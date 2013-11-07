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
        src: ['species/raw/templates/head.html',
              'species/raw/templates/header.html', 
              'species/raw/markup/body-species.html', 
              'species/raw/templates/footer.html'
             ],
        dest: 'species/dist/markup/species.html'
      },
      homepage: {
        src: ['species/raw/templates/head.html',
              'species/raw/templates/header.html',
              'species/raw/markup/body-homepage.html',
              'species/raw/templates/footer.html'
             ],
        dest: 'species/dist/markup/homepage.html'
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
        files: ['species/raw/**/*.html'],
        tasks: ['concat']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['concat:homepage', 'concat:dist']);

};

