module.exports = {
  id: 'db',
  commands: [
    require('./get.cmd'),
    require('./set.cmd')
  ],
  handler: (resolve, reject, session, param) => {
    const text = "I provide basic information and functionality, like the time and date.";
    return resolve({
      data: text,
      text: text,
      speech: text
    });
  }
};