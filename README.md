# grunt-mootools-packager

> Grunt task for MooTools Packager projects.

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-mootools-packager --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-mootools-packager');
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

#### options.separator
Type: `String`
Default value: `grunt.util.linefeed`

The delimeter to join all the source files together.

#### options.callback
Type: `Function`

The function to be called when compilation is finished. The compiled buffer will be passed as first argument in the callback function.

#### options.noOutput
Type: `Boolean`

If `true` no files will be written. Defaults to false.

#### options.name
Type: `String` or `Object`

The package name. TODO: Use package.json.

The name of the package, or, if there are multiple packages being built, an
object with the names and paths to their source files.

```js
grunt.initConfig({
  packager: {
    options: {
      name: {
        Core: 'js/mootools-core',
        More: 'js/mootools-more'
      }
    },
    all: {
      'dest/mootools.js': 'Source/**.js',
    },
  },
});
```


#### options.ignoreYAMLheader
Type: `Booelan`
Default value: `false`

Ignores the YAML headers for dependency loading.

#### options.only
Type: `String` or `Array`

The specific components or packages to compile (with their dependencies).

NOTE: You can specify the `.only` value in the `.options` and it will apply to all
configurations globally, but you can also specify an `.only` value for each configuration.
This allows you to build numerous libraries with specific requirements.

```js
grunt.initConfig({
  packager: {
    options: {
      name: {
        Core: 'js/mootools-core',
        More: 'js/mootools-more'
      }
    },
    // all of both libraries
    all: {
      src: [
        'js/mootools-core/Source/**/*.js',
        'js/mootools-more/Source/**/*.js'
      ],
      dest: 'mootools.js'
    },
    // the Form.Validator component and its requirements
    formValidator: {
      src: [
        'js/mootools-core/Source/**/*.js',
        'js/mootools-more/Source/**/*.js'
      ],
      only: [
        'More/Form.Validator'
      ]
      dest: 'form.validator.js'
    },
    // all of the More package and its requirements
    allOfMore: {
      src: [
        'js/mootools-core/Source/**/*.js',
        'js/mootools-more/Source/**/*.js'
      ],
      only: [
        'More/*'
      ]
      dest: 'more.js'
    }
  },
});
```

### Other Usage Examples

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
