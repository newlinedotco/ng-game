module.exports = (function(Game) {

  Game.Prefabs.GameoverPanel = function(game, parent){
    // Super call to Phaser.Group
    Phaser.Group.call(this, game, parent);

    // Add panel
    this.panel = this.game.add.sprite(0, 0, 'panel');
    this.panel.width = this.game.width/2;
    this.panel.height = 150;
    this.add(this.panel);

    // Pause text
    var headerText = Game.winner ? "You won!" : "You lost :(";

    this.textPause = this.game.add
      .bitmapText(game.width/2, -50, 'architectsDaughter', headerText, 28);
    this.textPause.position.x = 
      this.game.width/2 - this.textPause.textWidth/2;
    this.add(this.textPause);

    // Score text
    this.textScore = this.game.add
      .bitmapText(game.width/2, 80, 'architectsDaughter', 'Score : 0', 22);
    this.textScore.position.x = this.game.width/2 - this.textScore.textWidth/2;
    this.add(this.textScore);

    // Highscore text
    this.textHighScore = this.game.add
      .bitmapText(game.width/2, 105, 'architectsDaughter', 'High Score : 0', 22);
    this.textHighScore.position.x = this.game.width/2 - this.textHighScore.textWidth/2;
    this.add(this.textHighScore);

    // Group pos
    this.y = -80;
    this.x = 0;
    this.alpha = 0;

    // Play button
    this.btnReplay = this.game.add.button(this.game.width/2-32, 15, 'btn', this.replay, this, 3, 2, 3, 2);
    this.btnReplay.anchor.setTo(0.5, 0);
    this.add(this.btnReplay);

    // Btn Menu
    this.btnMenu = this.game.add.button(this.game.width/2+28, 15, 'btn', function(){
      this.game.state.getCurrentState().goToMenu();
    }, this, 5, 4, 5, 4);
    this.btnMenu.anchor.setTo(0.5, 0);
    this.add(this.btnMenu);
  };

  Game.Prefabs.GameoverPanel.prototype = Object.create(Phaser.Group.prototype);
  Game.Prefabs.GameoverPanel.constructor = Game.Prefabs.GameoverPanel;

  Game.Prefabs.GameoverPanel.prototype.show = function(score){
    score = score || 0;

    var highScore;
    var beated = false;

    console.log('winner', Game.winner);
    localStorage.setItem('highScore', 0);

    if(!!localStorage){
      highScore = parseInt(localStorage.getItem('highScore'), 10);

      if(!highScore || highScore < score){
        highScore = score;
        localStorage.setItem('highScore', highScore.toString());

        // Add new sprite if best score beated
        if(score > 0){
          beated = true;
          this.newScore = this.game.add.sprite(0, 120, 'new');
          this.newScore.anchor.setTo(0.5, 0.5);
          this.add(this.newScore);
        }
      }
    } else {
      highScore = 0;
    }

    this.textHighScore.setText('High Score: ' + highScore.toString());

    // Center text
    var scoreText = 'Score: ' + score.toString();
    this.textScore.setText(scoreText);

    this.textScore.update();
    this.textScore.position.x = this.game.width/2 - this.textScore.textWidth/2;

    this.textHighScore.update();
    this.textHighScore.position.x = this.game.width/2 - this.textHighScore.textWidth/2;

    this.panel.position.x = this.game.width/2  - this.panel.width/2;

    if(beated){
      this.newScore.x = this.textHighScore.position.x - 30;
    }

    // Show panel
    this.game.add.tween(this)
      .to({
          alpha:1, 
          y:this.game.height/2 - this.panel.height/2}, 
        1000, 
        Phaser.Easing.Exponential.Out, true, 0);
  };

  Game.Prefabs.GameoverPanel.prototype.replay = function(){
    // Start
    Game.reset();
    Game.multiplayer = true; // Hardcoded for demo
    this.game.state.start('Play');
  };
});