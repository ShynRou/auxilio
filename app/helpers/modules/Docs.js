const Doc = require('./Doc');

const Docs = function (collection) {
  this.insert = async function (doc) {
    if (doc && doc.owner) {
      return await collection.insert(doc);
    }
  };

  this.update = async function (doc) {
    if (doc && doc._id && doc.owner) {
      return await collection.update(filter, update);
    }
  };

  this.updateOne = async function (doc) {
    if (doc && doc._id) {
      return await collection.updateOne({ _id: doc._id }, { $set: doc });
    }
  };

  this.find = async function (queryObj) {
    return Doc.toDocs(await collection.find(queryObj).toArray());
  };

  this.findOne = async function (queryObj) {
    return new Doc(await collection.findOne(queryObj));
  };


  this.delete = async function (filter) {
    if (filter) {
      return await collection.deleteMany(filter);
    }
  };

  this.deleteOne = async function (doc) {
    if (doc && doc._id) {
      return await collection.deleteOne({ _id: doc._id });
    }
  };

  this.findOne = async function (queryObj) {
    return new Doc(await collection.findOne(queryObj));
  };

  this.find = async function (queryObj) {
    return Doc.toDocs(await collection.find(queryObj).toArray());
  };
};

Docs.prototype = {
  create(userId) {
    return new Doc({ owner: userId });
  },
};


module.exports = Docs;