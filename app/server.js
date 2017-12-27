const Rinku = function (config) {
  
  const Hapi = require('hapi');

  this.server = new Hapi.Server();
  this.server.connection(config.server);

  config.db = {
    url: "mongodb://localhost:27017/rinku",
    settings: {
        native_parser: false,
    }
  };

  this.server.start((err) => {
    if (err) {
      throw err;
    }

    console.log(`Server running at: ${this.server.info.uri}`);
  });


// INITIALIZE PLUGINS
  this.server.register([
      require('hapi-auth-cookie'),
      require('./plugins/officer/officer'),
      require('./plugins/auth/auth.plugin'),
      require('inert'),
      {
        register: require('hapi-mongodb'),
        options: config.db,
      }
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