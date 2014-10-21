module.exports = (function(Game) {
  var g = Game;

  Game.States.Preloader = function (game) {
     this.asset = null;
     this.ready = false;

     WebFontConfig = {
        //  The Google Fonts we want to load (specify as many as you like in the array)
        google: {
          families: ['Revalia', 'Architects Daughter']
        }
    };
  };

  Game.States.Preloader.prototype = {

    preload: function () {
      this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
      this.asset = this.add.sprite(this.world.centerX, this.world.centerY, 'preloader');
      this.asset.anchor.setTo(0.5, 0.5);
      this.load.setPreloadSprite(this.asset);

      // Load the game levels
      var Levels = Game.Levels = this.game.cache.getJSON('levels');

      // Load level backgrounds
      for (var i in Levels) {
        var obj = Levels[i];
        this.load.image('background'+i, obj.background);
      }

      // Load fonts
      this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

      // Load menu
      this.load.image('logo', 'assets/logo.png');

      // Load player sprites
      this.load.image('hero', 'assets/player_blue.png');
      this.load.image('shield', 'assets/shield.png');
      this.load.image('player_green', 'assets/player_green.png');

      this.load.image('laser_red', 'assets/laser_red.png');
      this.load.image('laser_yellow', 'assets/laser_yellow.png');
      this.load.image('laser_orange', 'assets/laser_orange.png');
      this.load.image('laser_gray', 'assets/laser_gray.png');

      // Load enemies
      this.load.image('enemy_1', 'assets/enemy_1.png');
      this.load.image('enemy_2', 'assets/enemy_2.png');
      this.load.image('enemy_3', 'assets/enemy_3.png');

      // Next level and gameover graphics
      this.load.image('next_level', 'assets/levelcomplete-bg.png');
      this.load.image('youwin', 'assets/youwin-bg.png');
      this.load.image('gameover', 'assets/gameover-bg.png');
      this.load.image('new', 'assets/new.png');

      this.load.spritesheet('btnMenu', 'assets/btn-menu.png', 190, 49, 2);
      this.load.spritesheet('btn', 'assets/btn.png', 49, 49, 6);
      this.load.spritesheet('num', 'assets/num.png', 12, 11, 5);
      this.load.spritesheet('bonus', 'assets/bonus.png', 16, 16, 2);

      // Numbers
      this.load.image('num', 'assets/num.png');
      this.load.image('lives', 'assets/lives.png');
      this.load.image('panel', 'assets/panel.png');

      this.load.image('laser', 'assets/laser.png');
      this.load.image('bullet', 'assets/bullet.png');

      // Audio
      this.load.audio('laserFx', 'assets/laser_01.mp3');
      this.load.audio('dink', 'assets/dink.mp3');
      this.load.audio('menu_music', 'assets/menu_music.mp3');
      this.load.audio('game_music', 'assets/game_music.mp3');

      this.load.spritesheet('explosion', 'assets/explode.png', 128, 128, 16);

      // Fonts
      this.load.bitmapFont('architectsDaughter', 
        'assets/fonts/r.png', 
        'assets/fonts/r.fnt');

      // Finally, load the cached level, if there is one
      Game.currentLevel = 0;
      if (localStorage.getItem('currentLevel')) {
        Game.currentLevel = localStorage.getItem('currentLevel');
      }
    },

    create: function () {
      this.asset.cropEnabled = false;

      this.game.stage.backgroundColor = 0x2B3E42;
      var tween = this.add.tween(this.asset)
      .to({
        alpha: 0
      }, 500, Phaser.Easing.Linear.None, true);
      tween.onComplete.add(this.startMainMenu, this);

      // Load keyboard capture
      var game = this.game;
      Game.cursors = game.input.keyboard.createCursorKeys();
      // var music = this.game.add.audio('galaxy');
      // music.loop = true;
      // music.play('');
      // window.music = music;
    },

    startMainMenu: function() {
      if (!!this.ready) {
        // this.game.state.start('MainMenu');
        this.game.state.start('Play');
        // this.game.state.start('NextLevel');
      }
    },

    toggleMusic: function() {
      if (this.musicIsPlaying = !this.musicIsPlaying) {
        music.stop();
      } else {
        music.play('');
      }
    },

    onLoadComplete: function () {
      this.ready = true;
    }
  };
});