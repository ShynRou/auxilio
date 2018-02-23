module.exports = async (input, request) => {
  let userId = input.userId || request.user.id;
  if (userId && input.groupId) {
    return request.reply(
      await request.originalRequest.server.plugins.auth.users.updateOne({ _id: userId }, { $push: { groups: input.groupId } })
    );
  }
  else {
    return { success: false, error: 'groupId is needed! (-g, --groupId)' };
  }
};