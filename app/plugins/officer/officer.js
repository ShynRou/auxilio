const UUID = require('uuid');
const CommandContainer = require('../../helpers/modules/CommandContainer');
const Docs = require('../../helpers/modules/Docs');


const officer = { modules: {}, docs: {}, rights: {} };
const Sheru = require('sheru');
officer.sheru = new Sheru({});

let server = null;


officer.register = function (module) {

  if (officer.modules[module.id]) {
    console.error(`Duplicated id, maybe you have already registered this plugin? (${module.id})`);
    return;
  }

  officer.modules[module.id] = module;
  officer.docs[module.id] = new Docs(server.plugins['hapi-mongodb'].db.collection('_module.' + module.id));
  officer.rights[module.id] = { core: module.core };

  const enrich = (cmd, cmdId, depth = 0) => {
    console.log(`${depth > 0 ? '  '.repeat(depth)+'↳' : ''}${cmdId} ${module.description ? ' \t\t//' + module.description : ''}`);

    cmd.module = module;

    cmd.container = new CommandContainer({...cmd});
    cmd.handler = (input, request) => cmd.container.secureHandler(input, request);

    if (cmd.commands) {
      Object.keys(cmd.commands).forEach(
        (commandId) => {
          cmd.commands[commandId].id = commandId;
          enrich(cmd.commands[commandId], commandId, depth+1);
        }
      );
    }
    return cmd;
  };

  enrich(module, module.id);

  officer.sheru.addCommand(module.id, module);
};


officer.run = function (request, h, script, input = null) {
  var scriptFunc = officer.sheru.parse(script);
  if (scriptFunc) {

    const module = script.replace(/\s.*$/gi, '').toLowerCase();

    const result = [];

    const reply = (data) => {
      result.push(data);
      return data;
    };

    return scriptFunc(input, {
      reply,
      docs: officer.docs[module],
      user: (request.credentials && request.credentials.username) || 'guest',
      responseToolkit: h,
      originalRequest: request,
    }).then(() => result).catch(error => {
      console.error('error', error);
      return error;
    });
  }
};

officer.getCommand = function (request, commands) {
  if (!commands || commands.length <= 0) {
    return null;
  }

  let result = officer.modules[commands[0]];
  for (let i = 1; i < commands.length; i++) {
    if (result && result.commands) {
      return null;
    }
    const cmd = result.commands[commands[i]];
    if (!cmd) {
      return null;
    }
  }
  return result;
};

// REGISTER PLUGIN =====================================================

var plugin = {
  name: 'officer',
  version: '1.0.0',
  register: function (srv, options) {
    server = srv;
    for (let key in officer) {
      server.expose(key, officer[key]);
    }
  }
};

module.exports.plugin = plugin;