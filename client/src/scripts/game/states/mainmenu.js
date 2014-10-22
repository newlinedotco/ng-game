/*
 * The MainMenu state is responsible for showing the
 * main menu of the game. 
 * 
 * The main menu has a scrolling background with two options
 * of new solo game or new multiplayer game. The difference
 * between the two is that `Game.multiplayer` is set to true
 * on the new mulitplayer option. 
 */
module.exports = (function(Game) {
  Game.States.MainMenu = function(game) {
    this.juicy;
    this.screenFlash;
  }

  Game.States.MainMenu.prototype = {
    create: function() {

      var game = this.game;

      this.startTime = game.time.now;
      
      var image = this.game.cache.getImage('logo'),
        centerX = this.world.centerX,
        centerY = this.world.centerY - image.height,
        endY    = this.world.height + image.height,
        textPadding = this.game.device.desktop ? 60 : 30;

      // Menu background
      this.background = game.add.tileSprite(0, 0, this.world.width, this.world.height, 'menu_background');
      this.background.autoScroll(-50, -20);
      this.background.tilePosition.x = 0;
      this.background.tilePosition.y = 0;

      // Add logo
      var sprite = game.add.sprite(centerX, centerY - textPadding, 'logo');
      sprite.anchor.set(0.5);

      if (this.game.device.desktop) {
        sprite.scale.set(2);
      }

      // Add new game
      var fontSize = (this.game.device.desktop ? '40px' : '20px');
      var newGame = this.newGame = this.add.text(this.world.centerX, 
        centerY + textPadding,
        "New game", 
        {
          font: fontSize + " Architects Daughter", 
          align:"center", 
          fill:"#fff"
        }); 
      newGame.inputEnabled = true;
      newGame.anchor.set(0.5);

      newGame.events.onInputOver.add(this.overNewgame, this);
      newGame.events.onInputOut.add(this.outNewgame, this);
      newGame.events.onInputDown.add(this.playGame, this);

      var multiGame = this.multiGame = 
        this.add.text(this.world.centerX, 
          centerY + textPadding + newGame.height,
        "New multiplayer game", 
        {
          font: fontSize + " Architects Daughter", 
          align:"center", 
          fill:"#fff"
        }); 
      multiGame.inputEnabled = true;
      multiGame.anchor.set(0.5);

      multiGame.events.onInputOver.add(this.overMultigame, this);
      multiGame.events.onInputOut.add(this.outMultigame, this);
      multiGame.events.onInputDown.add(this.playMultiGame, this);

      // Juicy
      this.juicy = game.plugins.add(Phaser.Plugin.Juicy);
      this.screenFlash = this.juicy.createScreenFlash();
      this.add.existing(this.screenFlash);

      // Music
      this.menu_music = game.add.audio('menu_music');
      this.dink       = game.add.audio('dink');
      this.menu_music.play();
    },

    playGame: function() {
      Game.multiplayer = false;
      this.menu_music.stop();
      this.game.state.start('Play');
    },

    playMultiGame: function() {
      Game.multiplayer = true;
      this.play();
    },

    overNewgame: function() {
      this.game.add.tween(this.newGame.scale)
        .to({x: 1.3, y: 1.3}, 300, Phaser.Easing.Exponential.Out, true)
      this.dink.play();
    },

    overMultigame: function() {
      this.game.add.tween(this.multiGame.scale)
        .to({x: 1.3, y: 1.3}, 300, Phaser.Easing.Exponential.Out, true)
      this.dink.play();
    },

    outMultigame: function() {
      this.game.add.tween(this.multiGame.scale)
        .to({x: 1, y: 1}, 300, Phaser.Easing.Exponential.Out, true)
      this.dink.play();
    },

    outNewgame: function() {
      this.game.add.tween(this.newGame.scale)
        .to({x: 1, y: 1}, 300, Phaser.Easing.Exponential.Out, true);
    }
  }
});
