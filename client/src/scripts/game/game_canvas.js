angular.module('app.game')
.directive('gameCanvas', function($window, mySocket, $injector) {

  var linkFn = function(scope, ele, attrs) {
    var w = angular.element($window);
    w.bind('resize', function(evt) {
      console.log('resized');
    });

    mySocket.then(function(sock) {
      require('./main.js')(
        ele, scope, sock, 
        scope.ngModel, 
        scope.mapId || new Date().getTime(), 
        $injector);
    });
  };

  return {
    scope: {
      ngModel: '=',
      mapId: '='
    },
    template: '<div id="game-canvas"></div>',
    compile: function(iEle, iAttrs) {
      return linkFn
    }
  }
})