module.exports = {
  method: ['POST'],
  path: '/api/',
  config: {
    //auth: { mode: 'try' },
  },
  description: 'basic text based action call',
  handler: function (request, reply) {
    console.log(request.server.plugins.langParser);
    const result = {
      request: request.payload,
      parsed: request.server.plugins.langParser.fracture(request.payload),
      answer: request.server.plugins.langParser.categorizeWord(request.payload),
    };

    reply(result);
  }
};