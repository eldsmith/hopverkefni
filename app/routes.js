module.exports = function(app, passport){

  var connection = require("./config/db.js");
  connection.connect();

  app.get('/', (req, res)=>{
    res.render('index');
  });

  app.get('/profile', (req, res)=>{
    res.render('profile');
  });

  app.get('/matches', (req, res)=>{
    res.render('matches');
  });

  app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',
      passport.authenticate('facebook', {
          successRedirect : '/profile',
          failureRedirect : '/'
  }));


  app.get("/api", function(req, res) {
    res.send("Þú hefur náð samband við apann, hvernig get ég aðstoðað?");
  });

  /*app.get("/api/userinfo:id", function(req, res) {
    connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
      if (err) {
        res.send(err);
      }
     
      res.send('The solution is: ', rows[0].solution);
    });
  });*/

};
