sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/ui/elev8rerp/componentcontainer/services/Masters/Location.service',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',

], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, locationService,commonFunction) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Masters.LocationMaster", {

		onInit: function () {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("locationmaster", "setDetailPage", this.setDetailPage, this);
			this.oFlexibleColumnLayout = this.byId("fclLocationMaster");

			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("loaddata", "loadData", this.loadData, this);
			this.loadData();
			this.fnShortCut();
			commonFunction.getCommonSettingData(this, 730);
		},

		onAfterRendering: function () {
			jQuery.sap.delayedCall(1000, this, function () {
				this.getView().byId("search").focus();
			});

		},

		onListItemPress: function (oEvent) {
			var viewModel = oEvent.getSource().getBindingContext("locationModel");
			var model = {
				"locationid": viewModel.getProperty("id"),
				"locationModel": viewModel.oModel.oData.modelData
			}
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("locationmaster", "setDetailPage", { viewName: "LocationMasterDetail", viewModel: model });
		},

		setDetailPage: function (channel, event, data) {
			this.detailView = sap.ui.view({
				viewName: "sap.ui.elev8rerp.componentcontainer.view.Masters." + data.viewName,
				type: "XML"
			});

			this.detailView.setModel(data.viewModel, "viewModel");
			this.oFlexibleColumnLayout.removeAllMidColumnPages();
			this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
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

		onSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");
			var contains = sap.ui.model.FilterOperator.Contains;
			var columns = ['locationcode', 'locationname'];
			var filters = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, contains, sQuery);
			}),
				false);  // false for OR condition

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [filters];
			}

			this.getView().byId("tblLocation").getBinding("items").filter(oTableSearchState, "Application");
		},



		onAddNew: function () {

			var viewModel = this.getView().getModel("locationModel").oData;
			var model = { "locationModel": viewModel.modelData };
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("locationmaster", "setDetailPage", { viewName: "LocationMasterDetail", viewModel: model });
		},


		onSort: function (oEvent) {
			this._bDescendingSort = !this._bDescendingSort;
			var oView = this.getView(),
				oTable = oView.byId("tblLocation"),
				oBinding = oTable.getBinding("items"),
				oSorter = new Sorter("locationname", this._bDescendingSort);
			oBinding.sort(oSorter);
		},

		loadData: function () {
			var currentContext = this;

			locationService.getAllLocations(function (data) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: data[0] });
				currentContext.getView().setModel(oModel, "locationModel");
			});
		}


	});
}, true);
