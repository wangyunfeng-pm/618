
var _ = require('underscore');
var util = require('./lib/util');


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

};
