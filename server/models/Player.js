(function() {

  var Player = function(config) {

    this.id       = config.id || '';

    this.name     = config.name || 'Player';

    this.xRel = this.x        = 0;
    this.yRel = this.y        = 0;
    this.rotation    = 0;
    this.lastUpdate = 0;
    this.mapId    = -1;
    this.health   = 10;
    this.points   = 0;

    this.lastShot = {};
  };

  module.exports = Player;

  Player.prototype.recordUpdate = function(data) {
    this.x = data.x;
    this.y = data.y;
    this.xRel = data.xRel;
    this.yRel = data.yRel;
    this.health = data.health;
    this.rotation = data.rotation;
    this.lastUpdate = data.timestamp;
  };

  Player.prototype.recordShot = function(data) {
    this.lastShot = data;
  };

  Player.prototype.addShotPoints = function(data) {
    this.points += 10;
  };

  Player.prototype.wasHit = function() {
    this.health -= 10;
  };

  Player.prototype.joinMap = function(map) {
    this.x = 0;
    this.y = 0;
    this.timestamp = new Date().getTime();
    this.mapId = map.id;
    map.addPlayer(this);
  };

  Player.prototype.inMap = function(id) {
    return this.mapId === id;
  };

  Player.prototype.leaveMap = function() {
    this.mapId = '';
    if (this.map) {
      this.map.removePlayer(this);
    }
  };

  Player.prototype.reset = function() {
    this.mapId = '';
  };

  Player.prototype.isAlive = function() {
    return this.health > 0;
  };

  Player.prototype.serialize = function() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      xRel: this.xRel,
      yRel: this.yRel,
      timestamp: this.timestamp,
      rotation: this.rotation
    }
  }

})();