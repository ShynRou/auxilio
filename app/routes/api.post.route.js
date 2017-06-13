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

    let cmdFound = request.server.plugins.officer.callScript(request, reply, request.payload );

    if(!cmdFound) {
      reply(Boom.badRequest());
    }
  }
};