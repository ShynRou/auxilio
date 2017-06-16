const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 8080, host: 'localhost' });

server.start((err) => {
  if (err) {
    throw err;
  }

  console.log(`Server running at: ${server.info.uri}`);
});

// REGISTER:
//  - Database (lokijs)
server.register(require('./plugins/loki/loki'));
//  - Command Manager (officer)
server.register(require('./plugins/officer/officer'));
//  - Language Parser (langParser)
server.register({
  register: require('./plugins/langParser/langParser'),
  options: {
    dictionary: './app/resource/dict/en/dictionary_custom.json'
  }
});

// INITIALIZE REFLACTIVE PLUGINS
server.register(require('inert'), (err) => {
    if (err) {
      console.error(err);
      return;
    }

    require('./commands')(server);
    require('./routes')(server);
  }
);