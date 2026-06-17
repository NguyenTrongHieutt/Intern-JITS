module.exports = {

  attributes: {

    sender: {
      model: 'customer',
      required: true
    },

    receiver: {
      model: 'customer',
      required: true
    },

    amount: {
      type: 'number',
      required: true
    },

    status: {
      type: 'string',
      isIn: ['SUCCESS', 'FAILED'],
      defaultsTo: 'SUCCESS'
    }
  }

};
