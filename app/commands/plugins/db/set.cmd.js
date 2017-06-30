
module.exports = {
  id: 'set',
  handlers: {
    entry: (resolve, reject, session, param) => {

      let doc =  session.create();
      doc.data = param;

      session.save(doc);

      return resolve({
        data: doc,
        text: doc,
        speech: `Your entry has been saved!`,
      });
    }
  }
};