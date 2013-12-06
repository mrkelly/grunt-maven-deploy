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

#### options.version
Type: `String`
Default: version found in package.json

The version to use when deploying to the maven repository

#### options.url
Type: `String`
Required

The url for the maven repository to deploy to.

#### options.repositoryId
Type: `String`
Optional

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
