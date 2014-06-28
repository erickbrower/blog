module.exports = function(grunt) {
    grunt.initConfig({
        jshint: grunt.file.readJSON('./jshint.json'),
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['./spec/**/*_test.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint', 'mochaTest']);
    grunt.registerTask('test', ['mochaTest']);
};
