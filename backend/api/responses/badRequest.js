var errorCodes = require('../constants/error-codes');
var messages = require('../constants/messages');

module.exports = function badRequest(details, message) {
  var payload = {
    err: errorCodes.BAD_REQUEST,
    message: message || messages.INVALID_PHONE
  };

  if (details && typeof details === 'object') {
    Object.keys(details).forEach((key) => {
      payload[key] = details[key];
    });
  }

  return this.res.status(200).json(payload);
};
