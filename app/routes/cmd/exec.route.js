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
  handler: async function (request, h) {

    let action = request.params.action.replace(/\//g,' ');

    let promise = request.server.plugins.officer.run(
      request,
      action,
      request.query || request.payload
    );

    if(promise) {
      return (await promise)[0];
    }
    else {
      return Boom.notFound();
    }
  }
};