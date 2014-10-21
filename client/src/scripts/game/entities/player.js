module.exports = (function(Game) {

  Game.Prefabs.Player = function(game, x, y, target, id) {
    this.id = id;
    if (target) {
      Phaser.Sprite.call(this, game, x, y, 'hero');
      // Target: mouse
      this.target     = target;

      // Follow pointer
      this.follow = false;

      // Minimum away
      this.minDistance = 10;

      // Speed
      this.speed      = 200;

      // Lives
      this.lives      = 3;

      // Shot delay
      this.shotDelay  = 100;

      // Number of bullets per shot
      this.numBullets   = 1;
      this.timerBullet;

      this.shieldsEnabled = false;
      this.timerShield;
      this.shield = this.game.add.sprite(0, 0, 'shield');
      this.shield.anchor.setTo(0.5, 0.5);
      this.shield.alpha = 0

      // Scale
      this.scale.setTo(1.2, 1.2);
    } else {
      Phaser.Sprite.call(this, game, x, y, 'hero');

      this.scale.setTo(0.5, 0.5);
      this.alpha = 0.8;
      this.x = x;
      this.y = y;

      // State queue
      this.stateQueue = [];
      this.minQueueSize = 10;
      this.maxQueueSize = 30;
      this.previousStateTime = 0;
    }

    // Explosion
    this.explosion = this.game.add.sprite(0,0, 'explosion');
    this.explosion.anchor.setTo(0.5, 0.5);
    this.explosion.alpha = 0;

    this.health = 10;
    // Anchor
    this.anchor.setTo(0.5, 0.5);
    // Rotate 90s so it's facing up
    this.rotation = -Math.PI/2;

    this.game.physics.enable(this, Phaser.Physics.ARCADE);
  };

  Game.Prefabs.Player.prototype   = Object.create(Phaser.Sprite.prototype);
  Game.Prefabs.Player.constructor = Game.Prefabs.Player;

  // Update
  Game.Prefabs.Player.prototype.update = function() {
    if (this.target) {
      this.updateHero();
    } else {
      this.updateRemote();
    }
  }

  Game.Prefabs.Player.prototype.onUpdateFromServer = function(data) {
    if (this.stateQueue.length > this.maxQueueSize) {
      this.stateQueue.splice(this.minQueueSize, this.maxQueueSize - this.minQueueSize);
    }
    this.stateQueue.push(data);
  };

  Game.Prefabs.Player.prototype.updateHero = function() {
    var distance, rotation;
      // Follow pointer
    if (this.follow) {
      distance = this.game.math.distance(this.x, this.y, this.target.x, this.target.y);

      if (distance > this.minDistance) {
        rotation = this.game.math.angleBetween(this.x, this.y, this.target.x, this.target.y);

        this.body.velocity.x = Math.cos(rotation) * this.speed * Math.min(distance / 120, 2);
        this.body.velocity.y = Math.sin(rotation) * this.speed * Math.min(distance / 120, 2);
        this.rotation = rotation;
      } else {
        this.body.velocity.setTo(0, 0);
      }
    } else {
      this.body.velocity.setTo(0, 0);
    }

    // Shields
    if (this.shieldsEnabled) {
      this.shield.x = this.x;
      this.shield.y = this.y;
      this.shield.rotation = this.rotation;
    }
  };

  Game.Prefabs.Player.prototype.updateRemote = function() {
    if (this.stateQueue.length > this.minQueueSize) {
      var earliestQueue = this.stateQueue.pop();

      
      if (!this.previousStateTime) {
        this.previousStateTime = new Date().getTime();
      }

      var tweenTime = Math.abs(this.previousStateTime - (earliestQueue.timestamp + 10));
      this.game.add.tween(this)
        .to({
          x: earliestQueue.x, //Rel * (Game.width == 0 ? 1 : Game.width),
          y: earliestQueue.y, //Rel * (Game.height == 0 ? 1 : Game.height),
          rotation: earliestQueue.rotation
        }, tweenTime, 
        Phaser.Easing.Linear.None, true, 0);

      this.previousStateTime = earliestQueue.timestamp;
    }
    // this.body.velocity.x = Math.cos(rotation) * this.speed * 
    // this.body.x = this.x;
    // this.body.y = this.y;
    // this.body.rotation = this.rotation;
  };

  Game.Prefabs.Player.prototype.die = function(autoKill){
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
    }
  };

  Game.Prefabs.Player.prototype.wasHitBy = function(bullet, player) {
    if (!this.shieldsEnabled) {
      this.health -= 10;

      if (this.health <= 0) {
        this.die();
      } else {
        this.enableShield(0.3);
      }

      return true;
    }
  };

  Game.Prefabs.Player.prototype.enableShield = function(duration) {
    this.shieldsEnabled = true;

    if (this.timerShield && !this.timerShield.expired) {
      this.timerShield.destroy();
    }

    this.timerShield = this.game.time.create(true);
    this.timerShield.add(Phaser.Timer.SECOND * duration, this.disableShield, this);
    this.timerShield.start();

    this.game.add.tween(this.shield)
      .to({alpha: 1}, 300, Phaser.Easing.Cubic.Out, true, 0);
  };

  Game.Prefabs.Player.prototype.disableShield = function() {
    this.game.add.tween(this.shield)
      .to({alpha: 0}, 300, 
        Phaser.Easing.Linear.NONE, 
        true,
        0, 6, true).onComplete.add(function() {
          this.shieldsEnabled = false;
        }, this);
  }
});