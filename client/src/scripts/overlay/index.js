module.exports =
angular.module('app.overlay', [])
.directive('overlayBar', function() {
  return {
    templateUrl: '/scripts/overlay/overlay.html',
    controller: 'OverlayController as ctrl'
  }
})

require('./overlay_controller.js');