// Copyright (c) 2009-2022 SAP SE, All Rights Reserved

sap.ui.define([
  "sap/base/Log",
  "sap/base/assert",
  "sap/ui/model/json/JSONModel",
  "sap/ui/base/ManagedObject",
  "sap/ui/integration/util/DataProviderFactory",
  "sap/ui/integration/util/BindingResolver"
], function (Log, assert, JSONModel, ManagedObject, DataProviderFactory, BindingResolver) {
  "use strict";

  // Control to pass models to binding resolver
  var oModelControl = new ManagedObject();

  var SearchResultModel = JSONModel.extend("sap.ushell.components.cepsearchresult.util.SearchResultModel");

  // allow to pass a extension used to fetch data
  SearchResultModel.prototype.setExtension = function (oExtension) {
    this._extension = oExtension;
  };

  // allow to pass a host to resolve
  SearchResultModel.prototype.setHost = function (oHost) {
    this._host = oHost;
  };

  SearchResultModel.prototype.setCard = function (oCard) {
    this._card = oCard;
  };

  SearchResultModel.prototype.fetchCategoryData = function (iPage) {
    var oCategory = this.getData();

    oCategory._status = oCategory._status || {};
    oCategory.list = oCategory.list || { data: {} };
    oCategory.list.data = oCategory.list.data || {};

    // ensure list result entry
    oCategory.list.data._result = [];
    oCategory.list.data._count = 0;
    oCategory.list._currentView = oCategory.list._currentView || oCategory.list.defaultView;

    // set values before data request
    oCategory._status.dataStatusText = oCategory.list.loadingDataText;

    oCategory.list.paginator.currentPage = iPage;
    oCategory.list.paginator.skip = (oCategory.list.paginator.currentPage - 1) * oCategory.list.paginator.pageSize;
    oCategory.list.paginator.top = oCategory.list.paginator.pageSize;

    this.oDataProviderFactory = new DataProviderFactory({
      card: this._card,
      extension: this._extension,
      host: this._host
    });

    var oPaginatorModel = new JSONModel(oCategory.list.paginator);
    oModelControl.setModel(oPaginatorModel, "paginator");
    oModelControl.setModel(this._card.getModel("parameters"), "parameters");
    var oRequest = BindingResolver.resolveValue(oCategory.list.data.request, oModelControl);
    var oExtension = BindingResolver.resolveValue(oCategory.list.data.extension, oModelControl);
    var oDataProvider;
    if (oRequest) {
      oDataProvider = this.oDataProviderFactory.create({ request: oRequest });
    }
    if (oExtension) {
      oDataProvider = this.oDataProviderFactory.create({ extension: oExtension });
    }
    oModelControl.setModel(null, "paginator");
    oModelControl.setModel(null, "parameters");

    return oDataProvider.getData()
      .then(function (oData) {

        var oDataModel = new JSONModel(oData);
        oCategory.list.data._result = oDataModel.getProperty(oCategory.list.data.path);
        oCategory.list.data._count = oDataModel.getProperty(oCategory.list.data.count);

        // update the status
        if (!oCategory.list.data._result ||
          !Array.isArray(oCategory.list.data._result) ||
          oCategory.list.data._result.length === 0) {
          oCategory._status.dataStatusText = oCategory.list.noDataText;
        }

        //pages
        if (oCategory.list.data.clientSplice) {
          oCategory.list.data._result.splice(0, oCategory.list.paginator.skip);
          oCategory.list.data._result.splice(oCategory.list.paginator.top);
        }


        for (var i = 0; i < oCategory.list.data._result.length; i++) {
          var oResult = BindingResolver.resolveValue(oCategory.list.data.mapping, oDataModel, oCategory.list.data.path + "/" + i);
          oCategory.list.data._result[i] = oResult;
        }
        this.checkUpdate();
      }.bind(this))
      .catch(function () {
        oCategory.list.data._result = [];
        oCategory.list.data._count = 0;
        oCategory._status.dataStatusText = oCategory.list.noDataText;
        this.checkUpdate();
      }.bind(this));
  };
  return SearchResultModel;
});

