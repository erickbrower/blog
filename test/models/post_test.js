require('../test_helper');

var db = require('../../config/db'),
  assert = require('assert'),
  _ = require('lodash'),
  Post = require('../../models').Post;

describe('saving a new Post', function() {
  before(function(done) {
    db.automigrate(function(err) {
      if (err) throw err;
      done();
    });
  });

  var attributes = {
    title: 'test post',
    body: 'blah blah blah'
  };

  describe('with valid attributes', function() {
    beforeEach(function(done) {
      Post.destroyAll(function() {
        done();
      });
    });

    it('should save successfully', function() {
      Post.create(attributes, function(err, post) {
        assert(!err, 'Errors were generated during create');
      });
    });
  });

  describe('with invalid attributes', function() {
    it('should fail if title is not present', function() {
      var badAttrs = _.clone(attributes);
      delete badAttrs['title']
      Post.create(badAttrs, function(err) {
        assert(err, 'Error was not generated during save');
      });
    });
  });
});
