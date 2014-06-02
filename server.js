// Express server for development
var express = require('express'),
    logger = require('morgan'),
    debug = require('debug')('my-application'),
    app = express();

app.use(logger('dev'));
app.use(express.static(__dirname + '/build'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

app.set('port', process.env.PORT || 8080);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
