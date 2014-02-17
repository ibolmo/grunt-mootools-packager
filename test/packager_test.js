'use strict';

var grunt = require('grunt');

exports.packager = {
  default_options: function(test) {
    return test.done();
    test.expect(1);

    var actual = grunt.file.read('tmp/all.js');
    var expected = grunt.file.read('test/expected/all.js');
    test.equal(actual, expected, 'should be exact for all build.');

    test.done();
  },
  nocompat_options: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/nocompat.js');
    var expected = grunt.file.read('test/expected/nocompat.js');
    test.equal(actual, expected, 'should be exact for nocompat build.');

    test.done();
  },
};
