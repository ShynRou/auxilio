const fs = require('fs');
const Boom = require('boom');
const transform = require('../transform');
const time2ms = require('../transform');
const {NodeVM} = require('vm2');

const CommandContainer = function (command) {
  this.module = command.module || command;
  this.command = command;
  this.module.group = this.module.group || [];
  this.command.group = this.command.group || [];
  const vm = new NodeVM({
    console: 'inherit',
    sandbox: {transform, time2ms},
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
  canAccess(userGroups, ...allowedGroups) {
    if (!allowedGroups || !allowedGroups.length) {
      return true;
    } else if (!userGroups || !userGroups.length) {
      return false;
    } else {
      return !!userGroups.find(g => allowedGroups.includes(g));
    }
  },

  async secureHandler(input, request) {

    let secureRequest = {reply: request.reply, user: request.user};

    if (this.module.rights) {
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


    if (this.canAccess(request.user.scope, ...this.module.group, ...this.command.group)) {
      return this.handler(input, secureRequest);
    } else {
      return request.reply(Boom.unauthorized(`Cannot access "${this.module.id}"`));
    }
  }
};

module.exports = CommandContainer;