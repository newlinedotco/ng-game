// For all available options, see node_modules/pho-devstack/config.js
// These are development build settings, see gulpfile-production.js for production settings

var gulp = require('gulp');
var extend = require('node.extend');
var substituteConfig = require('./substitute-config');

var pho = require('pho-devstack')(gulp, {
  imagemin: {
    enabled: false
  },
  substituter: extend(true, substituteConfig, {
    // cdn: '/', // uncomment if you are using absolute paths
    livereload: function() {
      return "<script>document.write('<script src=\"http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1\"></' + 'script>')</script>";
    }
  }),
  browserify: {
    debug: true,
    transforms: {
      "browserify-ngmin": false,
      uglifyify: false,
    }
  },
  copy: [
    'images/**/*', 
    'humans.txt', 
    'fonts/**/*',
    'assets/**/*',
    'bower_components/**/*.{js,map,css}'
    ]
});

// If needed, redefine tasks here

