
module.exports = {
  omit: function (deletions, ...objects) {
    if(objects && objects.length > 0) {
      let deletionObj = deletions.reduce((acc, d) => {
        acc[d] = undefined;
        return acc;
      }, {});

      return objects.map(o => ({...o, ...deletionObj}))
    }
    return objects;
  }
};