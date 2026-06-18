var errorCodes = require('../constants/error-codes');
var messages = require('../constants/messages');
var AppError = require('../errors/AppError');

module.exports = {

  getBalance: async function (customerId) {
    try {
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
  },

  transfer: async function (senderCustomerId, receiverPhone, amount) {
    try {
      var sender = await Customer.findOne({ id: senderCustomerId });

      if (!sender) {
        throw new AppError(errorCodes.NOT_FOUND, messages.SESSION_REQUIRED);
      }

      if (String(sender.phone) === String(receiverPhone)) {
        throw new AppError(errorCodes.FORBIDDEN, messages.SELF_TRANSFER, {
          field: 'receiverPhone'
        });
      }

      var receiver = await Customer.findOne({ phone: receiverPhone });

      if (!receiver) {
        throw new AppError(errorCodes.NOT_FOUND, messages.RECEIVER_NOT_FOUND, {
          field: 'receiverPhone'
        });
      }

      var senderPocket = await Pocket.findOne({ owner: sender.id });

      if (!senderPocket) {
        throw new AppError(errorCodes.NOT_FOUND, messages.WALLET_NOT_FOUND);
      }

      var receiverPocket = await Pocket.findOne({ owner: receiver.id });

      if (!receiverPocket) {
        throw new AppError(errorCodes.NOT_FOUND, messages.WALLET_NOT_FOUND);
      }

      var currentBalance = Number(senderPocket.balance || 0);

      if (currentBalance < amount) {
        throw new AppError(errorCodes.INSUFFICIENT_BALANCE, messages.INSUFFICIENT_BALANCE, {
          availableBalance: currentBalance,
          requestedAmount: amount
        });
      }

      var newSenderBalance = currentBalance - amount;
      var newReceiverBalance = Number(receiverPocket.balance || 0) + amount;

      await Pocket.updateOne({ id: senderPocket.id })
        .set({ balance: newSenderBalance });

      await Pocket.updateOne({ id: receiverPocket.id })
        .set({ balance: newReceiverBalance });

      var transaction = await Transaction.create({
        sender: sender.id,
        receiver: receiver.id,
        amount: amount,
        status: 'SUCCESS'
      }).fetch();

      return {
        transaction: {
          id: transaction.id,
          sender: {
            phone: sender.phone
          },
          receiver: {
            phone: receiver.phone
          },
          amount: transaction.amount,
          status: transaction.status
        },
        senderPocket: {
          id: senderPocket.id,
          balance: newSenderBalance
        }
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      sails.log.error('WalletService.transfer error:', error);
      throw new AppError(errorCodes.SERVER_ERROR, messages.SERVER_ERROR);
    }
  },

  getTransactions: async function (customerId, page, limit) {
    try {
      var criteria = {
        or: [
          { sender: customerId },
          { receiver: customerId }
        ]
      };
      var skip = (page - 1) * limit;
      var total = await Transaction.count(criteria);

      var transactions = await Transaction.find(criteria)
        .sort('createdAt DESC')
        .skip(skip)
        .limit(limit)
        .populate('sender')
        .populate('receiver');
      var totalPages = Math.ceil(total / limit);

      return {
        transactions: transactions.map( (transaction) =>  {
          var isOutgoing = transaction.sender && transaction.sender.id === customerId;

          return {
            id: transaction.id,
            type: isOutgoing ? 'OUT' : 'IN',
            sender: {
              phone: transaction.sender && transaction.sender.phone
            },
            receiver: {
              phone: transaction.receiver && transaction.receiver.phone
            },
            amount: transaction.amount,
            status: transaction.status,
            createdAt: transaction.createdAt
          };
        }),
        pagination: {
          page: page,
          limit: limit,
          total: total,
          totalPages: totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      sails.log.error('WalletService.getTransactions error:', error);
      throw new AppError(errorCodes.SERVER_ERROR, messages.SERVER_ERROR);
    }
  }

};
