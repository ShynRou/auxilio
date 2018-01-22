const fs = require('fs');
const { NodeVM } = require('vm2');

const CommandContainer = function (command) {
  this.module = command.module || command;
  this.command = command;
  const vm = new NodeVM({
    console: 'inherit',
    sandbox: {},
    require: {
      external: ['number-to-words', 'boom'],
      builtin: false,
      root: './',
    },
    nesting: false,
  });
  this.handler = vm.run(fs.readFileSync(this.module.dir + command.handler, 'utf8').toString(), command.handler);
};

CommandContainer.prototype = {
  async secureHandler(input, request) {

    let secureRequest = { reply: request.reply, user: request.user };

    if(this.module.rights) {
      if (this.module.rights.core) {
        secureRequest.originalRequest = request.originalRequest;
        secureRequest.responseToolkit = request.responseToolkit;
      }

      if (this.module.rights.docs) {
        secureRequest.docs = request.docs;
      }

      if (this.module.rights.https) {
        secureRequest.https = request.https;
      }

      if (this.module.rights.scripts) {
        secureRequest.inject = request.inject;
      }
    }

    return this.handler(input, secureRequest);
  }
};

module.exports = CommandContainer;