angular.module('app.network')
// The player model
// We'll store the player and their name
.factory('Player', function() {
  var Player = function(data) {
    this.id = data.id;
    this.name = data.name;
  };

  return Player;
})
// The `players` service holds all of the current players
// for the game. We use it to manage any player-related data
.service('players', function(mySocket, $rootScope, Player, Room) {
  
  var service = this,
      listOfPlayers = [];

  var playerById = function(id) {
    var player;
    for (var i = 0; i < listOfPlayers.length; i++) {
      if (listOfPlayers[i].id === id) {
        return listOfPlayers[i];
      }
    }
  }

  // Socket listeners
  mySocket.then(function(socket) {
    socket.on('gameOver', function(data) {
      $rootScope.$apply(function() {
        listOfPlayers = [];
      });
    });

    socket.on('map:update', function(map) {
      console.log('players map:update', map);
    })
  });

  // Scope listeners
  $rootScope.$on('game:removePlayer', function(evt, playerData) {
    var player = playerById(playerData.id);
    var idx = listOfPlayers.indexOf(player);

    console.log('game:removePlayer players player', playerData.id, _.map(listOfPlayers, 'id'));
    listOfPlayers.splice(idx, 1);
    $rootScope.$broadcast('newPlayers', listOfPlayers);
  });
  // Do we have a new player?
  $rootScope.$on('game:newPlayer', function(evt, playerData) {
    var player = new Player(playerData);
    listOfPlayers.push(player);
    $rootScope.$broadcast('newPlayers', listOfPlayers);
  });

});
