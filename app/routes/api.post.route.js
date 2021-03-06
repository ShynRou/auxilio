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
  handler: async function (request, h) {

    let promise = request.server.plugins.officer.run(request, h, request.payload);

    if (promise) {
      const result = await promise;
      console.log(result);
      return result && result.length === 1 ? result[0] : result;
    } else {
      return Boom.badRequest('Command not found!');
    }
  }
};