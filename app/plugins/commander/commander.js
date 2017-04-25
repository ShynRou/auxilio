

const commander = {};
commander.plugins = {};


commander.register = function (cmd) {
  console.log(`${cmd.plugin}.${cmd.id}`);

  if(!commander.plugins[cmd.plugin]) {
    commander.plugins[cmd.plugin] = {}
  }
  commander.plugins[cmd.plugin][cmd.id] = cmd;
};

commander.findBest = function (raw, parsed) {

  if(!raw || !parsed) {
    return null;
  }

  // CHECK RAW FOR COMMAND
  let cmdMatch = raw.match(/^[\/@>!]([\w\d\-_]+).([\w\d\-_]+).*$/);

  if(cmdMatch) {
    let cmd = commander.plugins[cmdMatch[1]][cmdMatch[2]];

    if(cmd) {
      return [{cmd, scoreRequired: 1, scoreOptional: 1}];
    }
  }
};

commander.parse = function (request, raw, parsed) {
  if(!raw || !parsed) {
    return "Sorry, did you say something?";
  }

  let cmds = commander.findBest(raw, parsed);
  if(cmds && cmds.length > 0) {
    console.log(cmds);
    return cmds[0].cmd.handlers.entry(request, raw, parsed);
  }
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