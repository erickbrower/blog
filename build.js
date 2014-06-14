var Metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    templates = require('metalsmith-templates'),
    permalinks = require('metalsmith-permalinks'),
    collections = require('metalsmith-collections'),
    async = require('async'),
    Handlebars = require('handlebars'),
    plugins = require('./lib/plugins'),
    helpers = require('./lib/helpers'),
    partials = require('./lib/partials');

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
        .use(plugins.lunrIndexer)
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
