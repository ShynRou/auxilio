module.exports.plugin = {
  name: 'auth',
  version: '1.0.0',
  register: function (server, options) {
    const Auth = require('./auth');
    const authentication = new Auth(server);

    for (let key in authentication) {
      server.expose(key, authentication[key]);
    }
  }
};