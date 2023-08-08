/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["sap/base/Log","sap/esh/search/ui/eventlogging/UsageAnalyticsConsumerSina","sap/esh/search/ui/flp/UsageAnalyticsConsumerFlp","sap/esh/search/ui/repositoryexplorer/UsageAnalyticsConsumerDwc","sap/esh/search/ui/SearchHelper","../sinaNexTS/providers/abap_odata/UserEventLogger"],function(e,n,r,i,s,t){function a(e,n){if(!(e instanceof n)){throw new TypeError("Cannot call a class as a function")}}function o(e,n){for(var r=0;r<n.length;r++){var i=n[r];i.enumerable=i.enumerable||false;i.configurable=true;if("value"in i)i.writable=true;Object.defineProperty(e,i.key,i)}}function u(e,n,r){if(n)o(e.prototype,n);if(r)o(e,r);Object.defineProperty(e,"prototype",{writable:false});return e}var c=function(){function o(e){a(this,o);this.init();var s=new n;s.init(e.sinaNext);this.addConsumer(s);if(typeof e["usageCollectionService"]!=="undefined"){var t=new i;t.init({usageCollectionService:e["usageCollectionService"]});this.addConsumer(t)}else{var u=new r;this.addConsumer(u)}}u(o,[{key:"init",value:function e(){this.consumers=[]}},{key:"addConsumer",value:function e(n){this.consumers.push(n);n.eventLogger=t}},{key:"logEvent",value:function n(r){if(!s.isLoggingEnabled()){return}for(var i=0;i<this.consumers.length;++i){var t=this.consumers[i];try{t.logEvent(r)}catch(n){var a=e.getLogger("sap.esh.search.ui.eventlogging.EventLogger");a.debug(n)}}}}]);return o}();return c})})();