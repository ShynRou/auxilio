const Rinku = function (config) {
  
  const Hapi = require('hapi');

  this.server = new Hapi.Server();
  this.server.connection(config.server);

  this.server.start((err) => {
    if (err) {
      throw err;
    }

    console.log(`Server running at: ${this.server.info.uri}`);
  });


// INITIALIZE PLUGINS
  this.server.register([
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

      this.officer = this.server.plugins.officer;
      this.langParser = this.server.plugins.langParser;
      this.loki = this.server.plugins.loki;

      require('./auth')(server);
      require('./commands')(server);
      require('./routes')(server);

    }
  );
};

module.exports = Rinku;