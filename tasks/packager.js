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
	var SL_STRIP_EXP = ['\\/[\\/*]\\s*<', '>(.*?)<\\/', '>(?:\\s*\\*\\/)?'];
	var ML_STRIP_EXP = ['\\/[\\/*]\\s*<', '>([.\\s\\S]*?)<\\/', '>(?:\\s*\\*\\/)?'];

	function validDefinition(object) {
		return 'name' in object && 'provides' in object;
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
			if (included[definition.key]) return;
			included[definition.key] = true;

			if (!options.ignoreYAMLheader){
				definition.requires.forEach(function(key){
					resolveDeps(registry[key]);
				});
			}
			buffer.push(definition);
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

				if (typeof options.name != 'string'){

					var projectName; 
					for (var prj in options.name) {

						if(~filepath.indexOf(options.name[prj])) projectName = prj;
					}
					if (!projectName) projectName = Object.keys(options.name)[0];
				}			

				var source = grunt.file.read(filepath);
				var definition = YAML.load(source.match(DESC_REGEXP)[1] || '');

				if (!definition || !validDefinition(definition)) return grunt.log.error('invalid definition: ' + filepath);

				definition.package = projectName || options.name;
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

			(options.only ? toArray(options.only) : set).forEach(function(key){
				if (!(key in registry)) throw new Error('Missing key: ' + key);
				resolveDeps(registry[key]);
			});


			buffer = buffer.map(function(def){ return def.source; }).join(options.separator);

			// strip blocks
			toArray(options.strip).forEach(function(block){
				buffer = buffer
					.replace(RegExp(SL_STRIP_EXP.join(block), 'gm'), '')
					.replace(RegExp(ML_STRIP_EXP.join(block), 'gm'), '');
			});

			grunt.file.write(f.dest, buffer);
		});

	});

};
