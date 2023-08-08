sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
], function (JSONModel, BaseController) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.ProductSales.PurchaseReturnListDetail", {
		onInit: function () {
			
		},

		onBeforeRendering : function(){          
			
			console.log(this.getView().getModel("viewModel"))
			var model = this.getView().getModel("viewModel");
			if(model != undefined){
               this.getView().byId("challanNo").setValue(model.challanNo); 
			this.getView().byId("stockName").setValue(model.stockName); 
			this.getView().byId("unit").setValue(model.unit); 
			this.getView().byId("quantity").setValue(model.quantity);  
			this.getView().byId("stockstatus").setValue(model.stockstatus); 
			this.getView().byId("batchno").setValue(model.batchno); 
			this.getView().byId("status").setValue(model.status); 
			
			}
			
		},

		onCancel : function()
		{
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---purchasereturnlist--fclPurchaseReturnList");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}
	});
}, true);
