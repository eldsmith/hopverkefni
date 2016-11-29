var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var configAuth = require('./auth');

module.exports = (passport)=>{

    // serialize-ar userinn í session
    passport.serializeUser((user, done)=>{
        done(null, user.ID);
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
        // Finnum notendan í facebook töfluni
        User.findOne(profile.id, 'userFacebook', function(err, user) {

            //Ef að villa kemur upp í database
            if (err)
                return done(err);

            // Loggum inn notenda ef hann finnst
            if (user) {
                return done(null, user);
            } else {
                // Ef enginn notandi finnst, búum hann til
                let newUser = {};
                let fbUser = {};
                let name =  (profile.name.givenName || '') + ' ' +
                            (profile.name.middleName || '') + ' ' +
                            (profile.name.familyName || '');

                // stilla allar upplýsingar frá facebook sem við sendum á modelið
                fbUser.ID    = profile.id;
                fbUser.token = token;
                fbUser.name  =  name;
                fbUser.email = profile.emails[0].value;

                //Notendaupplýsingar uppfærðar
                newUser.name = name;
                newUser.email = fbUser.email;

                //setjum inn userinn í db
                User.add(newUser, (error, result)=>{
                  if(error){
                    return done(error);
                  }

                  newUser.ID = result.insertId; //Sækjum id eftir insert

                  //Bætum fb login upplýsingum á user og tengjum hann við fb.
                  User.addToFacebook(newUser.ID, fbUser, (error, result)=>{
                    if(error){
                      return done(error)
                    }

                    return done(null, newUser)
                  })
                })
            }

        });

    }));

};
