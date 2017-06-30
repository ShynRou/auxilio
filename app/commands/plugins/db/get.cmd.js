
module.exports = {
  id: 'get',
  handlers: {
    entry: (resolve, reject, session, param) => {

      let list =  session.get();

      return resolve({
        data: list,
        text: list,
        speech: `Your db is ${list.length} entries long.`,
      });
    }
  }

};