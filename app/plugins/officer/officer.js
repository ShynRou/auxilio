const UUID = require('uuid');


const officer = {};
officer.commands = {};

let server = null;

const WORD_TYPE = {
  optional: 0,
  addition: 1,
  required: 2,
};


officer.register = function (plugin) {
  console.log(`${plugin.id}${plugin.description ? ' \t\t//' + plugin.description : ''}`);

  if (officer.commands[plugin.id]) {
    console.error(`Duplicated id, maybe you have already registered this plugin? (${plugin.id})`);
    return;
  }

  officer.commands[plugin.id] = plugin;
  plugin.collection = server.plugins.loki.db.getCollection('plugin.' + plugin.id);
  if (!plugin.collection) {
    plugin.collection = server.plugins.loki.db.addCollection('plugin.' + plugin.id, {
      unique: ['uid'],
    });
  }

  if (plugin.commands && plugin.commands.length > 0) {
    plugin.commands.forEach(command => {
      command.plugin = plugin;
      officer.commands[`${plugin.id}.${command.id}`] = command;
      console.log(` |.${command.id}${plugin.description ? ' \t\t//' + plugin.description : ''}`);
    });
  }
};


officer.run = function (request, reply, cmd, entryPoint = 'entry', param = {}) {
  console.log(cmd);
  if (officer.commands[cmd]) {
    let command = officer.commands[cmd];
    if (command.handler) {
      return new Promise(
        (resolve, reject) =>
          command.handler(
            resolve,
            reject,
            officer.getSession(command, request.credentials && request.credentials.username),
            param
          )
      );
    }
    else if (command.handlers && command.handlers[entryPoint]) {
      return new Promise(
        (resolve, reject) =>
          command.handlers[entryPoint](
            resolve,
            reject,
            officer.getSession(command, request.credentials && request.credentials.username),
            param
          )
      );
    }
  }
  return null;
};

officer.getSession = function (cmd, user = '*') {
  const collection = cmd && cmd.plugin.collection;
  return {
    get: () => collection.find({ user }),
    save: (data) => collection.update(data),
    remove: (uid) => collection.removeWhere({ uid }),
    create: () => collection.insert({ uid: UUID.v4(), user })
  }
};


officer.callScript = function (request, reply, script) {

  if (script) {
    // MATCH COMMAND AND SEPERATE INTO 1:plugin, 2:command, 3:entry, 4: named params, 5: unnamed params
    let match = script.match(/\/?([\w_-]+)(?:\.([\w_-]+))?(?:\.([\w_-]+))?( +\-[\w_-]+(?:\=(?:\"[^\"]*\"|[^\s]+)?))*(?: +(.*))?/);

    if (match) {
      let command = match[1] + (match[2] ? '.' + match[2] : '');
      let entry = match[3] || 'entry';

      let param = (match[4] && match[4].split(/(\-[\w_-]+(?:\=(?:\"[^\"]*\"|[^\s]+)))/).reduce(
          (result, value) => {
            let match = value.match(/\-([\w_-]+)(?:\=(\"[^\"]*\"|[^\s]+))/);
            if (match) {
              result[match[1]] = match[2] ? match[2].replace(/^\"|\"$/g, '') : true;
            }
            return result;
          },
          {}
        )) || {};

      param[''] = match[5];

      return officer.run(request, reply, command, entry, param);
    }
  }

  return false;
};


// REGISTER PLUGIN =====================================================

var plugin = {
  register: function (srv, options, next) {
    server = srv;
    for (let key in officer) {
      server.expose(key, officer[key]);
    }
    next();
  }
};

plugin.register.attributes = {
  name: 'officer',
  version: '1.0.0'
};

module.exports = plugin;