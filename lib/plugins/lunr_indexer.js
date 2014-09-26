var lunr = require('lunr'),
  _ = require('lodash');

module.exports = function lunrIndexer(files, metalsmith, done) {
  var idx = lunr(function() {
    this.field('title', {
      boost: 10
    });
    this.field('body');
    this.ref('path');
  });
  _.each(files, function index(file) {
    if (file.collection === 'posts') {
      idx.add(file);
    }
  });
  var serialized = JSON.stringify(idx.toJSON());
  files['data/posts_idx.json'] = {
    contents: new Buffer(serialized),
    mode: '0644'
  };
  setImmediate(done);
};
