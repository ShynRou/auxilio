module.exports = function load(server) {
  var glob = require('glob'),
    path = require('path');

  console.log("______________________________________________________________________________");
  console.log("___ INITIALIZING OFFICER  ____________________________________________________");
  glob.sync(__dirname + '/modules/**/*.module.json').forEach(function (file) {
    let module = require(path.resolve(file));
    module.dir = file.replace('\\', '/').replace(/\/[^/]*$/, '/');
    server.plugins.officer.register(module);
  });
  console.log("______________________________________________________________________________");
};