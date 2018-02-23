const Boom = require('boom');
const Joi = require('joi');
const exceptionToBoom = require('../../helpers/exceptionToBoom');

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
      h,
      action,
      request.payload || request.query
    );

    if(promise) {
      try {
        let result = await promise;
        return !result || result.length > 1 ? result : result[0];
      }
      catch (error) {
        return exceptionToBoom(error);
      }
    }
    else {
      return Boom.notFound();
    }
  }
};