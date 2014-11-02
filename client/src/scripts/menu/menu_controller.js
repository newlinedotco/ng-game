angular.module('app.menu')
.controller('MenuController', function(mySocket, $scope, Room) {

  $scope.$on('map:update', function(evt, mapId) {
    ctrl.rooms = Room.getRooms();
  });

  var ctrl = this;

  ctrl.createId = function() {
    return new Date().getTime().toString();
  };

});