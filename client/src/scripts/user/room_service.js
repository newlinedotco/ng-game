angular.module('app.user')
.service('Room', function($q, mySocket) {

  var currentRooms = [],
      currentRoomCount = 0;

  mySocket.on('roomList', function(data) {
    console.log('roomList', data);
    currentRooms = data.rooms;
    currentRoomCount = data.count;
  });

  this.getRooms = function() {
    return $q.when(currentRooms);
  };

  this.getRoom = function(id) {
    mySocket.emit('getRoom', id);
    var d = $q.defer();
    mySocket.on('roomInfo', function(room) {
      d.resolve(room);
    });
    mySocket.on('roomNotFound', function() {
      d.reject('not found');
    });
    return d.promise;
  }

});