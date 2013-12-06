/*
 * grunt-maven-deploy
 * https://github.com/mrkelly/grunt-maven-deploy
 *
 * Copyright (c) 2013 Michael Kelly
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Configuration to be run (and then tested).
    maven_deploy: {
      options: {
        url: 'http://localhost/nexus',
          repositoryId: 'local-nexus',     
      },
      src: {
        options: {
          classifier: 'sources'
        },
        files: [{src: ['**'], dest: ''}]
      },
      dist: {
        options: {
          url: 'http://localhost/nexus',
          repositoryId: 'local-nexus',
        },
        files: [{expand: true, cwd: 'tasks/', src: ['**'], dest: ''}]
      },
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint']);

  //Release
  grunt.registerTask('release', ['jshint']);

};
