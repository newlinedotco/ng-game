module.exports = (function(Game) {

  Game.Prefabs.Bullet = function(game, x, y, player, handleKilledFn){
    this.BULLET_SPEED = 500;

    this.player = player;
    this.game = player.game;

    Phaser.Sprite.call(this, player.game, 0, 0, 'bullet');
    
    this.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    this.angle = -Math.PI/2;
    this.kill(); // set dead at first

    this.laserSound = this.game.add.audio('laserFx');

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

    // this.events.onKilled.add(this.handleKilled, this);
    if (handleKilledFn) {
      this.events.onKilled.add(handleKilledFn, this);
    }
  }

  Game.Prefabs.Bullet.prototype = Object.create(Phaser.Sprite.prototype);
  Game.Prefabs.Bullet.constructor = Game.Prefabs.Bullet;

  Game.Prefabs.Bullet.prototype.shoot = function() {
    this.rotation = this.player.rotation;

    // var pt = this.game.input.activePointer.position;
    // laser.angle = this.game.physics.arcade.angleBetween(laser, pt);

    this.xVel = Math.cos(this.rotation) * this.BULLET_SPEED;
    this.yVel = Math.sin(this.rotation) * this.BULLET_SPEED;
    this.laserSound.play();
  };

  Game.Prefabs.Bullet.prototype.shootFrom = function(data) {
    this.rotation = data.rotation;

    this.xVel = Math.cos(this.rotation) * this.BULLET_SPEED;
    this.yVel = Math.sin(this.rotation) * this.BULLET_SPEED;
  };

  Game.Prefabs.Bullet.prototype.update = function() {
    var laser = this;
    laser.body.velocity.x = this.xVel;
    laser.body.velocity.y = this.yVel;
  }

});