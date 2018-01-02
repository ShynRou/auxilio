module.exports = async (input, request) => {
  return request.reply(
    await request.originalRequest.server.plugins.auth.logout(
      request.originalRequest
    )
  );
};