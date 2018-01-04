module.exports = async (input, request) => {
  return request.reply(
    await request.originalRequest.server.plugins.auth.login(
      input.username,
      input.password,
      request.originalRequest,
      request.responseToolkit,
    )
  );
};