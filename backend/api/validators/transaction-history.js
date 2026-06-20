var errorCodes = require('../constants/error-codes');
var messages = require('../constants/messages');

module.exports = {

  validate: function (inputs) {
    var page = inputs.page === undefined || inputs.page === null || inputs.page === '' ? 1 : Number(inputs.page);
    var limit = inputs.limit === undefined || inputs.limit === null || inputs.limit === '' ? 10 : Number(inputs.limit);
    var sort = inputs.sort === undefined || inputs.sort === null || inputs.sort === '' ? 'desc' : String(inputs.sort).toLowerCase();
    var dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

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

    if (sort !== 'desc' && sort !== 'asc') {
      return {
        code: errorCodes.BAD_REQUEST,
        message: messages.INVALID_PAGINATION,
        details: {
          field: 'sort',
          allowed: ['desc', 'asc']
        }
      };
    }

    if (inputs.from !== undefined && inputs.from !== null && inputs.from !== '' && Number.isNaN(Date.parse(inputs.from))) {
      return {
        code: errorCodes.BAD_REQUEST,
        message: messages.INVALID_PAGINATION,
        details: {
          field: 'from'
        }
      };
    }

    if (inputs.to !== undefined && inputs.to !== null && inputs.to !== '' && Number.isNaN(Date.parse(inputs.to))) {
      return {
        code: errorCodes.BAD_REQUEST,
        message: messages.INVALID_PAGINATION,
        details: {
          field: 'to'
        }
      };
    }

    if (inputs.from && inputs.to) {
      var from = new Date(inputs.from);
      var to = new Date(inputs.to);

      if (dateOnlyPattern.test(String(inputs.from))) {
        from.setHours(0, 0, 0, 0);
      }

      if (dateOnlyPattern.test(String(inputs.to))) {
        to.setHours(23, 59, 59, 999);
      }

      if (from > to) {
        return {
          code: errorCodes.BAD_REQUEST,
          message: messages.INVALID_PAGINATION,
          details: {
            field: 'from',
            message: 'from must be before or equal to to'
          }
        };
      }
    }

    return null;
  }

};
