
var langParser = {
  register: function (server, options, next) {
    const structure = require('./src/structure');
    for (let key in structure) {
      server.expose(key, structure[key]);
    }

    if(options && options['dictionary']) {
      server.plugins.langParser.init(options['dictionary']);
    }

    next();
  }
};

langParser.register.attributes = {
  name: 'langParser',
  version: '1.0.0'
};

module.exports = langParser;