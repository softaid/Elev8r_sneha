sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/m/MessageBox'

], function (JSONModel, BaseController, MessageToast, MessageBox) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Unknown", {
        
        onInit: function () {
			var oRouter, oTarget;

			oRouter = this.getRouter();
			oTarget = oRouter.getTarget("unknown");
			oTarget.attachDisplay(function (oEvent) {
				this._oData = oEvent.getParameter("data");	// store the data
			}, this);
		},

		// override the parent's onNavBack (inherited from BaseController)
		onNavBack : function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getTargets().display("home", {});
			oRouter.navTo("home", true);
		}
		
    });
}, true);
