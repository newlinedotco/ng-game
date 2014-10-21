var Game = {
  name: 'ng-invader',
  // States of our game
  States: {},
  // Prefabs
  Prefabs: {},
  // Levels
  Levels: {},

  orientated: true,

  backgroundX: 0,
  backgroundY: 0,

  paused: true,

  multiplayer: true,

  // Map
  mapData: {},

  // Socket
  socket: {},
  remotePlayers: [],
  toAdd: [],
  toRemove: [],
  latency: 0,

  width: 800,
  height: 600,

  // Helpers
  cpc: function(x) {
    return x * 64 + 32;
  },

  playerById: function(id) {
    for (var i = 0; i < this.remotePlayers.length; i++) {
      if (this.remotePlayers[i].id === id) {
        return this.remotePlayers[i];
      }
    }
    return false;
  },

  resetCallbacks: [],
  reset: function() {
    _.map(Game.resetCallbacks, function(i,v) {
      Game.resetCallbacks[i].apply(this);
    });
  },

  winner: false
};

require('../entities')(Game);

require('./boot')(Game);
require('./preloader')(Game);
require('./mainmenu')(Game);
require('./play')(Game);
require('./game_over')(Game);

module.exports = Game;