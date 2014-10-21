angular.module('app.navbar')
.controller('NavbarController', function($scope, players) {

  $scope.connectedPlayers = [];

  $scope.$on('newPlayers', function(evt, players) {
    $scope.connectedPlayers = players;
  });

})