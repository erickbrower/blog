var config = require('./conf');

var env = process.env.NODE_ENV || 'development';

var knex = require('knex')(config[env]);

exports = require('bookshelf')(knex);
