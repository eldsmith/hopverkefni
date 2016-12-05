const router = require('express').Router();

//FIXME: Betri error handling
module.exports = (app)=>{

  //FIXME: Bæta við check að það séu ekki ógild input,
  //       t.d. startedElectives og firstSemester eiga aldrei bæði að vera true
  router.post('/semester', (req, res)=>{
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

  app.use('/api', router);
}
