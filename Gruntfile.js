/*
 * grunt-packager
 * https://github.com/ibolmo/grunt-packager
 *
 * Copyright (c) 2014 Olmo Maldonado
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    clean: {
      tests: ['tmp'],
    },

    packager: {
      default_options: {
        options: {
          name: 'Test'
        },
        files: {
          'tmp/all.js': 'test/fixtures/*.js',
        },
      },
      nocompat_options: {
        options: {
          name: 'Test',
          strip: ['.*compat']
        },
        files: {
          'tmp/nocompat.js': 'test/fixtures/*.js',
        },
      },
    },

    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('test', ['clean', 'packager', 'nodeunit']);

  grunt.registerTask('default', ['test']);
};
