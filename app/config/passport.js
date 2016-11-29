var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var configAuth = require('./auth');

module.exports = (passport)=>{

    // serialize-ar userinn í session
    passport.serializeUser((user, done)=>{
        console.log(user);
        done(null, user.id);
    });

    passport.deserializeUser((id, done)=>{
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // Pullum auth upplýsingar sem við stillum í  ./auth
    passport.use(new FacebookStrategy({
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields: ['id', 'emails', 'name']
    },

    // runnað þegar facebook hefur skilað okkur upplýsingum
    (token, refreshToken, profile, done)=>{
        fb = {token: token, refreshToken: refreshToken, profile: profile}
        let user = new User(false);
        let fbLogin = facebookLogin(user, fb, done); // runnum generator fáum iterator
        user.setGenerator(fbLogin); //skellum generator/iteratornum inn og hefjum keyrslu
    }));

};

/* Generator sem sér um user byggt á facebook aðgang og á að tengist user object */
function *facebookLogin(user, fb, done){
  //Reynir að nota fb.id-ið til þess að finna notendann í gagnagrunninum
  user.getFacebook(fb.profile.id);
  let [error, userFbInfo] = yield;

  //Error er db error
  if(error){
    return done(error);
  }

  //Ef notandinn finnst þá erum við búnir
  if(userFbInfo){
    return done(null, user);
  }

  let name =  (fb.profile.name.givenName || '') + ' ' +
              (fb.profile.name.middleName || '') + ' ' +
              (fb.profile.name.familyName || '');

  fbUser = {
    id : fb.profile.id,
    token: fb.token,
    name: name,
    email: fb.profile.emails[0].value
  }

  //Fyrst að notandi fannst ekki í gagnagrunninum þá búum við til nýjan
  user.create(fbUser);
  [error, results] = yield;

  if(error){
    return done(error);
  }

  //Nú þegar við erum komin með nýjan user tengjum við hann við þennan facebook aðgang
  user.addFacebook(fbUser);
  [error, results] = yield;

  if(error){
    console.error('Error adding new user to facebook table');
    return done(error);
  }

  //Userinn kominn, allt tókst.
  return done(null, user);
}
