module.exports = {
  method: ['POST'],
  path: '/api/',
  config: {
    //auth: { mode: 'try' },
  },
  description: 'basic text based action call',
  handler: function (request, reply) {
    reply("hallo welt");
  }
};