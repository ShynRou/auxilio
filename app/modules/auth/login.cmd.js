module.exports = async (input, request) => {
  console.log(input);
  return request.reply(
    await request.originalRequest.server.plugins.auth.login(
      input.userId,
      input.password,
      request.originalRequest,
      request.responseToolkit,
    )
  );
};