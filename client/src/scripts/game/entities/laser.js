module.exports = (function(Game) {
  Game.Prefabs.Laser = function(game, x, y){
    // Super call to Phaser.sprite
    Phaser.Sprite.call(this, game, x, y, 'laser');

    // Centered anchor
    this.anchor.setTo(0.5, 0.5);

    // Speed
    this.speed = 150;

    // Kill when out of world
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

    // Enable physics
    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    this.tween = this.game.add.tween(this).to({angle:-360}, 3000, Phaser.Easing.Linear.NONE, true, 0, Number.POSITIVE_INFINITY);
  }

  Game.Prefabs.Laser.prototype = Object.create(Phaser.Sprite.prototype);
  Game.Prefabs.Laser.constructor = Game.Prefabs.Laser;

  Game.Prefabs.Laser.prototype.update = function(){
    if(!Game.paused){
      this.body.velocity.x = -this.speed;
    }else{
      this.body.velocity.x = 0;
    }
  };

  Game.Prefabs.Laser.prototype.reload = function(speed){
    this.alpha = 1;
    this.speed = speed;
    this.scale.x = 1;
    this.scale.y = 1;
  };

  Game.Prefabs.Laser.prototype.die = function(){
    this.game.add.tween(this).to({alpha: 0}, 150, Phaser.Easing.Cubic.Out, true, 0);
    this.game.add.tween(this.scale).to({x:1.5, y:1.5}, 150, Phaser.Easing.Cubic.Out, true, 0);
  };

  Game.Prefabs.Laser.prototype.pause = function(){
    this.tween.pause();
  };

  Game.Prefabs.Laser.prototype.resume = function(){
    this.tween.resume();
  };
});