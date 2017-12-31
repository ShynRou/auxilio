const n2w = require('number-to-words');
const Boom = require('boom');

const command = {
  id: 'register',
  options: [
    {short: 'u', long: 'username', params: 1},
    {short: 'p', long: 'password', params: 1},
    {short: 'e', long: 'email', params: 1},
  ],
  // plugin.options expected to be set with the Auth Module
  handler: async(input, request) => {
    console.log(input);
    return request.reply(
      await request.originalRequest.server.plugins.auth.register(
        input.username,
        input.password,
        input.email,
        request.originalRequest
      )
    );
  }
};

module.exports = command;