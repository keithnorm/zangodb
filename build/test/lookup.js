'use strict';

var _require = require('chai'),
    expect = _require.expect;

global.indexedDB = require('fake-indexeddb');
global.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange');
global.zango = require('../src');

var db = new zango.Db('mydb', { post: ['_id'], author: ['_id'] });
var posts = db.collection('post');
var authors = db.collection('author');

var post = {
  _id: 1,
  author: 1
};

var author = {
  _id: 1,
  name: 'Jack Johnson'
};

before(function () {
  posts.insert(post);
  authors.insert(author);
});
after(function () {
  return db.drop();
});

it('fetches and embeds related entity', function (done) {
  posts.aggregate([{
    $lookup: {
      from: 'author',
      localField: 'author',
      foreignField: '_id',
      as: 'author'
    }
  }]).toArray(function (error, docs) {
    if (error) {
      throw error;
    }
    expect(docs).to.have.lengthOf(1);
    expect(docs[0].author).to.have.property('name');
    expect(docs[0].author.name).to.equal('Jack Johnson');
    done();
  });
});