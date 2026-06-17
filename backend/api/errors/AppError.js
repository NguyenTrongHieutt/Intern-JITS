var errorCodes = require('../constants/error-codes');

function AppError(code, message, details) {
  Error.call(this);
  this.name = 'AppError';
  this.code = code || errorCodes.SERVER_ERROR;
  this.message = message || 'Lỗi hệ thống';
  this.details = details || null;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, AppError);
  }
}

AppError.prototype = Object.create(Error.prototype);
AppError.prototype.constructor = AppError;

AppError.prototype.toJSON = function () {
  return {
    code: this.code,
    message: this.message,
    details: this.details
  };
};

module.exports = AppError;
