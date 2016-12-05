const express = require('express');
const app = express();

const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');

require('./config/passport')(passport);
//Templating engine
app.set('view engine', 'pug');

//Views directory
app.set('views', __dirname + '/../public/views');

//Middleware for serving static pages
app.use(express.static(__dirname + '/../public'));

// Other Middleware
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser()); // get information from html forms

app.use(session({ secret: 'secret' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./routes.js')(app, passport);
module.exports = app;
