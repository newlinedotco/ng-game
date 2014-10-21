module.exports = (function(Game) {
  Game.Prefabs.Enemy = function(game, x, y, desc, target){
    var desc = this.desc = desc;

    var type = 'enemy_' + desc.type || '1';
    // Super call to Phaser.sprite
    Phaser.Sprite.call(this, game, x, y, type);

    // Speed
    this.speed = desc.speed;

    // Target
    this.target = target;

    // Dead - Can't use alive because enemies follow each other
    this.dead = false;

    // Min Distance
    this.minDistance = 10;

    // Explosion
    this.explosion = this.game.add.sprite(0,0, 'explosion');
    this.explosion.anchor.setTo(0.5, 0.5);
    this.explosion.alpha = 0;

    // Enable physics on this object
    this.anchor.setTo(0.5, 0.5);
      this.game.physics.enable(this, Phaser.Physics.ARCADE);

      // Out of bounds callback
      this.events.onOutOfBounds.add(function(){
        this.die(true);
      }, this);
  }

  Game.Prefabs.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
  Game.Prefabs.Enemy.constructor = Game.Prefabs.Enemy;

  Game.Prefabs.Enemy.prototype.update = function(){
    if(!Game.paused){
      // Change velocity to follow the target
      var distance, rotation;
      distance = this.game.math.distance(this.x, this.y, 
        this.target.x, 
        this.target.y);

      if (distance > this.minDistance) {
        rotation = this.game.math.angleBetween(this.x, this.y, this.target.x, this.target.y);

        this.body.velocity.x = Math.cos(rotation) * this.speed;
        this.body.velocity.y = -(Math.sin(rotation) * this.speed);
      } else {
        this.body.velocity.setTo(0, 0);
      }

      // Active enemy
      if(this.y < this.game.height && !this.checkWorldBounds) {
        this.checkWorldBounds = true;
      }
    }
  };

  Game.Prefabs.Enemy.prototype.die = function(autoKill){
    if(!this.dead){
      this.dead = true;
      this.alpha = 0;

      // Explosion
      if(!autoKill){
        this.explosion.reset(this.x, this.y);
        this.explosion.angle = this.game.rnd.integerInRange(0, 360);
        this.explosion.alpha = 0;
        this.explosion.scale.x = 0.2;
        this.explosion.scale.y = 0.2;
        this.game.add.tween(this.explosion)
          .to({alpha: 1, angle: "+30"}, 200, Phaser.Easing.Linear.NONE, true, 0).to({alpha: 0, angle: "+30"}, 300, Phaser.Easing.Linear.NONE, true, 0);
        this.game.add.tween(this.explosion.scale)
          .to({x:1.5, y:1.5}, 500, Phaser.Easing.Cubic.Out, true, 0);
      }

      // Update parent group
      this.parent.updateStatus(this, autoKill);
    }
  };

  Game.Prefabs.Enemy.prototype.pause = function(){
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
  };

  Game.Prefabs.Enemy.prototype.reload = function(i, from){
    // this.x = this.game.width + this.width/2 + i*(this.width + 10);
    this.x = from;
    this.checkWorldBounds = false;
    this.dead = false;
    this.alpha = 1;
    this.y = -this.height + i*(this.height); //this.game.height + this.height/2 + i*(this.height + 10); //from;
  };

  Game.Prefabs.Enemy.prototype.resetTarget = function(to){
    this.target = new Phaser.Point(this.x || this.game.width/2, to);
  };
});