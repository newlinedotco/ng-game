
angular.module('app', [
  'ui.router',
  require('./menu').name,
  require('./game').name,
  require('./user').name,
  require('./navbar').name,
  require('./overlay').name,
  require('./network').name,
])
.config(function($urlRouterProvider) {
  $urlRouterProvider
    .otherwise('/menu');
})
