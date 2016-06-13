
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var url = require('url');

var _ = require('underscore');
var moment = require('moment');
moment.locale('zh-cn');

var route = require('./route');
var config = require('./config.json');
var app = express();

app.set('views', path.join(__dirname, 'public/page'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: config.cookieSecret,
  resave: true,
  saveUninitialized: true
}));
app.use(require('express-domain-middleware'));

route(app);

app.use(function errorHandler(err, req, res, next) {
  console.log('******* ERROR ******* on %s %s: %j', req.method, req.url, err.message);
  //res.send(500, "Something bad happened. :(");
  res.status(500).send('ERROR');
  if (err.domain) {
    //you should think about gracefully stopping & respawning your server
    //since an unhandled error might put your application into an unknown state
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
