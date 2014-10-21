var Laser = require('./laser');

var LaserGun = function(player, color) {
  this.SHOT_DELAY = 200; // 100ms
  this.NUMBER_OF_BULLETS = 10;
  
  this.game = player.game;
  this.player = player;
  this.color = color;

  this.level = 0;
  this.lastBulletShotAt = 0;
  this.activeLasers = [];

  // Create laser pool
  this.laserPool = this.game.add.group();
  var currentIndex = 0;
  for (var i = 0; i < this.NUMBER_OF_BULLETS; i++) {
    this.laserPool.add(new Laser(this.player, this.color, this.handledKilled, this));
    // var laser = this.game.add.sprite(0, 0, 'laser_' + this.color);
    // this.laserPool.add(laser);
    // laser.anchor.setTo(0.5, 0.5);
    // this.game.physics.enable(laser, Phaser.Physics.ARCADE);
    // laser.kill(); // set dead at first
  }
}

module.exports = LaserGun;

LaserGun.prototype.shootLaser = function() {
  if (this.game.time.now - this.lastBulletShotAt < this.SHOT_DELAY) return; 
  this.lastBulletShotAt = this.game.time.now;

  // Get a laser
  var laser = this.laserPool.getFirstDead();
  // If we don't have any lasers left...
  if (laser === null || laser === undefined) return;

  laser.shoot(this.player);
  this.activeLasers.push(laser);
}

LaserGun.prototype.handledKilled = function(laser) {
  this.activeLasers.splice(this.activeLasers.indexOf(laser), 1);
}