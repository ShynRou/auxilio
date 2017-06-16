module.exports = {
  method: ['POST'],
  path: '/auth/login',
  config: {
    // auth: { mode: 'try' },
  },
  description: 'provides a user login',
  handler: function (request, reply) {
    reply("hallo welt");
  }
};