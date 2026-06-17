var errorCodes = require('../constants/error-codes');
var messages = require('../constants/messages');

module.exports = {

  validate: function (inputs) {
    var phone = String(inputs.phone || '').trim();
    var password = String(inputs.password || '');

    if (!phone || !password) {
      return {
        code: errorCodes.BAD_REQUEST,
        message: messages.REGISTER_REQUIRED_FIELDS,
        details: {
          fields: ['phone', 'password']
        }
      };
    }

    if (!/^[0-9]{9,15}$/.test(phone)) {
      return {
        code: errorCodes.BAD_REQUEST,
        message: messages.INVALID_PHONE,
        details: {
          field: 'phone'
        }
      };
    }

    if (password.length < 6) {
      return {
        code: errorCodes.BAD_REQUEST,
        message: messages.INVALID_PASSWORD,
        details: {
          field: 'password'
        }
      };
    }

    return null;
  }

};
