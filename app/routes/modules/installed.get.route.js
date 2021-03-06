const Boom = require('boom');
const Joi = require('joi');

module.exports = {
  method: ['GET'],
  path: '/api/modules/installed',
  config: {
    auth: {
      mode: 'try'
    }
  },
  description: 'get info for command',
  handler: function (request, h) {
    return Object.keys(request.server.plugins.officer.modules)
      .map(key => request.server.plugins.officer.modules[key])
      .filter(module => module && !module.hidden)
      .map(module => {
        return {...module, commands: undefined, options: undefined, handler: undefined, container: undefined};
      });
  }
};