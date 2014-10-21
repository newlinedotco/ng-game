module.exports = (function(Game) {

  require('./player')(Game);
  require('./gameover_panel')(Game);
  require('./pause_panel')(Game);

  require('./enemies')(Game);
  require('./enemy')(Game);

  require('./laser')(Game);
  require('./bullet')(Game);
});