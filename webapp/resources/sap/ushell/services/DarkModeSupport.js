// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/base/Log","sap/base/util/UriParameters","sap/ui/Device","sap/ushell/Config","sap/ushell/EventHub"],function(e,t,i,a,r){"use strict";var n="(prefers-color-scheme: dark)";function s(){this.channel=r.createChannel({mode:undefined});this.darkMediaQueryList=window.matchMedia(n);this.doables=[];this.themeChangedCallback=null;this.darkMediaQueryListListener=null}s.Mode={LIGHT:"light",DARK:"dark"};s.prototype.setup=function(){if(this.initialized){return}this.initialized=true;this.themeChangedCallback=function(){this.channel.emit("/mode",this.getCurrentThemeMode())}.bind(this);sap.ui.getCore().attachThemeChanged(this.themeChangedCallback);this.themeChangedCallback();if(this.canAutomaticallyToggleDarkMode()&&sap.ushell.Container.getUser().getDetectDarkMode()){this.enableDarkModeBasedOnSystem()}};s.prototype.destroy=function(){this.channel.emit("/mode",null);this.doables.forEach(function(e){e.off()});this.doables=[];if(this.initialized){sap.ui.getCore().detachThemeChanged(this.themeChangedCallback);this.themeChangedCallback=null;this.disableDarkModeBasedOnSystem();this.initialized=false}};s.prototype.attachModeChanged=function(e){var t=this.channel.on("/mode").do(function(t){e(t)});this.doables.push(t)};s.prototype.canAutomaticallyToggleDarkMode=function(){var e=this.darkMediaQueryList.media===n;return e&&!t.fromURL(window.location.href).has("sap-theme")};s.prototype.isThemeSupportDarkMode=function(e){e=e||this._getCurrentTheme();return!!this._findSupportedThemePair(e)};s.prototype._toggleDarkModeBasedOnSystemColorScheme=function(){var e=this._getCurrentTheme();if(this.darkMediaQueryList&&this.isThemeSupportDarkMode(e)){var t=this._findSupportedThemePair(e),i=this.darkMediaQueryList.matches;var a=i?t.dark:t.light;sap.ushell.Container.getUser().applyTheme(a)}};s.prototype._applyDefaultUserTheme=function(){var e=sap.ushell.Container.getUser();if(e.constants&&e.constants.themeFormat){e.applyTheme(e.getTheme(e.constants.themeFormat.ORIGINAL_THEME))}};s.prototype.toggleModeChange=function(){var e=this._getCurrentTheme(),t=this._findSupportedThemePair(e);if(t){var i=e===t.light?t.dark:t.light;sap.ushell.Container.getUser().applyTheme(i)}};s.prototype.enableDarkModeBasedOnSystem=function(){if(!this.initialized){e.warning("Automatic dark mode detection cannot be enabled, because the DarkModeSupport sevice was not setup.");return}if(!this.canAutomaticallyToggleDarkMode()){e.warning("Automatic dark mode detection cannot be enabled, because your browser does not support dark mode detection");return}if(this.darkMediaQueryListListener){e.warning("Automatic dark mode detection was already enabled");return}if(i.support.matchmedialistener){this.darkMediaQueryListListener=this._toggleDarkModeBasedOnSystemColorScheme.bind(this);this.darkMediaQueryList.addListener(this.darkMediaQueryListListener)}this._toggleDarkModeBasedOnSystemColorScheme()};s.prototype.disableDarkModeBasedOnSystem=function(){if(this.darkMediaQueryListListener){this.darkMediaQueryList.removeListener(this.darkMediaQueryListListener);this.darkMediaQueryListListener=null}this._applyDefaultUserTheme()};s.prototype.getCurrentThemeMode=function(){var e=this._getCurrentTheme(),t=this._findSupportedThemePair(e);if(t){return e===t.light?s.Mode.LIGHT:s.Mode.DARK}return null};s.prototype._getCurrentTheme=function(){return sap.ui.getCore().getConfiguration().getTheme()};s.prototype._findSupportedThemePair=function(e){var t=a.last("/core/darkMode/supportedThemes");return t.filter(function(t){return t.dark===e||t.light===e})[0]};s.hasNoAdapter=true;return s},true);