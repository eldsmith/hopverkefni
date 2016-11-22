var express = require('express');

var app = express();

//Templating engine
app.set('view engine', 'pug');  

//Views directory
app.set('views', __dirname + '/../public/views');

//Middleware for serving static pages
app.use(express.static(__dirname + '/../public'));

require('./routes.js')(app);
module.exports = app;
