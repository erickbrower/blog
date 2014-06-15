// Express server for development
var express = require('express'),
    morgan = require('morgan'),
    app = express(),
    port = process.env.PORT || 8080;

app.use(morgan('short'));
app.use(express.static(__dirname + '/public'));

// catch 404 and forward to error handler
app.use(function (req, res) {
    res.redirect('/404');
});

var server = app.listen(port, function () {
    console.log('Listening on port ' + server.address().port);
});
