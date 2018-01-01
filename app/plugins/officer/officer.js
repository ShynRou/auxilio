const UUID = require('uuid');
const Docs = require('../../helpers/Docs');


const officer = {modules: {}, docs: {}, rights: {}};
const Sheru = require('sheru');
officer.sheru = new Sheru({});

let server = null;


officer.register = function (module) {
  console.log(`${module.id}${module.description ? ' \t\t//' + module.description : ''}`);

  if (officer.modules[module.id]) {
    console.error(`Duplicated id, maybe you have already registered this plugin? (${module.id})`);
    return;
  }

  officer.modules[module.id] = module;
  officer.docs[module.id] = new Docs(server.plugins['hapi-mongodb'].db.collection('_module.' + module.id));
  officer.rights[module.id] = {core: module.core};

  const enrich = (cmd, script) => {
    cmd.module = module;
    script = (script ? script + '/' : '') + cmd.id;

    if (cmd.commands && cmd.commands.length > 0) {
      cmd.commands = cmd.commands.reduce((obj, command) => {
        obj[command.id] = enrich(command, script);
        return obj;
      }, {});
    }
    return cmd;
  };

  enrich(module);

  officer.sheru.addCommand(module.id, module);
};


officer.run = function (request, script, input = null) {
  var scriptFunc = officer.sheru.parse(script);
  if (scriptFunc) {

    const module = script.replace(/\s.*$/gi, '').toLowerCase();

    const result = [];

    const reply = (data) => {
      result.push(data);
      return data;
    };

    let originalRequest = undefined;
    if(officer.rights[module] && officer.rights[module].core) {
      originalRequest = request;
    }

    return scriptFunc(input, {
      reply,
      docs: officer.docs[module],
      user: (request.credentials && request.credentials.username) || 'guest',
      originalRequest: originalRequest,
    }).then(() => result).catch(error => {
      console.error(error);
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