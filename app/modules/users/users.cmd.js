module.exports = async function (input, request) {
  const entry = await request.originalRequest.server.plugins.auth.users.find().toArray();
  return request.reply(entry.map(e => ({username: e._id, email: e.email})));
};