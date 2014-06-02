var Metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    templates = require('metalsmith-templates'),
    permalinks = require('metalsmith-permalinks'),
    Handlebars = require('handlebars'),
    collections = require('metalsmith-collections'),
    fs = require('fs'),
    path = require('path');

var forge = function forge() {
    Metalsmith(__dirname)
        .use(collections({
            pages: {
                pattern: 'content/pages/*.md'
            },
            posts: {
                pattern: 'content/posts/*.md',
                sortBy: 'date',
                reverse: true
            }
        }))
        .use(markdown())
        .use(templates('handlebars'))
        .use(permalinks({
            pattern: ':collection/:title'
        }))
        .source('./src')
        .destination('./build')
        .build();
};

var parallel = function parallel(callbacks, last) {
    var count = callbacks.length;
    callbacks.forEach(function (callback) {
        callback(function () {
            count--;
            if (count === 0) {
                last();
            }
        });
    });
};

var registerPartial = function registerPartial(name, filePath, next) {
    var contents = fs.readFile(filePath, function (err, data) {
        Handlebars.registerPartial(name, data.toString());
        next();
    });
};

var partialsDir = path.resolve(__dirname, 'templates', 'partials');

fs.readdir(partialsDir, function read(err, files) {
    var registrations = [];
    files.forEach(function queue(file) {
        var name = file.replace(/[w+]*.hbt$/, ''),
            filePath = path.resolve(partialsDir, file);
        registrations.push(function (next) {
            registerPartial(name, filePath, next);
        });
    });
    parallel(registrations, forge);
});
