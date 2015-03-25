module.exports = function(grunt) {
  grunt.initConfig({
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
            flatten: true,
            src: ['./src/css/**'],
            dest: 'built/css/',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: './src/',
            src: ['index.html','cache.manifest'],
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

  grunt.registerTask('build', ['requirejs:compile', 'copy:built']);
  grunt.registerTask('deploy', ['surge:dominiweb']);
  grunt.registerTask('BAD', ['build', 'deploy']);
};
