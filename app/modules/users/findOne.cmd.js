
module.exports = async (input, request) => {
  return request.reply(
    await request.originalRequest.server.plugins.auth.users.findOne({_id: input.username, email: input.email})
  );
};