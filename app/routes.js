const User = require('./models/user');

module.exports = function(app, passport){
  require('./controllers/api')(app);

  app.get('/', (req, res)=>{
    res.render('index');
  });

  app.get('/profile', (req, res)=>{
    if(!req.user){
      res.redirect('/');
    }
    
    // Ef notandi er ekki búinn að stilla startedElectives
    // þá þarf að stilla þær og aðrar viðkomandi upplýsingar
    let setSemester = req.user.startedElectives === null;
    res.render('profile', {setSemester: setSemester});
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
