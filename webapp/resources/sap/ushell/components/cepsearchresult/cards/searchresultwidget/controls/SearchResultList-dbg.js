/*!
 * Copyright (c) 2009-2022 SAP SE, All Rights Reserved
 */

sap.ui.define([
  "sap/m/List",
  "sap/m/ListRenderer",
  "sap/m/CustomListItem",
  "sap/m/OverflowToolbar",
  "sap/m/ToolbarSpacer",
  "sap/m/SegmentedButton",
  "sap/m/SegmentedButtonItem",
  "sap/m/Title",
  "sap/ui/core/ResizeHandler",
  "sap/ui/Device",
  "sap/ui/dom/includeStylesheet",
  "sap/ushell/components/cepsearchresult/util/appendStyleVars",
  "sap/ui/core/Fragment",
  "./Paginator",
  "sap/m/Text",
  "sap/ushell/services/VisualizationInstantiation"
], function (
  List,
  ListRenderer,
  CustomListItem,
  OverflowToolbar,
  ToolbarSpacer,
  SegmentedButton,
  SegmentedButtonItem,
  Title,
  ResizeHandler,
  Device,
  includeStylesheet,
  appendStyleVars,
  Fragment,
  Paginator,
  Text,
  VisualizationInstantiation
) {

  "use strict";

  // Append style vars based on theme
  appendStyleVars([
    "sapUiShadowLevel0",
    "sapUiShadowLevel1",
    "sapUiBaseText",
    "sapUiContentLabelColor",
    "sapUiElementBorderCornerRadius",
    "sapMFontMediumSize",
    "sapUiListBorderColor",
    "sapMFontHeader4Size",
    "sapMFontMediumSize"
  ]);

  // Include the css for the control once
  includeStylesheet(sap.ui.require.toUrl("sap/ushell/components/cepsearchresult/cards/searchresultwidget/controls/SearchResultList.css"));

  // Measure the current 1x1 tile size in px
  var oTileSpan = document.createElement("span");
  oTileSpan.classList.add("sapMGT", "OneByOne");
  oTileSpan.style.position = "absolute";
  oTileSpan.style.top = "0";
  document.body.appendChild(oTileSpan);
  var iTileWidth = oTileSpan.offsetWidth + 5;
  oTileSpan.remove();


  // Header toolbar for cloning
  var oToolbarTemplate = new OverflowToolbar({
    style: "Clear",
    content: [
      new ToolbarSpacer({ width: "0.5rem" }),
      new Title({ text: "{category>title} ({= ${count>}})", level: "H1" }),
      new ToolbarSpacer(),
      new SegmentedButton({
        selectedKey: "{category>list/_currentView}",
        visible: "{= ${category>list/views}.length > -1}",
        items: [
          new SegmentedButtonItem({
            icon: "sap-icon://text-align-justified",
            key: "List",
            visible: "{= ${category>list/views}.indexOf('List') > -1}"
          }),
          new SegmentedButtonItem({
            icon: "sap-icon://filter-facets",
            key: "TwoColumn",
            visible: "{= ${category>list/views}.indexOf('TwoColumn') > -1}"
          }),
          new SegmentedButtonItem({
            icon: "sap-icon://grid",
            key: "Tile",
            visible: "{= ${category>list/views}.indexOf('Tile') > -1}"
          }),
          new SegmentedButtonItem({
            icon: "sap-icon://business-card",
            key: "Card",
            visible: "{= ${category>list/views}.indexOf('Card') > -1}"
          })
        ]
      }),
      new ToolbarSpacer({ width: "1rem" })
    ]
  });

  // Footer toolbar for cloning
  var oFooterToolbarTemplate = new OverflowToolbar({
    style: "Clear",
    content: [
      new ToolbarSpacer({ width: "1rem" }),
      new Text({
        text: "Found {= ${count>}} items"
      }),
      new ToolbarSpacer(),
      new Paginator({
        visible: "{= ${count>} > ${category>list/paginator/pageSize}}",
        count: "{= ${count>} || 0}",
        pageSize: "{category>list/paginator/pageSize}",
        currentPage: "{category>list/paginator/currentPage}"
      }),
      new ToolbarSpacer({ width: "1rem" })
    ]
  });
  oFooterToolbarTemplate.addStyleClass("sapUiSmallMarginBottom");
  oFooterToolbarTemplate.addStyleClass("sapUiSmallMarginTop");

  var oInstanceFactory = new VisualizationInstantiation();

  /**
   * SearchResultList for search results
   */
  var SearchResultList = List.extend(
    "sap.ushell.components.cepsearchresult.cards.searchresultwidget.controls.SearchResultList",
    /** @lends sap.ushell.components.cepsearchresult.cards.serchresult.controls.SearchResultList.prototype */ {
      metadata: {
        properties: {
          category: {
            type: "object"
          },
          paging: {
            type: "boolean",
            defaultValue: true
          },
          viewAll: {
            type: "boolean",
            defaultValue: false
          },
          view: {
            type: "string",
            defaultValue: "List"
          },
          itemFragment: {
            type: "string",
            defaultValue: "default"
          }
        },
        aggregations: {
          _footer: {
            type: "sap.m.OverflowToolbar",
            multiple: false,
            hidden: true
          }
        },
        events: {
          selectPage: {},
          fetchData: {}
        }
      },
      renderer: function (rm, oControl) {
        ListRenderer.render(rm, oControl);
        if (oControl.getPaging() || oControl.getViewAll()) {
          rm.renderControl(oControl.getAggregation("_footer"));
        }
      }
    });

  // Initialize
  SearchResultList.prototype.init = function () {
    this.addStyleClass("sapUiCEPCatList");
    this._initToolbar();
    this._initFooterBar();
    this._sViewHeight = "unset"; //let the browser decide the initial height
  };

  // Initialize the toolbar
  SearchResultList.prototype._initToolbar = function () {
    this.setHeaderToolbar(oToolbarTemplate.clone());
  };

  // Initialize the footer toolbar
  SearchResultList.prototype._initFooterBar = function () {
    var oFooter = oFooterToolbarTemplate.clone();
    oFooter.getContent()[3].attachSelectPage(this.handleSelectPage.bind(this));
    this.setAggregation("_footer", oFooter);
  };

  // Initialize the item fragment from the itemFragment names property.
  // Read from sap.ushell.components.cepsearchresult.cards.searchresultwidget.controls path
  SearchResultList.prototype._initItemFragment = function () {
    if (!this.oItemFragmentPromise) {
      this.oItemFragmentPromise = Fragment.load({
        type: "XML",
        name: "sap.ushell.components.cepsearchresult.cards.searchresultwidget.controls." + this.getItemFragment(),
        controller: this
      }).then(function (oFragment) {
        this.oItemFragment = oFragment;
      }.bind(this));
    }
    return this.oItemFragmentPromise;
  };

  /**
    * Override  bindAggregation to define the factory based on the item template
    *
    * @param {sName} sName - the name of the aggregation to bind
    * @param {*} vBindingInfo - the binding info
    *
    * @return {this} this to allow method chaining
    *
    * @private
    */
  SearchResultList.prototype.bindAggregation = function (sName, vBindingInfo) {
    if (sName === "items") {
      this._initItemFragment().then(function () {
        this.updateItems();
      }.bind(this));

      vBindingInfo.factory = function (sId, oBindingInfo) {
        var oViz = oBindingInfo.getProperty("_viz");
        if (oViz && this.getView() === "Tile") {
          var oItem = new CustomListItem();
          oItem.addStyleClass("sapUiCEPCatTileInstance");
          oItem.addContent(oInstanceFactory.instantiateVisualization(oViz));
          return oItem;
        } else if (this.oItemFragment) {
          return this.oItemFragment.clone(sId);
        }
        return new CustomListItem();
      }.bind(this);
    }
    return List.prototype.bindAggregation.apply(this, [sName, vBindingInfo]);
  };

  /**
   * Calculates how many columns are currently occupied by flex cols LI tags in the list.
   *
   * @return {int} the number of cols
   *
   * @private
   */
  SearchResultList.prototype._getCurrentColCount = function () {
    if (this.getDomRef()) {
      var aItems = this.getDomRef().querySelectorAll(".sapMListItems > LI");
      var iCols = 1;
      var iTop = aItems[0].offsetTop;
      for (var i = 1; i < aItems.length; i++) {
        if (aItems[i].offsetTop <= iTop) {
          iCols = iCols + 1;
        } else {
          break;
        }
      }
      return iCols;
    }
  };
  /**
    * Override _startItemNavigation to modify the column navigation based on the view
    *
    * @private
    */
  SearchResultList.prototype._startItemNavigation = function () {
    List.prototype._startItemNavigation.apply(this, [false]);
    if (this._oItemNavigation) {
      if (this.getView() === "Tile") {
        this._oItemNavigation.setItemDomRefs(
          Array.from(this.getDomRef().querySelectorAll(".sapMGT"))
        );
      }
      this._oItemNavigation.setTableMode(false, true).setColumns(this._getCurrentColCount());
    }
  };

  /**
   * Sets the view property. Adds style classes depending on the view property
   *
   * @param {string} sValue - the view setting List, Tile, Card
   *
   * @return {this} this to allow method chaining
   *
   * @private
   */
  SearchResultList.prototype.setView = function (sValue) {
    var sCurrentValue = this.getProperty("view");
    this.setProperty("view", sValue);
    this.removeStyleClass("sapUiCEPCatListCard");
    this.removeStyleClass("sapUiCEPCatListTile");
    this.removeStyleClass("sapUiCEPCatListTwoColumn");

    switch (sValue) {
      case "Card": this.addStyleClass("sapUiCEPCatListCard"); break;
      case "Tile": this.addStyleClass("sapUiCEPCatListTile"); break;
      case "TwoColumn": this.addStyleClass("sapUiCEPCatListTwoColumn"); break;
      default:
    }
    if (this._iGivenPageSize && this.getDomRef() && this.getDomRef().offsetWidth) {
      this.loadForVisibleItemCount(this._iGivenPageSize, this.getDomRef());
    }
    if (sValue && sCurrentValue !== sValue) {
      // reset the height and let the browser decide the height for this view
      this._sViewHeight = "unset";
    }
    this.updateItems();
    return this;
  };

  SearchResultList.prototype.loadForVisibleItemCount = function (iGivenPageSize, oMeasureDomRef) {
    this._iGivenPageSize = iGivenPageSize;
    this._iCurrentPageSize = iGivenPageSize;
    var iCols, iRows;
    if (this.getView() === "Tile" && oMeasureDomRef) {
      iCols = Math.floor((oMeasureDomRef.offsetWidth - 20) / (iTileWidth + 20));
      iRows = Math.ceil(iGivenPageSize / iCols);
      this._iCurrentPageSize = iRows * iCols;
    }
    if (this.getView() === "Card" && oMeasureDomRef) {
      iCols = Math.min(Math.floor((oMeasureDomRef.offsetWidth - 20) / 300), 3);
      iRows = Math.ceil(iGivenPageSize / iCols);
      this._iCurrentPageSize = iRows * iCols;
    }
    if (this.getView() === "TwoColumn") {
      if (oMeasureDomRef.offsetWidth < 600) {
        this.removeStyleClass("sapUiCEPCatListTwoColumn");
      } else {
        this.addStyleClass("sapUiCEPCatListTwoColumn");
      }
    }
    this.fireFetchData({
      page: 1,
      pageSize: this._iCurrentPageSize
    });
  };

  // Handles a selection of a page in the paginator
  SearchResultList.prototype.handleSelectPage = function (oEvent) {
    // keep the same height for the also for the navigated page
    // assumption the items height is stable
    this._sViewHeight = this.getDomRef().offsetHeight + "px";
    this.fireFetchData({
      page: oEvent.getParameter("page"),
      pageSize: this._iCurrentPageSize
    });
  };

  // Handles resize event and recalculates the columns
  SearchResultList.prototype._onResize = function (oEvent) {
    if (this._oItemNavigation) {
      this._oItemNavigation.setColumns(this._getCurrentColCount());
    }
    var sView = this.getView();
    // sometimes this event comes without a size or a old size
    if (sView === "Tile" &&
      oEvent.size &&
      oEvent.oldSize &&
      Math.abs(oEvent.size.width - oEvent.oldSize.width) > iTileWidth) {
      this.loadForVisibleItemCount(this._iGivenPageSize, this.getDomRef());
      this._sViewHeight = "unset";
      this.getDomRef().style.height = this._sViewHeight;
    } else if (sView === "TwoColumn") {
      if (oEvent.size && oEvent.size.width < 600) {
        this.removeStyleClass("sapUiCEPCatListTwoColumn");
      } else {
        this.addStyleClass("sapUiCEPCatList");
      }
    }
  };

  SearchResultList.prototype.applyModelContexts = function (oModel, mContexts) {
    for (var n in mContexts) {
      this.setModel(oModel, n);
      this.setElementBindingContext(oModel.createBindingContext(mContexts[n]), n);
    }
  };

  SearchResultList.prototype.itemNavigate = function (oEvent) {
    //find ListItem
    var oParent = oEvent.getSource();
    while (oParent.getParent()) {
      if (oParent.getParent() === this) {
        this.fireItemPress({
          listItem: oParent,
          srcControl: oEvent.getSource()
        });
        break;
      }
      oParent = oParent.getParent();
    }
  };

  // Deregister Resize handler and erase footer dom ref for force rendering.
  SearchResultList.prototype.onBeforeRendering = function () {
    if (this._iResizeListenerId) {
      Device.resize.detachHandler(this._fnResizeListener);
      ResizeHandler.deregister(this._iResizeListenerId);
      this._iResizeListenerId = null;
    }
    if (this.getDomRef()) {
      this.getDomRef().nextElementSibling.remove();
    }
    if (this.getItems().length > 0) {
      this.removeStyleClass("sapUiCEPCatListNoData");
    } else {
      this.addStyleClass("sapUiCEPCatListNoData");
    }
    List.prototype.onBeforeRendering.apply(this, arguments);
  };

  SearchResultList.prototype.onAfterRendering = function () {
    if (!this._iResizeListenerId) {
      this._fnResizeListener = this._onResize.bind(this);
      Device.resize.attachHandler(this._fnResizeListener);
      this._iResizeListenerId = ResizeHandler.register(this, this._fnResizeListener);
    }
    List.prototype.onAfterRendering.apply(this, arguments);
    this.getDomRef().style.height = this._sViewHeight;
  };

  return SearchResultList;

});
