var _ = require('lodash'),
  formatDate = require('../format_date');

module.exports = function bodyParser(files, metalsmith, done) {
  _.each(Object.keys(files), function(file) {
    if (files[file].collection === 'posts') {
      var data = files[file];
      data.formattedDate = formatDate(data.date);
      delete files[file];
      files[file] = data;
    }
  });
  setImmediate(done);
};
