let Boom = require('boom');

module.exports = async (input, request) => {
  try {
    let result = await request.originalRequest.server.plugins.auth.group.insert(
      {_id: input.groupId, name: input.name}
    );
    return request.reply({success: !!result});
  } catch (e) {
    return request.reply(
      Boom.conflict()
    );
  }
};