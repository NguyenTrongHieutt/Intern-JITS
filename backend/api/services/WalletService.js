var errorCodes = require('../constants/error-codes');
var messages = require('../constants/messages');
var AppError = require('../errors/AppError');

module.exports = {

  getBalance: async function (customerId) {
    try {
      if (!customerId) {
        throw new AppError(errorCodes.BAD_REQUEST, messages.SESSION_REQUIRED);
      }

      var pocket = await Pocket.findOne({ owner: customerId });

      if (!pocket) {
        throw new AppError(errorCodes.NOT_FOUND, messages.WALLET_NOT_FOUND);
      }

      return {
        balance: pocket.balance
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      sails.log.error('WalletService.getBalance error:', error);
      throw new AppError(errorCodes.SERVER_ERROR, messages.SERVER_ERROR);
    }
  }

};
