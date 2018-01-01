const Boom = require('boom');
const Joi = require('joi');

module.exports = {
  method: ['GET'],
  path: '/api/cmd/info/{action*}',
  config: {
    auth: {
      mode: 'try'
    },
    validate: {
      params: {
        action: Joi.string().regex(/([\w\-_]+\/?)*/).required()
      }
    }
  },
  description: 'get info for command',
  handler: function (request, reply) {

    let action = request.params.action.split(/\//g);

    let command = request.server.plugins.officer.getCommand(
      request,
      action
    );

    if (command) {
      return reply(command.description);
    }
    else {
      return reply(Boom.notFound());
    }
  }
};