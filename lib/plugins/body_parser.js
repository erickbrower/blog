module.exports = function bodyParser(files, metalsmith, done) {
    Object.keys(files).forEach(function (file) {
        if (files[file].collection === 'posts') {
            var data = files[file];
            data.body = data.contents.toString();
            files[file] = data;
        }
    });
    setImmediate(done);
};
