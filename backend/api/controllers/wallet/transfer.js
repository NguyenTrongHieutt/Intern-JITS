var errorCodes = require('../../constants/error-codes');
var messages = require('../../constants/messages');
var AppError = require('../../errors/AppError');
var transferValidator = require('../../validators/transfer');

module.exports = async function transfer(req, res) {
  var validationError = transferValidator.validate(req.body || {});

  if (validationError) {
    return res.badRequest(validationError.details, validationError.message);
  }

  var receiverPhone = String(req.body.receiverPhone || '').trim();
  var amount = Number(req.body.amount);

  try {
    var customerId = req.session.customerId;
    var result = await WalletService.transfer(customerId, receiverPhone, amount);

    return res.ok({
      transaction: result.transaction,
      pocket: result.senderPocket
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.error(error.code, error.details || {}, error.message);
    }

    sails.log.error('wallet/transfer action error:', error);
    return res.error(errorCodes.SERVER_ERROR, {}, messages.SERVER_ERROR);
  }
};
