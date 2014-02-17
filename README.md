# grunt-packager

> Grunt task for MooTools Packager projects.

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-packager --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-packager');
```

## The "packager" task

### Overview
In your project's Gruntfile, add a section named `packager` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  packager: {
    options: {
      name: 'Core' // Package name. (todo: use package.json)
    },
    your_target: {
      // Target-specific file lists and/or options go here.
      'mootools-all.js': 'Source/**.js'
    },
  },
});
```

### Options

#### options.strip
Type: `String` or `Array<String|RegExp>`
Default value: `false`

A single, or multiple, strings or regexp to remove from the combined code.

#### options.name
Type: `String`

The package name. TODO: Use package.json.

### Usage Examples

#### Default Options
```js
grunt.initConfig({
  packager: {
    options: {
      name: 'Core'
    },
    all: {
      'dest/mootools.js': 'Source/**.js',
    },
  },
});
```

#### Strip Options
```js
grunt.initConfig({
  packager: {
    options: {
      name: 'Core',
      strip: '.*compat'
    },
    all: {
      'dest/mootools.js': 'Source/**.js',
    },
  },
});
```
