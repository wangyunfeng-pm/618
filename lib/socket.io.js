
var _ = require('underscore');


var mod = {

  init: function (server) {
    var w = this;
    w.ready = false;
    w.io = require('socket.io')(server, {'pingInterval': 5000, 'pingTimeout': 11000});
    w.guestIndex = 1;
    console.log('socket.io init');

    w.initMap();
    w.initEvent();
  },

  initMap: function () {
    var w = this;
    var str = '杭州才云科技有限公司';
    var raffleIndex = [0, 3, 5];
    var map = {};

    var loopArray = [];
    for (var i = 0; i < str.length; i++) {
      loopArray.push(i);
    }
    w.shuffle(loopArray);

    // Randomize the string.
    for (var i = 0; i < str.length; i++) {
      current = loopArray[i];
      var o = {
        index: current,
        send: false,
        submitted: false,
        text: str.charAt(current),
        guestIndex: 0,
        guestName: "",
        socketId: null
      };
      map[i] = o;
    }
    w.str = str;
    w.map = map;
    w.raffleIndex = raffleIndex;

    console.log(w.map);
  },

  initEvent: function () {
    var w = this;

    w.io.on('connection', function (socket) {
      console.log('socket connection, id', socket.id);
      // Only send char if it's not monitor page.
      if (!socket.handshake.headers.referer || socket.handshake.headers.referer.indexOf('monitor') < 0) {
        for (var i = 0; i < w.str.length; i++ ) {
          if (w.map[i].send == false && w.map[i].submitted == false) {
            console.log("will send:", w.map[i].text);
            w.map[i].send = true;
            w.map[i].socketId = socket.id;
            w.map[i].guestIndex = w.guestIndex++;
            w.map[i].guestName = "";
            socket.emit('init', w.map[i+'']);
            break;
          }
        }
      }

      w.ready = true;
      w.socket = socket;

      w.socket.on('submit', function (data) {
        console.log('submit', data);
        w.socket.broadcast.emit('display', data);
        for (var i = 0; i < w.str.length; i++ ) {
          if (w.map[i].socketId == socket.id) {
            w.map[i].guestName = data.guestName;
            w.map[i].guestIndex = data.guestIndex;
            w.map[i].submitted = true;
            w.map[i].socketId = null;
          }
        }
      });

      w.socket.on('disconnect', function () {
        console.log('disconnect', socket.id);
        for (var i = 0; i < w.str.length; i++ ) {
          if (w.map[i].socketId == socket.id) {
            w.map[i].send = false;
            w.map[i].socketId = null;
          }
        }
      });

      if (socket.handshake.headers.referer && socket.handshake.headers.referer.indexOf('monitor') > -1) {
        w.monitor = socket;
        socket.emit('displayInit', {str: w.str});
      }
    });
  },

  end: function() {
    this.monitor.emit('end', null);
    var w = this;
    for (var i = 0; i < w.str.length; i++ ) {
      w.map[i].guestName = data.guestName;
      w.map[i].guestIndex = data.guestIndex;
      w.map[i].submitted = true;
      w.map[i].socketId = null;
    }
  },

  raffle: function() {
    this.monitor.emit('raffle', this.raffleIndex);
  },

  print: function() {
    console.log(this.map);
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

    w.waitForConnection(function() {
      if (typeof obj == 'string') {
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
  },

  shuffle: function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

}

module.exports = mod;
