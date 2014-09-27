var helper = require('../test_helper'),
  assert = require('assert'),
  _ = require('lodash'),
  Post = require('../../models').models.Post;

describe('saving a new Post', function() {
  describe('with valid attributes', function() {
    it('should save successfully', function() {
      Post.create(helper.factories.Post(), function(err, post) {
        assert.equal(err, undefined)
      });
    });
  });

  describe('with invalid attributes', function() {
    it('should fail if title is not present', function() {
      var attrs = helper.factories.Post();
      delete attrs['title']
      Post.create(attrs, function(err) {
        assert(err);
      });
    });
  });
});
