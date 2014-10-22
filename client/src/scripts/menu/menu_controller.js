angular.module('app.menu')
.controller('MenuController', function(mySocket, $scope, Room) {

  $scope.$on('map:update', function(evt, mapId) {
    ctrl.rooms = Room.getRooms();
    console.log('ROOMS', ctrl.rooms);
  });

  var ctrl = this;
  ctrl.startGame = function() {
  };

  ctrl.createId = function() {
    return new Date().getTime().toString();
  };

});