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
      parsed: request.server.plugins.langParser.fracture(request.payload),
    };

    result.answer = request.server.plugins.commander.parse(request, result.request, result.parsed);


    return reply(result);
  }
};