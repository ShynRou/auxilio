module.exports = {
  id: 'basics',
  aliases: [
    'basic',
    'b'
  ],
  commands: [
    require('./time.cmd')
  ],
  handler: (request, rawRequest, parseRequest) => {
    return "I provide basic information and functionality, like the time and date.";
  }
};