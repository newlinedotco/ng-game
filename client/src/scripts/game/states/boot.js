module.exports = (function(Game) {

  Game.States.Boot = function(game) {};

  Game.States.Boot.prototype = {
    resizeCanvasToContainerElement: function() {
      var canvas = this.game.canvas;

      var canvas          = this.game.canvas,
          containerWidth  = canvas.clientWidth,
          containerHeight = canvas.clientHeight;

      var xScale = containerWidth / this.width;
      var yScale = containerHeight / this.height;
      var newScale = Math.min( xScale, yScale );

      this.scale.width = newScale * this.game.width;
      this.scale.height = newScale * this.game.height;
      this.scale.setSize(containerWidth, containerHeight);

      Game.width  = this.game.width;
      Game.height = this.game.height;
    },
    init: function () {
      this.input.maxPointers = 1;
      this.stage.disableVisibilityChange = true;

      if (this.game.device.desktop) {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // this.scale.setMinMax(480, 260, 2048, 1536);
        // this.scale.pageAlignHorizontally = true;
        // this.scale.pageAlignVertically = true;
      } else {
        this.game.stage.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.stage.scale.minWidth =  480;
        this.game.stage.scale.minHeight = 260;
        this.game.stage.scale.maxWidth = 640;
        this.game.stage.scale.maxHeight = 480;
        this.game.stage.scale.forceLandscape = true;
        this.game.stage.scale.pageAlignHorizontally = true;
      }

      this.scale.setResizeCallback(this.handleResizeEvent, this);

      this.scale.setScreenSize(true);
      this.scale.refresh();
    },
    preload: function(){
              //  Here we load the assets required for our preloader (in this case a background and a loading bar)
      this.load.image('menu_background', 'assets/menu_background.jpg');
      this.load.image('preloader', 'assets/preloader.gif');
      this.load.json('levels', 'assets/levels.json');
    },

    create: function(){
      if (this.game.device.desktop) {
       this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //always show whole game
        this.game.stage.scale.pageAlignHorizontally = true;
      } else {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.forceLandscape = false;
        this.scale.pageAlignHorizontally = true;
      }
      this.resizeCanvasToContainerElement();
      Game.initialized = true;
      this.state.start('Preloader');
    },

    handleResizeEvent: function() {
      this.resizeCanvasToContainerElement();
    }
  }

});