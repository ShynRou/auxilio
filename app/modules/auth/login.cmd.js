const command = {
  id: 'login',
  options: [
    {short: 'u', long: 'username', params: 1},
    {short: 'p', long: 'password', params: 1},
  ],
  // plugin.options expected to be set with the Auth Module
  handler: async (input, request) => {
    return request.reply(
      await request.originalRequest.server.plugins.auth.login(
        input.username,
        input.password,
        request.originalRequest
      )
    );
  }
};

module.exports = command;