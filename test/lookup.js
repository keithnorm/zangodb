const { expect } = require('chai');

global.indexedDB = require('fake-indexeddb');
global.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange');
global.zango = require('../src');

const db = new zango.Db('mydb', { post: ['_id'], author: ['_id']});
const posts = db.collection('post');
const authors = db.collection('author');

const post = {
  _id: 1,
  author: 1,
};

const author = {
  _id: 1,
  name: 'Jack Johnson',
}

before(() => {
  posts.insert(post);
  authors.insert(author);
});
after(() => db.drop());

it('fetches and embeds related entity', (done) => {
  posts.aggregate([
    {
      $lookup: {
        from: 'author',
        localField: 'author',
        foreignField: '_id',
        as: 'author',
      }
    }
  ]).toArray((error, docs) => {
      if (error) { throw error; }
      expect(docs).to.have.lengthOf(1);
      expect(docs[0].author).to.have.property('name');
      expect(docs[0].author.name).to.equal('Jack Johnson');
      done();
  });
});
