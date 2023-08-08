sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
], function (JSONModel, BaseController) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.ProductSales.CreditMemoDetail", {
		onInit: function () {
			
		},

		onBeforeRendering : function(){          
			
			console.log(this.getView().getModel("viewModel"))
			var model = this.getView().getModel("viewModel");
			if(model != undefined){
               this.getView().byId("itemServiceType").setValue(model.itemServiceType); 
			this.getView().byId("summaryType").setValue(model.summaryType); 
			this.getView().byId("description").setValue(model.description); 
			this.getView().byId("sac").setValue(model.sac); 
			this.getView().byId("glAccount").setValue(model.glAccount); 
			this.getView().byId("glAccountName").setValue(model.glAccountName); 
			this.getView().byId("tax").setValue(model.tax); 
			this.getView().byId("total").setValue(model.total); 
            }
		},

		onCancel : function()
		{
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---creditmemo--fclCreditMemo");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}
	});
}, true);
