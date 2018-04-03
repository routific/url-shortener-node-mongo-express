var app = require('./api')

var server = app.listen(3000, function(){
  console.log('Server listening on port 3000');
});
