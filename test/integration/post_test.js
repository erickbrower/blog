var assert = require('assert'),
  app = require('../../app'),
  request = require('supertest');


describe('listing Posts via GET request', function() {
  describe('when Posts exist in the system', function() {
    var posts = [{
      title: 'test-post',
      body: 'blah blah blah'
    }];

    before(function(done) {
      Post.create(posts, function() {
        done();
      });
    });

    it('should return all existing Posts', function(done) {
      request(app)
        .set('Content-Type', 'application/json')
        .get('/posts')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          var data = JSON.parse(res.body);
          assert(data.length == 1, 'Response should have a length of 1');
          done();
        });
    });
  });
});

describe('creating a post via POST request', function() {
  describe('with valid attributes', function() {
    it('should be successful', function(done) {
      request(app)
        .set('Accept', 'application/json')
        .post('/posts')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          done();
        });
    });
  });
});
