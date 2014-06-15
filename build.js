var Metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    templates = require('metalsmith-templates'),
    permalinks = require('metalsmith-permalinks'),
    collections = require('metalsmith-collections'),
    plugins = require('./lib/plugins'),
    helpers = require('./lib/helpers'),
    partials = require('./lib/partials'),
    Handlebars = require('handlebars'),
    async = require('async');

function forge() {
    new Metalsmith(__dirname)
        .metadata({
            headline: 'erickbrower',
            tagline: 'I write code. A lot.',
            author: 'Erick Brower <cerickbrower@gmail.com>',
            description: 'My personal blog. @erickbrower'
        })
        .source('./src')
        .destination('./build')
        .use(plugins.bodyParser)
        .use(plugins.dateFormatter)
        .use(collections({
            posts: {
                pattern: 'content/posts/*.md',
                sortBy: 'date',
                reverse: true
            },
            pages: {
                pattern: 'content/pages/*.md',
                sortBy: 'title'
            }
        }))
        .use(markdown())
        .use(permalinks(':collection/:title'))
        .use(templates('handlebars'))
        .use(plugins.lunrIndexer)
        .use(plugins.jsonWriter)
        .build();
}

async.series([
    function(next) {
        partials.register(Handlebars, next);
    },
    function(next) {
        helpers.register(Handlebars, next);
    }
], forge);
