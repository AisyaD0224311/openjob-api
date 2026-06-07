const fs = require('fs');
const path = require('path');
const ClientError = require('../utils/ClientError');

const logFile = path.join(__dirname, '../../error.log');

const errorHandler = (err, req, res, next) => {
  try {
    const logMessage = `[${new Date().toISOString()}] ${err.name}: ${err.message}\n${err.stack}\n\n`;
    fs.appendFileSync(logFile, logMessage);
  } catch (logError) {
    console.error('Failed to log error:', logError);
  }
  next(err);
};

module.exports = errorHandler;