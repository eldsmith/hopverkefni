require('dotenv').config();

var app = require('./app/server');

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function(){
  console.log('server is running');
});
