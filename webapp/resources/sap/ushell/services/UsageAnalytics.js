// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/base/Log","sap/ui/Device","sap/ui/thirdparty/jquery"],function(e,t,s){"use strict";function i(i,n,a){var r=a&&a.config||{},o=[],u=false,l=false,c,d;window.oCustomProperties={};this.setLegalText=function(e){c=e;if(d){this.init(d.usageAnalyticsTitle,d.iAgree,d.iDisagree,d.remindMeLater)}};this.getLegalText=function(){return c};this.setTrackUsageAnalytics=function(t){var i=s.Deferred();var n=sap.ushell.Container.getUser();var a=n.getTrackUsageAnalytics();sap.ushell.Container.getServiceAsync("UserInfo").then(function(s){if(a!==t){n.setTrackUsageAnalytics(t);var r=s.updateUserPreferences(n);r.done(function(){n.resetChangedProperty("trackUsageAnalytics");if(!l&&t){this.start()}else if(l&&t===false){window.swa.disable()}else if(l&&t){window.swa.enable()}i.resolve()}.bind(this));r.fail(function(t){n.setTrackUsageAnalytics(a);n.resetChangedProperty("trackUsageAnalytics");e.error(t);i.reject(t)})}else{i.resolve()}}.bind(this)).catch(function(){e.error("Getting UserInfo service failed.");i.reject("Getting UserInfo service failed.")});return i.promise()};this.showLegalPopup=function(){sap.ui.require(["sap/m/Text","sap/m/Dialog","sap/m/Button","sap/m/library"],function(e,s,i,n){var a=n.ButtonType;var r=new s("agreementMessageBox",{title:d.usageAnalyticsTitle,type:"Message",stretch:t.system.phone,buttons:[new i("remindMeLaterButton",{text:d.remindMeLater,press:function(){r.close()}}),new i("iAgreeButton",{text:d.iAgree,type:a.Emphasized,press:function(){this.setTrackUsageAnalytics(true);r.close()}.bind(this)}),new i("iDisagreeButton",{text:d.iDisagree,press:function(){this.setTrackUsageAnalytics(false);r.close()}.bind(this)})],afterClose:function(){r.destroy()},content:new e({text:c})}).addStyleClass("sapUshellUsageAnalyticsPopUp").addStyleClass("sapContrastPlus");r.open()}.bind(this))};this.systemEnabled=function(){if(!r.enabled||!r.pubToken||this.isSetUsageAnalyticsPermitted()&&!c){if(!r.pubToken){e.warning("No valid pubToken was found in the service configuration")}if(!c){e.warning("No Legal text message found.")}return false}return true};this.userEnabled=function(){var e=sap.ushell.Container.getUser();if(!this.systemEnabled()){return false}return e.getTrackUsageAnalytics()};this.start=function(){sap.ui.getCore().getEventBus().publish("sap.ushell.services.UsageAnalytics","usageAnalyticsStarted");this._initUsageAnalyticsLogging();l=true;window.swa.custom2={ref:sap.ui.getCore().getConfiguration().getLanguage()}};this.init=function(e,t,s,i){d={usageAnalyticsTitle:e,iAgree:t,iDisagree:s,remindMeLater:i};if(this.systemEnabled()&&!l){if(!this.isSetUsageAnalyticsPermitted()){this.start()}else if(c){if(this.userEnabled()===true){this.start()}else if(this.userEnabled()===null||this.userEnabled()===undefined){this.showLegalPopup()}}}};this.setCustomAttributes=function(e){var t,i="attribute",n,a="custom",r,o,u="customFunction";if(!this.userEnabled()&&this.isSetUsageAnalyticsPermitted()){return}for(t=1;t<6;t++){r=a.concat(t+4);if(window.swa[r]!==undefined){continue}n=i+t;if(e[n]===undefined){continue}if(s.isFunction(e[n])){o=u+t;window[o]=e[n];window.swa[r]={ref:o}}else{window.swa[r]={ref:e[n]}}}};this.logCustomEvent=function(e,t,s){if(!this.userEnabled()&&this.isSetUsageAnalyticsPermitted()){return}if(!this._isAnalyticsScriptLoaded()){this._addDelayedEvent(e,t,s);return}if(s){s.unshift(t);s.unshift(e);window.swa.trackCustomEvent.apply(window.swa.trackCustomEvent,s)}else{window.swa.trackCustomEvent(e,t)}};window._trackingScriptsLoaded=function(){var e,t;u=true;for(e=0;e<o.length;e++){t=o[e];this.logCustomEvent(t.eventType,t.customEventValue,t.aAdditionalValues)}o=null};this._initUsageAnalyticsLogging=function(){if(window.swa===undefined){window.swa={}}window.swa.pubToken=r.pubToken;window.swa.baseUrl=r.baseUrl;window.swa.bannerEnabled=false;window.swa.loggingEnabled=true;window.swa.visitorCookieTimeout=63113852;window.swa.dntLevel=1;window.swa.trackerReadyCallback=window._trackingScriptsLoaded.bind(this);window.swa.clicksEnabled=r.logClickEvents!==false;window.swa.pageLoadEnabled=r.logPageLoadEvents!==false;this._handlingTrackingScripts()};this._handlingTrackingScripts=function(){var t=document,s=t.createElement("script"),i=t.getElementsByTagName("script")[0];s.onerror=function(){e.warning("SWA scripts not loaded!")};s.defer=true;s.async=true;s.src=window.swa.baseUrl+"js/privacy.js";i.parentNode.insertBefore(s,i)};this._isAnalyticsScriptLoaded=function(){return u};this.isSetUsageAnalyticsPermitted=function(){if(r.setUsageAnalyticsPermitted===undefined){return true}return r.setUsageAnalyticsPermitted};this._addDelayedEvent=function(e,t,s){var i={eventType:e,customEventValue:t,aAdditionalValues:s};o.push(i)}}i.hasNoAdapter=true;return i},true);