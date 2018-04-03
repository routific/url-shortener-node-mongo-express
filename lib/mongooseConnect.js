var mongoose = require('mongoose');
var config = require('../config');

var options = {
  useMongoClient: true,
  keepAlive: 120,
  connectTimeoutMS: 30000
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
