# grunt-maven-deploy

> Grunt Maven Deploy

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-maven-deploy --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-maven-deploy');
```

## The "maven_deploy" task

The project is heavily based off of [grunt-maven-tasks](https://github.com/smh/grunt-maven-tasks) by Stein Martin Hustad.  This plugin is a slimmed down version whose sole purpose is to publish artifacts to an artifact repository with classifiers.  All versioning and releasing should be managed by the user. 

### Overview
In your project's Gruntfile, add a section named `maven_deploy` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  options: {
    groupId: 'com.github.mrkelly',
    artifactId: 'grunt-maven-deploy',        
  },
  src: {
    options: {
      url: '<%= repositoryURL %>',
      repositoryId: 'my-nexus',
      classifier: 'sources'
    },
    files: [{src: ['**'], dest: ''}]
  },
});
```

### Options

#### options.groupId
Type: `String`
Required

The maven group id to use when deploying and artifact

#### options.artifactId
Type: `String`
Default: name found in package.json

The maven artifact id to use when deploying and artifact

#### options.packaging
Type: `String`
Default: `zip`

The artifact packaging. Supported values are `jar`, `war`, `gzip`, `deflate`, `deflateRaw`, `tar`, `tgz` (tar gzip), and `zip`.

If `options.type` is defined, that parameter is used instead.

#### options.type *(deprecated)*
Type: `String`
Optional

This parameter overrides the `options.packaging` parameter.

#### options.classifier
Type: `String`
Optional

The artifact classifier.

#### options.version
Type: `String`
Default: version found in package.json

The version to use when deploying to the maven repository

#### options.snapshot
Type: `Boolean`
Default: `false`

If true, `-SNAPSHOT` is appended to the version.

#### options.file
Type: `String` | `Function`
Default: *artifactId-version.packaging*
Example: fizzwidget-1.0.0.war

The output file.  You can use either a string or a callback function which takes an `options` parameter.  The `options` parameter includes all the options for this target's configuration.  

Note that `options.version` will have `-SNAPSHOT` appended at the time the file function is invoked when options.snapshot is `true`.

Example)

```javascript
function(options) {
  // customize output directory name and filename
  return 'target/' + options.artifactId + '-' + options.version + '.' + options.packaging;
}
```

#### options.goal
Type: `String`
Default: `deploy`

The action used to deploy the artifact. Supported values are `deploy` or `install`.

#### options.url
Type: `String`
Required when `options.goal` is `deploy` (the default). Ignored otherwise.

The url for the maven repository to deploy to.

#### options.repositoryId
Type: `String`
Optional. Ignored if `options.goal` is not `deploy`.

The repository id of the repository to deploy to. Used for looking up authentication in settings.xml.

### options.injectDestFolder
Type: `String`
Optional

Enables you to turn off the injection of destination folder inside your artifact allowing you to choose the structure you want by configuring the compress task.

### Files

Files may be specified using any of the supported [Grunt file mapping formats](http://gruntjs.com/configuring-tasks#files).

### Usage Examples

Deploying snapshots for source and dist as well as releases for source and dist.

```js
grunt.initConfig({
  maven_deploy: {
    options: {
      groupId: 'com.github.mrkelly',
      artifactId: 'grunt-maven-deploy',        
    },
    'release-src': {
      options: {
        url: '<%= releaseRepository %>',
        repositoryId: 'my-nexus',
        classifier: 'sources'
      },
      files: [{src: ['**'], dest: ''}]
    },
    'release-dist': {
      options: {
        url: '<%= releaseRepository %>',
        repositoryId: 'my-nexus',
      },
      files: [{expand: true, cwd: 'tasks/', src: ['**'], dest: ''}]
    },
    'deploy-src': {
      options: {
        url: '<%= snapshotRepository %>',
        repositoryId: 'my-nexus',
        classifier: 'sources'
      },
      files: [{src: ['**'], dest: ''}]
    },
    'deploy-dist': {
      options: {
        url: '<%= snapshotRepository %>',
        repositoryId: 'my-nexus',
      },
      files: [{expand: true, cwd: 'tasks/', src: ['**'], dest: ''}]
    },
  },
});
```
