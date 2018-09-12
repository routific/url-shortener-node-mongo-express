const utils = require('@routific/utils');
const config = require('../config');

const isTestEnv = config.env === 'test';
const logger = utils.getLogger(isTestEnv, config.loggerConfig)

module.exports = logger;
