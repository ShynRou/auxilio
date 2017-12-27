const table = (config, content, isHeadline) => {
  let spacer = isHeadline ? '_' : ' ';
  let result = [];
  for (let i = 0; i < content.length; i++) {
    let val = content[i] ? content[i].substr(0, config[i]) : '';
    result.push(val + spacer.repeat(config[i] - val.length));
  }
  return result.join(`${spacer}|${spacer}`);
};

module.exports = function load(server) {
  var glob = require('glob'),
    path = require('path'),
    tableConf = [12, 32, 4, 64];

  console.log("___ INITIALIZING ROUTES ______________________________________________________");
  console.log(table(tableConf, ['methods', 'route', 'auth', 'description'], true));
  glob.sync(__dirname + '/routes/**/*.route.js').forEach(function (file) {
    let route = require(path.resolve(file));
    console.log(
      table(tableConf, [
        `${route.method.join(', ')}`,
        `${route.path}`,
        `${route.config && route.config.auth ? route.config.auth.mode || '' : ''}`,
        `${route.description || '' }`
      ])
    );
    delete route.description;
    server.route(route);
  });
  console.log("______________________________________________________________________________");
};