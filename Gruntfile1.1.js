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
					'bower_components/openui5-sap.ui.core/resources',
					'bower_components/openui5-sap.m/resources',
					'bower_components/openui5-themelib_sap_belize/resources'
				],
				testresources: [
					'bower_components/openui5-sap.ui.core/test-resources',
					'bower_components/openui5-sap.m/test-resources',
					'bower_components/openui5-themelib_sap_belize/test-resources'
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
					appresources: 'cordovaApp/www'
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
							'bower_components/openui5-sap.ui.core/resources',
							'bower_components/openui5-sap.m/resources',
							'bower_components/openui5-themelib_sap_belize/resources',
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
			dist: 'cordovaApp/www',
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
					dest: 'cordovaApp/www'
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
					path: 'https://openui5.hana.ondemand.com/resources/sap-ui-core.js'
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

		cordovacli: 
		{
			options: {
				path: 'myHybridAppFolder',
				cli: 'cordova'
			},
			cordova: {
				options: {
					command: ['create', 'platform', 'plugin', 'build'],
					platforms: ['ios', 'android'],
					plugins: ['device', 'dialogs'],
					path: 'cordovaApp/www',
					id: 'io.cordova.hellocordova',
					name: 'HelloCordova'
				}
			},
			create: {
				options: {
					command: 'create',
					id: 'com.myHybridApp',
					name: 'myHybridApp'
				}
			},
			add_platforms: {
				options: {
					command: 'platform',
					action: 'add',
					platforms: ['ios', 'android']
				}
			},
			add_plugins: {
				options: {
					command: 'plugin',
					action: 'add',
					plugins: [
						'battery-status',
						'camera',
						'console',
						'contacts',
						'device',
						'device-motion',
						'device-orientation',
						'dialogs',
						'file',
						'geolocation',
						'globalization',
						'inappbrowser',
						'media',
						'media-capture',
						'network-information',
						'splashscreen',
						'vibration'
					]
				}
			},
			remove_plugin: {
				options: {
					command: 'plugin',
					action: 'rm',
					plugins: [
						'battery-status'
					]
				}
			},
			build_ios: {
				options: {
					command: 'build',
					platforms: ['ios']
				}
			},
			build_android: {
				options: {
					command: 'build',
					platforms: ['android']
				}
			},
			emulate_android: {
				options: {
					command: 'emulate',
					platforms: ['android'],
					args: ['--target', 'Nexus5']
				}
			},
			add_facebook_plugin: {
				options: {
					command: 'plugin',
					action: 'add',
					plugins: [
						'com.phonegap.plugins.facebookconnect'
					],
					args: ['--variable', 'APP_ID=fb12132424', '--variable', 'APP_NAME=myappname']
				}
			}
		}

	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-openui5');
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-cordovacli');

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
