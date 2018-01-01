module.exports = {
  id: 'private',
  auth: {
    scope: '*', // '*' user group accepts all logged in users (private)
  },
  handler: (resolve, reject, session, param) => {
    return resolve({
      data: true,
      text: 'success',
      speech: 'test was successful'
    });
  }
};