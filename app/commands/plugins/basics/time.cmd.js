
const n2w = require('number-to-words');

module.exports = {
  id: 'time',
  commands: [
    '!what is,\'s the !time',
    '!what !time is,\'s it',
    '!tell me the !time',
    '!tell me &what !time it is,\'s'
  ],
  handlers: {
    entry: (request, rawRequest, parseRequest) => {

      let date = new Date();

      let h = date.getHours();
      h = h == 0 ? 12 : (h-1)%12+1;
      let m = date.getMinutes();

      return {
        data: date.getTime(),
        text: date.toLocaleTimeString(),
        speech: `It's ${n2w.toWords(m)} past ${n2w.toWords(h)}`
      };
    }
  }

};