var errorCodes = require('../../constants/error-codes');
var messages = require('../../constants/messages');
var AppError = require('../../errors/AppError');
var loginValidator = require('../../validators/register-login');

module.exports = async function login(req, res) {
  var validationError = loginValidator.validate(req.body || {});

  if (validationError) {
    return res.badRequest(validationError.details, validationError.message);
  }

  var phone = String(req.body.phone || '').trim();
  var password = String(req.body.password || '');

  try {
    var result = await AuthService.login(phone, password);

    req.session.customerId = result.customer.id;
    req.session.customerPhone = result.customer.phone;

    return res.ok({
      customer: result.customer,
      pocket: result.pocket,
      session: {
        customerId: req.session.customerId,
        customerPhone: req.session.customerPhone,
        isAuthenticated: req.session.isAuthenticated
      }
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.error(error.code, error.details, error.message);
    }

    sails.log.error('auth/login action error:', error);
    return res.error(errorCodes.SERVER_ERROR, {}, messages.SERVER_ERROR);
  }
};
