module.exports = {

  attributes: {

    owner: {
      model: 'customer',
      required: true,
      unique: true
    },

    balance: {
      type: 'number',
      defaultsTo: 1000000
    }

  }

};
