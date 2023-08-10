// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ushell/components/applicationIntegration/application/PostMessageAPIInterface"],function(e,i){"use strict";var t={};function n(){this.getHandlers=function(){return t};this.registerCommHandlers=function(i){var n=[];Object.keys(i).forEach(function(e){var t=i[e];if(t.oServiceCalls){Object.keys(t.oServiceCalls).forEach(function(i){n.push({action:i,service:e})})}});e.extend(true,t,i);return n};this.registerCommunicationHandler=function(e,i){var n=t[e],r=[];if(!n){n=t[e]={oServiceCalls:{}}}if(i.oServiceCalls){Object.keys(i.oServiceCalls).forEach(function(t){n.oServiceCalls[t]=i.oServiceCalls[t];r.push({action:t,service:e})})}return r};this.registerCommunicationHandlers=function(e){var i=this;Object.keys(e).forEach(function(t){i.registerCommunicationHandler(t,e[t])})};this._getPostMesageInterface=function(e,i){var n=t[e],r;if(n&&n.oRequestCalls&&n.oRequestCalls[i]){r=n.oRequestCalls[i]}return r}}var r=new n;i.init(false,r.registerCommunicationHandlers.bind(r));return r});