const Rinku = function (config) {

  config = require('./configcheck')(config);

  config.db = config.db || {
    url: "mongodb://localhost:27017/rinku",
    settings: {
      native_parser: false,
    }
  };

  const Hapi = require('hapi');

  this.server = new Hapi.Server(config.server);
  this.server.app.config = config;

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
    {
      plugin: require('hapi-mongodb'),
      options: config.db,
    },
    require('./plugins/auth/auth.plugin'),
    require('./plugins/officer/officer'),
  ]).then(() => {
    this.officer = this.server.plugins.officer;
    this.langParser = this.server.plugins.langParser;
    this.loki = this.server.plugins.loki;

    require('./modules')(server);
    require('./routes')(server);
  }).catch((err) => {
    console.error(err.stack);
    this.server.stop();
  });
};

module.exports = Rinku;