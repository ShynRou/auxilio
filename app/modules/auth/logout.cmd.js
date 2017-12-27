

const command = {
  id: 'logout',
  handler: async(input, request, originalRequest) => {
    return originalRequest.server.plugins.auth.logout(originalRequest);
  }

};

module.exports = command;