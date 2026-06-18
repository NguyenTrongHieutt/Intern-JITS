var errorCodes = require('../constants/error-codes');
var messages = require('../constants/messages');

module.exports = {

  validate: function (inputs) {
    var page = inputs.page === undefined || inputs.page === null || inputs.page === '' ? 1 : Number(inputs.page);
    var limit = inputs.limit === undefined || inputs.limit === null || inputs.limit === '' ? 10 : Number(inputs.limit);

    if (!Number.isInteger(page) || page < 1) {
      return {
        code: errorCodes.BAD_REQUEST,
        message: messages.INVALID_PAGINATION,
        details: {
          field: 'page'
        }
      };
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
      return {
        code: errorCodes.BAD_REQUEST,
        message: messages.INVALID_PAGINATION,
        details: {
          field: 'limit',
          max: 50
        }
      };
    }

    return null;
  }

};
