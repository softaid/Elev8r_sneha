sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageBox'
], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, MessageBox) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.ProductSales.PurchaseReturnList", {
		
		onInit: function () {
            this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("purchasereturnlist", "purchasereturnlist", this.setDetailPage, this);     	
			this.oFlexibleColumnLayout = this.byId("fclPurchaseReturnList");
            // set model for list dialog
            var oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.elev8rerp.componentcontainer.model.Sales.ProductSales", "/purchasereturn.json"));
             this.getView().setModel(oModel)
		},
		
		onExit: function () {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
		},

		onAddNewRow : function() {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("purchasereturnlist", "purchasereturnlist", {viewName:"PurchaseReturnListDetail"});
		},

		onListIconPress: function(oEvent) {
            console.log(this._oDialog);
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("sap.ui.elev8rerp.componentcontainer.fragmentview.Sales.ProductSales.purchaseReturnDialog", this);
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
	
		// handleSearch: function(oEvent) {
		// 	var sValue = oEvent.getParameter("value");
		// 	var columns = ['orderDate', 'subject', 'custName', 'quotationNumber' ];			
		// 	var oFilter = new sap.ui.model.Filter(columns.map(function(colName) {
		// 		             return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue); }),
		// 	              false);  // false for OR condition
		// 	var oBinding = oEvent.getSource().getBinding("items");
		// 	oBinding.filter([oFilter]);
		// },
	
		handleClose: function(oEvent) {
            console.log(oEvent.getParameter("selectedContexts"));
			var aContexts = oEvent.getParameter("selectedContexts");
            var selRow = aContexts.map(function(oContext) { return oContext.getObject();});
            console.log(selRow);
            // this.getView().byId("txtOrderDate").setValue(selRow[0].orderDate); 
            this.getView().byId("number").setValue(selRow[0].number);
            this.getView().byId("date").setValue(selRow[0].date);
            this.getView().byId("nuSupplierName").setSelectedKey(selRow[0].nuSupplierName);
            this.getView().byId("orderNumber").setSelectedKey(selRow[0].orderNumber);
            this.getView().byId("againstForm").setValue(selRow[0].againstForm);
            this.getView().byId("subject").setValue(selRow[0].subject);
            this.getView().byId("addressTo").setValue(selRow[0].addressTo);
			this.bindTable(selRow[0].details);			
		},
	
		bindTable : function(oModel)
		{
			var currentContext = this;
			 // instantiating the model of type json
			var oModel = new sap.ui.model.json.JSONModel(oModel);
		    // Set the model to Table
		    var oTable = this.getView().byId("tblPurchaseReturnList");
            oTable.setModel(oModel);
            oTable.setModel(oModel,"dataModel");
		    // Template
		    var oTemplate = new sap.m.ColumnListItem({
		    cells : [ new sap.m.Text({
			   text : "{dataModel>challanNo}"
		    }), new sap.m.Text({
                text : "{dataModel>stockname}"
            }), new sap.m.Text({
                text : "{dataModel>unit}"
            }),new sap.m.Text({
                text : "{dataModel>quantity}"
            }),
            new sap.m.Text({
                text : "{dataModel>stockstatus}"
            }),new sap.m.Text({
                text : "{dataModel>batchno}"
            }),new sap.m.Text({
                text : "{dataModel>status}"
            }),new sap.ui.commons.Button({
                text: "",
                icon:"sap-icon://navigation-right-arrow",
                press: function (e) {
                    console.log( e.getSource().getBindingContext("dataModel"))
                    var viewModel = e.getSource().getBindingContext("dataModel");    
                    var model = {
                        "challanNo" : viewModel.getProperty("challanNo"),
						"stockname" : viewModel.getProperty("stockname"),
						"unit" : viewModel.getProperty("unit"), 
                        "quantity" : viewModel.getProperty("quantity"),
						"stockstatus" : viewModel.getProperty("stockstatus"),
						"batchno" : viewModel.getProperty("batchno"),
						"status": viewModel.getProperty("status"),
                    }
                    
                    currentContext.bus = sap.ui.getCore().getEventBus();
			        currentContext.bus.publish("purchasereturnlist", "purchasereturnlist", {viewName:"PurchaseReturnListDetail", viewModel : model});
                }
                })
		   ]
          });
          
          
		  oTable.bindAggregation("items", {
             path : "dataModel>/",
			 sorter: { path: 'from'},
			 template : oTemplate
		   })
        },
        
        setDetailPage: function (channel, event, data) {
            this.detailView = sap.ui.view({
                viewName: "sap.ui.elev8rerp.componentcontainer.view.Sales.ProductSales." + data.viewName,
                type: "XML"
            });

           this.detailView.setModel(data.viewModel,"viewModel"); 
            this.oFlexibleColumnLayout.removeAllMidColumnPages();          
            this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
        },
	});
}, true);
