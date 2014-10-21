(function() {

  var _ = require('lodash');
  
  var Map = function(config) {
    this.id = config.id;

    this.players = config.players || [];
  };

  module.exports = Map;

  Map.prototype.update = function() {
  };

  Map.prototype.reset = function() {
    _.map(this.players, function(player) {
      player.reset();
    });
    this.players = [];
  };

  Map.prototype.addPlayer = function(player) {
    this.players.push(player);
  };

  Map.prototype.removePlayer = function(player) {
    this.players.splice(this.players.indexOf(player), 1);
  };

  Map.prototype.serialize = function() {
    var players = _.map(this.players, function(player) {
      return player.serialize();
    });
    return {
      id: this.id,
      players: players
    }
  };

})();