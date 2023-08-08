/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["sap/m/Select","sap/ui/core/Item"],function(e,t){var a=e.extend("sap.esh.search.ui.controls.SearchSelectQuickSelectDataSource",{renderer:{apiVersion:2},constructor:function a(r,c){var i=this;e.prototype.constructor.call(this,r,c);this.attachChange(function(e){var t=e.getParameter("selectedItem");var a=t.getBindingContext().getObject();i.handleSelectDataSource(a)});this.bindItems({path:"/config/quickSelectDataSources",template:new t("",{key:"{id}",text:"{labelPlural}"})});this.bindProperty("maxWidth",{parts:[{path:"/config/FF_optimizeForValueHelp"}],formatter:function e(t){if(t){i.addStyleClass("sapElisaSearchSelectQuickSelectDataSourceValueHelp")}return"100%"}});this.bindProperty("visible",{parts:[{path:"/config/FF_optimizeForValueHelp"},{path:"/config/quickSelectDataSources"},{path:"/count"}],formatter:function e(t,a,r){if(t){i.addStyleClass("sapElisaSearchSelectQuickSelectDataSourceValueHelp")}return(a===null||a===void 0?void 0:a.length)>0}})},handleSelectDataSource:function e(t){var a=this;var r=this.getModel();if(r.config.bResetSearchTermOnQuickSelectDataSourceItemPress){r.setSearchBoxTerm("",false)}if(typeof r.config.cleanUpSpaceFilters==="function"){r.config.cleanUpSpaceFilters(r)}r.setDataSource(t,false);var c=window.document.querySelectorAll('[id$="-searchInputHelpPageSearchFieldGroup-button"]');c.forEach(function(e){if(e.id===a.getId().replace("-searchInputHelpPageSearchFieldGroup-selectQsDs","-searchInputHelpPageSearchFieldGroup-button")){var t=sap.ui.getCore().byId(e.id);t["firePress"]()}})}});return a})})();