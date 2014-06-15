var _ = require('lodash');

module.exports = function jsonWriter(files, metalsmith, done) {
    _.each(Object.keys(files), function (file) {
        if (files[file].collection === 'posts') {
            var data = files[file],
                name = file.replace(/[w+]*.html$/, '.json'),
                serialized = JSON.stringify({
                    title: data.title,
                    date: data.date
                });
            files[name] = {
                contents: new Buffer(serialized),
                mode: '0644'
            };
        }
    });
    setImmediate(done);
};
