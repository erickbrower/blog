var db = require('../models');

exports.params = {
  //Load the post into the request
  postId: function postId(req, res, next, id) {
    db.Post.find(id, function(err, post) {
      if (err) {
        return next(404);
      }
      req.post = post;
      next();
    });
  }
};

exports.index = function index(req, res) {
  //TODO: paginate this
  db.Post.all(function(err, posts) {
    if (err) {
      return res.status(404).send(err);
    } else {
      res.json(posts);
    }
  });
};

exports.show = function show(req, res) {
  res.json(req.post);
};

exports.create = function create(req, res) {
  var post = new db.Post(req.body);
  post.isValid(function(valid) {
    if (!valid) {
      return res.status(400).json(post.errors);
    } else {
      post.save(function() {
        res.json(post);
      });
    }
  });
};

exports.destroy = function destroy(req, res) {
  req.post.destroy(function() {
    res.json(req.post);
  });
};
