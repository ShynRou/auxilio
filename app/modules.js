module.exports = function load(server) {
  var glob = require('glob'),
    path = require('path');

  console.log("______________________________________________________________________________");
  console.log("___ INITIALIZING OFFICER  ____________________________________________________");
  glob.sync(__dirname + '/modules/**/*.module.js').forEach(function (file) {
    let module = require(path.resolve(file));
    server.plugins.officer.register(module);
  });
  console.log("______________________________________________________________________________");
};