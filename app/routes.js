module.exports = function load(server) {
  var glob = require('glob'),
    path = require('path');

  console.log("___ INITIALIZING ROUTES ______________________________________________________");
  glob.sync(__dirname + '/routes/**/*.route.js').forEach(function (file) {
    let route = require(path.resolve(file));
    console.log(
      `[${route.method.join(', ')}]\t`
      + `${route.path}\t`
      + `${route.config && route.config.auth ? `(${(route.config.auth.mode || '').substr(0, 1)})` : ''}\t`
      + `${route.description ? '//' + route.description : '' }`
    );
    delete route.description;
    server.route(route);
  });
  console.log("______________________________________________________________________________");
};