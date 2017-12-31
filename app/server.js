const Rinku = function (config) {

  config = require('./configcheck')(config);

  config.db = config.db || {
      url: "mongodb://localhost:27017/rinku",
      settings: {
        native_parser: false,
      }
    };

  const Hapi = require('hapi');

  this.server = new Hapi.Server();
  this.server.app.config = config;
  this.server.connection(config.server);

  this.server.start((err) => {
    if (err) {
      throw err;
    }
    console.log(`Server running at: ${this.server.info.uri}`);
  });


// INITIALIZE PLUGINS
  this.server.register([
      require('inert'),
      require('hapi-auth-jwt2'),
      require('./plugins/officer/officer'),
      {
        register: require('hapi-mongodb'),
        options: config.db,
      },
      require('./plugins/auth/auth.plugin'),
    ], (err) => {
      if (err) {
        console.error(err);
        return;
      }

      this.officer = this.server.plugins.officer;

      require('./modules')(server);
      require('./routes')(server);
    }
  );
};

module.exports = Rinku;