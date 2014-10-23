module.exports = 
(function(app, io) {
  var util = require('util');
  var Player = require('./../models/Player');
  var Map = require('./../models/Map');

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
      socket.on('playerLeftMap', onPlayerLeftMap);
      socket.on('shotbullet', onShotBullet);
      socket.on('playerHit', onPlayerHit);
      socket.on('setPlayerName', onSetPlayerName);

      // Get all the maps
      socket.on('getMaps', onGetMaps);
    });
  };

  function onSetPlayerName(data) {
    console.log('onSetPlayerName', data);
    // Send details to player
    this.emit('playerDetails', {
      id: this.id
    });
  }
  function onGetMaps() {
    var maps = [];
    for (var k in g.maps) {
      maps.push(g.maps[k].serialize());
    }
    this.emit('getAllMaps', maps);
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
      var map = new Map({id: data.mapId});
      g.maps[data.mapId] = map;
      g.io.emit('newMapCreated', map.serialize());
    };

    if (!player.inMap(data.mapId)) {
      player.joinMap(g.maps[data.mapId]);

      this.broadcast.to(data.mapId)
        .emit('gameUpdated:add', {
          player: player.serialize(),
          map: data.mapId,
          allPlayers: g.maps[data.mapId].players
        });

      this.join(data.mapId);

      this.emit('gameUpdated:add', {
        map: data.mapId,
        allPlayers: g.maps[data.mapId].players
      });

      g.io.emit('global:newPlayer', {
        player: player.serialize(),
        map: data.mapId
      });
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
    if (livingPlayersLeft <= 1) {
      var winner = winningPlayer(shooter.mapId);

      g.io.sockets.to(shooter.mapId)
        .emit('gameOver', {
          mapId: shooter.mapId,
          winner: winner,
          name: 'Game over'
        });

      var map = g.maps[shooter.mapId.toString()];
      if (map) {
        map.players = [];
        delete g.maps[shooter.mapId.toString()];
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

    console.log('index', g.players.indexOf(player));
    g.players.splice(g.players.indexOf(player), 1);
    // this.leave(player.mapId);

    if (!g.maps[player.mapId]) {
      util.log("Map not found: " + player.mapId);
      return;
    }

    var mapId = player.mapId,
        map = g.maps[mapId];

    // this.broadcast.to(player.mapId)
    //   .emit('removePlayer', { 
    //     id: this.id,
    //     players: map.players
    //   });
    player.leaveMap(g.maps[mapId]);
    map.removePlayer(player);

    this.broadcast.to(mapId)
      .emit('gameUpdated:remove', {
        id: this.id,
        map: mapId,
        allPlayers: map.players,
        removedPlayer: player
      });

  };

  function onPlayerLeftMap() {
    var player = playerById(this.id);
    if (!player) {
      util.log("Player not found: " + this.id);
      return;
    }

    if (!g.maps[player.mapId]) {
      util.log("Map not found: " + player.mapId);
      return;
    }

    var mapId = player.mapId;
    var map = g.maps[mapId];
    map.removePlayer(player);
    player.leaveMap(g.maps[mapId]);

    g.io.emit('global:playerLeftMap', {
      id: this.id,
      mapId: mapId
    });

    // this.broadcast.to(player.mapId)
    //   .emit('removePlayer', { 
    //     id: this.id,
    //     players: map.players
    //   });
  
    console.log('onPlayerLeftMap', map.players.length);
    if (map.players.length <= 0) {
      g.io.emit('global:removeMap', {
        mapId: mapId
      });
      delete g.maps[mapId];
    } else {
      this.broadcast.to(mapId)
        .emit('gameUpdated:remove', {
          id: this.id,
          map: mapId,
          allPlayers: map.players,
          removedPlayer: player
        });
    }
  }

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