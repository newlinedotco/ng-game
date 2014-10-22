module.exports = 
angular.module('app.menu', [
  require('./play_button').name
])
.config(function($stateProvider) {
  $stateProvider
    .state('menu', {
      abstract: true,
      templateUrl: 'scripts/menu/template.html',
      url: '/menu'
    })
    .state('menu.home', {
      url: '',
      templateUrl: 'scripts/menu/main.html',
      controller: 'MenuController as ctrl',
      onEnter: function(Room) {
        Room.queryForRooms();
      }
    })
})

// require('./HomeCtrl');
require('./menu_controller');