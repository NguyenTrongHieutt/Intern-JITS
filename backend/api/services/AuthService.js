var errorCodes = require('../constants/error-codes');
var messages = require('../constants/messages');
var AppError = require('../errors/AppError');
var hashPassword = require('../utils/hash-password');
var comparePassword = require('../utils/compare-password');

module.exports = {

  register: async function (phone, password) {
    try {
      var existedCustomer = await Customer.findOne({ phone: phone });

      if (existedCustomer) {
        throw new AppError(errorCodes.CONFLICT, messages.PHONE_EXISTS, {
          field: 'phone'
        });
      }

      var customer = await Customer.create({
        phone: phone,
        password: hashPassword(password)
      }).fetch();


      try {
        var pocket = await Pocket.create({
          owner: customer.id,
          balance: 1000000
        }).fetch();
      } catch (pocketError) {
        await Customer.destroyOne({ id: customer.id });
        throw pocketError;
      }

      return {
        customer: {
          id: customer.id,
          phone: customer.phone
        }
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      sails.log.error('AuthService.register error:', error);
      throw new AppError(errorCodes.SERVER_ERROR, messages.SERVER_ERROR);
    }
  },

  login: async function (phone, password) {
    try {
      var customer = await Customer.findOne({ phone: phone });

      if (!customer) {
        throw new AppError(errorCodes.INVALID_CREDENTIALS, messages.INVALID_CREDENTIALS, {
          field: 'phone'
        });
      }

      if (!comparePassword(password, customer.password)) {
        throw new AppError(errorCodes.INVALID_CREDENTIALS, messages.INVALID_CREDENTIALS, {
          field: 'password'
        });
      }


      return {
        customer: {
          id: customer.id,
          phone: customer.phone
        }
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      sails.log.error('AuthService.login error:', error);
      throw new AppError(errorCodes.SERVER_ERROR, messages.SERVER_ERROR);
    }
  }

};
