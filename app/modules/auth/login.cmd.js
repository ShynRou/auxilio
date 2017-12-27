const command = {
  id: 'login',
  options: [
    {short: 'u', long: 'username', params: 1},
    {short: 'p', long: 'password', params: 1},
  ],
  // plugin.options expected to be set with the Auth Module
  handler: async(input, request, originalRequest) => {
    return originalRequest.server.plugins.auth.login(input.username, input.password, originalRequest);
  }
};

module.exports = command;