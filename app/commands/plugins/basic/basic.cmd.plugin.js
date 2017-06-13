module.exports = {
  id: 'basic',
  commands: [
    require('./time.cmd'),
    require('./date.cmd')
  ],
  handler: (reply, session, param) => {
    const text = "I provide basic information and functionality, like the time and date.";
    return reply({
      data: text,
      text: text,
      speech: text
    });
  }
};