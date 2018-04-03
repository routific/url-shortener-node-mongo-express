var config = require('./config');
var app = require('./api');

var server = app.listen(config.port, function(){
  console.log('Server listening on port ' + config.port);
});
