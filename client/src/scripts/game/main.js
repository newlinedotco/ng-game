module.exports =
(function(ele, scope, socket, maps, mapId, injector) {

  // Require lib
  require('./lib/juicy');
  var UUID = require('./lib/uuid');
  
  var height  = parseInt(ele.css('height'), 10),
      width   = parseInt(ele.css('width'), 10);
  var game = new Phaser.Game(width, height, Phaser.AUTO, 'gameCanvas');

  var Game    = require('./states'),
      states  = Game.States;

  game.state.add('Boot', states.Boot);
  game.state.add('Preloader', states.Preloader);
  game.state.add('MainMenu', states.MainMenu);
  game.state.add('Play', states.Play);
  // game.state.add('Game', require('./states/game'));
  // game.state.add('NextLevel', require('./states/next_level'));
  game.state.add('GameOver', states.GameOver);

  game.mapId = mapId;
  game.socket = socket;
  game.scope  = scope;
  Game.maps           = maps;
  Game.remotePlayers = [];

  var user  = injector.get('User'),
      g     = Game;

  g.socket        = socket;
  g.mapId         = mapId;
  g.currentPlayer = user.getCurrentUser();

  // Turn off music
  scope.$on('game:toggleMusic', function() {
    game.state.states.Preloader.toggleMusic();
  });

  // Cleanup
  scope.$on('$destroy', function() {
    game.destroy();
  });

  // Network socket events
  socket.on('connected', function(data) {
    Game.connected = true;

    g.sid     = data.id;
    g.playerName = 'Player'; //prompt("Please enter your name") || 'Player';
    g.socket.emit('setPlayerName', { name: g.playerName });
    g.socket.emit('getMap', { mapId: g.mapId });
    game.state.start('Boot');
    // Game.socket.id = data.id;
    // var mapId = data.mapId || 'lobby';
    // Game.mapId = mapId;
    // socket.emit('getMap', {
    //   mapId: mapId
    // });
  });

  game.socket.on('getMap', function(data) {
    if (data.map) {
      g.mapData[data.mapId] = data.map;
      if (g.initialized) {
        game.cache.addTilemap('map:' + data.mapId, null, Game.arrayToCSV(data.map), Phaser.Tilemap.CSV);
      }
    }
  });

});