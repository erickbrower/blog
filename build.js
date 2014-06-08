var metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    templates = require('metalsmith-templates'),
    permalinks = require('metalsmith-permalinks'),
    collections = require('metalsmith-collections'),
    Handlebars = require('handlebars'),
    fs = require('fs'),
    path = require('path'),
    lunr = require('lunr'),
    _ = require('lodash');

var lunrIndexer = function lunrIndexer(files, metalsmith, done) {
    var idx = lunr(function() {
        this.field('title', { boost: 10 });
        this.field('body');
    });
    _.each(files, function index(file) {
        if (file.collection === 'posts') {
            file.body = file.contents.toString();
            idx.add(file);
        }
    });
    files['data/posts_idx.json'] = { 
        contents: new Buffer(JSON.stringify(idx)),
        mode: '0644'
    };
    setImmediate(done);
};


var forge = function forge() {
    metalsmith(__dirname)
        .use(lunrIndexer)
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
    _.each(callbacks, function(cb) {
        cb(function() {
            count--;
            if (count === 0) {
                last();
            }
        });
    });
};

var partialsDir = path.resolve(__dirname, 'templates', 'partials');

var registerPartialFile = function registerPartialFile(name, filePath, next) {
    fs.readFile(filePath, function(err, data) {
        Handlebars.registerPartial(name, data.toString());
        next();
    });
};

var registerPartialFiles = function registerPartialFiles(files, next) {
    var stage = function stage(file) {
        var name = file.replace(/[w+]*.hbt$/, ''),
            filePath = path.resolve(partialsDir, file);
        return function(next) {
            registerPartialFile(name, filePath, next);
        };
    };
    parallel(_.map(files, stage), next);
};

var registerPartials = function registerPartials(next) {
    fs.readdir(partialsDir, function read(err, files) {
        registerPartialFiles(files, next);
    });
};

var registerHelpers = function registerHelpers() {
    Handlebars.registerHelper('top', function top(collection, options) {
        var out = '',
            newest = _.first(collection, 3);
        _.each(newest, function(item) {
            out += options.fn(item);
        });
        return out;
    });
};

registerPartials(function run() {
    registerHelpers();
    forge();
});
