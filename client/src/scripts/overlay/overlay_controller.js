angular.module('app.overlay')
.controller('OverlayController', function($rootScope, $scope, players, feed) {
  var ctrl = this;

  ctrl.turnOffMusic = function() {
    $rootScope.$broadcast('game:toggleMusic');
  };

  ctrl.title = "Feed";

  ctrl.feed = feed.list;
  ctrl.feedLimit = 10;

  $scope.$on('newPlayers', function(evt, players) {
    $scope.players = players;
  });

})