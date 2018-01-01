
var authRegister = {
  register: function (server, options, next) {
    const Auth = require('./auth');
    const authentication = new Auth(server);

    for (let key in authentication) {
      server.expose(key, authentication[key]);
    }

    next();
  }
};

authRegister.register.attributes = {
  name: 'auth',
  version: '1.0.0'
};

module.exports = authRegister;