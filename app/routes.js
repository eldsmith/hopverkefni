const User = require('./models/user');

//FIXME: Ætti að vera route hluti til controllera
module.exports = function(app, passport){
  require('./controllers/api')(app);

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
};
