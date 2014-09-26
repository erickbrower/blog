var env = process.env.NODE_ENV || 'development';

var thing = require('./conf')[env];

var config = require('./conf')[env],
  Schema = require('jugglingdb').Schema,
  schema = new Schema('postgres', config);

module.exports = schema;
