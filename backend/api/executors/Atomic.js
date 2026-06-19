var errorCodes = require('../constants/error-codes');
var messages = require('../constants/messages');
var AppError = require('../errors/AppError');
var MongoHelper = require('../utils/MongoHelper');

async function TransferTransaction(senderId, receiverId, amount) {
  var db = MongoHelper.getMongoDb(Pocket);
  var pockets = MongoHelper.getCollection(Pocket);
  var transactions = MongoHelper.getCollection(Transaction);
  var nativeSenderId = MongoHelper.toObjectId(senderId);
  var nativeReceiverId = MongoHelper.toObjectId(receiverId);
  var session = db.client.startSession();
  var createdTransaction;
  var updatedSenderPocket;

  try {
    await session.withTransaction(async () => {
      var senderPocket = await pockets.findOne({
        owner: nativeSenderId
      }, {
        session: session
      });

      if (!senderPocket) {
        throw new AppError(errorCodes.NOT_FOUND, messages.WALLET_NOT_FOUND);
      }

      var receiverPocket = await pockets.findOne({
        owner: nativeReceiverId
      }, {
        session: session
      });

      if (!receiverPocket) {
        throw new AppError(errorCodes.NOT_FOUND, messages.WALLET_NOT_FOUND);
      }

      var senderDebitResult = await pockets.findOneAndUpdate({
        _id: senderPocket._id,
        balance: {
          $gte: amount
        }
      }, {
        $inc: {
          balance: -amount
        },
        $set: {
          updatedAt: Date.now()
        }
      }, {
        returnDocument: 'after',
        session: session
      });

      updatedSenderPocket = MongoHelper.getFindOneAndUpdateDocument(senderDebitResult);
      if (!updatedSenderPocket) {
        throw new AppError(errorCodes.INSUFFICIENT_BALANCE, messages.INSUFFICIENT_BALANCE, {
          availableBalance: Number(senderPocket.balance || 0),
          requestedAmount: amount
        });
      }

      await pockets.updateOne({
        _id: receiverPocket._id
      }, {
        $inc: {
          balance: amount
        },
        $set: {
          updatedAt: Date.now()
        }
      }, {
        session: session
      });

      var now = Date.now();
      var insertResult = await transactions.insertOne({
        sender: nativeSenderId,
        receiver: nativeReceiverId,
        amount: amount,
        status: 'SUCCESS',
        createdAt: now,
        updatedAt: now
      }, {
        session: session
      });

      createdTransaction = {
        id: insertResult.insertedId.toString(),
        amount: amount,
        status: 'SUCCESS'
      };

    });

    return {
      transaction: createdTransaction,
      senderPocket: {
        id: updatedSenderPocket._id.toString(),
        balance: updatedSenderPocket.balance
      }
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    try {
      var now = Date.now();

      await transactions.insertOne({
        createdAt: now,
        updatedAt: now,
        amount: amount,
        status: 'FAILED',
        sender: nativeSenderId,
        receiver: nativeReceiverId
      });
    } catch (failedTransactionError) {
      sails.log.error('TransferTransaction failed record error:', failedTransactionError);
    }

    sails.log.error('TransferTransaction error:', error);
    throw new AppError(errorCodes.SERVER_ERROR, messages.SERVER_ERROR);
  }
  finally {
    await session.endSession();
  }
}

module.exports = {
  TransferTransaction: TransferTransaction
};
