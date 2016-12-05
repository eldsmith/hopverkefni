const router = require('express').Router();

//FIXME: Betri error handling
module.exports = (app)=>{

  // Breytir semester upplýsingum notendans
  //FIXME: Bæta við check að það séu ekki ógild input,
  //       t.d. startedElectives og firstSemester eiga aldrei bæði að vera true
  router.post('/user/semester', (req, res)=>{
    let semester = {
      startedElectives: req.param('startedElectives') === 'true',
      firstSemester: req.param('firstSemester') === 'true',
      graduating: req.param('graduating') === 'true'
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

    if(req.user){
      req.user.update(user, (error, results)=>{
        res.send(error || results);
      });
    }
  });

  //
  app.use('/api', router);
}
