/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){window.onload=function(){sap.ui.loader.config({baseUrl:"../../../../../../resources/",paths:{"sap/esh/search/ui":"/resources/sap/esh/search/ui"}});sap.ui.require(["sap/esh/search/ui/SearchCompositeControl"],function(e){var s=sap.esh.search.ui.config||{};var a={FF_optimizeForValueHelp:true,facetPanelWidthInPercent:0,facetVisibility:true,pageSize:15,combinedResultviewToolbar:false,unifiedToolbarsWithContextBar:true,updateUrl:false,sinaConfiguration:{provider:"sample"}};var i=Object.assign(a,s);var t=new e(i);window.addEventListener("hashchange",function(){t.getModel().parseURL()},false);t.attachSearchFinished(function(){t.setResultViewTypes(["searchResultList"]);t.setResultViewType("searchResultList")});t.placeAt("panelLeft")});jQuery("html").css("overflow-y","auto");jQuery("html").css("height","100%")}})();