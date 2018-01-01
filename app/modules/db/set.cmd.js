const cmd = {
  id: 'set',
  handler: async (input, request) => {
    let doc = request.docs.create(request.user);
    doc.setData(input);
    let result = await request.docs.insert(doc);

    return request.reply({
      data: doc,
      text: doc,
      speech: result ? `Your entry has been saved!` : 'Failed to Insert',
    });
  }
};

module.exports = cmd;