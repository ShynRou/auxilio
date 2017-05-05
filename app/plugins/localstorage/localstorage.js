
var localstorage = {
  register: function (server, options, next) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    const store = new LocalStorage('./storage');
    for (let key in store) {
      server.expose(key, store[key]);
    }

    next();
  }
};

localstorage.register.attributes = {
  name: 'localstorage',
  version: '1.0.0'
};

module.exports = localstorage;