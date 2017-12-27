
var authRegister = {
  register: function (server, options, next) {
    const Auth = require('./plugins/auth/auth');

    server.expose('auth', new Auth(this.server));

    next();
  }
};

authRegister.register.attributes = {
  name: 'auth',
  version: '1.0.0'
};

module.exports = authRegister;