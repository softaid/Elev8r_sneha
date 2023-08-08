/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(
	["sap/base/Log", "sap/ui/core/routing/HashChanger", "sap/ui/base/Object"],
	function (Log, HashChanger, BaseObject) {
		"use strict";
		var URL_KEY = "sap-url-hash";
		var TRANSIENT_KEY = "transient";
		var oLogger = Log.getLogger("sap.suite.ui.commons.collaboration.CollaborationHelper");

		/**
		 * CollaborationHelper for collaboration related utility
		 * @namespace
		 * @since 1.108
		 * @alias module:sap/suite/ui/commons/collaboration/CollaborationHelper
		 * @private
		 * @ui5-restricted
		 * @experimental Since 1.108
		 */
		var CollaborationHelper = BaseObject.extend(
			"sap.suite.ui.commons.collaboration.CollaborationHelper"
		);

		/**
		 * This function creates a shortened URL.
		 * @param {string} sUrl full URL
		 * @returns {string} This function returns a shortened url in the format
		 * `<protocol>/<hostname>#<semantic-object>&/sap-url-hash=<UUID>`
		 * @private
		 * @ui5-restricted sap.suite.suite-ui-commons
		 * @experimental since 1.108
		 */
		CollaborationHelper.compactHash = function (sUrl) {
			var oShellContainer = sap.ushell && sap.ushell.Container;
			if (!oShellContainer) {
				//In case uShell Container is not present, minification is not needed.
				return {
					url: sUrl
				};
			}
			return oShellContainer.getServiceAsync("AppState").then(
				function (oAppStateService) {
					var oEmptyAppState = oAppStateService.createEmptyAppState(
						undefined,
						false
					);
					var sKey = this._getNextKey(oEmptyAppState);
					if (!this._isEligibleForBackendPersistency(oAppStateService)) {
						oLogger.warning("Transient flag is true. URL will not be shortened");
						return {
							url: sUrl
						};
					}
					var sUrlBeforeHash = this._extractURLBeforeHash(sUrl);
					var sSemanticObjectAndAction = this._extractSemanticObjectAndAction(sUrl);
					if (!sSemanticObjectAndAction) {
						// In case sSemanticObjectAndAction is undefined, let's not minify the url.
						return {
							url: sUrl
						};
					}
					return this._storeUrl(sUrl, oEmptyAppState)
						.then(function () {
							return {
								url: sUrlBeforeHash + "#" + sSemanticObjectAndAction + "&/" + URL_KEY + "=" + sKey
							};
						})
						.catch(function (error) {
							oLogger.warning("URL is not shortened due to an error." + error.toString());
							//In case if the wrapper promise is rejected then return the current url as shortened url.
							return {
								url: sUrl
							};
						});
				}.bind(this)
			);
		};

		/**
		 * function that returns a Promise that resolves to the current url
		 * @returns {Promise} promise with data as current Url
		 * @private
		 */
		CollaborationHelper._getCurrentUrl = function () {
			var oUShellContainer = sap.ushell && sap.ushell.Container;
			return oUShellContainer ? new Promise(function (fnResolve) {
				oUShellContainer.getFLPUrlAsync(true).done(function (sFLPUrl) {
					fnResolve(sFLPUrl);
				});
			}) : Promise.resolve(document.URL);
		};

		/**
		 * Method checks whether the application is running in Teams environment & if yes disables
		 * the Avatar icon on the shell, this is done in synchronously. Method returns a promise.
		 * Promise is resolved immediately if URL is not compact. In case of compact hash, then
		 * will retrieve the original/complete hash and replace it on the window & then resolve
		 * the promise.
		 * @return {Promise} return resolved promise when url redirection is done.
		 * @public
		 */
		CollaborationHelper.processAndExpandHash = function () {
			this._hideAvatarFromShellbar();
			return this._getCurrentUrl().then(function (sCurrentUrl) {
				//if the current url has url param, sap-url-hash, then we have to redirect to an actual url.
				if (sCurrentUrl.indexOf(URL_KEY) > -1) {
					var sHash = sCurrentUrl.split('#')[1].split('=')[1];
					return this._retrieveURL(sHash).then(function (oAppState) {
						window.location.replace(oAppState.getData());
						return Promise.resolve();
					});
				}
				return Promise.resolve();
			}.bind(this));
		};

		/**
		 * Hides avatar of user if app is running in the MS Teams application.
		 * @private
		 * @ui5-restricted sap.suite.suite-ui-commons
		 * @experimental since 1.108
		 */
		CollaborationHelper._hideAvatarFromShellbar = function () {
			this.isTeamsModeActive().then(function (bIsActive) {
				if (bIsActive) {
					var oAvatar = sap.ui.getCore().byId('meAreaHeaderButton');
					if (oAvatar) {
						oAvatar.setVisible(false);
					}
				}
			});
		};

		/**
		 * Determines whether application is running inside the MS Teams.
		 * In case url parameter "sap-collaboration-teams" is set to true & appState is set to lean
		 * method runs that application is running in Teams environment
		 * @returns {Promise} return resolved promise with data true in case conditions are met else false
		 * @public
		 */
		CollaborationHelper.isTeamsModeActive = function () {
			var bAppRunningInTeams = false;
			var oUshellContainer = sap.ushell && sap.ushell.Container;
			var oURLParsing = oUshellContainer && oUshellContainer.getService("URLParsing");
			return this._getCurrentUrl().then(function (sCurrentUrl) {
				var sBeforeHashURL = sCurrentUrl.split("#")[0];
				if (sBeforeHashURL.indexOf('?') !== -1) {
					var oParsedUrl = oURLParsing && oURLParsing.parseParameters(sBeforeHashURL.substring(sBeforeHashURL.indexOf('?')));
					if (oParsedUrl &&
						oParsedUrl["sap-collaboration-teams"] &&
						oParsedUrl["sap-collaboration-teams"][0] &&
						oParsedUrl["sap-collaboration-teams"][0] === "true") {
						bAppRunningInTeams = true;
					}
					var bAppStateLean = false;
					if (oParsedUrl &&
						oParsedUrl["appState"] &&
						oParsedUrl["appState"][0] &&
						oParsedUrl["appState"][0] === "lean") {
						bAppStateLean = true;
					}
					return Promise.resolve(bAppRunningInTeams && bAppStateLean);
				} else {
					return Promise.resolve(false);
				}
			});
		};

		/**
		 * This function retrieves the url stored against the hash in the K/V persistent store.
		 * @param {string} hash hash from the URL
		 * @returns {AppState} instance of AppState
		 * @private
		 */
		CollaborationHelper._retrieveURL = function (hash) {
			if (sap.ushell && sap.ushell.Container) {
				return sap.ushell.Container.getServiceAsync("AppState").then(function (oAppStateService) {
					return oAppStateService.getAppState(hash);
				});
			}
		};

		/**
		 * This function checks the transient flag in the _oConfig object.
		 * @param {AppState} appStateInstance instance of AppState
		 * @returns {boolean} true if transient flag is set to false
		 * @private
		 */
		CollaborationHelper._isEligibleForBackendPersistency = function (appStateInstance) {
			return appStateInstance && appStateInstance._oConfig && TRANSIENT_KEY in appStateInstance._oConfig && !appStateInstance._oConfig[TRANSIENT_KEY];
		};

		/**
		 * This function generates an alphanumberic UUID string.
		 * @param {AppState} oAppStateService instance of AppState
		 * @returns {string} Returns a randomly generated UUID string.
		 * @private
		 */
		CollaborationHelper._getNextKey = function (oAppStateService) {
			return oAppStateService.getKey();
		};

		/**
		 * This functions parses a url and extracts smenatic-object, action and context-raw if applicable.
		 * @param {string}  sUrl full url
		 * @returns {string} Returns a string in the format <semantic-object>-<action>~<contextRaw>.
		 * @private
		 */
		CollaborationHelper._extractSemanticObjectAndAction = function (sUrl) {
			var URLParser = sap.ushell && sap.ushell.services && new sap.ushell.services.URLParsing();
			if (URLParser) {
				var parsedShellHash = URLParser.parseShellHash(this._extractURLHash(sUrl));
				if (parsedShellHash) {
					return parsedShellHash.contextRaw ?
						parsedShellHash.semanticObject + "-" +
						parsedShellHash.action + "~" +
						parsedShellHash.contextRaw :
						parsedShellHash.semanticObject + "-" + parsedShellHash.action;
				}
			}
			return undefined;
		};

		/**
		 * Extracting URL present before the # character.
		 * @param {string} sUrl full url
		 * @returns {string} string before the # character in the URL.
		 * @private
		 */
		CollaborationHelper._extractURLBeforeHash = function (sUrl) {
			var sUrlFragementBeforeHash = sUrl.split("#")[0];
			return sUrlFragementBeforeHash;
		};

		/**
		 * Extracting hash from the URL
		 * @param {string} sUrl full url
		 * @returns {string} hash from the URL
		 * @private
		 */
		CollaborationHelper._extractURLHash = function (sUrl) {
			var sUrlHash = sUrl.substring(sUrl.indexOf('#'));
			return sUrlHash;
		};

		/**
		 * This function saves the hash and the long url in the K/V DB.
		 * @param {string} sUrl full URL
		 * @param {AppState} oAppStateService instance of AppState
		 * @returns {Promise} Promise which ultimately resolves once the value is stored successfully.
		 * @private
		 */
		CollaborationHelper._storeUrl = function (sUrl, oAppStateService) {
			oAppStateService.setData(sUrl);
			return oAppStateService.save();
		};
		return CollaborationHelper;
	}
);
