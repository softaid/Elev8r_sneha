sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageBox'
], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, MessageBox) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.ProductSales.PurchaseBillList", {
        
        onInit: function () {

            this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("purchasebillmaster", "purchasebillmaster", this.setDetailPage, this);     	
			this.oFlexibleColumnLayout = this.byId("fclPurchaseBillMaster");
            var oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.elev8rerp.componentcontainer.model.Sales.ProductSales", "/purchasebill.json"));
			 this.getView().setModel(oModel)
			 
			 var model = new JSONModel();
			 model.setData({modelData : []});
			this.getView().setModel(model, "itemTableModel");

			var omodel = new JSONModel();
			omodel.setData({modelData : []});

			this.getView().setModel(omodel, "stkTableModel");

			var omodel1 = new JSONModel();
			omodel1.setData({modelData : []});
			this.getView().setModel(omodel1, "tblTaxModel");

			var omodel2 = new JSONModel();
			omodel2.setData({modelData : []});
			this.getView().setModel(omodel2, "tblOtherChargesModel");
		},
		
		onExit: function () {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
		},

		onAddNewRow : function() {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("purchasebillmaster", "purchasebillmaster", {viewName:"ChallanDetail"});
		},
		onAddNewRow1 : function() {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("purchasebillmaster", "purchasebillmaster", {viewName:"StockDetail"});
		},
		onAddNewRow2 : function() {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("purchasebillmaster", "purchasebillmaster", {viewName:"TaxDetail"});
		},
		onAddNewRow3 : function() {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("purchasebillmaster", "purchasebillmaster", {viewName:"OtherChargesDetail"});
		},

		onListIconPress: function(oEvent) {
            if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("sap.ui.elev8rerp.componentcontainer.fragmentview.Sales.ProductSales.purchaseBillDialog", this);
			 }
  
			 var bMultiSelect = !!oEvent.getSource().data("multi");
			 this._oDialog.setMultiSelect(bMultiSelect);
  
			 var bRemember = !!oEvent.getSource().data("remember");
			 this._oDialog.setRememberSelections(bRemember);
  
			 this.getView().addDependent(this._oDialog);
  
			 jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			 this._oDialog.open();
		},

		handleClose: function(oEvent) {
            console.log(oEvent.getParameter("selectedContexts"));
			var aContexts = oEvent.getParameter("selectedContexts");
            var selRow = aContexts.map(function(oContext) { return oContext.getObject();});
            console.log(selRow);
			
			this.getView().byId("billDate").setValue(selRow[0].billDate);
            this.getView().byId("custName").setSelectedKey(selRow[0].custName);
            this.getView().byId("orderNumber").setSelectedKey(selRow[0].orderNumber);
            this.getView().byId("againstForm").setValue(selRow[0].againstForm);
            this.getView().byId("salesRepresentative").setValue(selRow[0].salesRepresentative);
            this.getView().byId("referredBy").setSelectedKey(selRow[0].referredBy);
            this.getView().byId("addressTo").setValue(selRow[0].addressTo);
            this.getView().byId("creditPeriod").setValue(selRow[0].creditPeriod);
			this.getView().byId("salesType").setSelectedKey(selRow[0].salesType);
			this.getView().byId("netTotal").setValue(selRow[0].netTotal);
			this.getView().byId("discount").setValue(selRow[0].discount);
			this.getView().byId("taxTotal").setValue(selRow[0].taxTotal);
			this.getView().byId("otherCharges").setValue(selRow[0].otherCharges);
			this.getView().byId("subTotal").setValue(selRow[0].subTotal);
			this.getView().byId("roundOff").setValue(selRow[0].roundOff);
			
			console.log("Challan details :", selRow[0].challanDetails);
			this.bindTable1(selRow[0].challanDetails);		
			this.bindTable2(selRow[0].stockDetails);		
			this.bindTable3(selRow[0].taxDetails);		
			this.bindTable4(selRow[0].otherDetails);			
		},

		bindTable1 : function(data)
		{
			var oTable = this.getView().byId("itemTable");
			var oModel = this.getView().getModel("itemTableModel");

			oModel.setData({modelData : data}); 
			oModel.refresh();
		},

		bindTable2 : function(data)
		{
			var oTable = this.getView().byId("stkTable");
			var oModel = this.getView().getModel("stkTableModel");

			oModel.setData({modelData : data}); 
			oModel.refresh();
		},

		bindTable3 : function(data)
		{
			var oTable = this.getView().byId("tblTax");
			var oModel = this.getView().getModel("tblTaxModel");

			oModel.setData({modelData : data}); 
			oModel.refresh();
		},

		bindTable4 : function(data)
		{
			var oTable = this.getView().byId("tblOtherCharges");
			var oModel = this.getView().getModel("tblOtherChargesModel");

			oModel.setData({modelData : data}); 
			oModel.refresh();
        },
        

        setDetailPage: function (channel, event, data) {
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---purchasebilllist--fclPurchaseBillMaster");
			   this.detailView = sap.ui.view({
					viewName: "sap.ui.elev8rerp.componentcontainer.view.Sales.ProductSales." + data.viewName,
					type: "XML"
			   });
	
			this.detailView.setModel(data.viewModel ,"viewModel");
			this.oFlexibleColumnLayout.removeAllMidColumnPages();
			this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
		},

        
        onChallanListPress: function (oEvent) {
			var viewModel = oEvent.getSource().getBindingContext("itemTableModel");                           						
			var model =  {
				"challanNo" : viewModel.getProperty("challanNo"),
                "challanDate" : viewModel.getProperty("challanDate")
			};

		    this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("purchasebillmaster", "purchasebillmaster", {viewName:"ChallanDetail" , viewModel : model});
		},
		
		onStockListPress: function (oEvent) {
			var viewModel = oEvent.getSource().getBindingContext("stkTableModel");                           						
			var model =  {
				"stockName" : viewModel.getProperty("stockName"),
				"quantity" : viewModel.getProperty("quantity"),
				"freeqty" : viewModel.getProperty("freeqty"),
				"unit" : viewModel.getProperty("unit"),
				"rate" : viewModel.getProperty("rate"),
			};
		    this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("purchasebillmaster", "purchasebillmaster", {viewName:"StockDetail" , viewModel : model});

		},
		
		onTaxPress: function (oEvent) {
			var viewModel = oEvent.getSource().getBindingContext("tblTaxModel");                           						
			var model =  {
				"taxName" : viewModel.getProperty("taxName"),
                "amount" : viewModel.getProperty("amount")
			};
		    this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("purchasebillmaster", "purchasebillmaster", {viewName:"TaxDetail" , viewModel : model});
		},
		
		onOtherChargesPress: function (oEvent) {
			var viewModel = oEvent.getSource().getBindingContext("tblOtherChargesModel");                           						
			var model =  {
				"otherchargesDetail" : viewModel.getProperty("otherchargesDetail"),
                "otherAmount" : viewModel.getProperty("otherAmount")
			};
		    this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("purchasebillmaster", "purchasebillmaster", {viewName:"OtherChargesDetail" , viewModel : model});
        },
	});
}, true);
