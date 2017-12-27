const Doc = require('./Doc');

const Docs = function (collection) {
  this.collection = collection;
};

Docs.prototype = {

  create(userId) {
    return new Doc({owner: userId});
  },

  async insert(doc) {
    console.log(doc);
    if(doc && doc.owner) {
      return await this.collection.insert(doc);
    }
  },

  async update(doc) {
    if(doc && doc._id && doc.owner) {
      return await this.collection.update(doc);
    }
  },

  async find(queryObj) {
    return Doc.toDocs(await this.collection.find(queryObj).toArray());
  },

  async findOne(queryObj) {
    return new Doc(await this.collection.findOne(queryObj));
  }
};


module.exports = Docs;