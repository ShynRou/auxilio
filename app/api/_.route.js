module.exports = {
  method: ['GET'],
  path: '/',
  config: {
    //auth: { mode: 'try' },
  },
  description: 'basic text based action call',
  handler: function (request, reply) {
    reply("hallo welt");
  }
};