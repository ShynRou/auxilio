const Commander = {};

Commander.register = function (command) {
  console.log(`${command.plugin}.${command.id}`);
};


module.exports = Commander;