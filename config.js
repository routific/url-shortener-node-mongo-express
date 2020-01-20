const readFileSync = require('fs').readFileSync;

function loadFromEnvironment(varName, options) {
  const value = process.env[varName];
  if (value === undefined) {
    if (options.fail === true)
      throw new Error(`Environment variable ${varName} is missing.`)
    if (options.defaultValue !== undefined)
      return options.default;
  }

  return value;
}

function readFile(fileName) {
  return readFileSync(fileName).toString('utf8').trim();
}

const config = {};

const env = process.env.NODE_ENV || 'development';
config.env = env;
config.port = process.env.PORT || 3000;

config.webhost = process.env['WEBHOST'] || 'http://localhost:3000/';
config.shortIdPre = process.env['PREPEND'] || '';

const mongoAddr = process.env.MONGO_ADDR || 'localhost:27017';
const mongoDbName = (env === 'development') ? 'routific-api' : 'routific-api-' + env;
const mongoDefault = 'mongodb://' + mongoAddr + '/' + mongoDbName;
config.mongoUrl = process.env['MONGOLAB_URI'] || mongoDefault;

config.loggerConfig = {
  name: 'url-shortener',
  level: loadFromEnvironment('LOG_LEVEL', { defaultValue: 'info' }),
  clsNamespace: 'fi.routi'
}

if (env === 'production') {
  config.loggerConfig.sentryConfig = {
    dsn: loadFromEnvironment('SENTRY_DSN', { fail: true }),
    stack: 'production',
    gitSha: readFile('./gitSha.txt')
  }
}

module.exports = config;
