/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./performancelogging/PerformanceLogger"], function (__PerformanceLogger) {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var PerformanceLogger = _interopRequireDefault(__PerformanceLogger);
  /*
   * Search Result View Type Settings Explaination:
   *                                                                                                      | In which case functional?
   * File                     | Paramater                                 | Explain                       | Search in Apps    | Search in All / Category | Search in Business Object
   * --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
   * SearchConfiguration      | resultViewTypes                           | view types                    |                   |                          | x
   * (Design Time Settings)                                                 (only for Search in Business Object)
   *                          | fallbackResultViewType                    | fallback view type            |                   |                          | x
   *                            (DWC is using it)                           (only for Search in Business Object)
   * --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
   * SearchCompositeControl   | resultViewTypes                           | active view types             | x (hard coded)    | x (hard coded in Ushell) | x
   * (Run Time Settings)      | resultViewType                            | active view type              | x (hard coded)    | x (hard coded in Ushell) | x
   * --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
   * SearchModel              | "/resultViewTypes"                        | active view types             | x (hard coded)    | x (hard coded in Ushell) | x
   * (Run Time UI)            | "/resultViewType"                         | active view type              | x (hard coded)    | x (hard coded in Ushell) | x
   * --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
   * Storage                  | "resultViewTypeForAllAndCategorySearch"   | last-used view type           |                   | x                        |
   *                          | "resultViewTypeForBusinessObjectSearch"   | last-used view type           |                   |                          | x
   */


  var SearchConfigurationSettings = /*#__PURE__*/_createClass(function SearchConfigurationSettings() {
    _classCallCheck(this, SearchConfigurationSettings);

    _defineProperty(this, "id", "");

    _defineProperty(this, "facetPanelResizable", false);

    _defineProperty(this, "facetPanelWidthInPercent", 25);

    _defineProperty(this, "getCustomNoResultScreen", function () {
      return null;
    });

    _defineProperty(this, "FF_optimizeForValueHelp", false);

    _defineProperty(this, "FF_unifiedToolbarsWithContextBar", true);

    _defineProperty(this, "combinedResultviewToolbar", false);

    _defineProperty(this, "titleColumnName", "");

    _defineProperty(this, "titleColumnWidth", "");

    _defineProperty(this, "extendTableColumn", null);

    _defineProperty(this, "searchBusinessObjects", true);

    _defineProperty(this, "odataProvider", false);

    _defineProperty(this, "multiSelect", true);

    _defineProperty(this, "charts", true);

    _defineProperty(this, "maps", false);

    _defineProperty(this, "mapProvider", null);

    _defineProperty(this, "newpie", false);

    _defineProperty(this, "filterRootCondition", null);

    _defineProperty(this, "dataSource", "");

    _defineProperty(this, "dataSources", []);

    _defineProperty(this, "resultViewTypes", ["searchResultList", "searchResultTable"]);

    _defineProperty(this, "personalizationStorage", "auto");

    _defineProperty(this, "boSuggestions", false);

    _defineProperty(this, "_eshClickableObjectType", true);

    _defineProperty(this, "defaultSearchScopeApps", false);

    _defineProperty(this, "searchScopeWithoutAll", false);

    _defineProperty(this, "suggestionKeyboardRelaxationTime", 400);

    _defineProperty(this, "suggestionStartingCharacters", 3);

    _defineProperty(this, "enableMultiSelectionResultItems", false);

    _defineProperty(this, "updateUrl", true);

    _defineProperty(this, "renderSearchUrl", function (properties) {
      return "#Action-search&/top=" + properties.top + "&filter=" + properties.filter;
    });

    _defineProperty(this, "quickSelectDataSources", []);

    _defineProperty(this, "pageSize", 10);

    _defineProperty(this, "FF_facetPanelUnifiedHeaderStyling", false);

    _defineProperty(this, "searchBarDoNotHideForNoResults", false);

    _defineProperty(this, "searchInAttibuteFacetPostion", {});

    _defineProperty(this, "cleanUpSpaceFilters", null);

    _defineProperty(this, "setSearchInLabelIconBindings", null);

    _defineProperty(this, "getSearchInFacetListMode", null);

    _defineProperty(this, "checkAndSetSpaceIcon", null);

    _defineProperty(this, "getFirstSpaceCondition", null);

    _defineProperty(this, "getPlaceholderLabelForDatasourceAll", null);

    _defineProperty(this, "setQuickSelectDataSourceAllAppearsNotSelected", null);

    _defineProperty(this, "bNoAppSearch", false);

    _defineProperty(this, "bResetSearchTermOnQuickSelectDataSourceItemPress", false);

    _defineProperty(this, "bPlaceHolderFixedValue", false);

    _defineProperty(this, "FF_bOptimizedQuickSelectDataSourceLabels", false);

    _defineProperty(this, "metaDataJsonType", false);

    _defineProperty(this, "defaultDataSource", "");

    _defineProperty(this, "displayFacetPanelInCaseOfNoResults", false);

    _defineProperty(this, "browserTitleOverwritten", true);

    _defineProperty(this, "sinaConfiguration", null);

    _defineProperty(this, "customGridView", null);

    _defineProperty(this, "userDefinedDatasourcesMulti", false);

    _defineProperty(this, "usageCollectionService", undefined);

    _defineProperty(this, "performanceLogger", new PerformanceLogger());

    _defineProperty(this, "FF_staticHierarchyFacets", false);

    _defineProperty(this, "FF_dynamicHierarchyFacets", true);

    _defineProperty(this, "FF_hierarchyBreadcrumbs", false);

    _defineProperty(this, "FF_dynamicHierarchyFacetsInShowMore", false);

    _defineProperty(this, "FF_DWCO_REPOSITORY_EXPLORER_FOLDER", false);

    _defineProperty(this, "modulePaths", undefined);

    _defineProperty(this, "isUshell", false);

    _defineProperty(this, "selectionChange", function () {
      /* */
    });

    _defineProperty(this, "getSpaceFacetId", undefined);

    _defineProperty(this, "dimensionNameSpace_Description", "");

    _defineProperty(this, "hasSpaceFiltersOnly", undefined);

    _defineProperty(this, "showSpaceFacetInShowMoreDialog", undefined);

    _defineProperty(this, "openSpaceShowMoreDialog", undefined);

    _defineProperty(this, "tabStripsFormatter", function (tabStrips) {
      return tabStrips;
    });

    _defineProperty(this, "assembleSearchCountBreadcrumbs", undefined);

    _defineProperty(this, "folderMode", false);

    _defineProperty(this, "autoAdjustResultViewTypeInFolderMode", false);

    _defineProperty(this, "enableQueryLanguage", false);

    _defineProperty(this, "isSearchUrl", function (url) {
      return url.indexOf("#Action-search") === 0;
    });

    _defineProperty(this, "beforeNavigation", function () {
      /* */
    });

    _defineProperty(this, "getCustomToolbar", function () {
      return [];
    });

    _defineProperty(this, "initAsync", function () {
      return Promise.resolve();
    });

    _defineProperty(this, "bRecentSearches", false);

    _defineProperty(this, "eshUseExtendedChangeDetection", false);

    _defineProperty(this, "parseSearchUrlParameters", function (parameters) {
      return parameters;
    });
  } //Oliver
  ); // list of configuration parameters which are also known in sina
  // (these parameters are automatically passed to sina via sinaConfiguration)


  var sinaParameters = ["renderSearchUrl", "FF_hierarchyBreadcrumbs", "folderMode", "enableQueryLanguage"];
  var defaultSearchConfigurationSettings = new SearchConfigurationSettings();
  SearchConfigurationSettings.sinaParameters = sinaParameters;
  SearchConfigurationSettings.defaultSearchConfigurationSettings = defaultSearchConfigurationSettings;
  return SearchConfigurationSettings;
});
})();