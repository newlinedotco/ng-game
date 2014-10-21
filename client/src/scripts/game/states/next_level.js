var BaseGame    = require('./boot');

var NextLevel = function() {
    
}

module.exports = NextLevel;

NextLevel.prototype.create = function() {
  BaseGame.currentLevel = BaseGame.currentLevel || 0;
  var game = this.game;

  // Move to the next level
  BaseGame.currentLevel += 1;

  if (BaseGame.currentLevel < BaseGame.Levels.length) {
    this.showNextLevel(function() {
      console.log('go again!', BaseGame.Levels.length, BaseGame.currentLevel);
      game.state.start('Game');
    });
  } else {
    this.showYouWin(function() {
      console.log('you totally won it all!');
      game.state.start('MainMenu');
    });
  }
}

NextLevel.prototype.showNextLevel = function(fn) {
  var game = this.game,
      currentLevel = BaseGame.currentLevel - 1;
  var image = this.game.cache.getImage('next_level'),
      centerX = this.world.centerX - image.width/2,
      centerY = this.world.centerY - image.height/2,
      endY    = this.world.height + image.height,
      textPadding = 20;

  var textGroup = game.add.group();

  var textDetails = game.add.text(
      image.width/2, 
      image.height/2 - textPadding,
      "Level " + (currentLevel + 1) + " Complete",
      {
        font: "16px Arial",
        fill: "#ffffff",
        align: "center"
      }
    );
  textDetails.anchor.set(0.5);
  textGroup.addChild(textDetails);
  console.log('points', currentLevel, BaseGame.levelPoints);

  var textPoints = game.add.text(
      image.width/2, 
      image.height/2 + textPadding,
      (BaseGame.levelPoints[currentLevel] || 0) + " points",
      {
        font: "28px Arial",
        fill: "#ffffff",
        align: "center"
      }
    );
  textPoints.anchor.set(0.5);
  textGroup.addChild(textPoints);

  var sprite = game.add.sprite(centerX, -centerY, 'next_level');
  sprite.alpha = 0;
  sprite.addChild(textGroup);

  var tween = game.add.tween(sprite)
    .to({y: centerY, alpha: 1}, 800, Phaser.Easing.Bounce.Out)
    .to({y: endY, alpha: 0}, 800, Phaser.Easing.Bounce.Out, true, 1800);

  tween._lastChild.onComplete.add(fn, this)
  tween.start();
}

NextLevel.prototype.showYouWin = function(fn) {
  var game = this.game;
  var image = this.game.cache.getImage('youwin'),
      centerX = this.world.centerX - image.width/2,
      centerY = this.world.centerY - image.height/2,
      endY    = this.world.height + image.height,
      textPadding = 40;

  var textGroup = game.add.group();

  var totalPoints = 0;
  for (var i in BaseGame.levelPoints) {
    totalPoints += BaseGame.levelPoints[i];
  }
  console.log('totalPoints', totalPoints);
  var textPoints = game.add.text(
      image.width/2, 
      image.height/2 + textPadding,
      (totalPoints || 0) + " points",
      {
        font: "40px Arial",
        fill: "#ffffff",
        align: "center"
      }
    );
  textPoints.anchor.set(0.5);
  textGroup.addChild(textPoints);

  var sprite = game.add.sprite(centerX, -centerY, 'youwin');
  sprite.alpha = 0;
  sprite.addChild(textGroup);

  var tween = game.add.tween(sprite)
    .to({y: centerY, alpha: 1}, 800, Phaser.Easing.Bounce.Out)
    .to({angle: '+15'}, 200, Phaser.Easing.Linear.None)
    .to({angle: '-10'}, 200, Phaser.Easing.Linear.None)
    .to({angle: '+15'}, 200, Phaser.Easing.Linear.None)
    .to({y: endY, alpha: 0}, 800, Phaser.Easing.Bounce.Out, false, 150);

  var tween2 = game.add.tween(textPoints.scale)
    .to({x: 2, y: 2}, 300, Phaser.Easing.Linear.None)
    .to({x: 1, y: 1}, 300, Phaser.Easing.Linear.None);

  tween.onComplete.add(function() {
    tween2.start();
  }, this)
  tween.start();
  tween2._lastChild.onComplete.add(fn);
}
