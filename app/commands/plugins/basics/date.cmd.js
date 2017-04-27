
const n2w = require('number-to-words');

module.exports = {
  id: 'date',
  commands: [
    '!what is,\'s the !date',
    '!what !date is,\'s it',
    '!tell me the !date',
    '!tell me +what !date it is,\'s'
  ],
  handlers: {
    entry: (request, rawRequest, parseRequest) => {

      let date = new Date();

      let day = date.getDate();
      let month = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december"
      ][date.getMonth()+1];

      return {
        data: date.getTime(),
        text: date.toLocaleDateString(),
        speech: `It's the ${n2w.toWordsOrdinal(day)} of ${month}.`
      };
    }
  }

};