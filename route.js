
var _ = require('underscore');
var util = require('./lib/util');
var socket = require('./lib/socket.io.js');


module.exports = function(app) {
  app.get('/', function (req, res) {
    res.render('guest');
  })
  app.get('/favicon.ico', function(req, res){
    res.status(200);
  })
  app.get('/guest', function (req, res) {
    res.render('guest');
  });
  app.get('/monitor', function (req, res) {
    res.render('monitor')
  });
  app.get('/raffle', function (req, res) {
    socket.raffle()
    res.render('raffle')
  });
  app.get('/end', function (req, res) {
    socket.end()
    res.render('end')
  });
};
