// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/utils/UrlParsing","sap/ushell/_ApplicationType/systemAlias"],function(e,s){"use strict";function a(){return e}function r(e,a,r){if(!r||r===s.SYSTEM_ALIAS_SEMANTICS.applied){return s.isAbsoluteURI(e)&&!a}if(r===s.SYSTEM_ALIAS_SEMANTICS.apply){return s.isAbsoluteURI(e)}throw new Error("Invalid system alias semantics: '"+r+"'")}function t(e,s){var a,r;if(e){var t=s.match(/#.*/);if(t){r=t;a=s.replace(t,"")}else{a=s;r=""}s=a+(s.indexOf("?")<0?"?":"&")+e+r}return s}function n(s,a){var r=a.match(/#.*/);var n=r&&r[0];if(!n){var i=e.paramsToString(s);return t(i,a)}var l=e.parseShellHash(n);Object.keys(s).forEach(function(e){var a=s[e];l.params[e]=[a]});var u=Object.keys(l.params).reduce(function(e,s){var a=l.params[s];var r=a.map(function(e){return encodeURIComponent(e)});e[encodeURIComponent(s)]=r;return e},{});l.params=u;var p=a.replace(n,"");var m=e.constructShellHash(l);return p+"#"+m}function i(e,s){if(e["sap-system"]&&e["sap-system"]!=null&&e["sap-system"]!=undefined&&e["sap-system"]!=""){e.systemAlias=e["sap-system"]}else{e.systemAlias=s.systemAlias}if(e.systemAlias===undefined){delete e.systemAlias}}return{getURLParsing:a,appendParametersToUrl:t,appendParametersToIntentURL:n,absoluteUrlDefinedByUser:r,setSystemAlias:i}});