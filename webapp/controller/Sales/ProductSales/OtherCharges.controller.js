sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageBox'
], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, MessageBox) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.ProductSales.OtherCharges", {
		onInit: function () {
			this.bus = sap.ui.getCore().getEventBus();
		},

		onBeforeRendering : function(){
            this.model = this.getView().getModel("viewModel");
			var oModel = new JSONModel();
			
		    if(this.model != undefined){				  
			  oModel.setData(this.model);
			}
			// else{
            //     oModel.setData({id : null, lineId : null, orderNumber : null, orderEntry : null, orderDate : null,
            //     customerName : "", itemName : "", totalWeight : null, openQuantity : null, toRelease : null, ratePerKg : null, farmName : "", farmerName : ""}); 
			// }

		    this.getView().setModel(oModel,"editOtherChargesModel");
		},
		
		onCancel : function()
		{
			this.bus.unsubscribe("purchasebillmaster", "purchasebillmaster", this.setDetailPage, this);
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---purchasebilllist--fclPurchaseBillMaster");
			//this.oFlexibleColumnLayout.removeAllMidColumnPages();
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}
	});
}, true);
