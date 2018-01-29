
module.exports = async (input, request) => {
  return request.reply(
    await request.originalRequest.server.plugins.auth.groups.findOne({_id: input.groupId, name: input.name})
  );
};