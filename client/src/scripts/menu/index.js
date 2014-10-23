module.exports = 
angular.module('app.menu', [])
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

require('./menu_controller');