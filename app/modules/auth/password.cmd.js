module.exports = async (input, request) => {
  return request.reply(
    await request.originalRequest.server.plugins.auth.changePassword(
      request.user.id,
      input.old,
      input.new,
      request.originalRequest,
      request.responseToolkit,
    )
  );
};