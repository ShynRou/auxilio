
var loki = {
  register: function (server, options, next) {
    var lokijs = new require('lokijs');
    const db = new lokijs('./storage/db.json');
    server.expose('db',db);

    next();
  }
};

loki.register.attributes = {
  name: 'loki',
  version: '1.0.0'
};

module.exports = loki;