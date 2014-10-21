var util = require('util');
var Player = require('./Player');
var Map = require('./Map');
var mapData = require('../data/maps.json');


g = {
  io: undefined,
  players: [],
  maps: {},
  time: {
    step: 1 / 60,
    now: 0
  }
};


for (var mapId in mapData) {
  if (mapData.hasOwnProperty(mapId)) {
    // Make a new map
    g.maps[mapId] = new Map({
      mapId: mapId,
      map: mapData[mapId]
    });
  }
}


function init(sio) {
  g.io = sio;
  bindSocketEvents();

  setInterval(step, 1000 * g.time.step);

  return g;
}


function bindSocketEvents() {
  g.io.sockets.on('connection', function onConnection(socket) {
    // TODO: Add event listeners
    util.log("Client has connected: " + socket.id);

    socket.emit('connected', { id: socket.id });

    g.players.push(new Player({ id: socket.id }));

    socket.on('disconnect', onDisconnect);
    socket.on('setPlayerName', onSetPlayerName);
    socket.on('getMap', onGetMap);
    socket.on('newPlayer', onNewPlayer);
    socket.on('updatePlayer', onUpdatePlayer);
    socket.on('startGame', onStartGame);
    socket.on('resetGame', onResetGame);
  });

  for (var map in g.maps) {
    if (g.maps.hasOwnProperty(map)) {
      g.maps[map].bindUpdateEvent(g.io);
    }
  }
}


function onDisconnect() {
  var player = playerById(this.id);
  if (!player) {
    util.log("Player not found: " + this.id);
    return;
  }

  util.log("Client has disconnected: " + this.id);

  g.players.splice(g.players.indexOf(player), 1);
  this.broadcast.to(player.mapId).emit('removePlayer', { id: this.id });
  this.leave(player.mapId);

  if (!g.maps[player.mapId]) {
    util.log("Map not found: " + player.mapId);
    return;
  }

  player.leaveMap(g.maps[player.mapId]);
}


function onSetPlayerName(data) {
  playerById(this.id).name = data.name;
}


function onGetMap(data) {
  if (!g.maps[data.mapId]) {
    util.log("Map not found: " + data.mapId);
    return;
  }

  this.emit('getMap', g.maps[data.mapId].serialize());
}


function onNewPlayer(data) {
  if (!g.maps[data.mapId]) {
    util.log("Map not found: " + data.mapId);
    return;
  }

  var player = playerById(this.id);
  if (!player) {
    util.log("Player not found: " + this.id);
    return;
  }

  this.broadcast.to(data.mapId).emit('newPlayer', player.serialize());

  // Send existing players to the new player
//  this.emit('newPlayers', {
//    players: g.maps[data.mapId].players.map(function(existingPlayer) {
//      return existingPlayer.serialize();
//    })
//  });
  for (var i = 0, p = g.maps[data.mapId].players; i < p.length; i++) {
    this.emit('newPlayer', p[i].serialize());
  }

  this.join(data.mapId);
  player.joinMap(g.maps[data.mapId]);
}


function onUpdatePlayer(data) {
  var player = playerById(this.id);
  if (!player) {
    util.log("Player not found: " + this.id);
    return;
  }

  player.updateKeys(data);
}


function onStartGame(data) {
  if (!g.maps[data.mapId]) {
    util.log("Map not found: " + data.mapId);
    return;
  }

  var countdown = 4;
  var mapId = data.mapId;

  if (g.maps[mapId].isStarting || g.maps[mapId].started) {
    return;
  }

  if (!g.maps[mapId].isStarting) {
    g.maps[mapId].isStarting = true;
  }

  var startCountdown = setInterval(function() {
    var text;
    switch (countdown) {
      case 4:
        text = "Game is starting...";
        break;
      case 3:
        text = "3";
        break;
      case 2:
        text = "2";
        break;
      case 1:
        text = "1";
        break;
      case 0:
        text = "Start!";
        break;
    }

    if (text) {
      g.io.to(mapId).emit('startGameCountdown', text);
      if (text === "Start!") {
        g.maps[mapId].start();
        clearInterval(startCountdown);
      }
    }

    countdown--;

  }, 1000);
}


function onResetGame(data) {
  if (!g.maps[data.mapId]) {
    util.log("Map not found: " + data.mapId);
    return;
  }

  g.maps[data.mapId].reset();
  g.io.to(data.mapId).emit('resetGame');
}


function playerById(id) {
  for (var i = 0; i < g.players.length; i++) {
    if (g.players[i].id === id) {
      return g.players[i];
    }
  }
  return false;
}


function step() {
//  for (var map in g.maps) {
//    if (g.maps.hasOwnProperty(map)) {
//      map.world.step(g.timeStep);
//    }
//  }
  var now = Date.now();
  if (!g.time.now) {
    g.time.now = now;
  }
  var elapsed = now - g.time.now;
  g.maps['lobby'].update(elapsed / 1000);
  g.time.now = now;
}


module.exports = init;
