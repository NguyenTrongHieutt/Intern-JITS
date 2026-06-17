var messages = require('../constants/messages');

module.exports = function error(code, details, message) {
  var payload = {
    err: code,
    message: message || messages.SERVER_ERROR
  };

  if (details && typeof details === 'object') {
    Object.keys(details).forEach((key) => {
      payload[key] = details[key];
    });
  }

  return this.res.status(200).json(payload);
};
