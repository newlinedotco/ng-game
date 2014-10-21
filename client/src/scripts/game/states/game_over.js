module.exports = (function(Game) {

  Game.States.GameOver = function(game) {

  };

  Game.States.GameOver.prototype.create = function() {
    if (Game.multiplayer) {
      // Gameover panel
      this.gameoverPanel = new Game.Prefabs.GameoverPanel(this.game);
      this.game.add.existing(this.gameoverPanel);

      this.gameoverPanel.show(Game.score);
    }
  };
});