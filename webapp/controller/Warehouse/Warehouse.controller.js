sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/ui/elev8rerp/componentcontainer/services/Warehouse/Warehouse.service',	
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',	
	
], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, warehouseService, commonService) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Warehouse.Warehouse", {
        
        onInit: function () {	
			var currentContext = this;	
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("onWarehouseAdd", "onWarehouseAdd", this.onWarehouseAdd, this); 
			this.getAllWaarehouse();
			this.fnShortCut();
		},

		getAllWaarehouse:function(){
			var currentContext = this;
			warehouseService.getAllWarehouse(function(data){
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({modelData : data[0]}); 
				currentContext.getView().setModel(oModel,"warehouseModel");
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

		onWarehouseAdd: function (sChannel, sEvent, oData) {
			var jsonStr = oData.data;
			var oModel = this.getView().getModel("warehouseModel");
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
			this.getAllWaarehouse();
		},

		onListItemPress : function(oEvent){
			var viewModel = oEvent.getSource().getBindingContext("warehouseModel");   
			var model = { "id": viewModel.getProperty("id") } 
			this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("warehousemaster", "setDetailPage", {viewName:"WarehouseDetail", viewModel : model});
		},

		onAddNew: function () {
			this.bus = sap.ui.getCore().getEventBus();
			var model = {
				"id" : null,
				"countryid" : null,
				"stateid" : null,
				"cityid" : null,
				"active" : true
			}
            this.bus.publish("warehousemaster", "setDetailPage", {viewName:"WarehouseDetail", viewModel : model});
		},

		
	});
}, true);
