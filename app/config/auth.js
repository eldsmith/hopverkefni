const util = require('util');

module.exports = {

    'facebookAuth' : {
        'clientID'      : process.env.FACEBOOK_APP_ID,
        'clientSecret'  : process.env.FACEBOOK_SECRET,
        'callbackURL'   : util.format('http://localhost:%s/auth/facebook/callback', process.env.PORT || '5000')
    }

};
