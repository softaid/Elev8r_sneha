sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageBox'
], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, MessageBox) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.ProductSales.ProductOrder", {
		
		onInit: function () {
            this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("productsalesorder", "productsalesorder", this.setDetailPage, this);     	
			this.oFlexibleColumnLayout = this.byId("fclProductSalesOrder");
            // set model for list dialog
            var oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.elev8rerp.componentcontainer.model.Sales.ProductSales", "/productorder.json"));
             this.getView().setModel(oModel)
		},
		
		onExit: function () {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
		},

		onAddNewRow : function() {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("productsalesorder", "productsalesorder", {viewName:"ProductOrderDetail"});
		},

		onListIconPress: function(oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("sap.ui.elev8rerp.componentcontainer.fragmentview.Sales.ProductSales.ProductOrderDialog", this);
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
			var columns = ['orderDate', 'subject', 'custName', 'quotationNumber' ];			
			var oFilter = new sap.ui.model.Filter(columns.map(function(colName) {
				             return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue); }),
			              false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},
	
		handleClose: function(oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			var selRow = aContexts.map(function(oContext) { return oContext.getObject();});
            // this.getView().byId("txtOrderDate").setValue(selRow[0].orderDate); 
            this.getView().byId("txtSubject").setValue(selRow[0].subject);
            this.getView().byId("txtCustName").setValue(selRow[0].custName);
            this.getView().byId("txtQuotationNumber").setValue(selRow[0].quotationNumber);
            this.getView().byId("txtAgainstForm").setValue(selRow[0].againstForm);
            this.getView().byId("txtSalesRepresentative").setValue(selRow[0].salesRepresentative);
            this.getView().byId("txtReferredBy").setValue(selRow[0].referredBy);
            this.getView().byId("txtReferenceNumber").setValue(selRow[0].referenceNumber);
            this.getView().byId("txtReferencedate").setValue(selRow[0].referencedate);
            this.getView().byId("txtDueDate").setValue(selRow[0].dueDate);
            this.getView().byId("txtSalesType").setValue(selRow[0].salesType);
			this.bindTable(selRow[0].details);			
		},
	
		bindTable : function(oModel)
		{
			var currentContext = this;
			 // instantiating the model of type json
			var oModel = new sap.ui.model.json.JSONModel(oModel);
		    // Set the model to Table
		    var oTable = this.getView().byId("tblProductSalesOrder");
            oTable.setModel(oModel);
            oTable.setModel(oModel,"dataModel");
		    // Template
		    var oTemplate = new sap.m.ColumnListItem({
		    cells : [ new sap.m.Text({
			   text : "{dataModel>stockName}"
		    }), new sap.m.Text({
                text : "{dataModel>quantity}"
            }),
            new sap.m.Text({
                text : "{dataModel>freeQty}"
            }),
            new sap.m.Text({
                text : "{dataModel>unit}"
            }),
            new sap.m.Text({
                text : "{dataModel>rate}"
            }),
            new sap.m.Text({
                text : "{dataModel>taxName}"
            }),
            new sap.m.Text({
                text : "{dataModel>amount}"
            }),
            new sap.m.Text({
                text : "{dataModel>otherchargesDetail}"
            }),new sap.ui.commons.Button({
                text: "",
                icon:"sap-icon://navigation-right-arrow",
                press: function (e) {
                    console.log( e.getSource().getBindingContext("dataModel"))
                    var viewModel = e.getSource().getBindingContext("dataModel");    
                    var model = {
                        "stockName" : viewModel.getProperty("stockName"),
                        "quantity" : viewModel.getProperty("quantity"),
                        "freeQty" : viewModel.getProperty("freeQty"),
                        "unit" : viewModel.getProperty("unit"),
                        "rate" : viewModel.getProperty("rate"),
                        "taxName" : viewModel.getProperty("taxName"),
                        "amount" : viewModel.getProperty("amount"),
                        "otherchargesDetail" : viewModel.getProperty("otherchargesDetail"),	
                    }
                    
                    currentContext.bus = sap.ui.getCore().getEventBus();
			        currentContext.bus.publish("productsalesorder", "productsalesorder", {viewName:"ProductOrderDetail", viewModel : model});
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
