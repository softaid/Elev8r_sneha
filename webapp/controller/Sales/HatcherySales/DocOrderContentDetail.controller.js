sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
    
], function (JSONModel, BaseController, MessageToast, MessageBox) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.HatcherySales.DocOrderContentDetail", {
		onInit: function () {
			
		},

		onBeforeRendering : function(){
			var model = this.getView().getModel("viewModel");
			
			if(model != undefined){
				this.getView().byId("txtItemNo").setValue(model.itemNo); 
				this.getView().byId("txtDispatchQty").setValue(model.dispatchQty); 
				this.getView().byId("txtItemDescription").setValue(model.itemDescription); 
				this.getView().byId("txtQuantity").setValue(model.quantity); 
				this.getView().byId("txtUnitPrice").setValue(model.unitPrice); 
				this.getView().byId("txtDiscount").setValue(model.discount); 
				this.getView().byId("txtTaxCode").setValue(model.taxCode); 
				this.getView().byId("txtTotal").setValue(model.total); 
			}
		},
		
		onSave : function()
		{
			
		},

		onDelete : function(){
			
		},

		onCancel : function()
		{
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---hatcherydocorder--fclHatcheryDocOrder");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}
	});
}, true);
