module.exports = async (input, request) => {

  const search = {};
  if (input.userId) {
    search._id = new RegExp(`.*${input.userId}.*`,'i');
  }
  if (input.email) {
    search.email = new RegExp(`.*${input.email}.*`,'i');
  }

  return request.reply(
    await request.originalRequest.server.plugins.auth.users.find(search).toArray()
  );
};