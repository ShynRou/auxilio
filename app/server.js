
const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 8080, host: 'localhost' });

server.start((err) => {

  if (err) {
    throw err;
  }

  console.log(`Server running at: ${server.info.uri}`);
});

require('./routes')(server);