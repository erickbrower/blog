var Metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    templates = require('metalsmith-templates'),
    permalinks = require('metalsmith-permalinks'),
    collections = require('metalsmith-collections'),
    Handlebars = require('handlebars'),
    fs = require('fs'),
    path = require('path'),
    lunr = require('lunr'),
    _ = require('lodash');

var bodyParser = function bodyParser(files, metalsmith, done) {
    var isPost = function isPost(file) {
        return file.collection === 'posts';
    };
    _.each(Object.keys(files), function (file) {
        if (isPost(files[file])) {
            var data = files[file];
            data.body = data.contents.toString();
            delete files[file];
            files[file] = data;
        }
    });
    setImmediate(done);
};

var lunrIndexer = function lunrIndexer(files, metalsmith, done) {
    var idx = lunr(function () {
        this.field('title', { boost: 10 });
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

var forge = function forge() {
    new Metalsmith(__dirname)
        .metadata({
            headline: 'erickbrower',
            tagline: 'I write code. A lot.',
            author: 'Erick Brower <cerickbrower@gmail.com>',
            description: 'My personal blog. @erickbrower'
        })
        .source('./src')
        .destination('./build')
        .use(bodyParser)
        .use(collections({
            posts: {
                pattern: 'content/posts/*.md',
                sortBy: 'date',
                reverse: true
            }
        }))
        .use(markdown())
        .use(templates('handlebars'))
        .use(permalinks(':collection/:title'))
        .use(lunrIndexer)
        .build();
};

var parallel = function parallel(callbacks, last) {
    var count = callbacks.length;
    _.each(callbacks, function (cb) {
        cb(function () {
            count--;
            if (count === 0) {
                last();
            }
        });
    });
};

var partialsDir = path.resolve(__dirname, 'templates', 'partials');

var registerPartialFile = function registerPartialFile(name, filePath, next) {
    fs.readFile(filePath, function (err, data) {
        Handlebars.registerPartial(name, data.toString());
        next();
    });
};

var registerPartialFiles = function registerPartialFiles(files, next) {
    var stage = function stage(file) {
        var name = file.replace(/[w+]*.hbt$/, ''),
            filePath = path.resolve(partialsDir, file);
        return function (next) {
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
        _.each(newest, function (item) {
            out += options.fn(item);
        });
        return out;
    });
};

registerPartials(function run() {
    registerHelpers();
    forge();
});
