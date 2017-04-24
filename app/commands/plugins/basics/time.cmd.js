
const n2w = require('number-to-words');

module.exports = {
  plugin: 'basics',
  id: 'time',
  commands: [
    'what ?is,\'s ?the time',
    'what time ?is,\'s ?it',
    'tell ?me ?the time',
    'tell ?me ?what $time ?it ?is,\'s'
  ],
  handlers: {
    entry: function (request, rawRequest, parseRequest, reply) {

      let date = new Date();

      let h = date.getHours();
      h = h == 0 ? (h-1)%12+1 : 12;
      let m = date.getMinutes();

      reply({
        data: date.getTime(),
        text: date.toLocaleTimeString(),
        speech: `It's ${n2w(m)} past ${n2w(h)}`
      })
    }
  }

};