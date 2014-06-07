var Metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    templates = require('metalsmith-templates'),
    permalinks = require('metalsmith-permalinks'),
    collections = require('metalsmith-collections'),
    Handlebars = require('handlebars'),
    fs = require('fs'),
    path = require('path');

var testy = function testy(files, metalsmith, done) {
    console.log(files);
    done();
};

var forge = function forge() {
    Metalsmith(__dirname)
        .metadata({
            headline: 'erickbrower',
            tagline: 'I write code. A lot.',
            author: 'Erick Brower <cerickbrower@gmail.com>',
            description: 'My personal blog. @erickbrower'
        })
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
    fs.readFile(filePath, function (err, data) {
        Handlebars.registerPartial(name, data.toString());
        next();
    });
};

var registerHelpers = function registerHelpers() {
    Handlebars.registerHelper('limit', function (collection, limit, start) {
        var out = [], i, c;
        start = start || 0;
        for (i = c = 0; i < collection.length; i++) {
            if (i >= start && c < limit + 1) {
                out.push(collection[i]);
                c++;
            }
        }
        return out;
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
    parallel(registrations, function () {
        registerHelpers();
        forge();
    });
});
