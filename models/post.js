var Schema = require('jugglingdb').Schema;

exports.init = function(db) {
  var Post = db.define('Post', {
    title: {
      type: String,
      length: 255
    },
    slug: {
      type: String,
      length: 255,
      index: true
    },
    content: {
      type: Schema.Text
    },
    date: {
      type: Date,
      default: function() {
        return new Date;
      }
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    published: {
      type: Boolean,
      default: false,
      index: true
    }
  });

  //private 
  function generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }

  Post.validatesPresenceOf('title');

  //TODO: handle uniqueness, append unique chars
  Post.beforeCreate = function(next, post) {
    post.slug = generateSlug(post.title);
    next();
  };

  return Post;
};
