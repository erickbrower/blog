var express = require('express'),
  logger = require('morgan'),
  router = require('config/routes'),
  db = require('config/db'),
  app = express();

app.set('db', db);

app.use(logger('short'));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

router.route(app);

app.use(function(req, res) {
  res.status(404);
});

module.exports = app;
