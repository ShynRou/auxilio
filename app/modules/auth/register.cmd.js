const n2w = require('number-to-words');
const Boom = require('boom');

const command = {
  id: 'register',
  // plugin.options expected to be set with the Auth Module
  handler: async(input, request, originalRequest) => {

      return originalRequest.server.plugins.auth.register(input.username, input.password, input.email, originalRequest);
  }
};

module.exports = command;