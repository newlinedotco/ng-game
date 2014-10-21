casper.test.begin('devstack template is working', function(test) {
  casper.start('dist/index.html', function() {
    test.assertExists('h1');
  }).run(function() {
    test.done();
  });
});
