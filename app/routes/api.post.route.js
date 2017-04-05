const structure = require('../src/lang/structure');

module.exports = {
  method: ['POST'],
  path: '/api/',
  config: {
    //auth: { mode: 'try' },
  },
  description: 'basic text based action call',
  handler: function (request, reply) {
    const result = {
      request: request.payload,
      parsed: structure(request.payload),
      answer: 'to be done',
    };

    reply(result);
  }
};