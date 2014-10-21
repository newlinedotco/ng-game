angular.module('app.network')
.factory('mySocket', function(ioLoader, $q, socketFactory, User) {

  var mySocket = $q.defer();

  ioLoader.done().then(function(io) {
    var myIoSocket = io.connect(window.location.hostname);

    var aSock = socketFactory({
      ioSocket: myIoSocket
    });

    mySocket.resolve(aSock);
  });

  return mySocket.promise;
});
