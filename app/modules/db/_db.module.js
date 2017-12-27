module.exports = {
  id: 'db',
  commands: [
    require('./get.cmd.js'),
    require('./set.cmd.js')
  ],
  handler: (input, request) => {
    const text = "I provide basic information and functionality, like the time and date.";
    return request.reply({
      data: text,
      text: text,
      speech: text
    });
  }
};