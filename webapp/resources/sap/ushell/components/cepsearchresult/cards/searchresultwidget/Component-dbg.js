// Copyright (c) 2009-2022 SAP SE, All Rights Reserved

sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ushell/components/cepsearchresult/util/appendStyleVars",
  "sap/ushell/components/cepsearchresult/util/SearchResultManager"
], function (UIComponent, appendThemeVars, SearchResultManager) {
  "use strict";

  appendThemeVars([
    "sapUiShadowLevel0"
  ]);

  // Stylesheet is included by the component

  /**
   * Component of the Search Result Widget (Component Card - UI Integration Card)
   * The Card should be registered as a visualization of the Search Result Application
   * It is reusable on any WorkPage for the standard and advanced editions of Work Zone.
   *
   * @param {string} sId Component id
   * @param {object} oParams Component parameter
   *
   * @class
   * @extends sap.ui.core.UIComponent
   *
   * @private
   *
   * @since 1.110.0
   * @alias sap.ushell.components.cepsearchresult.cards.searchresultwidget.Component
   */
  var Component = UIComponent.extend("sap.ushell.components.cepsearchresult.cards.searchresultwidget.Component", /** @lends sap.ushell.components.cepsearchresult.cards.searchresultwidget.Component */{
    onCardReady: function (oCard) {
      // Holds the card for use inside the controller
      this.oCard = oCard;
      // add a style class to identify the card root in css
      this.oCard.getDomRef().classList.add("searchResultCard");
      // allow access to the card parameters
      this.mCardParameters = oCard.getCombinedParameters();
      this.oSearchResultManager = new SearchResultManager(this.mCardParameters.edition);
    },
    /**
     * Returns the search term the component was initialized with by the corresponding intent.
     *
     * @private
     * @returns {string} the current search term.
     */
    getSearchTerm: function () {
      return this.mParameters.searchTerm;
    },

    /**
     * Returns the categories the card should display.
     *
     * @private
     * @returns {string} the current search term.
     */
    getCategories: function () {
      return this.mParameters.categories;
    }
  });

  return Component;
});
