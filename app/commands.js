module.exports = function load(server) {
  var glob = require('glob'),
    path = require('path');

  console.log("___ INITIALIZING COMMAND PLUGINS ____________________________________________________");
  glob.sync(__dirname + '/commands/**/*.cmd.plugin.js').forEach(function (file) {
    let plugin = require(path.resolve(file));
    server.plugins.commander.register(plugin);
  });
  console.log("______________________________________________________________________________");
};