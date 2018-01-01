const Boom = require('boom');
const Joi = require('joi');

module.exports = {
  method: ['GET', 'POST'],
  path: '/api/cmd/exec/{action*}',
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
  description: 'calls plugin command directly',
  handler: function (request, reply) {

    let action = request.params.action.replace(/\//g,' ');

    let promise = request.server.plugins.officer.run(
      request,
      action,
      request.query || request.payload
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