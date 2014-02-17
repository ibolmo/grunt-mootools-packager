/*
 * grunt-packager
 * https://github.com/ibolmo/grunt-packager
 *
 * Copyright (c) 2014 Olmo Maldonado
 * Licensed under the MIT license.
 */

'use strict';

var YAML = require('js-yaml');

module.exports = function(grunt) {

  var DESC_REGEXP = /\/\*\s*^---([.\s\S]*)^(?:\.\.\.|---)\s*\*\//m;
  var STRIP_EXP = ['\\/[\\/*]\s*<', '>([.\\s\\S]*?)<\\/', '>(?:\\s*\\*\\/)?'];

  function validDefinition(object) {
    return !!object.name && !!(object.requires || object.provides);
  }

  function getPrimaryKey(definition){
    return definition.package + '/' + definition.name;
  }

  // provides keys to the source file based on the name and the components provided
  function getKeys(definition){
    return definition.provides.map(function(component){
      return definition.package + '/' + component;
    }).concat(getPrimaryKey(definition));
  }

  function toArray(object){
    if (!object) return [];
    if (object.charAt) return [object];
    return grunt.util.toArray(object);
  }

  grunt.registerMultiTask('packager', 'Grunt task for MooTools Packager projects.', function() {

    var registry = {}, buffer = [], included = {}, set = [];

    function resolveDeps(definition){
      definition.requires.forEach(function(key){
        resolveDeps(registry[key]);
      });
      if (included[definition.key]) return;
      buffer.push(definition);
      included[definition.key] = true;
    }

    var options = this.options({
      only: false,
      strip: [],
      separator: grunt.util.linefeed
    });

    this.files.forEach(function(f){
      // expand and filter by existence
      var files = grunt.file.expand({nonull: true}, f.src).filter(function(filepath){
        return grunt.file.exists(filepath) || grunt.log.warn('empty or invalid: ' + filepath);
      });

      // read files and populate registry map
      files.forEach(function(filepath){

        var source = grunt.file.read(filepath);
        var definition = YAML.load(source.match(DESC_REGEXP)[1] || '');

        if (!definition || !validDefinition(definition)) return grunt.log.error('invalid definition: ' + filepath);

        definition.package = options.name;
        definition.source = source;
        definition.key = getPrimaryKey(definition);
        definition.provides = toArray(definition.provides);
        // assume requires are relative to the package, if no package provided
        definition.requires = toArray(definition.requires).map(function(component){
          return ~component.indexOf('/') ? component : (definition.package + '/' + component);
        });

        // track all files collected, used to check that all sources were included
        set.push(definition.key);

        getKeys(definition).forEach(function(key){
          if (key in registry && key != definition.key){
            return grunt.log.warn('key: ' + key + ', has repeated definition: ' + filepath);
          }
          registry[key] = definition;
        });

      });

      if (!options.only){
        // include all sources
        for (var key in registry) if (key in registry) resolveDeps(registry[key]);
        if (set.length != buffer.length) return grunt.log.error('Could not include all sources.');
      } else {
        toArray(options.only).forEach(resolveDeps);
      }

      buffer = buffer.map(function(def){ return def.source; }).join(options.separator);

      // strip blocks
      toArray(options.strip).forEach(function(block){
        var regexp = RegExp(STRIP_EXP.join(block), 'gm');
        buffer = buffer.replace(regexp, '');
      });

      grunt.file.write(f.dest, buffer);
    });

  });

};
