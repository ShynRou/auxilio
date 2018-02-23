const Doc = function (doc) {
  doc = doc || {};
  this._id = doc._id;
  this.owner = doc.owner;
  this.users = doc.users || [];
  this.groups = doc.groups || [];
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

  getRights(user) {
    if (user) {
      if (user.id === this.owner) {
        return {
          write: true,
          share: true,
        }
      }

      let rights = this.users.find((rights) => rights.id === prevOwner);
      if (rights) {
        return {
          write: rights.w,
          share: rights.s,
        };
      }
      if(user.groups) {
        rights = this.groups.find((rights) => user.groups.includes(rights.id));
        if (rights) {
          return {
            write: rights.w,
            share: rights.s,
          };
        }
      }
    }
  },

  changeOwner(userId, keepRead, keepWrite, keepShare) {
    if (userId !== this.owner) {
      let prevOwner = this.owner;
      this.owner = userId;
      if (keepRead) {
        let prevOwnerRights = this.users.find((rights) => rights.id === prevOwner);
        if (prevOwnerRights) {
          prevOwner.w = keepWrite;
          prevOwner.s = keepShare;
        }
        else {
          this.users.push({
            id: userId,
            w: keepWrite,
            s: keepShare,
          });
        }
      }
      else {
        this.removeUserRights(prevOwner);
      }
    }
  },

  addUser(userId, canWrite, canShare) {
    if (this.owner !== userId && !this.users.find((rights) => rights.id === userId)) {
      this.users.push({ id: userId, w: canWrite, s: canShare });
    }
  },

  editUserRights(userId, canWrite, canShare) {
    let user = this.users.find((rights) => rights.id === userId);
    if (user) {
      user.w = canWrite;
      user.s = canShare;
    }
  },

  removeUser(userId) {
    this.users = this.users.filter((rights) => rights.id !== userId);
  },

  addGroup(groupId, canWrite, canShare) {
    if (!this.groups.find((rights) => rights.id === groupId)) {
      this.groups.push({ id: groupId, w: canWrite, s: canShare });
    }
  },

  editGroupRights(groupId, canWrite, canShare) {
    let group = this.groups.find((rights) => rights.id === groupId);
    if (group) {
      group.w = canWrite;
      group.s = canShare;
    }
  },

  removeGroup(groupId) {
    this.groups = this.groups.filter((rights) => rights.id !== groupId);
  },

};

module.exports = Doc;