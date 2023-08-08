sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageBox'
], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, MessageBox) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.ProductSales.ProductDeliveryListDetail", {
		onInit: function () {
			this.bus = sap.ui.getCore().getEventBus();
		},
		
		onAfterRendering : function(){          
			console.log(this.getView().getModel("viewModel"));
			var model = this.getView().getModel("viewModel");
			if(model != undefined){
               this.getView().byId("txtChallanNumber").setValue(model.challanNumber); 
			this.getView().byId("txtChallandate").setValue(model.challanDate); 
			this.getView().byId("pMode").setValue(model.modeOfTransport); 
			this.getView().byId("pVehicle").setValue(model.vehicleNumber); 
			this.getView().byId("pWeight").setValue(model.totalWeight); 
			this.getView().byId("pShipAddr").setValue(model.shippingAddress); 
			this.getView().byId("pAddressTo").setValue(model.addressTo);
			this.getView().byId("pCust").setValue(model.custName);
			this.getView().byId("txtSubject").setValue(model.subject);
			}
			
		},

		onCancel : function()
		{
			this.bus.unsubscribe("productdeliverymaster", "setDetailPage", this.setDetailPage, this);
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---productdelivery--fclProductDeliveryMaster");
			//this.oFlexibleColumnLayout.removeAllMidColumnPages();
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}
	});
}, true);
