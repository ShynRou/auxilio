module.exports = {
  id: 'basic',
  commands: [
    require('./time.cmd'),
    require('./date.cmd')
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