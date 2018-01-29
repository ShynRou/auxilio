module.exports = async function (input, request) {
  const entry = await request.originalRequest.server.plugins.auth.groups.find().toArray();
  return request.reply(entry.map(e => ({groupId: e._id, name: e.name})));
};