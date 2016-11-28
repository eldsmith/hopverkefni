module.exports = function(app, passport){
  app.get('/', (req, res)=>{
    res.render('index');
  });

  app.get('/profile', (req, res)=>{
    res.render('index');
  });

  app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',
      passport.authenticate('facebook', {
          successRedirect : '/profile',
          failureRedirect : '/'
      }));

};
