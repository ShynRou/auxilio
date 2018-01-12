const Boom = require('boom');
const Joi = require('joi');

module.exports = {
  method: ['GET'],
  path: '/api/cmd/ui/{action*}',
  config: {
    auth: {
      mode: 'try'
    },
    validate: {
      params: {
        action: Joi.string().allow(null, '').regex(/([\w\-_]+\/?)*/)
      }
    }
  },
  description: 'get ui for command',
  handler: function (request, h) {

    let action = request.params.action.split(/\//g).filter(a => !!a);

    let command = request.server.plugins.officer.getCommand(
      request,
      action
    );

    if (command) {
      return {ui: command.ui, store: command.store};
    }
    else {
      return Boom.notFound();
    }
  }
}
;