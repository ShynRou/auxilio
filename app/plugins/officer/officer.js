const officer = {};
officer.commands = {};

const WORD_TYPE = {
  optional: 0,
  addition: 1,
  required: 2,
};


officer.register = function (plugin) {
  console.log(`${plugin.id}${plugin.description ? ' \t\t//' + plugin.description : ''}`);

  officer.commands[plugin.id] = plugin;

  if (plugin.commands && plugin.commands.length > 0) {
    plugin.commands.forEach(command => {
      officer.commands[`${plugin.id}.${command.id}`] = command;
      console.log(` |.${command.id}${plugin.description ? ' \t\t//' + plugin.description : ''}`);
    });
  }
};


officer.call = function (request, reply, cmd, entryPoint = 'entry', param = {}) {
  if (officer.commands[cmd]) {
    let command = officer.commands[cmd];
    if (command.handler) {
      return new Promise(
        (resolve, reject) =>
          command.handler(reply, request.session, param)
      );
    }
    else if (command.handlers && command.handlers[entryPoint]) {
      return new Promise(
        (resolve, reject) =>
        command.handlers[entryPoint](resolve, reject, request.session, param)
      );
    }
  }
  return null;
};

officer.callScript = function (request, reply, script) {

  console.log(script);

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

      return officer.call(request, reply, command, entry, param);
    }
  }

  return false;
};

officer


// REGISTER PLUGIN =====================================================

var plugin = {
  register: function (server, options, next) {
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