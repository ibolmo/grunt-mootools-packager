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
	var PACKAGE_DOT_STAR = /(.*)\/\*$/;

	// ensures the definition has a name and a provision
	function validDefinition(definition) {
		return 'name' in definition && 'provides' in definition;
	}

	// returns primary key of a definition
	function getPrimaryKey(definition){
		return definition.package + '/' + definition.name;
	}

	// provides keys to the source file based on the name and the components provided
	function getKeys(definition){
		return definition.provides.map(function(component){
			return definition.package + '/' + component;
		}).concat(getPrimaryKey(definition));
	}

	// matches project name with component's path
	function getProjectName(componentPath, optionsName){
		if (typeof optionsName == 'string') return optionsName;
		var projectName;
		for (var prj in optionsName){
			if(~componentPath.indexOf(optionsName[prj])) projectName = prj;
		}
		if (!projectName) grunt.fail.warn('Missing name in options for component with path: ' + componentPath);
		return projectName;
	}

	// wraps item in an array if it isn't one
	function toArray(object){
		if (!object) return [];
		if (object.charAt) return [object];
		return grunt.util.toArray(object);
	}

	// verifies that an item is in the registry of components
	function checkRegistry(registry, key, path){
		if (registry[key] == undefined){
			throw new Error('Dependency not found: ' + key + ' in ' + path);
		}
	}

	// fixes requires keys to use package/key; allows for dependencies that
	// use the `/Key` or just `Key` convention to refer to a component within
	// the same package
	function fixDependencyKey(key, packageName){
		// support `requires: /SomethingInThisPackage`
		if (key.indexOf('/') == 0) key = packageName + key;
		// support `requires: SomethingInThisPackage`
		if (key.indexOf('/') == -1) key = packageName + '/' + key;
		return key;
	}

	grunt.registerMultiTask('packager', 'Grunt task for MooTools Packager projects.', function() {

		var registry = {}, buffer = [], included = {}, set = [], packages = {};

		var options = this.options({
			only: false,
			strip: [],
			separator: grunt.util.linefeed,
			ignoreYAMLheader: false
		});


		function resolveDeps(definition){
			definition.key = fixDependencyKey(definition.key);
			if (included[definition.key]) return;
			grunt.verbose.writeln('|-', definition.key);
			included[definition.key] = true;

			if (!options.ignoreYAMLheader){
				definition.requires.forEach(function(key){
					key = fixDependencyKey(key, definition.package);
					checkRegistry(registry, key, definition.filepath);
					resolveDeps(registry[key]);
				});
			}
			buffer.push(definition);
		}

		// loads a component and its dependencies
		// if the key given is a package and a wildcard, loads all of them
		// e.g. `Package/Component` OR `Package/*`
		var loadComponent = function(key){
			var wildCardMatch = key.match(PACKAGE_DOT_STAR);
			if (wildCardMatch){
				packages[wildCardMatch[1]].forEach(loadComponent);
			} else {
				if (key in registry) resolveDeps(registry[key]);
				else throw new Error('Missing key: ' + key);
			}
		}

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
				definition.filepath = filepath;
				definition.package = getProjectName(filepath, options.name);
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

			set.forEach(function(key){
				var definition = registry[key];
				if (!packages[definition.package]) packages[definition.package] = []
				packages[definition.package].push(key);
			});

			if (grunt.option('verbose')){
				grunt.log.verbose.writeln('Loaded packages:')
				for (var p in packages){
					grunt.log.verbose.writeln('Package: ', p);
					grunt.log.verbose.writeln(' ', packages[p])
				}
			}
			// support global options.only as well as .only per build
			var only = options.only || f.only;
			// same deal with exclude option
			var exclude = options.exclude || f.exclude;

			grunt.log.verbose.writeln('compiling', f.dest, 'with dependencies:', only || 'all');

			// load each component into the buffer list
			(only ? toArray(only) : set).forEach(loadComponent);

			// remove unwanted dependencies
			if (exclude){
				var toExclude = toArray(exclude);
				buffer = buffer.filter(function(def){
					var shouldKeep = toExclude.filter(function(dependency){
						var match = dependency.match(/([^\*]+)/);
						return match ? def.key.indexOf(match[1]) != 0 : true;
					});
					return shouldKeep.length;
				});
			}

			// convert the buffer into the actual source
			buffer = buffer.map(function(def){ return def.source; }).join(options.separator);

			// strip blocks
			toArray(options.strip).forEach(function(block){
				buffer = buffer
					.replace(RegExp(SL_STRIP_EXP.join(block), 'gm'), '')
					.replace(RegExp(ML_STRIP_EXP.join(block), 'gm'), '');
			});

			grunt.log.verbose.ok('successfully compiled', f.dest, 'with dependencies:', only || 'all');

			if (options.noOutput) return;
			grunt.file.write(f.dest, buffer);
		});

		var cb = options.callback;
		if (cb) cb(buffer);
	});

};
