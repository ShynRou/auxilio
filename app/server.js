const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 8080, host: 'localhost' });

server.start((err) => {
  if (err) {
    throw err;
  }

  console.log(`Server running at: ${server.info.uri}`);
});

server.register(require('./plugins/localstorage/localstorage'));
server.register(require('./plugins/officer/officer'));
server.register({
  register: require('./plugins/langParser/langParser'),
  options: {
    dictionary: './app/resource/dict/en/dictionary_custom.json'
  }
});

server.register(require('inert'), (err) => {
    if (err) {
      console.error(err);
      return;
    }

    require('./commands')(server);
    require('./routes')(server);
  }
);