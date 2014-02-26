/*
 * Generated on 2014-02-26
 * generator-assemble v0.4.10
 * https://github.com/assemble/generator-assemble
 *
 * Copyright (c) 2014 Fabrice Weinberg
 */

'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// '<%= config.src %>/templates/pages/{,*/}*.hbs'
// use this if you want to match all subfolders:
// '<%= config.src %>/templates/pages/**/*.hbs'

module.exports = function(grunt) {

  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({

    config: {
      src: 'src',
      dist: 'dist'
    },

    watch: {
      assemble: {
        files: ['<%= config.src %>/{content,data,templates}/{,*/}*.{md,hbs,yml}'],
        tasks: ['assemble']
      },
      compass: {
        files: ['<%= config.src %>/style/{,*/}*.scss'],
        tasks: ['build']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.dist %>/{,*/}*.html',
          '<%= config.dist %>/assets/{,*/}*.css',
          '<%= config.dist %>/assets/{,*/}*.js',
          '<%= config.dist %>/assets/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '<%= config.dist %>'
          ]
        }
      }
    },

    assemble: {
      pages: {
        options: {
          flatten: true,
          assets: '<%= config.dist %>/assets',
          layout: '<%= config.src %>/templates/layouts/default.hbs',
          data: '<%= config.src %>/data/*.{json,yml}',
          partials: '<%= config.src %>/templates/partials/*.hbs'
        },
        files: {
          '<%= config.dist %>/': ['<%= config.src %>/templates/pages/*.hbs']
        }
      }
    },

    compass: {
      dist: {
        options: {
          sassDir: '<%= config.src %>/style',
          cssDir: '<%= config.dist %>/assets/css'
        }
      }
    },

    autoprefixer: {

       options: {
          browsers: ['last 1 version']
       },

       // prefix the specified file
       dist: {
         src: '<%= compass.dist.options.cssDir %>/main.css',
         dest: '<%= compass.dist.options.cssDir %>/main.prefix.css'
       }
    },

    cssmin: {
      dist:{
        files: {
          '<%= compass.dist.options.cssDir %>/main.min.css': [
            '<%= config.src %>/vendor/normalize.css/normalize.css',
            '<%= compass.dist.options.cssDir %>/main.prefix.css'
          ]
        }
      }
    },

    uglify: {
      dist: {
        files: {
          '<%= config.dist %>/assets/js/main.min.js': [
            '<%= config.src %>/vendor/jquery/dist/jquery.js',
            '<%= config.src %>/script/nodeshotbuilder.js'
          ]
        }
      }
     },
    // Before generating any new files,
    // remove any previously-created files.
    clean: ['<%= config.dist %>/**/*.{html,css,js,xml}']

  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-autoprefixer');

  grunt.registerTask('dist', [
    'clean',
    'build'
  ]);

  grunt.registerTask('build', [
    'assemble',
    'compass',
    'autoprefixer',
    'cssmin',
    'uglify'
  ]);

  grunt.registerTask('dev', [
    'dist',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('default', [
    'dev'
  ]);

};
