angular.module('app.network')
.factory('FeedItem', function() {
  var FeedItem = function(eventName, data) {
    console.log('FeedItem ->', data);
    this.id = data.id;
    this.eventName = eventName;

    this.msg = data.name || eventName + ' happened';
  };

  return FeedItem;
})
.service('feed', function(mySocket, $rootScope, FeedItem) {
  
  // $rootScope.$on('')
  var service = this,
      list = [];

  this.list = list;

  var addToList = function(name, data) {
    $rootScope.$apply(function() {
      var item = new FeedItem(name, data);
      list.push(item);
    });
  }

  $rootScope.$on('game:removePlayer', function(evt, playerData) {
  });

  mySocket.then(function(socket) {
    // New player joined
    socket.on('newPlayer', function(data) {
      addToList("join", data);
    });

    // Player was hit
    socket.on('playerHit', function(data) {
      addToList("playerHit", data);
    });

  });

});
