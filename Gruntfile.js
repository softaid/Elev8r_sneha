'use strict';

module.exports = function (grunt) {

	grunt.initConfig({

		connect: {
			options: {
				port: 9090,
				hostname: '*'
			},
			src: {},
			dist: {}
		},

		openui5_connect: {
			options: {
				resources: [
					'resources',
					'utility/xlsx.js'
				],
				testresources: [
					'test-resources'
				],
				cors: {
					origin: 'http://localhost:9090'
				}
			},
			src: {
				options: {
					appresources: 'webapp'
				}
			},
			dist: {
				options: {
					appresources: 'dist'
				}
			}
		},

		openui5_preload: {
			component: {
				options: {
					resources: {
						cwd: 'webapp',
						prefix: 'sap-app-container',
						src: [
							'resources',
							'**/*.js',
							'**/*.xml',
							'**/*.fragment.html',
							'**/*.fragment.json',
							'**/*.fragment.xml',
							'**/*.view.html',
							'**/*.view.json',
							'**/*.view.xml',
							'**/*.properties',
							'manifest.json',
							'!test/**'
						]
					},
					dest: 'dist'
				},
				components: 'sap-app-container'
			}
		},

		clean: {
			dist: 'dist',
			coverage: 'coverage'
		},

		copy: {
			dist: {
				files: [{
					expand: true,
					cwd: 'webapp',
					src: [
						'**',
						'!test/**'
					],
					dest: 'dist'
				}]
			}
		},

		eslint: {
			webapp: ['webapp']
		},

		karma: {
			options: {
				basePath: 'webapp',
				frameworks: ['qunit', 'openui5'],
				openui5: {
					path: 'resources/sap-ui-core.js'
				},
				client: {
					openui5: {
						config: {
							theme: 'sap_belize',
							language: 'EN',
							bindingSyntax: 'complex',
							compatVersion: 'edge',
							preload: 'async',
							resourceroots: { 'sap-app-container': './base' }
						},
						tests: [
							'sap-app-container/test/unit/allTests',
							'sap-app-container/test/integration/AllJourneys'
						]
					}
				},
				files: [
					{ pattern: '**', included: false, served: true, watched: true }
				],
				reporters: ['progress'],
				port: 9876,
				logLevel: 'INFO',
				browserConsoleLogOptions: {
					level: 'warn'
				},
				browsers: ['Chrome']
			},
			ci: {
				singleRun: true,
				browsers: ['PhantomJS'],
				preprocessors: {
					'{webapp,webapp/!(test)}/*.js': ['coverage']
				},
				coverageReporter: {
					includeAllSources: true,
					reporters: [
						{
							type: 'html',
							dir: '../coverage/'
						},
						{
							type: 'text'
						}
					],
					check: {
						each: {
							statements: 100,
							branches: 100,
							functions: 100,
							lines: 100
						}
					}
				},
				reporters: ['progress', 'coverage']
			},
			watch: {
				client: {
					clearContext: false,
					qunit: {
						showUI: true
					}
				}
			},
			coverage: {
				singleRun: true,
				browsers: ['PhantomJS'],
				preprocessors: {
					'{webapp,webapp/!(test)}/*.js': ['coverage']
				},
				coverageReporter: {
					includeAllSources: true,
					reporters: [
						{
							type: 'html',
							dir: '../coverage/'
						},
						{
							type: 'text'
						}
					]
				},
				reporters: ['progress', 'coverage']
			}
		},
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-openui5');
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-karma');


	// Server task
	grunt.registerTask('serve', function (target) {
		grunt.task.run('openui5_connect:' + (target || 'src') + ':keepalive');
	});

	// Linting task
	grunt.registerTask('lint', ['eslint']);

	// Test tasks
	grunt.registerTask('test', ['clean:coverage', 'openui5_connect:src', 'karma:ci']);
	grunt.registerTask('watch', ['openui5_connect:src', 'karma:watch']);
	grunt.registerTask('coverage', ['clean:coverage', 'openui5_connect:src', 'karma:coverage']);

	// Build task
	grunt.registerTask('build', ['clean:dist', 'openui5_preload', 'copy']);

	// Default task
	grunt.registerTask('default', ['serve']);
};
