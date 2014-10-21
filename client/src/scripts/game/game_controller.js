angular.module('app.game')
.controller('GameController', function($scope, mySocket, User) {
  $scope.players = [];
  $scope.mapId = '1';

  $scope.$on('game:getAvailablePlayers', function(players) {
    $scope.players = players;
  });

  $scope.$on('$destroy', function() {
    mySocket.emit('player leaving');
    $scope.$emit('player leaving');
  });

});