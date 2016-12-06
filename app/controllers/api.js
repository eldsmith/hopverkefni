const router = require('express').Router();
const Tag = require('../models/tag');
const User = require('../models/user');

//FIXME: Betri error handling
//FIXME: Ætti kannski ekki að vera senda errors frá db beint á client í production
module.exports = (app)=>{

  /**** User ****/

  //Sækir upplýsingar um notendann sem er loggaður inn
  router.get('/user', (req,res)=>{
    if(req.user){
      let user = {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        tags: req.user.tags,
        firstSemester: req.user.firstSemester,
        startedElectives: req.user.startedElectives,
        graduating: req.user.graduating
      };

      res.send(user);
    }
  });

  //Sækir ids fyrir alla notendur
  router.get('/users', (req,res)=>{
    if(req.user){
      User.getAllIds((error, results)=>{
        res.send(results);
      });
    }
  });


  //Breytir notenda upplýsingum
  //FIXME: Bæta við check að það séu ekki ógild input,
  //       t.d. startedElectives og firstSemester eiga aldrei bæði að vera true
  router.post('/user', (req, res)=>{
    let user = {
      name: req.param('name'),
      email: req.param('email'),
      phone: req.param('phone'),
      startedElectives: req.param('startedElectives'),
      firstSemester: req.param('firstSemester'),
      graduating: req.param('graduating')
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
    let tagList = req.param('tags'); // array af nöfnum fyrir tags
    let tagIds = [];

    // FIXME: KILL IT WITH FIRE
    if(req.user){
      req.user.deleteAllTags((error, results)=>{
        Tag.getAll((error, results)=>{

          //Förum í gegnum results og tjekkum hvort tögin eru í db
          if(results){
            for(let row of results){
              console.log(row.name);
              let index = tagList.indexOf(row.name);
              if(index > -1){
                tagIds.push(row.ID);
                tagList.splice(index, 1);
              }
            }
          }

          //Ef við erum með eitthver tags eftir þá þurfum við að bæta þeim við í db
          if(tagList.length >= 1){
            console.log(tagList);
            for(let tag in tagList){
              Tag.addTag(tagList[tag], (error, results)=>{
                tagIds.push(results.insertId);
                if(tag >= tagList.length - 1){
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
