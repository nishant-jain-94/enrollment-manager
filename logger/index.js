const bunyan = require('bunyan');
const bFormat = require('bunyan-format');

const formatOut = bFormat({ output: 'short' });
const logger = bunyan.createLogger({ name: 'Enrollment-Manager', stream: formatOut });

module.exports = logger;
