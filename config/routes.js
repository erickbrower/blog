var postsController = require('../controllers/posts');

exports.route = function(app) {
  app.param(':post_id', postsController.params.postId);

  app.get('/posts', postsController.index);
  app.get('/posts/:post_id', postsController.show);
  app.post('/posts', postsController.create);
  app.put('/posts/:post_id', postsController.update);
  app.delete('/posts/:post_id', postsController.destroy);
};
