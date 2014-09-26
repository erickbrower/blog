var fs = require('fs'),
  async = require('async'),
  path = require('path'),
  _ = require('lodash');

exports.register = function register(Handlebars, next) {
  var partialsDir = path.resolve(__dirname, '..', 'templates', 'partials');

  function registerPartial(name, filePath, next) {
    fs.readFile(filePath, function(err, data) {
      Handlebars.registerPartial(name, data.toString());
      next();
    });
  }

  function stage(file) {
    var name = file.replace(/[w+]*.hbt$/, ''),
      filePath = path.resolve(partialsDir, file);
    return function(next) {
      registerPartial(name, filePath, next);
    };
  }
  fs.readdir(partialsDir, function read(err, files) {
    async.parallel(_.map(files, stage), next);
  });
};
