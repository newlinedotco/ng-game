#!/usr/bin/env node
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = process.env.PORT || 8000;
server.listen(port, function() {
  console.log("Running on port ", port);
});

app.use(express.static('./../client/dist'));

app.get('/', function(req, res) {
  res.sendfile('./../client/dist/index.html');
});

require('./routes/io.js')(app, io);
