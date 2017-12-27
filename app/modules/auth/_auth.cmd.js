module.exports = {
  id: 'auth',
  core: true, // the commander will pass the request as 6th parameter
  commands: [
    require('./login.cmd.js'),
    require('./logout.cmd.js'),
    require('./register.cmd.js'),
  ],
  handler: (reply, inject, session, param) => {
    const text = "You can use auth to login and logout.";
    return reply({
      data: text,
      text: text,
      speech: text
    });
  }
};