let Rinku = require('./app/server')({
  server: {
    host: 'localhost',
    port: 3001,

    routes: {
      cors: {
        origin: ['*'],
        additionalHeaders: [
          'Content-Type',
          'Accept',
          'Access-Control-Allow-Origin',
          'Authorization',
        ],
        credentials: true,
      }
    }
  },
});