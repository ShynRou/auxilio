module.exports = async (input, request) => {

  const search = {};
  if (input.userId) {
    search._id = new RegExp(`.*${input.userId}.*`,'i');
  }
  if (input.email) {
    search.email = new RegExp(`.*${input.email}.*`,'i');
  }

  let entry = await request.originalRequest.server.plugins.auth.users.find(search).toArray();

  return request.reply(
    transform.omit(['password', 'sessions'], ...entry)
  );
};