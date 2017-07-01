const Boom = require('boom');
const Joi = require('joi');

module.exports = {
  method: ['GET', 'POST'],
  path: '/api/cmd/{action*}',
  config: {
    auth: {
      mode: 'try'
    },
    validate: {
      params: {
        action: Joi.string().regex(/([\w\-_]+\/?){0,3}/).required()
      }
    }
  },
  description: 'calls plugin command directly',
  handler: function (request, reply) {

    let action = request.params.action.split('/');

    let promise = request.server.plugins.officer.run(
      request,
      reply,
      action[0] + (action[1] ? '.' + action[1] : ''),
      action[2]
    );

    if (promise) {
      promise.then(
        data => reply(data)
      ).catch(
        data => reply(data)
      );
    }
    else {
      return reply(Boom.notFound());
    }
  }
};