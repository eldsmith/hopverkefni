var FacebookStrategy = require('passport-facebook').Strategy;
// load up the user model
var User = require('../models/user');

// load the auth variables
var configAuth = require('./auth');

module.exports = (passport)=>{

    // used to serialize the user for the session
    passport.serializeUser((user, done)=>{
        done(null, user.ID);
    });

    // used to deserialize the user
    passport.deserializeUser((id, done)=>{
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields: ['id', 'emails', 'name'] //This

    },

    // facebook will send back the token and profile
    (token, refreshToken, profile, done)=>{
        // Finnum notendan í facebook töfluni
        User.findOne(profile.id, 'userFacebook', function(err, user) {

            //Ef að villa kemur upp í database
            if (err)
                return done(err);

            // Loggum inn notenda ef hann finnst
            if (user) {
                return done(null, user); // user found, return that user
            } else {
                // if there is no user found with that facebook id, create them
                let newUser = {};
                let fbUser = {};
                let name =  (profile.name.givenName || '') + ' ' +
                            (profile.name.middleName || '') + ' ' +
                            (profile.name.familyName || '');

                // set all of the facebook information in our user model
                fbUser.ID    = profile.id; // set the users facebook id
                fbUser.token = token; // we will save the token that facebook provides to the user
                fbUser.name  =  name; // look at the passport user profile to see how names are returned
                fbUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                newUser.name = name;
                newUser.email = fbUser.email;

                User.add(newUser, (error, result)=>{
                  if(error){
                    return done(error);
                  }

                  newUser.ID = result.insertId;

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
