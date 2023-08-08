sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter',
    'sap/ui/elev8rerp/componentcontainer/services/FactorMaster/FactorMaster.service'

], function (BaseController, JSONModel, Filter, FilterOperator, Sorter,factormasterService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.UnitFactor.UnitFactor", {

      
        onInit: function () {

            this.bus = sap.ui.getCore().getEventBus();
            this.bus.subscribe("factormaster", this.setDetailPage, this);
            this.oFlexibleColumnLayout = this.byId("fclfactormaster");
            this.bus.subscribe("unitfactormasteradd", "loadFactorMaster", this.loadFactorMaster, this);
            this.loadFactorMaster();

            jQuery.sap.delayedCall(1000, this, function () {
				this.getView().byId("searchId").focus();
            });
            this.fnShortCut(); 

        },
        fnShortCut: function () {
			var currentContext = this;
			$(document).keydown(function (evt) {
				if (evt.keyCode == 79 && evt.ctrlKey) {
					jQuery(document).ready(function ($) {
						evt.preventDefault();
						currentContext.onAddNew()
					})
                }
			});
		},

        onExit: function () {
            this.bus.unsubscribe("factormaster", this.setDetailPage, this);
        },

        setDetailPage: function (channel, event, data) {
			this.detailView = sap.ui.view({
				viewName: "sap.ui.elev8rerp.componentcontainer.view.UnitFactor." + data.viewName,
				type: "XML"
			});

			this.detailView.setModel(data.viewModel, "viewModel");
			this.oFlexibleColumnLayout.removeAllMidColumnPages();
			this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
		},

        onSearch: function (oEvent) {
            var oTableSearchState = [],
                sQuery = oEvent.getParameter("query");
            var contains = sap.ui.model.FilterOperator.Contains;
            var columns = ['convertedunitname'];
            var filters = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, contains, sQuery);
            }),
                false);  // false for OR condition

            if (sQuery && sQuery.length > 0) {
                oTableSearchState = [filters];
            }

            this.getView().byId("factormasterTable").getBinding("items").filter(oTableSearchState, "Application");
        },

        onAddNew: function () {
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("factormaster", { viewName: "UnitFactorDetail" });
        },

        onListItemPress: function (oEvent) {
            var viewModel = oEvent.getSource().getBindingContext("factormasterModel");
            var model = { "id": viewModel.getProperty("id") };
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("factormaster", { viewName: "UnitFactorDetail", viewModel: model });
        },

        loadFactorMaster: function () {
            var currentContext = this;
            factormasterService.getAllFactorMaster(function (data) {
                var oModel = new JSONModel();
                oModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oModel, "factormasterModel");
            });
        },
      
    });
});