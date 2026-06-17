var crypto = require('crypto');

module.exports = function hashPassword(password) {
  return crypto.createHash('sha256').update(String(password)).digest('hex');
};
