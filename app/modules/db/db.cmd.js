module.exports = (input, request) => {
  const text = "I provide basic information and functionality, like the time and date.";
  return request.reply({
    data: text,
    text: text,
    speech: text
  });
};