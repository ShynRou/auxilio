module.exports = function(input, request) {
  const text = "You can use auth to login and logout.";
  console.log('hey');
  return request.reply({
    data: text,
    text: text,
    speech: text
  });
};