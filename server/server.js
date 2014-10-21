#!/usr/bin/env node
var express = require('express'),
    path    = require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = process.env.PORT || 8000;
server.listen(port, function() {
  console.log("Running on port ", port);
});

app.use(express.static(path.join(__dirname, '../client/dist'), { maxAge: 86400000 }));

app.get('/', function(req, res) {
  res.sendfile(path.join(__dirname, '../client/dist/index.html'));
});

require('./routes/io.js')(app, io);
