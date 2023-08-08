sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
], function (JSONModel, BaseController) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.ProductSales.ProductOrderDetail", {
		onInit: function () {
			
		},

		onBeforeRendering : function(){          
			
			console.log(this.getView().getModel("viewModel"))
			var model = this.getView().getModel("viewModel");
			if(model != undefined){
               this.getView().byId("pStk").setValue(model.stockName); 
			this.getView().byId("pQty").setValue(model.quantity); 
			this.getView().byId("pFreeQty").setValue(model.freeQty); 
			this.getView().byId("pUnit").setValue(model.unit); 
			this.getView().byId("pRate").setValue(model.rate); 
			this.getView().byId("pTax").setValue(model.taxName); 
			this.getView().byId("pAmt").setValue(model.amount); 
			this.getView().byId("pOther").setValue(model.otherchargesDetail); 
			}
			
		},

		onCancel : function()
		{
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---productorder--fclProductSalesOrder");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}
	});
}, true);
