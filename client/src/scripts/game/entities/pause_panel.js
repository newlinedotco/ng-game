module.exports = (function(Game) {

  Game.Prefabs.PausePanel = function(game, parent){
    // Super call to Phaser.Group
    Phaser.Group.call(this, game, parent);

    // Add panel
    this.panel = this.game.add.sprite(0, 0, 'panel');
    this.panel.width = 480;
    this.panel.height = 80;
    this.add(this.panel);

    // Pause text
    this.textPause = this.game.add.bitmapText(game.width/2, -42, 'kenpixelblocks', 'Pause', 28);
    this.textPause.position.x = this.game.width/2 - this.textPause.textWidth/2;
    this.add(this.textPause);

    // Group pos
    this.y = -80;
    this.x = 0;
    this.alpha = 0;

    // Play button
    this.btnPlay = this.game.add.button(this.game.width/2-32, 15, 'btn', this.unPause, this, 3, 2, 3, 2);
    this.btnPlay.anchor.setTo(0.5, 0);
    this.add(this.btnPlay);

    // Btn Menu
    this.btnMenu = this.game.add.button(this.game.width/2+28, 15, 'btn', function(){
      this.game.state.getCurrentState().goToMenu();
    }, this, 5, 4, 5, 4);
    this.btnMenu.anchor.setTo(0.5, 0);
    this.add(this.btnMenu);
  };

  Game.Prefabs.PausePanel.prototype = Object.create(Phaser.Group.prototype);
  Game.Prefabs.PausePanel.constructor = Game.Prefabs.PausePanel;

  Game.Prefabs.PausePanel.prototype.show = function(){
    this.game.add.tween(this).to({alpha:1, y:this.game.height/2 - this.panel.height/2}, 1000, Phaser.Easing.Exponential.Out, true, 0);
  };

  Game.Prefabs.PausePanel.prototype.unPause = function(){
    this.game.add.tween(this).to({alpha:0, y:-80}, 1000, Phaser.Easing.Exponential.Out, true, 0);
    this.game.state.getCurrentState().playGame();
  };

});