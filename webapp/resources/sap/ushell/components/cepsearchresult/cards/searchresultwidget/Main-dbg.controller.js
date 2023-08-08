//Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/resource/ResourceModel",
  "./controls/SearchResultList"
], function (Controller, ResourceModel, SearchResultList) {
  "use strict";

  var oSearchResultList = new SearchResultList({
    noDataText: "{category>_status/dataStatusText}",
    category: "{category>}",
    paging: "{= ${category>list/paging}}",
    view: "{category>list/_currentView}",
    items: "{path:'data>'}",
    itemFragment: "{= ${category>list/item/fragment} || 'default'}"
  });

  //load fragments only once
  return Controller.extend("sap.ushell.components.cepsearchresult.cards.searchresultwidget.Main", {
    onInit: function () {
      this.oView = this.getView();
      var oOwnerComponent = this.getOwnerComponent();
      this.oCard = oOwnerComponent.oCard;

      this.oResourceModel = new ResourceModel({
        bundleName: "sap.ushell.components.cepsearchresult.cards.searchresultwidget.i18n.i18n"
      });

      //the card i18n model
      this.oView.setModel(this.oResourceModel, "card_i18n");
      //allow data binding to parameters of the card
      this.oView.setModel(this.oCard.getModel("parameters"), "parameters");

      this.mCardParameters = oOwnerComponent.mCardParameters;
      this.sSearchTerm = this.mCardParameters.searchTerm;
      this.oSearchResultManager = oOwnerComponent.oSearchResultManager;

      // init async
      this.oSearchResultManager._loaded.then(this.initUIAsync.bind(this));
    },

    initUIAsync: function () {
      this.oCategoriesModel = this.oSearchResultManager.getCategoriesModel(this.mCardParameters.categories);
      this.oCategoriesModel.getProperty("/").forEach(function (oCategory, i) {
        // create the model
        var oSearchResultModel = this.oSearchResultManager.createSearchResultModel(
          oCategory.name,
          this.oCard,
          this.oCategoriesModel
        );

        //create a new list
        var oList = this._createList(oCategory.name, oSearchResultModel);

        // add to view
        this.oView.byId("content").addItem(oList);

      }.bind(this));
      this.oView.setVisible(true);
    },

    _createList: function (sCategory, oSearchResultModel) {

      //clone the List
      var oList = oSearchResultList.clone(sCategory, "", {cloneBindings: true});

      //apply the models and binding contexts
      oList.applyModelContexts(oSearchResultModel, {
        category: "/",
        data: "/list/data/_result",
        count: "/list/data/_count"
      });

      oList.attachItemPress(function (oEvent) {
        var sUrl = oEvent.getParameter("listItem").getBindingContext("data").getProperty("url");
        document.location.hash = sUrl;
      });

      oList.attachFetchData(function (oEvent) {
        var mParameters = oEvent.getParameters();
        oSearchResultModel.setProperty("/list/paginator/pageSize", mParameters.pageSize);
        //trigger data fetch for the page
        oSearchResultModel.fetchCategoryData(mParameters.page);
      });

      oList.loadForVisibleItemCount(
        oSearchResultModel.getProperty("/list/paginator/pageSize"),
        this.oCard.getDomRef()
      );

      return oList;
    }
  });
});

