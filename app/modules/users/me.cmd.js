module.exports = async (input, request) => {
  return request.reply(
    request.user
  );
};