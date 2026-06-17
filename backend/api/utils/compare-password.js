var crypto = require('crypto');
var hashPassword = require('./hash-password');

module.exports = function comparePassword(password, hashedPassword) {
  var inputHash = hashPassword(password);
  var storedHash = String(hashedPassword || '');

  if (inputHash.length !== storedHash.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(storedHash));
};
