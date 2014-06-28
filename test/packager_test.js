'use strict';

var grunt = require('grunt');

exports.packager = {

  // simple compat build, one project
  default_options: function(test){ 
    test.expect(1);

    var actual = grunt.file.read('tmp/all.js');
    var expected = grunt.file.read('test/expected/all.js');
    test.equal(actual, expected, 'should be exact for all build.');

    test.done();
  },
  // simple no-compat build, one project
  nocompat_options: function(test){
    test.expect(1);

    var actual = grunt.file.read('tmp/nocompat.js');
    var expected = grunt.file.read('test/expected/nocompat.js');
    test.equal(actual, expected, 'should be exact for nocompat build.');

    test.done();
  },
  // multi project build with dependency defined with `package/*`
  multipackage: function(test){
    test.expect(1);

    var actual = grunt.file.read('tmp/multipackage.js');
    var expected = grunt.file.read('test/expected/multipackage.js');
    test.equal(actual, expected, 'should be exact for multipackage build.');

    test.done();
  },
  // multi project build with simple option `only: 'package'`
  multipackage_partial_simple: function(test){
    test.expect(1);

    var actual = grunt.file.read('tmp/multipackage_partial_simple.js');
    var expected = grunt.file.read('test/expected/multipackage_partial_simple.js');
    test.equal(actual, expected, 'should be exact for multipackage build with specified "only".');

    test.done();
  },
  // multi project build with wildcard option `only: 'package/*'`
  multipackage_partial_widcard: function(test){
    test.expect(1);

    var actual = grunt.file.read('tmp/multipackage_partial_widcard.js');
    var expected = grunt.file.read('test/expected/multipackage_partial_widcard.js');
    test.equal(actual, expected, 'should be exact for multipackage build with specified "only".');

    test.done();
  }
};
