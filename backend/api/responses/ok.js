var errorCodes = require('../constants/error-codes');
var messages = require('../constants/messages');

module.exports = function ok(data) {
  var payload = {
    err: errorCodes.SUCCESS,
    message: messages.SUCCESS
  };

  if (data && typeof data === 'object') {
    Object.keys(data).forEach((key) => {
      payload[key] = data[key];
    });
  }

  return this.res.status(200).json(payload);
};
