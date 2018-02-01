module.exports = async function (input, request) {
  const entry = await request.originalRequest.server.plugins.auth.users.find().toArray();
  return request.reply(transform.omit(['password', 'sessions'], ...entry));
};