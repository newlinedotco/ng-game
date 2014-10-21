module.exports = 
(function(app, io) {

  var util = require('util');
  var Player = require('../models/Player');
  var Map = require('../models/Map');

  g = {
    io: undefined,
    players: [],
    maps: {}
  };

  function init(sio) {
    g.io = sio;
    bindSocketEvents();

    return g;
  }


  function bindSocketEvents() {
    g.io.sockets.on('connection', function onConnection(socket) {
      util.log("Client has connected: " + socket.id);

      socket.emit('connected', { id: socket.id });

      var player = new Player({ id: socket.id });
      g.players.push(player);

      socket.on('newPlayer', onNewPlayer);
      socket.on('updatePlayer', onUpdatePlayer);
      socket.on('disconnect', onDisconnect);
      socket.on('shotbullet', onShotBullet);
      socket.on('playerHit', onPlayerHit);
    });
  };

  function onNewPlayer(data) {
    var player = playerById(this.id);
    if (!player) {
      util.log("Player not found: " + this.id);
      return;
    }

    if (!data.mapId) {
      util.log("Cannot join an empty game?", data.mapId);
      return;
    }

    if (!g.maps[data.mapId]) {
      util.log("Game doesn't exist yet. Creating game: " + data.mapId);
      g.maps[data.mapId] = new Map({
        id: data.mapId
      })
    }

    if (!player.inMap(data.mapId)) {
      this.broadcast.to(data.mapId)
        .emit('newPlayer', player.serialize());

      for (var i = 0, p = g.maps[data.mapId].players; i < p.length; i++) {
        this.emit('newPlayer', p[i].serialize());
      }

      this.join(data.mapId);
      player.joinMap(g.maps[data.mapId]);
    }
  };

  function updateRemotePlayers() {
    var that = this;
    for (var key in g.maps) {
      var game = g.maps[key];

      var newData;
        newData = {
          mapId: game.id,
          game: game.serialize(),
          timestamp: new Date().getTime()
        }
        g.io.sockets.to(game.id).emit('updatePlayers', newData);
    }
  };

  function onUpdatePlayer(data) {
    var player = playerById(this.id);

    if (!player) {
      util.log("Player not found: ", data.id);
      return;
    }

    player.recordUpdate(data);

    updateRemotePlayers();
  };

  function onShotBullet(data) {
    // This the `id` is the player who shot
    var player = playerById(data.id);

    if (!player) {
      util.log("Player not found: " + data.id);
      return;
    }

    player.recordShot(data);
    g.io.sockets.to(player.mapId)
      .emit('bulletShot', data);
  }

  function onPlayerHit(data) {
    var shooter = playerById(data.shooter),
        victim  = playerById(data.victim);

    if (!shooter) {
      util.log("Shooter not found " + shooter);
      return;
    }

    if (!victim) {
      util.log("victim not found " + victim);
      return;
    }

    shooter.addShotPoints();
    victim.wasHit();

    data.shooterPoints  = shooter.points;
    data.victimHealth   = victim.health;
    data.name = victim.name+" was shot by "+shooter.name;
    g.io.sockets.to(shooter.mapId)
      .emit('playerHit', data);

    if (data.victimHealth <= 0) {
      victim.leaveMap();
    }

    var livingPlayersLeft = livingPlayers(shooter.mapId);
    if (livingPlayers(shooter.mapId) <= 1) {
      var winner = winningPlayer(shooter.mapId);

      var map = g.maps[shooter.mapId.toString()];
      g.io.sockets.to(shooter.mapId)
        .emit('gameOver', {
          winner: winner,
          name: 'Game over'
        });

      map.reset();
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
    // this.leave(player.mapId);

    if (!g.maps[player.mapId]) {
      util.log("Map not found: " + player.mapId);
      return;
    }

    this.broadcast.to(player.mapId)
      .emit('removePlayer', { id: this.id });

    player.leaveMap(g.maps[player.mapId]);
  };

  function playerById(id) {
    for (var i = 0; i < g.players.length; i++) {
      if (g.players[i].id === id) {
        return g.players[i];
      }
    }
    return false;
  };

  function livingPlayers(id) {
    var count = 0;
    for (var i = 0; i < g.players.length; i++) {
      var player = g.players[i];
      if (player.inMap(id) && player.isAlive()) {
        count++;
      }
    }
    return count;
  };

  function winningPlayer(id) {
    for (var i = 0; i < g.players.length; i++) {
      var player = g.players[i];
      if (player.inMap(id) && player.isAlive()) {
        return player;
      }
    }
    return false;
  };

  init(io);

});