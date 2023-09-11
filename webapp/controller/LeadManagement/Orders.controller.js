sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/ui/model/Sorter',
	'sap/ui/elev8rerp/componentcontainer/services/LeadManagement/Order.service',
	'sap/ui/elev8rerp/componentcontainer/utility/xlsx',
	'sap/m/MessageToast'
], function (JSONModel, BaseController, Sorter, orderService, xlsx, MessageToast) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.LeadManagement.Orders", {

		onInit: function () {

			this.bus = sap.ui.getCore().getEventBus();
			// this.bus.subscribe("quotationmaster", "setDetailPage", this.setDetailPage, this);
			this.bus.subscribe("orderscreen", "handleOrderList", this.handleOrderList, this);
			this.bus.subscribe("orderdetail", "handleOrderDetails", this.handleOrderDetails, this);
			this.bus.subscribe("loadorderdata", "loadOrderData", this.loadOrderData, this);
			//this.oFlexibleColumnLayout = this.byId("fclQuotation");

			this.handleRouteMatched(null);

			var model = new JSONModel();
			var emptyModel = this.getModelDefault();
			model.setData(emptyModel);
			this.getView().setModel(model, "partyModel");

			var model = new JSONModel();
			model.setData(emptyModel);
			this.getView().setModel(model, "subledgerModel");
			jQuery.sap.delayedCall(1000, this, function () {
				// this.getView().byId("onSearchId").focus();
			});
			this.fnShortCut();
		},

		getModelDefault: function () {
			return {

			}
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

		handleRouteMatched: function (evt) {
			this.loadOrderData();
		},

		
		handleOrderDetails : function (sChannel, sEvent, oData) {
            console.log("oData",oData);
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.bus = sap.ui.getCore().getEventBus();
            oRouter.getTargets().display(oData.pagekey, { viewModel: oData.viewModel });
            oRouter.navTo(oData.pagekey, true);
        },

		onListItemPress: function (oEvent) {
			var viewModel = oEvent.getSource().getBindingContext("orderMasterModel").getObject();
			console.log("---------------viewModel-----------------", viewModel);
			var model = { "id": viewModel.id }

			this.bus = sap.ui.getCore().getEventBus();
			setTimeout(function () {
                this.bus = sap.ui.getCore().getEventBus();
                this.bus.publish("orderdetail", "handleOrderDetails", { pagekey: "orderdetail", viewModel:model });
            }, 1000);
            
            this.bus.publish("orderdetail", "handleOrderDetails", { pagekey: "orderdetail", viewModel:model });
		},
		
		onAddNew: function() {
			this.bus = sap.ui.getCore().getEventBus();
			setTimeout(function () {
				this.bus = sap.ui.getCore().getEventBus();
				this.bus.publish("orderdetail", "handleOrderDetails", { pagekey: "addorder", viewModel:null });
			}, 1000);
			this.bus.publish("orderdetail", "handleOrderDetails", { pagekey: "addorder", viewModel:null});
		},

			 /**
         * Function to navigate to specified route.
         * @param {*} sChannel 
         * @param {*} sEvent 
         * @param {*} oData 
         */
		handleOrderList : function (sChannel, sEvent, oData) {
			console.log("oData",oData);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.bus = sap.ui.getCore().getEventBus();
			oRouter.getTargets().display(oData.pagekey, { viewModel: oData.viewModel });
			oRouter.navTo(oData.pagekey, true);
		},

		onSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");
			var contains = sap.ui.model.FilterOperator.Contains;
			var columns = ['leadname', 'contactname'];
			var filters = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, contains, sQuery);
			}),
				false);

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [filters];
			}

			this.getView().byId("tblOrderMaster").getBinding("items").filter(oTableSearchState, "Application");
		},

		onSort: function (oEvent) {
			this._bDescendingSort = !this._bDescendingSort;
			var oView = this.getView(),
				oTable = oView.byId("tblOrderMaster"),
				oBinding = oTable.getBinding("items"),
				oSorter = new Sorter("leadname", this._bDescendingSort);
			oBinding.sort(oSorter);
		},

		loadOrderData: function () {
			var currentContext = this;
			orderService.getAllOrders(function (data) {
				var oModel = new sap.ui.model.json.JSONModel();
                if(data.length && data[0].length){
                    oModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oModel, "orderMasterModel");
                }else{
                    oModel.setData({ modelData: [] });
                    currentContext.getView().setModel(oModel, "orderMasterModel");
                }
				console.log("orderMasterModel", oModel);
			});
		},

		onExit: function () {
			this.bus.unsubscribe("quotationmaster", "setDetailPage", this.setDetailPage, this);
		}
	});

}, true);
