
module.exports = async (input, request) => {
  return request.reply(
    await request.originalRequest.server.plugins.auth.register(
      input.username,
      input.password,
      input.email,
      request.originalRequest,
      request.responseToolkit
    )
  );
};