module.exports = function load(server) {
  var glob = require('glob'),
    path = require('path'),
    commander = require('./commands/commander');

  console.log("___ INITIALIZING COMMANDS ____________________________________________________");
  glob.sync(__dirname + '/commands/**/*.cmd.js').forEach(function (file) {
    let cmd = require(path.resolve(file));
    commander.register(cmd);
  });
  console.log("______________________________________________________________________________");
};