sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageBox'
], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, MessageBox) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.ProductSales.CreditMemo", {
		
		onInit: function () {
            this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("creditmemo", "creditmemo", this.setDetailPage, this);     	
			this.oFlexibleColumnLayout = this.byId("fclCreditMemo");
            // set model for list dialog
            var oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.elev8rerp.componentcontainer.model.Sales.ProductSales", "/creditMemo.json"));
             this.getView().setModel(oModel)
		},
		
		onExit: function () {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
		},

		onAddNewRow : function() {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("creditmemo", "creditmemo", {viewName:"CreditMemoDetail"});
		},

		onListIconPress: function(oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("sap.ui.elev8rerp.componentcontainer.fragmentview.Sales.ProductSales..creditMemoDialog", this);
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
			var aContexts = oEvent.getParameter("selectedContexts");
			var selRow = aContexts.map(function(oContext) { return oContext.getObject();});
            // this.getView().byId("txtOrderDate").setValue(selRow[0].orderDate); 
            this.getView().byId("vendor").setSelectedKey(selRow[0].vendor);
            this.getView().byId("name").setValue(selRow[0].name);
            this.getView().byId("contactPerson").setSelectedKey(selRow[0].contactPerson);
            this.getView().byId("vendorReferenceNumber").setValue(selRow[0].vendorReferenceNumber);
            this.getView().byId("localCurrency").setSelectedKey(selRow[0].localCurrency);
            this.getView().byId("transactionType").setValue(selRow[0].transactionType);
            this.getView().byId("shipFrom").setValue(selRow[0].shipFrom);
            this.getView().byId("number").setValue(selRow[0].number);
            this.getView().byId("status").setValue(selRow[0].status);
            this.getView().byId("postingDate").setValue(selRow[0].postingDate);
            this.getView().byId("dueDate").setValue(selRow[0].dueDate);
            this.getView().byId("documentDate").setValue(selRow[0].documentDate);
            this.getView().byId("buyer").setSelectedKey(selRow[0].buyer);
            this.getView().byId("owner").setSelectedKey(selRow[0].documentDate);
            this.getView().byId("totalBeforeDiscount").setValue(selRow[0].totalBeforeDiscount);
            this.getView().byId("discount").setValue(selRow[0].discount);
            this.getView().byId("totalDownPayment").setValue(selRow[0].totalDownPayment);
            this.getView().byId("freight").setValue(selRow[0].freight);
            this.getView().byId("dTax").setValue(selRow[0].dTax);
            this.getView().byId("totalCredit").setValue(selRow[0].totalCredit);
            this.getView().byId("appliedAmount").setValue(selRow[0].appliedAmount);
            this.getView().byId("totalBalance").setValue(selRow[0].totalBalance);
			this.bindTable(selRow[0].details);			
		},
	
		bindTable : function(oModel)
		{
			var currentContext = this;
			 // instantiating the model of type json
			var oModel = new sap.ui.model.json.JSONModel(oModel);
		    // Set the model to Table
		    var oTable = this.getView().byId("tblCreditMemo");
            oTable.setModel(oModel);
            oTable.setModel(oModel,"dataModel");
		    // Template
		    var oTemplate = new sap.m.ColumnListItem({
		    cells : [ new sap.m.Text({
			   text : "{dataModel>itemServiceType}"
		    }), new sap.m.Text({
                text : "{dataModel>summaryType}"
            }),
            new sap.m.Text({
                text : "{dataModel>description}"
            }),
            new sap.m.Text({
                text : "{dataModel>sac}"
            }),
            new sap.m.Text({
                text : "{dataModel>glAccount}"
            }),
            new sap.m.Text({
                text : "{dataModel>glAccountName}"
            }),
            new sap.m.Text({
                text : "{dataModel>tax}"
            }),
            new sap.m.Text({
                text : "{dataModel>total}"
            }),new sap.ui.commons.Button({
                text: "",
                icon:"sap-icon://navigation-right-arrow",
                press: function (e) {
                    console.log( e.getSource().getBindingContext("dataModel"))
                    var viewModel = e.getSource().getBindingContext("dataModel");    
                    var model = {
                        "itemServiceType" : viewModel.getProperty("itemServiceType"),
                        "summaryType" : viewModel.getProperty("summaryType"),
                        "description" : viewModel.getProperty("description"),
                        "sac" : viewModel.getProperty("sac"),
                        "glAccount" : viewModel.getProperty("glAccount"),
                        "glAccountName" : viewModel.getProperty("glAccountName"),
                        "tax" : viewModel.getProperty("tax"),
                        "total" : viewModel.getProperty("total"),	
                    }
                    
                    currentContext.bus = sap.ui.getCore().getEventBus();
			        currentContext.bus.publish("creditmemo", "creditmemo", {viewName:"CreditMemoDetail", viewModel : model});
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
