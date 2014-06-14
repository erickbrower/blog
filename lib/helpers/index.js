var fs = require('fs');

exports.register = function register(Handlebars, next) {
    fs.readdir(__dirname, function (err, files) {
        files.forEach(function(file) {
            var name = file.replace(/[w+]*.js$/, '');
            if (name !== 'index') {
                Handlebars.registerHelper(name, require('./' + file));
            }
        });
        next();
    });
};
