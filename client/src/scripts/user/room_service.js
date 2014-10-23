angular.module('app.user')
.service('Room', function($rootScope, $q, mySocket) {
  var service = this;
  var currentRooms = [],
      currentRoomCount = 0;

  this.queryForRooms = function() {
    mySocket.then(function(socket) {
      socket.emit('getMaps');
    });
  };

  mySocket.then(function(socket) {
    socket.on('getAllMaps', function(data) {
      currentRooms = data;
      $rootScope.$broadcast('map:update');
    });

    socket.on('global:newPlayer', function(data) {
      var mapId = data.map,
          map   = getRoomById(mapId);

      if (map) {
        map.players.push(data.player);
      }
    });

    socket.on('newMapCreated', function(newMap) {
      currentRooms.push(newMap);
      $rootScope.$broadcast('map:update', newMap);
    });

    socket.on('gameOver', function(data) {
      var mapId = data.mapId,
          map   = getRoomById(mapId);

      console.log('gameOver', data, map);
    });

    socket.on('global:playerLeftMap', function(data) {
      var mapId = data.mapId,
          map   = getRoomById(mapId);

      if (map) {
        var idx = getPlayerIndexById(data.id, map);
        map.players.splice(idx, 1);
      }
      $rootScope.$broadcast('map:update', map);
    });

    socket.on('global:removeMap', function(data) {
      var mapId = data.mapId,
          map   = getRoomById(mapId);

      if (map) {
        service.queryForRooms();
      }
      $rootScope.$broadcast('map:update', map);
    });

  });

  this.getRooms = function() {
    return currentRooms;
  };

  this.getRoom = function(id) {
    return getRoomById(id);
  };

  var getRoomById = function(id) {
    for (var i = 0; i < currentRooms.length; i++) {
      if (currentRooms[i].id === id) {
        return currentRooms[i];
      }
    }
    return false;
  };

  var getPlayerIndexById = function(id, map) {
    for (var i = 0; i < map.players.length; i++) {
      var player = map.players[i];
      if (player.id === id) {
        return i;
      }
    }
  };

});