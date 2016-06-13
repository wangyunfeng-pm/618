
var _ = require('underscore');


var mod = {
  init: function (server) {
    var w = this;
    w.ready = false;
    w.io = require('socket.io')(server);
    console.log('socket.io init');

    w.initMap();

    w.initEvent();
  },

  initMap: function () {
    var w = this;
    var str = '才云科技';
    var map = {};

    for(var i=0; i< str.length; i++){
      var o = {
        index: i,
        send: false,
        text: str.charAt(i),
        socketId: null
      };
      map[i] = o;
    }
    w.str = str;
    w.map = map;
  },

  initEvent: function () {
    var w = this;

    w.io.on('connection', function (socket) {
      console.log('socket connection');
      for(var i=0; i< w.str.length;i++ ){
        if(w.map[i].send == false){
          w.map[i].send = true;
          w.map[i].socketId = socket.id;
          socket.emit('init', w.map[i+'']);
          break;
        }
      }
      w.ready = true;
      w.socket = socket;
      w.socket.on('submit', function (data) {
        console.log('submit', data);
        w.socket.emit('display', data);
      });

      socket.emit('displayInit', {str: w.str});

      socket.on('disconnect', function () {
        console.log('disconnect', socket.id);
        for(var i=0; i< w.str.length;i++ ){
          if(w.map[i].socketId == socket.id){
            w.map[i].send = false;
            w.map[i].socketId = null;
          }
        }
      })
    });


  },

  on: function (event, fn) {
    var w = this;

    w.waitForConnection(function(){
      w.socket.on(event, fn);
    });
  },

  onMessage: function (fn) {
    var w = this;

    w.waitForConnection(function(){
      w.socket.on('redux', fn);
    });
  },

  sendEvent: function (event, json) {
    var w = this;

    w.waitForConnection(function(){
      w.socket.emit(event, json);
    });
  },

  send: function (obj) {
    var w = this;

    w.waitForConnection(function(){
      if(typeof obj == 'string'){
        obj = JSON.parse(obj);
      }
      w.socket.emit('redux', obj);
    });
  },

  waitForConnection: function(fn){
    var w = this, interval = 1000;

    if(w.ready){
      fn();
    }else{
      setTimeout(function () {
        w.waitForConnection(fn, interval);
      }, interval);
    }
  }
}

module.exports = mod;
