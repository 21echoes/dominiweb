module.exports = function(grunt) {
  var rework_vars = require('rework-vars')();
  var rework_colors = require('rework-plugin-colors')();

  grunt.initConfig({
    autoprefixer: {
      options: {
        browsers: ['> 5%']
      },
      dist: {
        files: {
          'src/css/index-prefixed.css': 'src/css/index.css'
        }
      }
    },
    rework: {
      compile: {
        files: {
          'built/css/index.css': 'src/css/index-prefixed.css'
        },
        options: {
          toString: {compress: true},
          use: [
            rework_vars,
            rework_colors
          ]
        }
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: "./src/js",
          name: "index",
          out: "./built/js/index.js",
          paths: {
            jquery: "lib/jquery",
            underscore: "lib/underscore",
            backbone: "lib/backbone",
            Handlebars: "lib/handlebars",
            text: "lib/text",
            hbars: "lib/hbars",
            fastclick: "lib/fastclick",
          },
          stubModules: ['text', 'hbars']
        }
      }
    },
    copy: {
      built: {
        files: [
          {
            expand: true,
            cwd: './src/',
            src: ['index.html','apple-touch-icon.png','cache.manifest','version.json'],
            dest: 'built/',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: './src/js/lib/',
            src: ['require.min.js'],
            dest: 'built/js/lib/',
            filter: 'isFile'
          }
        ]
      }
    },
    surge: {
      dominiweb: {
        options: {
          project: 'built/',
          domain: 'dominiweb.surge.sh'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-surge');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-rework');

  grunt.registerTask('build', ['autoprefixer:dist','rework:compile', 'requirejs:compile', 'copy:built']);
  grunt.registerTask('deploy', ['surge:dominiweb']);
  grunt.registerTask('BAD', ['build', 'deploy']);
};
