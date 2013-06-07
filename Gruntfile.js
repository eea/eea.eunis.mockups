/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    meta: {
      version: '0.1.0'
    },
    banner: '',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['species/head.html',
              'species/header.html', 
              'species/body.html', 
              'species/footer.html'
             ],
        dest: 'species/dist/index.html'
      },
      homepage: {
        src: ['species/head.html',
              'species/header.html',
              'species/body-homepage.html',
              'species/footer.html'
             ],
        dest: 'species/dist/homepage.html'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['species/**/*.js']
      }
    },
    watch: {
      concat: {
        files: ['species/*.html'],
        tasks: ['concat']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['concat']);

};

