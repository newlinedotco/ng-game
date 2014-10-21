module.exports =
angular.module('app.menu.playButton', [])
.directive('playButton', function() {
  return {
    scope: {
      onClick: '&'
    },
    template: '<div class="playButton"\
        ng-click="onClick()">\
      <i class="icon ion-play"></i>\
      <span class="play-text">play</span>\
    </div>'
  }
})