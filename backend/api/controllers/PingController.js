module.exports = {
  ping: async function (req, res) {
    return res.json({
      err: 200,
      message: 'pong',
      data: null,
    });
  },
};
