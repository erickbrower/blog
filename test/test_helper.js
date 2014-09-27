process.env.NODE_ENV = 'test';

var db = require('../models').db,
  Faker = require('Faker'),
  _ = require('lodash');

//Drop and create the tables for each test
beforeEach(function(done) {
  db.automigrate(function(err) {
    if (err) throw err;
    done();
  });
});


module.exports = {
  factories: {
    Post: function(num) {
      num = num || 1
      var result = _.times(num, function() {
        return {
          title: Faker.Lorem.sentence(),
          content: Faker.Lorem.paragraphs()
        };
      });
      if (result.length === 1) {
        return result[0];
      }
      return result;
    }
  }
};
