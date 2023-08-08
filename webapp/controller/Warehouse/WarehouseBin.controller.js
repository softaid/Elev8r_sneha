sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/ui/elev8rerp/componentcontainer/services/Warehouse/WarehouseBin.service',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',

], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, warehouseBinService, commonService, commonFunction) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Warehouse.WarehouseBin", {

		onInit: function () {
			var currentContext = this;
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("onWarehouseBinAdd", "onWarehouseBinAdd", this.onWarehouseBinAdd, this);

			var emptyModel = this.getModelDefault();
			var binModel = new JSONModel();
			binModel.setData(emptyModel);
			this.getView().setModel(binModel, "binModel");
			// location help box	
			commonFunction.getLocationList(this);
			this.fnShortCut();
		},
		onAfterRendering: function(){
			jQuery.sap.delayedCall(500, this, function() {
				this.getView().byId("txtToLocation").focus();
			});
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

		getModelDefault: function () {
			return {
			}
		},
	
		onWarehouseBinAdd: function (sChannel, sEvent, oData) {
			var jsonStr = oData.data;
			var oModel = this.getView().getModel("warehousebinModel");
			if (jsonStr["id"] == null) { //add new shed pen

				// push new record in object
				oModel.oData.modelData.push(jsonStr);
			}
			else {  //update existing shed pen
				var tableData = oModel.getData();
				// Find the index of the object via id
				var index = tableData.modelData
					.map(function (pen) { return pen.id; })
					.indexOf(jsonStr["id"]);

				// Replace the record in the array
				tableData.modelData.splice(index, 1, jsonStr);
			}


			oModel.refresh();

			var oModel = this.getView().getModel("binModel");
			this.getAllWarehouseBin(oModel.oData.warehouseid);

		},

		handleRouteMatched: function () {
			// location help box	
			commonFunction.getLocationList(this);
		},

		// location value help
		handleLocationValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog

			this._valueHelpDialog = sap.ui.xmlfragment(
				"sap.ui.elev8rerp.componentcontainer.fragmentview.Common.LocationDialog",
				this
			);
			this.getView().addDependent(this._valueHelpDialog);

			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);
		},

		handleLocationSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['locationcode', 'locationname'];
			var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
			}),
				false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		onLocationDialogClose: function (oEvent) {
			var currentContext = this;
			var aContexts = oEvent.getParameter("selectedContexts");
			// if (aContexts != undefined) {
			var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
			var oModel = currentContext.getView().getModel("binModel");

			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---warehousemaster--fclWarehouseMaster");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);

			// update existing model to set locationid
			//oModel.oData.itemid = selRow[0].itemid;
			oModel.oData.locationcode = selRow[0].locationcode;
			oModel.oData.locationid = selRow[0].id;
			oModel.oData.locationname = selRow[0].locationname;

			oModel.refresh();


			currentContext.getView().byId("cmbWarehouse").setEnabled(true);

			commonFunction.getLocationWiseWarehouse(selRow[0].id, this);
		},

		//warehouse fragment open
		handleWarehouseValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			//if (!this._valueHelpDialog) {
			this._valueHelpDialog = sap.ui.xmlfragment(
				"sap.ui.elev8rerp.componentcontainer.fragmentview.Common.WarehouseDialog",
				this
			);
			this.getView().addDependent(this._valueHelpDialog);
			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);
		},


		handleWarehouseSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['warehousecode', 'warehousename'];
			var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
			}),
				false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);

		},

		onWarehouseDialogClose: function (oEvent) {
			var currentContext = this;
			var aContexts = oEvent.getParameter("selectedContexts");
			// if (aContexts != undefined) {
			var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
			var oModel = currentContext.getView().getModel("binModel");

			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---warehousemaster--fclWarehouseMaster");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);

			// update existing model to set locationid
			//oModel.oData.itemid = selRow[0].itemid;
			oModel.oData.warehousecode = selRow[0].warehousecode;
			oModel.oData.warehouseid = selRow[0].id;
			oModel.oData.warehousename = selRow[0].warehousename;

			oModel.refresh();


			currentContext.getView().byId("btnAdd").setEnabled(true);

			currentContext.getAllWarehouseBin(selRow[0].id);

		},

		getAllWarehouseBin: function (warehouseid) {
			var currentContext = this;
			warehouseBinService.getAllWarehouseBin({ warehouseid: warehouseid }, function (data) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: data[0] });
				currentContext.getView().setModel(oModel, "warehousebinModel");
			});
		},

		onListItemPress: function (oEvent) {

			var viewModel = oEvent.getSource().getBindingContext("warehousebinModel");

			var model = {
				"id": viewModel.getProperty("id"),
				"bincode": viewModel.getProperty("bincode"),
				"binname": viewModel.getProperty("binname"),
				"warehouseid": viewModel.getProperty("warehouseid"),
				"warehousename": viewModel.getProperty("warehousename"),

			}


			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("warehousemaster", "setDetailPage", { viewName: "WarehousebinDetail", viewModel: model });
		},

		onAddNew: function (oEvent) {
			var oModel = this.getView().getModel("binModel");
			var model = {
				id: null,
				locationid: oModel.oData.locationid,
				warehouseid: oModel.oData.warehouseid,
			};

			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("warehousemaster", "setDetailPage", { viewName: "WarehouseBinDetail", viewModel: model });
		},

	});
}, true);
