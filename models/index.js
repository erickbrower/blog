var db = require('../config/db'),
  Post = require('./post').init(db),
  Category = require('./category').init(db);

Post.belongsTo(Category, {
  as: 'category',
  foreignKey: 'categoryId'
});

Category.hasMany(Post, {
  as: 'posts',
  foreignKey: 'postId'
});

module.exports = db.models;
