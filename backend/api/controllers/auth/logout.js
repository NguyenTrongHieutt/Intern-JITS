var messages = require('../../constants/messages');

module.exports = async function logout(req, res) {
  req.session.destroy(function (err) {
    if (err) {
      sails.log.error('auth/logout action error:', err);
      return res.serverError({}, messages.SERVER_ERROR);
    }

    return res.ok({ loggedOut: true });
  });
};
