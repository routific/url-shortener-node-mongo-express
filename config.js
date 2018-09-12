const config = {};

const env = process.env.NODE_ENV || 'development';
config.env = env;
config.port = process.env.PORT || 3000;

config.webhost = process.env['WEBHOST'] || 'http://localhost:3000/';
config.shortIdPre = process.env['PREPEND'] || '';

const mongoAddr = process.env.MONGO_ADDR || 'localhost';
const mongoDbName = (env === 'development') ? 'routific-api' : 'routific-api-' + env;
const mongoDefault = 'mongodb://' + mongoAddr + '/' + mongoDbName;
config.mongoUrl = process.env['MONGOLAB_URI'] || mongoDefault;

module.exports = config;
