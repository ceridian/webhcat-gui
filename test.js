var u = require('./lib/util.js');
var l = require('./lib/lib.js');
var models = require('./models');
var async = require('async');
//var a = require('./lib/auth.js');
var request = require('request');
var express = require('express');
var path = require('path');
var https = require('https');
var fs = require('fs');

var app = express();

var options = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.crt')
};

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'index.html'));
})

var server = https.createServer(options, app);
io = require("socket.io").listen(server);
server.listen(443);





io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});
