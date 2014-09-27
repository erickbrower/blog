var helper = require('../test_helper'),
  assert = require('assert'),
  app = require('../../app'),
  Post = require('../../models').models.Post,
  request = require('supertest');

describe('GET /api/posts', function() {
  var posts = helper.factories.Post(3);

  beforeEach(function(done) {
    Post.create(posts, function(err) {
      if (err) throw err;
      done();
    });
  });

  it('should return all existing Posts', function(done) {
    request(app)
      .get('/api/posts')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        assert.equal(res.body.length, 3);
        done();
      })
  });
});

describe('POST /api/posts', function() {
  describe('with valid attributes', function() {
    var attributes = helper.factories.Post();

    it('should create a new Post resource', function(done) {
      request(app)
        .post('/api/posts')
        .send(attributes)
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          if (err) throw err;
          assert.equal(res.body.title, attributes.title);
          done();
        });
    });
  });
});

describe('GET /api/posts/:post_id', function() {

  describe('when the Post resource exists', function() {
    var resource;

    beforeEach(function(done) {
      var attributes = helper.factories.Post();
      Post.create(attributes, function(err, post) {
        if (err) throw err;
        resource = post;
        done();
      });
    });

    it('should respond with the Post resource', function(done) {
      request(app)
        .get('/api/posts/' + resource.id)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          assert.equal(res.body.slug, resource.slug);
          done();
        })
    });
  });

  describe('when the resource does not exist ', function() {
    it('should return 404', function(done) {
      request(app)
        .get('/api/posts/123')
        .expect('Content-Type', /json/)
        .expect(404)
        .end(function() {
          done();
        });
    });
  });
});

describe('PUT /api/posts/:post_id', function() {
  var resource;

  describe('when the Post resource exists', function() {
    beforeEach(function(done) {
      Post.create(helper.factories.Post(), function(err, post) {
        if (err) throw err;
        resource = post;
        done();
      });
    });

    describe('with valid attributes', function() {
      it('should update the Post resource', function() {
        var newTitle = helper.factories.Post().title;
        request(app)
          .put('/api/posts/' + resource.id)
          .send({
            title: newTitle
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) throw err;
            assert.equal(res.body.title, newTitle);
          });
      });
    });
  });
});

describe('DELETE /api/posts/:post_id', function() {
  describe('when the Post resource exists', function() {
    it('should destroy the Post');
  });

  describe('when the Post resource does not exist', function() {
    it('should respond 404');
  });
});
