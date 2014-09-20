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
        }
      },
      nocompat_options: {
        options: {
          name: 'Test',
          strip: ['.*compat']
        },
        files: {
          'tmp/nocompat.js': 'test/fixtures/*.js',
        }
      },
      multipackage: {
        options: {
          name: {
            ProjectB: 'test/fixtures/Project_B',
            ProjectA: 'test/fixtures/Project_A'
          }
        },
        src: ['test/fixtures/Project_A/*.js', 'test/fixtures/Project_B/*.js'],
        dest: 'tmp/multipackage.js'
      },
      multipackage_partial_simple: {
        options: {
          only: ['ProjectA/ProjectA.Secondary'],
          name: {
            ProjectB: 'test/fixtures/Project_B',
            ProjectA: 'test/fixtures/Project_A'
          }
        },
        src: ['test/fixtures/Project_A/*.js', 'test/fixtures/Project_B/*.js'],
        dest: 'tmp/multipackage_partial_simple.js'
      },
      multipackage_partial_widcard: {
        options: {
          only: 'ProjectB/*',
          name: {
            ProjectB: 'test/fixtures/Project_B',
            ProjectA: 'test/fixtures/Project_A'
          }
        },
        src: ['test/fixtures/Project_A/*.js', 'test/fixtures/Project_B/*.js'],
        dest: 'tmp/multipackage_partial_widcard.js'
      },
      callback: {
        options: {
          name: 'Test',
		  callback: function(data){ grunt.file.write('tmp/callbackOutput.js', data);}
        },
        files: {
          'tmp/all.js': 'test/fixtures/*.js',
        }
      },
      noOutput: {
        options: {
          name: 'Test',
		  noOutput: true
        },
        files: {
          'tmp/noOutput.js': 'test/fixtures/*.js',
        }
      },
    },

    nodeunit: {
      tests: ['test/*_test.js'],
    }

  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('test', ['clean', 'packager', 'nodeunit']);

  grunt.registerTask('default', ['test']);
};
