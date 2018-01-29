module.exports = async (input, request) => {

  const search = {};
  if (input.groupId) {
    search._id = new RegExp(`.*${input.groupId}.*`,'i');
  }
  if (input.name) {
    search.name = new RegExp(`.*${input.name}.*`,'i');
  }

  return request.reply(
    await request.originalRequest.server.plugins.auth.groups.find(search).toArray()
  );
};