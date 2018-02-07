const Doc = require('./Doc');

const Docs = function (collection) {
  this.collection = collection;
};

Docs.prototype = {
  create(userId) {
    return new Doc({owner: userId});
  },

  async insert(doc) {
    if(doc && doc.owner) {
      return await this.collection.insert(doc);
    }
  },

  async updateOne(doc) {
    if(doc && doc._id) {
      return await this.collection.updateOne({_id: doc._id}, {$set: doc});
    }
  },

  async update(filter, update) {
    if(filter && update) {
      return await this.collection.update(filter, update);
    }
  },

  async deleteOne(doc) {
    if(doc && doc._id) {
      return await this.collection.deleteOne({_id: doc._id});
    }
  },

  async delete(filter) {
    if(filter) {
      return await this.collection.deleteMany(filter);
    }
  },

  async findOne(queryObj) {
    return new Doc(await this.collection.findOne(queryObj));
  },

  async find(queryObj) {
    return Doc.toDocs(await this.collection.find(queryObj).toArray());
  },
};


module.exports = Docs;