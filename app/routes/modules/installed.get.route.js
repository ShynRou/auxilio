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
  handler: function (request, reply) {
    let modules = Object.keys(request.server.plugins.officer.modules)
      .map(key => request.server.plugins.officer.modules[key])
      .map(module => ({
        id: module.id,
        name: module.name,
        icon: module.icon
      }));

    return reply(modules);
  }
};