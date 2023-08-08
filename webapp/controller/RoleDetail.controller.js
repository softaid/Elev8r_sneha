sap.ui.define([
	"sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    
], function (JSONModel, BaseController) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.RoleDetail", {
		onInit: function () {
			
		},

		onAfterRendering : function(){
            var model = this.getView().getModel("viewModel");
			if(model != undefined){				
			   this.getView().byId("txtRole").setValue(model.name);	
			   this.getView().byId("txtDescription").setValue(model.description);	
            }				  			   			   
		},

		onCancel : function()
		{
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---usermanagement--fclUserManagement");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}
	});
}, true);
