angular.module('app.user')
.service('User', function() {

  var currentUser =
    localStorage.getItem('currentUser');

  if (currentUser) {
    currentUser = JSON.parse(currentUser);
  };

  this.setCurrentUser = function(u) {
    localStorage.setItem('currentUser', JSON.stringify(u));
    currentUser = u;
  };

  this.getCurrentUser = function() {
    return currentUser;
  };

  this.modifyCurrentUser = function(opts) {
    var u = this.getCurrentUser();

    if (u) {
      for (var opt in opts) {
        u[opt] = opts[opt];
      }
      this.setCurrentUser(u);
    } else {
      this.setCurrentUser(opts);
    }

    return currentUser;
  };

});