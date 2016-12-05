const router = require('express').Router();
const Tag = require('../models/tag');

//FIXME: Betri error handling
//FIXME: Ætti kannski ekki að vera senda errors frá db beint á client í production
module.exports = (app)=>{

  /**** User ****/

  // Breytir semester upplýsingum notendans
  //FIXME: Færa þetta yfir í user þar sem structure-ið hefur breyst svolítið
  //FIXME: Bæta við check að það séu ekki ógild input,
  //       t.d. startedElectives og firstSemester eiga aldrei bæði að vera true
  router.post('/user/semester', (req, res)=>{
    let semester = {
      startedElectives: req.param('startedElectives'),
      firstSemester: req.param('firstSemester'),
      graduating: req.param('graduating')
    }

    if(req.user){
      req.user.update(semester, (error, results)=>{
        res.send(error || results);
      });
    }
  });

  //Sækir upplýsingar um notendann sem er loggaður inn
  router.get('/user', (req,res)=>{
    if(req.user){
      let user = {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        firstSemester: req.user.firstSemester,
        startedElectives: req.user.startedElectives,
        graduating: req.user.graduating
      };

      res.send(user);
    }
  });

  //Breytir notenda upplýsingum
  router.post('/user', (req, res)=>{
    let user = {
      name: req.param('name'),
      email: req.param('email'),
      phone: req.param('phone')
    }

    console.log(user);
    if(req.user){
      req.user.update(user, (error, results)=>{
        res.send(error || results);
      });
    }
  });


  /**** Tags ****/

  // Þarf að fylgjast með status 400 sem segir til um duplicate key
  router.post('/tags', (req, res)=>{
    let tag = req.param('tag');

    if(req.user){
      new Tag(tag, (error, results)=>{
        if(error){
          if(error.code === 'ER_DUP_ENTRY'){
            res.status(400).send({'error' : 'ER_DUP_ENTRY'});
          }
          else{
            res.status(500).send(error);
          }
        }

      });
    }
    else{
      res.status(401).send('401 Unauthorized');
    }
  });

  router.get('/tags', (req, res)=>{
    if(req.user){
      Tag.getAll((error, results)=>{
        if(error){
          res.status(500).send(error);
        }
        else{
          res.send(results);
        }
      });
    }
    else{
      res.status(401).send('401 Unauthorized');
    }
  });

  app.use('/api', router);
}
