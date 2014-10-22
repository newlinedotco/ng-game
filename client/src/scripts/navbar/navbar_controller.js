angular.module('app.navbar')
.controller('NavbarController', function($scope, Game, players) {

  $scope.connectedPlayers = [];
  $scope.game = Game;

  $scope.$on('newPlayers', function(evt, players) {
    $scope.connectedPlayers = players;
  });

})