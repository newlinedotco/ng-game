require('./ioLoader');

module.exports =
angular.module('app.network', [
  'btford.socket-io',
  'app.loader'
])
.config(function(ioLoaderProvider) {
  console.log('ioLoader', ioLoaderProvider);
})

require('./ws');
require('./players');
require('./feed');