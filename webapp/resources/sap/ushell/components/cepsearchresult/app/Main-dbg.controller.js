//Copyright (c) 2009-2022 SAP SE, All Rights Reserved

/**
 * @private
 */

sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ushell/components/cepsearchresult/util/SearchResultManager"
], function (Controller, SearchResultManager) {

  "use strict";

  return Controller.extend("sap.ushell.components.cepsearchresult.app.Main", {

    onInit: function () {
      this.oSearchResultManager = new SearchResultManager(this.getOwnerComponent().getSearchConfig());
      this.getView().setModel(this.oSearchResultManager.getModel(), "manager");
      this.getView().setVisible(true);
      this.setCategory(this.getOwnerComponent().getCategory());
      this.byId("searchResultWidget").setManifest(sap.ui.require.toUrl("sap/ushell/components/cepsearchresult/cards/searchresultwidget/manifest.json"));
    },

    onExit: function () {
      SearchResultManager._resetGlobals();
    },

    tabSelectionChange: function (oEvent) {
      this.setCategory(oEvent.getParameters().item.getKey());
    },

    setCategory: function (sKey) {
      this.byId("searchCategoriesTabs").setSelectedKey(sKey);
      this.byId("searchResultWidget").setParameters({
        categories: sKey,
        searchTerm: this.getOwnerComponent().getSearchTerm(),
        edition: this.getOwnerComponent().getSearchConfig()
      });
    }
  });
});
