module.exports = {
  method: ['GET'],
  path: '/chat/',
  config: {
    //auth: { mode: 'try' },
  },
  description: 'chat for text based api',
  handler: function (request, reply) {
    reply("hallo welt");
  }
};