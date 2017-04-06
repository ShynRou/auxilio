
var localstorage = {
  register: function (server, options, next) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    server.app.localStorage = new LocalStorage('./storage'); // TODO: make configurable
  }
};

localstorage.register.attributes = {
  name: 'localstorage',
  version: '1.0.0'
};

module.exports = localstorage;