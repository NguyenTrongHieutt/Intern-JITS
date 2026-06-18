var errorCodes = require('../constants/error-codes');
var messages = require('../constants/messages');

module.exports = {

  validate: function (inputs) {
    var receiverPhone = String(inputs.receiverPhone || '').trim();
    var amount = Number(inputs.amount);

    if (!receiverPhone || inputs.amount === undefined || inputs.amount === null || inputs.amount === '') {
      return {
        code: errorCodes.BAD_REQUEST,
        message: messages.TRANSFER_REQUIRED_FIELDS,
        details: {
          fields: ['receiverPhone', 'amount']
        }
      };
    }

    if (!/^[0-9]{9,15}$/.test(receiverPhone)) {
      return {
        code: errorCodes.BAD_REQUEST,
        message: messages.INVALID_PHONE,
        details: {
          field: 'receiverPhone'
        }
      };
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return {
        code: errorCodes.BAD_REQUEST,
        message: messages.INVALID_TRANSFER_AMOUNT,
        details: {
          field: 'amount'
        }
      };
    }

    return null;
  }

};
