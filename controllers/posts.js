var Post = require('../models').models.Post;

exports.params = {
  //Load the post into the request
  postId: function postId(req, res, next, id) {
    Post.find(id, function(err, post) {
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
  Post.all(function(err, posts) {
    if (err) {
      res.status(404).send(err);
    } else {
      res.json(posts);
    }
  });
};

exports.show = function show(req, res) {
  res.json(req.post);
};

exports.create = function create(req, res) {
  var handler = function(err, post) {
    if (err) {
      res.status(400).json(post.errors);
    } else {
      res.status(201).json(post);
    }
  };
  Post.create(req.body, handler);
};

exports.destroy = function destroy(req, res) {
  req.post.destroy(function(err) {
    if (err) {
      res.status(400).json(err);
    } else {
      res.json(req.post);
    }
  });
};

exports.update = function update(req, res) {
  req.post.updateAttributes(req.body, function(err, post) {
    if (err) {
      res.status(400).json(post.errors);
    } else {
      res.json(post);
    }
  });
};
