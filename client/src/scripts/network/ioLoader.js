'use strict';

angular.module('app.loader', [])
.provider('ioLoader', function() {

  this.scriptUrl = window.location.origin+'/socket.io/socket.io.js';

  this.$get = ['$window', '$document', '$q', function($window, $document, $q) {

    var defer = $q.defer(),
      scriptUrl = this.scriptUrl;

    return {

      done: function(){

        var onScriptLoad = function(){
          return defer.resolve($window.io);
        };

        if($window.io){
          onScriptLoad();
        }
        else{
          var scriptTag = $document[0].createElement('script');

          scriptTag.type = 'text/javascript';
          scriptTag.async = true;
          scriptTag.src = scriptUrl;
          scriptTag.onreadystatechange = function () {
            if (this.readyState === 'complete') {
              onScriptLoad();
            }else{
              defer.reject();
            }
          };
          scriptTag.onload = onScriptLoad;
          var s = $document[0].getElementsByTagName('head')[0];
          s.appendChild(scriptTag);
        }

        return defer.promise;
      }
    };
  }];

  this.setScriptUrl = function(url) {
    this.scriptUrl = url;
  };


});
