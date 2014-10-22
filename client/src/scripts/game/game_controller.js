angular.module('app.game')
.controller('GameController', function($scope, $stateParams, mySocket, User) {
  $scope.players = [];
  $scope.mapId = $stateParams.id || '1';

  $scope.$on('game:getAvailablePlayers', function(players) {
    $scope.players = players;
  });

  $scope.$on('$destroy', function() {
    $scope.$emit('player leaving');
  });

});