sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageBox'
], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, MessageBox) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.ProductSales.ProductDeliveryList", {
        
        onInit: function () {

            var oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.elev8rerp.componentcontainer.model.Sales.ProductSales", "/productDelivery.json"));
			this.getView().setModel(oModel, "productdelivery");

            // this.bus = sap.ui.getCore().getEventBus();
			// this.bus.subscribe("productdeliverymaster", "setDetailPage", this.setDetailPage, this);

            // this.oFlexibleColumnLayout = this.byId("fclProductDeliveryMaster");
        },

        //("componentcontainer---productdelivery--fclChallanMaster");

        handleClose: function(oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			var selRow = aContexts.map(function(oContext) { return oContext.getObject();});
            // this.getView().byId("txtOrderDate").setValue(selRow[0].orderDate); 
            // this.getView().byId("txtSubject").setValue(selRow[0].subject);
            // this.getView().byId("txtCustName").setValue(selRow[0].custName);
            // this.getView().byId("txtQuotationNumber").setValue(selRow[0].quotationNumber);
            // this.getView().byId("txtAgainstForm").setValue(selRow[0].againstForm);
            // this.getView().byId("txtSalesRepresentative").setValue(selRow[0].salesRepresentative);
            // this.getView().byId("txtReferredBy").setValue(selRow[0].referredBy);
            // this.getView().byId("txtReferenceNumber").setValue(selRow[0].referenceNumber);
            // this.getView().byId("txtReferencedate").setValue(selRow[0].referencedate);
            // this.getView().byId("txtDueDate").setValue(selRow[0].dueDate);
            // this.getView().byId("txtSalesType").setValue(selRow[0].salesType);
			// this.bindTable(selRow[0].details);			
		},
	
		// bindTable : function(oModel)
		// {
		// 	var currentContext = this;
		// 	 // instantiating the model of type json
		// 	var oModel = new sap.ui.model.json.JSONModel(oModel);
		//     // Set the model to Table
		//     var oTable = this.getView().byId("tblProductDeliveryList");
        //     oTable.setModel(oModel);
        //     oTable.setModel(oModel,"dataModel");
		//     // Template
		//     var oTemplate = new sap.m.ColumnListItem({
		//     cells : [ new sap.m.Text({
		// 	   text : "{dataModel>challanNumber}"
		//     }), new sap.m.Text({
        //         text : "{dataModel>challanDate}"
        //     }), new sap.m.Text({
        //         text : "{dataModel>addressTo}"
        //     }), new sap.m.Text({
        //         text : "{dataModel>modeOfTransport}"
        //     }), new sap.m.Text({
        //         text : "{dataModel>vehicleNumber}"
        //     }), new sap.m.Text({
        //         text : "{dataModel>totalWeight}"
        //     }), new sap.m.Text({
        //         text : "{dataModel>shippingAddress}"
        //     }),
        //     new sap.m.Text({
        //         text : "{dataModel>againstChallanCumInvoice}"
        //     }),
        //     new sap.m.Text({
        //         text : "{dataModel>subject}"
        //     }),
        //     new sap.m.Text({
        //         text : "{dataModel>orderNumber}"
        //     }),
        //     new sap.m.Text({
        //         text : "{dataModel>custName}"
        //     }),
        //     new sap.m.Text({
        //         text : "{dataModel>status}"
        //     }),new sap.ui.commons.Button({
        //         text: "",
        //         icon:"sap-icon://edit",
        //         press: function (e) {
        //             console.log( e.getSource().getBindingContext("dataModel"))
        //             var viewModel = e.getSource().getBindingContext("dataModel");    
        //             var model = {
        //                 "challanNumber" : viewModel.getProperty("challanNumber"),
        //                 "challanDate" : viewModel.getProperty("challanDate"),
        //                 "addressTo" : viewModel.getProperty("addressTo"),
        //                 "modeOfTransport" : viewModel.getProperty("modeOfTransport"),
        //                 "vehicleNumber" : viewModel.getProperty("vehicleNumber"),
        //                 "totalWeight" : viewModel.getProperty("totalWeight"),
        //                 "shippingAddress" : viewModel.getProperty("shippingAddress"),
        //                 "againstChallanCumInvoice" : viewModel.getProperty("againstChallanCumInvoice"),
        //                 "subject" : viewModel.getProperty("subject"),
        //                 "orderNumber" : viewModel.getProperty("orderNumber"),
        //                 "custName" : viewModel.getProperty("custName"),
        //                 "status" : viewModel.getProperty("status"),
        //             }
                    
        //             currentContext.bus = sap.ui.getCore().getEventBus();
		// 	        currentContext.bus.publish("productdeliverymaster", "productdeliverymaster", {viewName:"ProductDeliveryListDetail", viewModel : model});
        //         }
        //         })
		//    ]
        //   });
          
          
		//   oTable.bindAggregation("items", {
        //      path : "dataModel>/",
		// 	 sorter: { path: 'from'},
		// 	 template : oTemplate
		//    })
        // },

        setDetailPage: function (channel, event, data) {
            console.log(data);
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---productdelivery--fclProductDeliveryMaster");
			
			   this.detailView = sap.ui.view({
					viewName: "sap.ui.elev8rerp.componentcontainer.view.Sales.ProductSales." + data.viewName,
					type: "XML"
			   });
	
			this.oFlexibleColumnLayout.removeAllMidColumnPages();
			this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
		},

        onAddNew:  function (oEvent) {
		    this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("productdeliverymaster", "setDetailPage", {viewName:"ProductDeliveryListDetail"});
        },
        
        onProductDeliveryPress: function (oEvent) {
            var viewModel = oEvent.getSource().getBindingContext("productdelivery");                                
            var model = {
                "challanNumber" : viewModel.getProperty("challanNumber"),
                "challanDate" : viewModel.getProperty("challanDate"),
                "addressTo" : viewModel.getProperty("addressTo"),
                "modeOfTransport" : viewModel.getProperty("modeOfTransport"),
                "vehicleNumber" : viewModel.getProperty("vehicleNumber"),
                "totalWeight" : viewModel.getProperty("totalWeight"),
                "shippingAddress" : viewModel.getProperty("shippingAddress"),
                "againstChallanCumInvoice" : viewModel.getProperty("againstChallanCumInvoice"),
                "subject" : viewModel.getProperty("subject"),
                "orderNumber" : viewModel.getProperty("orderNumber"),
                "custName" : viewModel.getProperty("custName"),
                "status" : viewModel.getProperty("status"),					
            }

		    this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("productdeliverymaster", "setDetailPage", {viewName:"ProductDeliveryListDetail", viewModel : model});
		},
	});
}, true);
