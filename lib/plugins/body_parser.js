var _ = require('lodash');

module.exports = function bodyParser(files, metalsmith, done) {
  _.each(Object.keys(files), function(file) {
    if (files[file].collection === 'posts') {
      var data = files[file];
      data.body = data.contents.toString();
      delete files[file];
      files[file] = data;
    }
  });
  setImmediate(done);
};
