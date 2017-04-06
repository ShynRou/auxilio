const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 8080, host: 'localhost' });

server.start((err) => {
  if (err) {
    throw err;
  }

  console.log(`Server running at: ${server.info.uri}`);
});


server.register(require('./plugins/storage/localstorage'));


server.register(require('inert'), (err) => {
    if (err) {
      console.error(err);
      return;
    }

    require('./routes')(server);
  }
);