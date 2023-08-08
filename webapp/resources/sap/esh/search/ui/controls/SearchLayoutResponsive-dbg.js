/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["sap/ui/layout/ResponsiveSplitter", "sap/ui/layout/SplitterLayoutData", "sap/m/ScrollContainer", "sap/m/VBox", "sap/m/BusyDialog", "sap/ui/layout/SplitPane", "sap/ui/layout/PaneContainer", "sap/ui/core/library", "sap/m/Text", "../UIEvents"], function (ResponsiveSplitter, SplitterLayoutData, ScrollContainer, VBox, BusyDialog, SplitPane, PaneContainer, sap_ui_core_library, Text, __UIEvents) {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }

  var Orientation = sap_ui_core_library["Orientation"];

  var UIEvents = _interopRequireDefault(__UIEvents);
  /**
   * @namespace sap.esh.search.ui.controls
   */


  var SearchLayoutResponsive = ResponsiveSplitter.extend("sap.esh.search.ui.controls.SearchLayoutResponsive", {
    renderer: {
      apiVersion: 2
    },
    metadata: {
      properties: {
        searchIsBusy: {
          type: "boolean"
        },
        busyDelay: {
          type: "int"
        },
        combinedResultviewToolbar: {
          type: "boolean",
          defaultValue: false
        },
        unifiedToolbarsWithContextBar: {
          type: "boolean",
          defaultValue: true
        },
        showFacets: {
          type: "boolean"
        },
        showFooter: {
          type: "boolean"
        },
        facetPanelResizable: {
          type: "boolean",
          defaultValue: false
        },
        facetPanelWidthInPercent: {
          type: "int",
          defaultValue: "25"
        },
        animateFacetTransition: {
          type: "boolean",
          defaultValue: false
        },
        resultContainer: {
          // container for table, grid, list (, map)
          type: "sap.ui.core.Control",
          multiple: false
        }
      },
      aggregations: {
        facets: {
          type: "sap.ui.core.Control",
          multiple: false
        },
        footer: {
          type: "sap.ui.core.Control",
          multiple: false
        }
      }
    },
    constructor: function _constructor(sId, options) {
      var _this = this;

      ResponsiveSplitter.prototype.constructor.call(this, sId, options); // facets

      var facetsDummyContainer = new VBox("", {
        items: [new Text()] // dummy for initialization

      });
      this._paneLeftContent = new SplitPane({
        requiredParentWidth: 10,
        // use minimal width -> single pane mode disabled
        content: facetsDummyContainer
      });
      this._paneLeftContainer = new PaneContainer({
        orientation: Orientation.Vertical,
        panes: [this._paneLeftContent]
      }); // result list

      var resultScrollContainer = new ScrollContainer("", {
        height: "100%",
        vertical: true
      }); // pane right, content

      var resultContainer = new VBox("", {
        items: [resultScrollContainer]
      });
      this._paneRightContent = new SplitPane({
        requiredParentWidth: 10,
        // use minimal width -> single pane mode disabled
        content: resultContainer
      }); // pane right, container: header + content

      var combinedToolbar = new VBox();
      combinedToolbar.addStyleClass("sapUiNoMarginBottom");
      this._paneRightHeader = new SplitPane({
        requiredParentWidth: 10,
        // use minimal width -> single pane mode disabled
        content: combinedToolbar
      });
      this._paneRightContainer = new PaneContainer({
        orientation: Orientation.Vertical,
        panes: [this._paneRightHeader, this._paneRightContent]
      }); // facet panel "hidden"

      this._paneLeftContainer.setLayoutData(new SplitterLayoutData({
        size: "0%",
        // width
        resizable: false
      })); // vertical


      this._paneRightHeader.setLayoutData(new SplitterLayoutData({
        size: "0%",
        // height
        resizable: false
      }));

      this._paneRightContainer.setLayoutData(new SplitterLayoutData({
        size: "100%" // height

      })); // footer


      var footerDummyContainer = new VBox("", {
        items: [] // dummy for initialization

      }); // panes

      this._paneMainContainer = new PaneContainer({
        orientation: Orientation.Horizontal,
        panes: [this._paneLeftContainer, this._paneRightContainer],
        resize: function resize() {
          _this.triggerUpdateLayout();
        }
      });
      this._paneMainFooter = new SplitPane({
        requiredParentWidth: 10,
        // use minimal width -> single pane mode disabled
        content: footerDummyContainer
      });

      this._paneMainContainer.setLayoutData(new SplitterLayoutData({
        size: "100%",
        // height
        resizable: false
      }));

      this._paneMainFooter.setLayoutData(new SplitterLayoutData({
        size: "0%",
        // height
        resizable: false
      }));

      var paneContainer = new PaneContainer({
        orientation: Orientation.Vertical,
        panes: [this._paneMainContainer, this._paneMainFooter]
      });
      this.setRootPaneContainer(paneContainer);
      this.setDefaultPane(this._paneRightContent);
    },
    getFacets: function _getFacets() {
      var facetContainer = this._paneLeftContent;

      if (facetContainer !== null && facetContainer !== void 0 && facetContainer.getContent()) {
        return facetContainer.getContent();
      }

      return undefined;
    },
    setFacets: function _setFacets(oControl) {
      this._facets = oControl;
      var facetContainer = this._paneLeftContent;

      if (facetContainer) {
        this._paneLeftContainer.removeAllPanes();

        facetContainer.setContent(oControl);

        this._paneLeftContainer.addPane(facetContainer);
      }
    },
    getFooter: function _getFooter() {
      var footerContainer = this._paneMainFooter;

      if (footerContainer !== null && footerContainer !== void 0 && footerContainer.getContent()) {
        return footerContainer.getContent();
      }

      return undefined;
    },
    setFooter: function _setFooter(oControl) {
      this._footer = oControl;
      var footerContainer = this._paneMainFooter;

      if (footerContainer) {
        this.getRootPaneContainer().removeAllPanes();
        footerContainer.setContent(oControl);
        this.getRootPaneContainer().addPane(this._paneMainContainer);
        this.getRootPaneContainer().addPane(footerContainer);
      }
    },
    getResultContainer: function _getResultContainer() {
      var resultListScrollContainer = this._paneRightContent.getContent();

      if (resultListScrollContainer) {
        return resultListScrollContainer;
      }

      return undefined;
    },
    setResultContainer: function _setResultContainer(oControl) {
      this._resultContainer = oControl; // update result list

      if (this._paneRightContent) {
        this._paneRightContainer.removeAllPanes();

        this._paneRightContent.setContent(oControl);

        this._paneRightContainer.addPane(this._paneRightHeader);

        this._paneRightContainer.addPane(this._paneRightContent);
      }
    },
    setSearchIsBusy: function _setSearchIsBusy(isBusy) {
      var _this2 = this;

      if (isBusy) {
        if (this._busyFlag) {
          return;
        }

        if (this._busyTimeout) {
          return;
        }

        this._busyTimeout = setTimeout(function () {
          _this2._busyTimeout = null;

          _this2._setIsBusy(isBusy);
        }, this.getProperty("busyDelay"));
      } else {
        if (this._busyFlag) {
          this._setIsBusy(isBusy);

          return;
        }

        if (this._busyTimeout) {
          clearTimeout(this._busyTimeout);
          this._busyTimeout = null;
          return;
        }
      }
    },
    _setIsBusy: function _setIsBusy(isBusy) {
      var oModel = this.getModel();

      if (isBusy) {
        if (oModel.config.isUshell) {
          if (!this._busyIndicatorModal) {
            this._busyIndicatorModal = new BusyDialog();
          }

          this._busyIndicatorModal.open();
        } else {
          this.setBusy(true);
        }

        this._busyFlag = true;
      } else if (this._busyFlag) {
        if (oModel.config.isUshell) {
          if (this._busyIndicatorModal) {
            this._busyIndicatorModal.close();
          }
        } else {
          this.setBusy(false);
        }

        this._busyFlag = false;
      }

      this.setProperty("searchIsBusy", isBusy, true);
    },
    setCombinedResultviewToolbar: function _setCombinedResultviewToolbar(hasCombinedResultviewToolbar) {
      // the 3rd parameter supresses rerendering
      this.setProperty("combinedResultviewToolbar", hasCombinedResultviewToolbar, true); // this validates and stores the new value

      return this; // return "this" to allow method chaining
    },
    setUnifiedToolbarsWithContextBar: function _setUnifiedToolbarsWithContextBar(hasUnifiedToolbarsWithContextBar) {
      // the 3rd parameter supresses rerendering
      this.setProperty("unifiedToolbarsWithContextBar", hasUnifiedToolbarsWithContextBar, true); // this validates and stores the new value

      return this; // return "this" to allow method chaining
    },
    setShowFacets: function _setShowFacets(showFacets) {
      var _this$_footer;

      var oModel = this.getModel();

      if (!this._paneRightContainer) {
        return;
      }

      if (!this.getResultContainer()) {
        return;
      }

      if (this.getProperty("combinedResultviewToolbar")) {
        var headerContent = this._paneRightHeader.getContent();

        if (headerContent.getItems().length === 0) {
          var combinedResultviewToolbar = this._resultContainer.getAggregation("combinedResultviewToolbar");

          combinedResultviewToolbar.addStyleClass("sapElisaSearchContainerCountBreadcrumbs");

          if (oModel.config.FF_optimizeForValueHelp) {
            combinedResultviewToolbar.addStyleClass("sapElisaSearchContainerCountBreadcrumbsValueHelp");
          }

          if (!this.getProperty("unifiedToolbarsWithContextBar")) {
            combinedResultviewToolbar.addItem(this._resultContainer.getProperty("countBreadcrumbsHiddenElement"));
          } // separate toolbar for context (breadcrumb+count)


          this._paneRightContainer.removeAllPanes();

          this._paneRightHeader.setContent(combinedResultviewToolbar);

          this._paneRightContainer.addPane(this._paneRightHeader);

          this._paneRightContainer.addPane(this._paneRightContent);
        }
      } else if (this.getProperty("unifiedToolbarsWithContextBar")) {
        var _headerContent = this._paneRightHeader.getContent();

        var _combinedResultviewToolbar = this._resultContainer.getAggregation("combinedResultviewToolbar");

        if (_combinedResultviewToolbar && _combinedResultviewToolbar instanceof VBox) {
          _combinedResultviewToolbar.addStyleClass("sapElisaSearchContainerCountBreadcrumbs");

          if (oModel.config.FF_optimizeForValueHelp) {
            _combinedResultviewToolbar.addStyleClass("sapElisaSearchContainerCountBreadcrumbsValueHelp");
          }

          if (_headerContent instanceof VBox && _headerContent.getItems().length === 0 || this._paneRightHeader.getContent() !== _combinedResultviewToolbar) {
            // separate toolbar for context (breadcrumb+count)
            this._paneRightContainer.removeAllPanes();

            this._paneRightHeader.setContent(_combinedResultviewToolbar);

            this._paneRightContainer.addPane(this._paneRightHeader);

            this._paneRightContainer.addPane(this._paneRightContent);
          }
        }
      } else {
        var _headerContent2 = this._paneRightHeader.getContent();

        if (_headerContent2) {
          this._paneRightHeader.setLayoutData(new SplitterLayoutData({
            size: "0%",
            resizable: false
          }));
        }
      }

      var footerIsVisible = (_this$_footer = this._footer) === null || _this$_footer === void 0 ? void 0 : _this$_footer.getVisible();
      this.updateLayout(showFacets, footerIsVisible, this.getProperty("combinedResultviewToolbar"), this.getProperty("unifiedToolbarsWithContextBar"));
      return this; // return "this" to allow method chaining
    },
    setShowFooter: function _setShowFooter(showFooter) {
      if (!this._paneMainFooter) {
        return;
      }

      if (!this.getResultContainer()) {
        return;
      }

      var paneLeftContainerLayoutData = this === null || this === void 0 ? void 0 : this._paneLeftContainer.getLayoutData();
      var widthString = paneLeftContainerLayoutData.getProperty("size").replace("%", "");
      var facetPanelPaneWidth = parseInt(widthString);
      var facetsAreVisible = facetPanelPaneWidth > 0;
      this.updateLayout(facetsAreVisible, showFooter, this.getProperty("combinedResultviewToolbar"), this.getProperty("unifiedToolbarsWithContextBar"));
      return this; // return "this" to allow method chaining
    },
    setFacetPanelWidthInPercent: function _setFacetPanelWidthInPercent(facetPanelWidthInPercentValue) {
      // the 3rd parameter supresses rerendering
      this.setProperty("facetPanelWidthInPercent", facetPanelWidthInPercentValue, true); // this validates and stores the new value

      this._facetPanelWidthSizeIsOutdated = true;
      return this; // return "this" to allow method chaining
    },
    triggerUpdateLayout: function _triggerUpdateLayout() {
      var _this$_footer2;

      var paneLeftContainerLayoutData = this === null || this === void 0 ? void 0 : this._paneLeftContainer.getLayoutData();
      var widthString = paneLeftContainerLayoutData.getProperty("size").replace("%", "");
      var facetPanelPaneWidth = parseInt(widthString);
      var facetsAreVisible = facetPanelPaneWidth > 0;
      var footerIsVisible = (_this$_footer2 = this._footer) === null || _this$_footer2 === void 0 ? void 0 : _this$_footer2.getVisible();
      this.updateLayout(facetsAreVisible, footerIsVisible, this.getProperty("combinedResultviewToolbar"), this.getProperty("unifiedToolbarsWithContextBar"));
    },
    updateLayout: function _updateLayout(facetsAreVisible, footerIsVisible, hasCombinedResultviewToolbar, hasUnifiedToolbarsWithContextBar) {
      var _this$_paneRightConte,
          _this$_paneLeftConten,
          _this3 = this;

      // update facets
      // adjust the facet content
      var facetContainer = this._paneLeftContent;

      if ((facetContainer === null || facetContainer === void 0 ? void 0 : facetContainer.getContent()) instanceof VBox) {
        var vBoxItems = facetContainer.getContent().getItems();

        if ((vBoxItems === null || vBoxItems === void 0 ? void 0 : vBoxItems.length) > 0 && vBoxItems[0] instanceof Text) {
          this._paneLeftContainer.removeAllPanes();

          facetContainer.setContent(this._facets);

          this._paneLeftContainer.addPane(facetContainer);
        }
      } // update result view
      // adjust the container


      if (((_this$_paneRightConte = this._paneRightContent) === null || _this$_paneRightConte === void 0 ? void 0 : _this$_paneRightConte.getContent()) instanceof VBox) {
        var _vBoxItems = this._paneRightContent.getContent().getItems();

        if ((_vBoxItems === null || _vBoxItems === void 0 ? void 0 : _vBoxItems.length) > 0 && _vBoxItems[0] instanceof ScrollContainer) {
          if (_vBoxItems[0].getContent().length === 0) {
            this._paneRightContainer.removeAllPanes();

            this._paneRightContent.setContent(this._resultContainer);

            this._paneRightContainer.addPane(this._paneRightHeader);

            this._paneRightContainer.addPane(this._paneRightContent);
          }
        }
      } // animation


      if (this._facets) {
        // robustness when triggered by constructor
        if (this.getProperty("animateFacetTransition")) {
          this._facets.addStyleClass("sapUshellSearchFacetAnimation");
        } else {
          this._facets.removeStyleClass("sapUshellSearchFacetAnimation");
        }
      } // splitter position (header)


      if (hasCombinedResultviewToolbar && !hasUnifiedToolbarsWithContextBar) {
        var splitterRightHeaderVerticalSize = 0; // search bar --- filter button + collection dropdown (value help mode only) < - > data source tab strip < - > custom buttons (export-flp, DWC-buttons like create/delete/move...) < - > generic buttons (sort, attributes, view type)

        splitterRightHeaderVerticalSize = splitterRightHeaderVerticalSize + 2; // filter bar

        var filterBar = this._paneRightHeader.getContent().getItems()[0];

        if (filterBar !== null && filterBar !== void 0 && filterBar.getVisible()) {
          splitterRightHeaderVerticalSize = splitterRightHeaderVerticalSize + 2;
        } // context/breadcrumb bar


        splitterRightHeaderVerticalSize = splitterRightHeaderVerticalSize + 2; // set layout

        this._paneRightHeader.setLayoutData(new SplitterLayoutData({
          size: "".concat(splitterRightHeaderVerticalSize, "rem"),
          resizable: false
        }));
      } else if (hasUnifiedToolbarsWithContextBar) {
        // header
        var _splitterRightHeaderVerticalSize = 0; // context/breadcrumb bar

        _splitterRightHeaderVerticalSize = _splitterRightHeaderVerticalSize + 2; // set layout

        this._paneRightHeader.setLayoutData(new SplitterLayoutData({
          size: "".concat(_splitterRightHeaderVerticalSize, "rem"),
          resizable: false
        }));
      } else {
        // splitterRightHeaderVerticalSize = "0%";  -> does not work, header will still block some empty space!!!
        this._paneRightHeader.destroy();
      } // splitter position (facets)


      if (this !== null && this !== void 0 && (_this$_paneLeftConten = this._paneLeftContent) !== null && _this$_paneLeftConten !== void 0 && _this$_paneLeftConten.getContent()) {
        var currentFacetPanelWidthSize;
        var paneLeftContainerLayoutData = this === null || this === void 0 ? void 0 : this._paneLeftContainer.getLayoutData();

        if (!facetsAreVisible) {
          this._paneLeftContainer.setLayoutData(new SplitterLayoutData({
            size: "0%",
            // width
            resizable: false
          }));

          if (this._paneRightContainer) {
            this._paneRightContainer.setLayoutData(new SplitterLayoutData({
              size: "100%" // width

            }));
          }
        } else {
          if (this._facetPanelWidthSizeIsOutdated) {
            currentFacetPanelWidthSize = this.getProperty("facetPanelWidthInPercent");
            this._facetPanelWidthSizeIsOutdated = false;
          } else {
            currentFacetPanelWidthSize = parseInt(paneLeftContainerLayoutData.getProperty("size").replace("%", ""));

            if (currentFacetPanelWidthSize < 1) {
              if (this._previousFacetPanelWidthSize) {
                currentFacetPanelWidthSize = this._previousFacetPanelWidthSize;
              } else {
                currentFacetPanelWidthSize = this.getProperty("facetPanelWidthInPercent");
              }
            }
          }

          this._paneLeftContainer.setLayoutData(new SplitterLayoutData({
            size: currentFacetPanelWidthSize + "%",
            resizable: this.getProperty("facetPanelResizable")
          }));

          this._previousFacetPanelWidthSize = currentFacetPanelWidthSize; // remember width to restore when showing facets (after having closed them before)

          var resultListPaneWidthInPercent = 100 - currentFacetPanelWidthSize + "%";

          this._paneRightContainer.setLayoutData(new SplitterLayoutData({
            size: resultListPaneWidthInPercent
          }));
        }
      } // footer


      var footerContent = this._paneMainFooter.getContent();

      if (typeof footerContent["getItems"] === "function" && footerContent["getItems"]().length === 0 && typeof this._footer !== "undefined") {
        this.getRootPaneContainer().removeAllPanes();

        this._paneMainFooter.setContent(this._footer);

        this.getRootPaneContainer().addPane(this._paneMainContainer);
        this.getRootPaneContainer().addPane(this._paneMainFooter);
      }

      if (footerIsVisible && window.document.getElementById(this._paneMainContainer.getParent().getParent().getId()) // check if already rendered
      ) {
        var footerHeight = 52;
        var searchUiHeight = window.document.getElementById(this._paneMainContainer.getParent().getParent().getId()).getBoundingClientRect().height;
        var mainContainerHeight = searchUiHeight - footerHeight;

        this._paneMainContainer.setLayoutData(new SplitterLayoutData({
          size: "".concat(mainContainerHeight, "px"),
          resizable: false
        }));

        this._paneMainFooter.setLayoutData(new SplitterLayoutData({
          size: "".concat(footerHeight, "px"),
          resizable: false
        }));
      } else {
        this._paneMainContainer.setLayoutData(new SplitterLayoutData({
          size: "100%",
          resizable: false
        }));

        this._paneMainFooter.setLayoutData(new SplitterLayoutData({
          size: "0%",
          resizable: false
        }));
      }

      var handleAnimationEnd = function handleAnimationEnd() {
        _this3.getModel().notifySubscribers(UIEvents.ESHSearchLayoutChanged);
      };

      var $searchFacets = jQuery(".sapUiFixFlexFixed"); // TODO: JQuery

      $searchFacets.one("transitionend", handleAnimationEnd); //  TODO: JQuery
    }
  });
  return SearchLayoutResponsive;
});
})();