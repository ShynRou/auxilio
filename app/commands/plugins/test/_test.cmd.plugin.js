module.exports = {
  id: 'test',
  commands: [
    require('./public.cmd'),
    require('./private.cmd')
  ],
  handler: (resolve, reject, session, param) => {
    const text = "You can use the test plugin to test the basic functionality";
    return resolve({
      data: text,
      text: text,
      speech: text
    });
  }
};