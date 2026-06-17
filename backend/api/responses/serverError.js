var errorCodes = require('../constants/error-codes');
var messages = require('../constants/messages');

module.exports = function serverError(details, message) {
  var payload = {
    err: errorCodes.SERVER_ERROR,
    message: message || messages.SERVER_ERROR
  };

  if (details && typeof details === 'object') {
    Object.keys(details).forEach((key) => {
      payload[key] = details[key];
    });
  }

  return this.res.status(200).json(payload);
};
