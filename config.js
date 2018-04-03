var config = {};

var env = process.env.NODE_ENV || 'development';
config.port = process.env.PORT || 3000;

config.webhost = process.env['WEBHOST'] || 'http://localhost:3000/';
config.shortIdPre = process.env['PREPEND'] || '';

var mongoAddr = process.env.MONGO_ADDR || 'localhost';
var mongoDbName = (env === 'development') ? 'routific-api' : 'routific-api-' + env;
var mongoDefault = 'mongodb://' + mongoAddr + '/' + mongoDbName;
config.mongoUrl = process.env['MONGOLAB_URI'] || mongoDefault;

module.exports = config;
