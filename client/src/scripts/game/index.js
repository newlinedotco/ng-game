module.exports =
angular.module('app.game', ['ui.router', 'app.user'])
.config(function($stateProvider) {
  $stateProvider
    .state('game', {
      url: '/game',
      abstract: true,
      templateUrl: '/scripts/game/template.html'
    })
    .state('game.play', {
      url: '/:id',
      template: '<div>\
        <div id="gameCanvas" game-canvas="players" map-id="mapId"></div>\
        <div id="orientation"></div>\
      </div>',
      controller: 'GameController',
      onEnter: function(Game) {
        Game.playing = true;
      },
      onExit: function(Game) {
        Game.playing = false;
      }
    })
})

require('./game_controller.js')
require('./game_canvas.js');