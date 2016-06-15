var io = require('socket.io-client');

var socketURL = 'http://0.0.0.0:8080';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

var client1 = io.connect(socketURL, options);

client1.on('connect', function(data) {

  client1.on('init', function(data) {
    console.log(data);

    client1.emit('submit', data);

    setTimeout(function() {
      client1.disconnect();
    }, 1000);
  });

});
