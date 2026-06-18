var errorCodes = require('../../constants/error-codes');
var messages = require('../../constants/messages');
var AppError = require('../../errors/AppError');

module.exports = async function balance(req, res) {
  try {
    var customerId = req.session.customerId;

    var result = await WalletService.getBalance(customerId);

    return res.ok({ balance: result.balance });
  } catch (error) {
    if (error instanceof AppError) {
      return res.error(error.code, error.details || {}, error.message);
    }

    sails.log.error('wallet/balance action error:', error);
    return res.error(errorCodes.SERVER_ERROR, {}, messages.SERVER_ERROR);
  }
};
