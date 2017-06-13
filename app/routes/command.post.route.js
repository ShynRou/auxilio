const Boom = require('boom');
const Joi = require('joi');

module.exports = {
  method: ['POST'],
  path: '/api/cmd/{action*}',
  config: {
    // auth: { mode: 'try' },
    validate: {
      params: {
        action: Joi.array().min(1).max(3)
      }
    }
  },
  description: 'calls plugin command directly',
  handler: function (request, reply) {


    let success = request.server.plugins.officer.call(
      request,
      request.params.action[0] + request.params.action[1] ? '.' + request.params.action[1] : '',
      request.params.action[2]
    );

    if (!success)
      return reply(Boom.notFound());
  }
};