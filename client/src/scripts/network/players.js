angular.module('app.network')
.factory('Player', function() {
  var Player = function(data) {
    this.id = data.id;
    this.name = data.name;

    // this._data = data;
  };

  return Player;
})
.service('players', function(mySocket, $rootScope, Player, User) {
  
  // $rootScope.$on('')
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

  $rootScope.$on('game:removePlayer', function(evt, playerData) {
    var player = playerById(playerData.id);
    var idx = listOfPlayers.indexOf(player);
    listOfPlayers.splice(idx, 1);
    $rootScope.$broadcast('newPlayers', listOfPlayers);
  });
  $rootScope.$on('game:newPlayer', function(evt, playerData) {
    var player = new Player(playerData);
    listOfPlayers.push(player);
    $rootScope.$broadcast('newPlayers', listOfPlayers);
  });

});
