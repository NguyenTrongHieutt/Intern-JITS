var AppError = require('../../errors/AppError');
var registerValidator = require('../../validators/register-login');

module.exports = async function register(req, res) {
  var validationError = registerValidator.validate(req.body || {});

  if (validationError) {
    return res.badRequest(validationError.details, validationError.message);
  }

  var phone = String(req.body.phone || '').trim();
  var password = String(req.body.password || '');

  try {
    var result = await AuthService.register(phone, password);

    return res.ok(result);
  } catch (error) {
    if (error instanceof AppError) {
      return res.error(error.code, error.details, error.message);
    }

    sails.log.error('auth/register action error:', error);
    return res.serverError({}, 'Lỗi hệ thống');
  }
};
