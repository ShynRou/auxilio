module.exports = async (input, request) => {
  console.log(input);
  return request.reply(
    request.user
  );
};