/*
 * grunt-maven-deploy
 * https://github.com/mrkelly/grunt-maven-deploy
 *
 * Licensed under the MIT license.
 */

'use strict';

function injectDestFolder(targetPath, files) {
  var path = require('path');
  files.forEach(function(file) {
    file.dest = path.join(targetPath, file.dest || '');
  });
  return files;
}

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('maven_deploy', 'Packages and deploys artifact to maven repo', function(version, mode) {
    var options = this.options();

    requireOptionProps(options, ['groupId']);

    options.goal = options.goal || this.target;

    requireOptionProps(options, ['url']);
    deploy(this);

  });

  function deploy(task) {
    var pkg = grunt.file.readJSON('package.json');
    var options = task.options({
      artifactId: pkg.name,
      version: pkg.version,
      packaging: 'zip'
    });

    guaranteeFileName(options);
    configureDestination(options, task);
    configureMaven(options, task);

    grunt.task.run('maven_deploy:package', 'maven_deploy:deploy-file');
  }

  grunt.registerTask('maven_deploy:package', function() {
    var compress = require('grunt-contrib-compress/tasks/lib/compress')(grunt);
    compress.options = grunt.config('maven.package.options');
    compress.tar(grunt.config('maven.package.files'), this.async());
  });

  grunt.registerTask('maven_deploy:deploy-file', function() {
    var options = grunt.config('maven.deploy-file.options');

    var args = [ 'deploy:deploy-file' ];
    args.push('-Dfile='         + options.file);
    args.push('-DgroupId='      + options.groupId);
    args.push('-DartifactId='   + options.artifactId);
    args.push('-Dpackaging='    + options.packaging);
    args.push('-Dversion='      + options.version);
    args.push('-Durl='          + options.url);
    if (options.repositoryId) {
      args.push('-DrepositoryId=' + options.repositoryId);
    }

    if (options.classifier) {
      args.push('-Dclassifier=' + options.classifier);
    }
    
    var done = this.async();
    var msg = 'Deploying to maven...';
    grunt.verbose.write(msg);
    grunt.log.debug('Running command "mvn ' + args.join(' ') + '"');
    var mavenCommand = grunt.util.spawn({ cmd: 'mvn', args: args }, function(err, result, code) {
      if (err) {
        grunt.verbose.or.write(msg);
        grunt.log.error().error('Failed to deploy to maven');
      } else {
        grunt.verbose.ok();
        grunt.log.writeln('Deployed ' + options.file.cyan + ' to ' + options.url.cyan);
      }
      done(err);
    });

    mavenCommand.stdout.on('data', function(buf) {
      grunt.verbose.write(String(buf));
    });
  });

  function guaranteeFileName(options) {
    if (!options.file) {
      options.file = options.artifactId + '-' + options.version + '.' + options.packaging;
    }
  }

  function configureDestination(options, task) {
    if (typeof options.injectDestFolder === 'undefined' || options.injectDestFolder === true) {
      task.files = injectDestFolder(options.artifactId + '-' + options.version, task.files);
    }
  }

  function configureMaven(options, task) {
    grunt.config.set('maven.package.options', { archive: options.file, mode: options.packaging });
    grunt.config.set('maven.package.files', task.files);
    grunt.config.set('maven.deploy-file.options', options);
    grunt.config.set('maven.install-file.options', options);
  }

  function requireOptionProps(options, props) {
    var msg = 'Verifying properties ' + grunt.log.wordlist(props) + ' exists in options...';
    grunt.verbose.write(msg);

    var failProps = props.filter(function(p) {
      return !options.hasOwnProperty(p);
    }).map(function(p) {
      return '"' + p + '"';
    });

    if (failProps.length === 0) {
      grunt.verbose.ok();
    } else {
      grunt.verbose.or.write(msg);
      grunt.log.error().error('Unable to process task.');
      throw grunt.util.error('Required options ' + failProps.join(', ') + ' missing.');
    }
  }

};
