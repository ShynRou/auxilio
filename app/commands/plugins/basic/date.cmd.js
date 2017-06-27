
const n2w = require('number-to-words');

module.exports = {
  id: 'date',
  handlers: {
    entry: (resolve, reject, session, param) => {

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

      return resolve({
        data: date.getTime(),
        text: date.toLocaleDateString(),
        speech: `It's the ${n2w.toWordsOrdinal(day)} of ${month}.`
      });
    }
  }

};