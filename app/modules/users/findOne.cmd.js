module.exports = async (input, request) => {
  return request.reply(
    transform.omit(
      ['password', 'sessions'],
      await request.originalRequest.server.plugins.auth.users.findOne({_id: input.userId, email: input.email})
    )
  );
};