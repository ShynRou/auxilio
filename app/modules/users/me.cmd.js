module.exports = async (input, request) => {
  return request.reply(
    {
      id: request.user.id,
      name: request.user.name,
      groups: request.user.scope,
      email: request.user.email,
      sid: request.user.sid,
    }
  );
};