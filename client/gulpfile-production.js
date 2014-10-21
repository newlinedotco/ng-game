// For all available options, see node_modules/pho-devstack/config.js
// These are production build settings, see gulpfile.js for development settings

var gulp = require('gulp');
var extend = require('node.extend');
var substituteConfig = require('./substitute-config');

var pho = require('pho-devstack')(gulp, {
  browserify: {
    debug: false,
    transforms: {
      "browserify-ngmin": true,
      uglifyify: true
    }
  },
  less: {
    sourceMap: false
  },
  livereload: {
    enabled: false
  },
  plumber: {
    enabled: false
  },
  rename: {
    enabled: true
  },
  watch: {
    enabled: false
  },
  spritesPreprocessor: {
    enabled: true,
    prefix: '../images/sprites/' // change this to prefix path before sprites. '/images/sprites/' for absolute paths
  },
  base64: {
    // baseDir: 'src', // uncomment if you are using absolute paths
    enabled: true
  },
  substituter: extend(true, substituteConfig, {
    // cdn: 'http://example.com' // url to your CDN server
    // cdn: '/', // uncomment if you are using absolute paths without CDN
  }),
  copy: ['humans.txt', 'bower_components/angular/**/*.{js,map}']
});

// If needed, redefine tasks here
