

const commander = {};
commander.plugins = {};
commander.cmds = [];


commander.register = function (cmd) {
  console.log(`${cmd.plugin}.${cmd.id}`);

  if(!commander.plugins[cmd.plugin]) {
    commander.plugins[cmd.plugin] = {}
  }
  commander.plugins[cmd.plugin][cmd.id] = cmd;
};

commander.findBest = function (fracture) {

};

// REGISTER PLUGIN =====================================================

var plugin = {
  register: function (server, options, next) {
    for (let key in commander) {
      server.expose(key, commander[key]);
    }
    next();
  }
};

plugin.register.attributes = {
  name: 'commander',
  version: '1.0.0'
};

module.exports = plugin;