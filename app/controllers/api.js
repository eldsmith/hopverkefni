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
        res.send(results);
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
        res.send(results);
      });
    }
  });

  //  Breytir notenda tags eftir að hafa deletað þeim öllum
  //  FIXME: delete all tags ætti að vera aðskilið en höfum ekki tíma
  router.post('/user/tags', (req, res)=>{
    let newTags = req.param('newTags'); // array af nöfnum með nýjum tögum
    let tagIds = req.param('ids'); // ekki ný tög, id fyrir tög sem eru nú þegar í db
    let dbTagNames = [];
    let addTags = [];

    // FIXME: KILL IT WITH FIRE
    if(req.user){
      req.user.deleteAllTags((error, results)=>{
        if(newTags){
          Tag.getAll((error, results)=>{

            // FIXME: Implimenta getAllNames í modelinu, eða options í getAll.
            results.map((obj)=>{
              dbTagNames.push(obj.name);
            })

            //Vera viss um að tagginu hafi ekki verið bætt við á þeim tíma sem userinn var að velja
            for(let name of newTags){
              if (dbTagNames.indexOf(name) === -1){
                addTags.push(name);
              }
            }
            if(addTags){
              for(let tag in addTags){
                Tag.addTag(addTags[tag], (error, results)=>{
                  tagIds.push(results.insertId);
                  if(tag >= addTags.length - 1){
                    req.user.addTags(tagIds, (error, results)=>{
                      res.send(results);
                    });
                  }
                });
              }
            }
            else{
              req.user.addTags(tagIds, (error, results)=>{
                res.send(results);
              });
            }
          });
        }
      else{
        req.user.addTags(tagIds, (error, results)=>{
          res.send(results);
        });
      }
      })
    }
  });

  //Sækir notenda tags
  router.get('/user/tags', (req, res)=>{
    if(req.user){
      req.user.getTags((error, results)=>{
        res.send(results);
      });
    }
  });

  //eyðir notenda tagi
  router.delete('/user/tags', (req, res)=>{
    let tagID = req.param('id');

    if(req.user){
      req.user.deleteTag(tagID, (error, results)=>{
        res.send(results);
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
        else{
          req.user.addTag(results.insertId,(error, results)=>{
            res.send(results);
          })
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
