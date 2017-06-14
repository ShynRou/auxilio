module.exports = function load(server) {
  var glob = require('glob'),
    path = require('path');

  console.log("______________________________________________________________________________");
  console.log("___ INITIALIZING OFFICER  ____________________________________________________");
  glob.sync(__dirname + '/commands/**/*.cmd.plugin.js').forEach(function (file) {
    let plugin = require(path.resolve(file));
    server.plugins.officer.register(plugin);
  });
  console.log("______________________________________________________________________________");
};