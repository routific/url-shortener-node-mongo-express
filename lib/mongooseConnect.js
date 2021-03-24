var mongoose = require('mongoose');
var config = require('../config');

var options = {
  keepAlive: true,
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

module.exports = new Promise(function(resolve, reject) {
  mongoose.connect(config.mongoUrl, options, function(err) {
    if( err ) {
      reject(err);
    } else {
      resolve();
    }
  });
});
