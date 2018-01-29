module.exports = function load(server) {
  var glob = require('glob'),
    path = require('path');

  const modules = {};

  console.log("______________________________________________________________________________");
  console.log("___ MODULES  ____________________________________________________________");
  glob.sync(__dirname + '/modules/**/*.module.json').forEach(function (file) {
    let module = require(path.resolve(file));
    module.dir = file.replace('\\', '/').replace(/\/[^/]*$/, '/');

    modules[module.id] = module;
  });

  if (server.app.config.modules && server.app.config.modules.dir) {
    glob.sync(`${server.app.config.modules.dir}/**/*.module.json`).forEach(function (file) {
      let module = require(path.resolve(file));
      if(modules[module.id]) {
        modules[module.id] = Object.assign({},modules[module.id], module);
      }
      else {
        module.dir = file.replace('\\', '/').replace(/\/[^/]*$/, '/');
      }
    });
  }

  Object.keys(modules).forEach(key => server.plugins.officer.register(modules[key]));
  console.log("______________________________________________________________________________");
};