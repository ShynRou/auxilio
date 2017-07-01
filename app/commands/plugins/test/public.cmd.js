module.exports = {
  id: 'public',
  auth: {
    scope: null, // no user group required (public)
  },
  handler: (resolve, reject, session, param) => {
    return resolve({
      data: true,
      text: 'success',
      speech: 'test was successful'
    });
  }
};