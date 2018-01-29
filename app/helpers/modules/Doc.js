const Doc = function (doc) {
  doc = doc || {};
  this._id = doc._id;
  this.owner = doc.owner;
  this.users = doc.users;
  this.groups = doc.groups;
  this.created = doc.created || Date.now();
  this.data = doc.data;
};

Doc.toDocs = function (array) {
  return array && array.map(d => new Doc(d));
};

Doc.prototype = {
  setData(data) {
    this.data = data;
  },

  changeOwner(userId, keepRead, keepWrite, keepShare) {
    const prevOwner = this.owner;
    console.log('Doc.changeOwner() not yet supported!');
  },

  shareWithUser(userId, canWrite, canShare) {
    if (!this.users.find((rights) => rights.id === userId)) {
      if (!this.users) {
        this.users = [];
      }
      this.users.push({id: userId, w: canWrite, s: canShare});
    }
  },

  shareWithGroup(groupId, canWrite, canShare) {
    if (!this.groups.find((rights) => rights.id === groupId)) {
      if (!this.groups) {
        this.groups = [];
      }
      this.groups.push({id: groupId, w: canWrite, s: canShare});
    }
  },

};

module.exports = Doc;