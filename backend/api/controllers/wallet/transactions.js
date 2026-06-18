var errorCodes = require('../../constants/error-codes');
var messages = require('../../constants/messages');
var AppError = require('../../errors/AppError');
var transactionHistoryValidator = require('../../validators/transaction-history');

module.exports = async function transactions(req, res) {
  var inputs = req.body || {};
  var validationError = transactionHistoryValidator.validate(inputs);

  if (validationError) {
    return res.badRequest(validationError.details, validationError.message);
  }

  var page = inputs.page === undefined || inputs.page === null || inputs.page === '' ? 1 : Number(inputs.page);
  var limit = inputs.limit === undefined || inputs.limit === null || inputs.limit === '' ? 10 : Number(inputs.limit);

  try {
    var customerId = req.session.customerId;
    var result = await WalletService.getTransactions(customerId, page, limit);

    return res.ok({
      transactions: result.transactions,
      pagination: result.pagination
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.error(error.code, error.details || {}, error.message);
    }

    sails.log.error('wallet/transactions action error:', error);
    return res.error(errorCodes.SERVER_ERROR, {}, messages.SERVER_ERROR);
  }
};
