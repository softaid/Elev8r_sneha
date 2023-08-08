/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["sap/esh/search/ui/SearchModel", "sap/ui/core/Control", "./TypeGuardForControls"], function (SearchModel, Control, ___TypeGuardForControls) {
  // import SearchCountBreadcrumbs from "./SearchCountBreadcrumbs";
  var typesafeRender = ___TypeGuardForControls["typesafeRender"];
  /**
   * @namespace sap.esh.search.ui.controls
   */

  var SearchResultContainer = Control.extend("sap.esh.search.ui.controls.SearchResultContainer", {
    renderer: {
      apiVersion: 2,
      render: function render(oRm, oControl) {
        var oSearchModel = oControl.getModel(); // inner div for results

        oRm.openStart("div", oControl);
        oRm["class"]("sapUshellSearchResultContainer");
        oRm["class"]("sapUshellSearchResultListsContainer"); // class deprecated

        if (oSearchModel instanceof SearchModel) {
          var _oSearchModel$config;

          if (oSearchModel !== null && oSearchModel !== void 0 && (_oSearchModel$config = oSearchModel.config) !== null && _oSearchModel$config !== void 0 && _oSearchModel$config.FF_optimizeForValueHelp) {
            oRm["class"]("sapUshellSearchResultContainerValueHelp");
            oRm["class"]("sapUshellSearchResultListsContainerValueHelp"); // class deprecated
          }
        }

        oRm.openEnd(); // render main header

        var noResultScreenControl = oControl === null || oControl === void 0 ? void 0 : oControl.getNoResultScreen();
        typesafeRender(noResultScreenControl, oRm); // render total count bar

        if (oSearchModel instanceof SearchModel) {
          var _oSearchModel$config2, _oSearchModel$config3, _oSearchModel$config4, _oSearchModel$config5, _oSearchModel$config6;

          if (oSearchModel !== null && oSearchModel !== void 0 && (_oSearchModel$config2 = oSearchModel.config) !== null && _oSearchModel$config2 !== void 0 && _oSearchModel$config2.combinedResultviewToolbar && !(oSearchModel !== null && oSearchModel !== void 0 && (_oSearchModel$config3 = oSearchModel.config) !== null && _oSearchModel$config3 !== void 0 && _oSearchModel$config3.FF_unifiedToolbarsWithContextBar)) {// nothing to do here ('combinedResultviewToolbar' will be rendered by SearchLayoutResponsive)
          } else if (oSearchModel !== null && oSearchModel !== void 0 && (_oSearchModel$config4 = oSearchModel.config) !== null && _oSearchModel$config4 !== void 0 && _oSearchModel$config4.FF_unifiedToolbarsWithContextBar) {// nothing to do here ('context bar' will be rendered by SearchLayoutResponsive)
          } else {
            // open inner div level 2
            oRm.openStart("div", oControl.getId() + "-breadcrumbs-bar");
            oRm["class"]("sapUshellSearchTotalCountBar");
            oRm["class"]("sapElisaSearchContainerCountBreadcrumbs");

            if (oSearchModel.config.FF_optimizeForValueHelp) {
              oRm["class"]("sapElisaSearchContainerCountBreadcrumbsValueHelp");
            }

            oRm.openEnd();
            var countBreadcrumbs = oControl.getCountBreadcrumbs();
            typesafeRender(countBreadcrumbs, oRm); // close level 2

            oRm.close("div");
          } // render center area


          var centerAreaControl = oControl.getCenterArea();
          typesafeRender(centerAreaControl, oRm);

          if (oSearchModel !== null && oSearchModel !== void 0 && (_oSearchModel$config5 = oSearchModel.config) !== null && _oSearchModel$config5 !== void 0 && _oSearchModel$config5.combinedResultviewToolbar && !(oSearchModel !== null && oSearchModel !== void 0 && (_oSearchModel$config6 = oSearchModel.config) !== null && _oSearchModel$config6 !== void 0 && _oSearchModel$config6.FF_unifiedToolbarsWithContextBar)) {// nothing to do here ('combinedResultviewToolbarHiddenElement' will be rendered by SearchLayoutResponsive)
          } else {
            var countBreadcrumbsHiddenElement = oControl.getCountBreadcrumbsHiddenElement();
            typesafeRender(countBreadcrumbsHiddenElement, oRm);
          } // close inner div for results


          oRm.close("div");
        }
      }
    },
    metadata: {
      properties: {
        countBreadcrumbsHiddenElement: {
          // to be used for aria-describedby of search result list items
          type: "sap.ui.core.InvisibleText"
        },
        combinedResultviewToolbarHiddenElement: {
          // to be used for aria-describedby of search result list items
          type: "sap.ui.core.InvisibleText"
        }
      },
      aggregations: {
        centerArea: {
          type: "sap.ui.core.Control",
          singularName: "content",
          multiple: true
        },
        countBreadcrumbs: {
          type: "sap.ui.core.Control",
          multiple: false
        },
        combinedResultviewToolbar: {
          type: "sap.ui.core.Control",
          multiple: false
        },
        noResultScreen: {
          type: "sap.ui.core.Control",
          multiple: false
        }
      }
    },
    constructor: function _constructor(sId, settings) {
      Control.prototype.constructor.call(this, sId, settings); // define group for F6 handling

      this.data("sap-ui-fastnavgroup", "true", true
      /* write  into DOM */
      );
    },
    getCenterArea: function _getCenterArea() {
      return this.getAggregation("centerArea");
    },
    getNoResultScreen: function _getNoResultScreen() {
      return this.getAggregation("noResultScreen");
    },
    setNoResultScreen: function _setNoResultScreen(object) {
      this.setAggregation("noResultScreen", object);
    },
    getCountBreadcrumbs: function _getCountBreadcrumbs() {
      return this.getAggregation("countBreadcrumbs");
    },
    setCountBreadcrumbs: function _setCountBreadcrumbs(object) {
      this.setAggregation("countBreadcrumbs", object);
    },
    getCountBreadcrumbsHiddenElement: function _getCountBreadcrumbsHiddenElement() {
      return this.getAggregation("countBreadcrumbsHiddenElement");
    },
    getCombinedResultviewToolbar: function _getCombinedResultviewToolbar() {
      return this.getAggregation("combinedResultviewToolbar");
    },
    setCombinedResultviewToolbar: function _setCombinedResultviewToolbar(object) {
      this.setAggregation("combinedResultviewToolbar", object);
    },
    getCombinedResultviewToolbarHiddenElement: function _getCombinedResultviewToolbarHiddenElement() {
      return this.getAggregation("combinedResultviewToolbarHiddenElement");
    }
  });
  return SearchResultContainer;
});
})();