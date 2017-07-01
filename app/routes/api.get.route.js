module.exports = {
  method: ['GET'],
  path: '/api',
  config: {
    // auth: { mode: 'try' },
  },
  description: 'replies API manual',
  handler: function (request, reply) {
    reply("hallo welt");
  }
};