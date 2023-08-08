sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageBox',
	'sap/m/MessageToast',
	'sap/ui/model/Filter',
], function (JSONModel, BaseController, MessageBox, MessageToast,Filter) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.HatcherySales.DocInvoice", {
		
		onInit: function () {
			this.bus = sap.ui.getCore().getEventBus();
            this.bus.subscribe("hatcherydocinvoice", "setDetailPage", this.setDetailPage, this);     
            this.oFlexibleColumnLayout = this.byId("fclHatcheryDocInvoice");

			// set model for list dialog
			var oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.elev8rerp.componentcontainer.model.Sales.HatcherySales", "/invoice.json"));
			this.getView().setModel(oModel);
		},

		onExit: function () {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
		},

		onAddNewContent : function()
		{
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("hatcherydocinvoice", "setDetailPage", {viewName:"DocInvoiceContentDetail"});
		},

        setDetailPage: function (channel, event, data) {
            this.detailView = sap.ui.view({
                viewName: "sap.ui.elev8rerp.componentcontainer.view.Sales.HatcherySales." + data.viewName,
                type: "XML"
            });

            this.detailView.setModel(data.viewModel,"viewModel"); 
            this.oFlexibleColumnLayout.removeAllMidColumnPages();          
            this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
        },

        onListIconPress: function(oEvent) {
		   if (!this._oDialog) {
			  this._oDialog = sap.ui.xmlfragment("sap.ui.elev8rerp.componentcontainer.fragmentview.Sales.HatcherySales.DocInvoiceDialog", this);
		   }

		   // Multi-select if required
		   var bMultiSelect = !!oEvent.getSource().data("multi");
		   this._oDialog.setMultiSelect(bMultiSelect);

		   // Remember selections if required
		   var bRemember = !!oEvent.getSource().data("remember");
		   this._oDialog.setRememberSelections(bRemember);

		   this.getView().addDependent(this._oDialog);

		   // toggle compact style
		   jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
		   this._oDialog.open();
	    },

	    handleSearch: function(oEvent) {
		   var sValue = oEvent.getParameter("value");
		   var columns = ['customer', 'name','postingDate','dueDate','docDate'];			
		   var oFilter = new sap.ui.model.Filter(columns.map(function(colName) {
						    return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue); }),
					     false);  // false for OR condition
		   var oBinding = oEvent.getSource().getBinding("items");
		   oBinding.filter([oFilter]);
	    },

	    handleClose: function(oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			var selRow = aContexts.map(function(oContext) { return oContext.getObject();});
			this.getView().byId("txtCustomer").setValue(selRow[0].customer); 
			this.getView().byId("txtName").setValue(selRow[0].name); 
			this.getView().byId("txtCustomerRefNo").setValue(selRow[0].customerRefNo);
			this.getView().byId("cmbCurrency").setSelectedKey(selRow[0].localCurrency);
			this.getView().byId("txtPlaceOfSupply").setValue(selRow[0].placeOfSupply); 
			this.getView().byId("txtTransactionType").setValue(selRow[0].transactionType);		
			this.getView().byId("txtNo1").setValue(selRow[0].no1); 
			this.getView().byId("txtNo2").setValue(selRow[0].no2); 		
			this.getView().byId("txtStatus").setValue(selRow[0].status); 
			this.getView().byId("txtPostingDate").setValue(selRow[0].postingDate);
			this.getView().byId("txtDueDate").setValue(selRow[0].dueDate); 
			this.getView().byId("txtDocumentDate").setValue(selRow[0].documentDate); 
			this.getView().byId("txtOwner").setValue(selRow[0].owner); 
			this.getView().byId("txtTotalBeforeDiscount").setValue(selRow[0].totalBeforeDiscount); 
			this.getView().byId("txtDiscount").setValue(selRow[0].discount); 
			this.getView().byId("txtDiscount1").setValue(selRow[0].discount1); 
			this.getView().byId("txtTotalDownPayment").setValue(selRow[0].totalDownPayment); 			
			this.getView().byId("txtFreight").setValue(selRow[0].freight); 
			this.getView().byId("chkRounding").setSelected(selRow[0].rounding); 
			this.getView().byId("txtRoundTotal").setValue(selRow[0].roundTotal); 		
		 
			this.bindDetailTable(selRow[0].contentDetails);
	    },

	    bindDetailTable : function(oModel)
	   {
            //bind table
			var currentContext = this;
			// instantiating the model of type json
			var oModel = new sap.ui.model.json.JSONModel(oModel);
 
		   // Set the model to Table
		   var oTable = this.getView().byId("tblHatcheryDocInvoiceContent");
		   oTable.setModel(oModel,"dataModel");
 
		   // Template
		   var oTemplate = new sap.m.ColumnListItem({
				cells : [ new sap.m.Text({
							 text : "{dataModel>itemNo}"
					  }),new sap.m.Text({
							  text : "{dataModel>itemDescription}"
					  }),new sap.m.Text({
						 text : "{dataModel>quantity}"
					  }),new sap.m.Text({
						 text : "{dataModel>unitPrice}"
					  }),new sap.m.Text({
						 text : "{dataModel>discount}"
					  }),new sap.m.Text({
						 text : "{dataModel>taxCode}"
					  })	,new sap.m.Text({
						text : "{dataModel>WTaxLiable}"
					 }),new sap.m.Text({
						text : "{dataModel>total}"
					 }),new sap.m.Text({
						 text : "{dataModel>whse}"
					 }),new sap.m.Text({
						text : "{dataModel>binLocationAllocation}"
					 }),new sap.m.Text({
						text : "{dataModel>UOMCode}"
					 }),new sap.m.Text({
						text : "{dataModel>COGSLocation}"
					 }),new sap.m.Text({
						text : "{dataModel>location}"
					 }),new sap.ui.commons.Button({
							 text: "",
							 icon:"sap-icon://edit",
							 press: function (e) {
								 var viewModel = e.getSource().getBindingContext("dataModel");                                
								 
								 var model = {
								     "itemNo" : viewModel.getProperty("itemNo"),
								     "itemDescription" : viewModel.getProperty("itemDescription"),
								 	"quantity" : viewModel.getProperty("quantity"),
								     "unitPrice" : viewModel.getProperty("unitPrice"),
								     "discount" : viewModel.getProperty("discount"),
								     "taxCode" : viewModel.getProperty("taxCode"),
								     "WTaxLiable" : viewModel.getProperty("WTaxLiable"),
									 "total" : viewModel.getProperty("total"),
								     "whse" : viewModel.getProperty("whse"),
								     "binLocationAllocation" : viewModel.getProperty("binLocationAllocation"),
								     "UOMCode" : viewModel.getProperty("UOMCode"),
								     "COGSLocation" : viewModel.getProperty("COGSLocation"),
								     "location" : viewModel.getProperty("location")					 
								 }
								 
								 currentContext.bus = sap.ui.getCore().getEventBus();
								 currentContext.bus.publish("hatcherydocinvoice", "setDetailPage", {viewName:"DocInvoiceContentDetail", viewModel : model});
							 }
					  })
				  ]
			});
 
			oTable.bindAggregation("items", {
				path : "dataModel>/",
				sorter: { path: 'itemNo'},
				template : oTemplate
			})
	    },
    });
}, true);
