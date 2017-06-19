const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({port: 8080, host: 'localhost'});

server.start((err) => {
  if (err) {
    throw err;
  }

  console.log(`Server running at: ${server.info.uri}`);
});


// INITIALIZE PLUGINS
server.register([
    require('hapi-auth-cookie'),
    require('./plugins/loki/loki'),
    require('./plugins/officer/officer'),
    {
      register: require('./plugins/langParser/langParser'),
      options: {
        dictionary: './app/resource/dict/en/dictionary_custom.json'
      }
    },
    require('inert'),
  ], (err) => {
    if (err) {
      console.error(err);
      return;
    }

    require('./auth')(server);
    require('./commands')(server);
    require('./routes')(server);
  }
);