require('../test_helper');

var assert = require('assert'),
  sinon = require('sinon'),
  Post = require('../../models').Post,
  postsController = require('../../controllers/posts');

describe('.create', function() {
  describe('with a valid request', function() {
    it('should create a Post from the request body');
    it('should return a 202 status code');
  });

  describe('with an invalid request', function() {
    it('should not create a Post');
    it('should return a 400 status code');
  });
});

describe('.index', function() {
  it('should list existing Posts');
  it('should paginate');
});

describe('.show', function() {
  it('should find the Post by id');
});

describe('.destroy', function() {
  it('should delete the Post by id');
});

describe('.update', function() {
  it('should update the Post by id');
});
