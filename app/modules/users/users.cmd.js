module.exports = function(input, request) {
  const text = "You can use 'users' to find users and get and edit your user data!";
  return request.reply({
    data: text,
    text: text,
    speech: text
  });
};