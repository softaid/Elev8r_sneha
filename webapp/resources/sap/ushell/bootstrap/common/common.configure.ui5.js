// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/base/Log","./common.load.launchpad","./common.read.ui5theme.from.config","../common/common.configure.xhrlogon","../common/common.load.xhrlogon"],function(o,e,i,n,a){"use strict";function t(t){if(!t||!t.libs||!Array.isArray(t.libs)){o.error("Mandatory settings object not provided",null,"sap/ushell/bootstap/common/common.configure.ui5");return{}}var r=window["sap-ui-config"]||(window["sap-ui-config"]={});var l=t&&t.platform;var s=t&&t.platformAdapters;var u=t.ushellConfig;var c=t.theme?t.theme:i(u).theme;if(u&&u.modulePaths){var m=Object.keys(u.modulePaths).reduce(function(o,e){o[e.replace(/\./g,"/")]=u.modulePaths[e];return o},{});sap.ui.loader.config({paths:m})}var h=r.oninit;r.oninit=function(){if(typeof h==="string"){var i=/^module:((?:[_$.\-a-zA-Z0-9]+\/)*[_$.\-a-zA-Z0-9]+)$/.exec(h);if(i&&i[1]){sap.ui.require([i[1]])}else{o.error("Given onInit module ("+h+") cannot be loaded.")}}sap.ui.require(["sap/ushell/Container"],function(){window.sap.ushell.bootstrap(l,s).then(function(){n.start(sap.ushell.Container,a)}).then(function(){(t.onInitCallback||e)()})})};r.preload="async";r.compatversion="edge";r.libs=t.libs.join();r.theme=c;r["xx-boottask"]=t.bootTask;if(u&&u.ushell&&u.ushell.verticalization&&u.ushell.verticalization.activeTerminologies&&u.ushell.verticalization.activeTerminologies.length>0){r.activeterminologies=u.ushell.verticalization.activeTerminologies}return r}return t});