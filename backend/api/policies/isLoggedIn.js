var errorCodes = require('../constants/error-codes');
var messages = require('../constants/messages');

module.exports = function isLoggedIn(req, res, next) {
  if (req.session && req.session.customerId) {
    return next();
  }

  return res.error(
    errorCodes.UNAUTHORIZED,
    {},
    messages.SESSION_REQUIRED
  );
};
