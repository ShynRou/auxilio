const Joi = require('joi');
const Boom = require('boom');

module.exports = {
  method: ['POST'],
  path: '/api',
  config: {
    //auth: { mode: 'try' },
    validate: {
      payload: Joi.string()
    }
  },
  description: 'basic text based action call',
  handler: function (request, reply) {

    let promise = request.server.plugins.officer.run(request, request.payload);

    if(promise) {
      promise.then((result) => reply(result)).catch((error) => reply(result));
    }
    else {
      return reply(Boom.badRequest('Command not found!'));
    }
  }
};