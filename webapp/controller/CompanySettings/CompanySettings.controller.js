sap.ui.define([
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageToast',
	'sap/ui/model/json/JSONModel',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service', 
], function (BaseController, MessageToast, JSONModel, commonService) {
	"use strict";
	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.CompanySettings.CompanySettings", {

		onInit: function () {
			var oViewModel = new JSONModel({
					currentUser: "Administrator",
					lastLogin: new Date(Date.now() - 86400000),
					companyname : commonService.session("companyname"),
					companyaddress : commonService.session("address"),
					detailaddress : commonService.session("detailaddress"),
					companycontact : commonService.session("companycontact"),
					companyemail : commonService.session("companyemail"),
					city : commonService.session("city"),
					pincode : commonService.session("pincode"),
					contactno2 : commonService.session("contactno2"),
					faxnumber : commonService.session("faxnumber"),
				});

			this.setModel(oViewModel, "view");	
		},

		onMasterPressed: function (oEvent) {
			var oContext = oEvent.getParameter("listItem").getBindingContext("side");
			var sPath = oContext.getPath() + "/selected";
			oContext.getModel().setProperty(sPath, true);
			var sSelectedMasterElement = oContext.getProperty("title");
			var sKey = oContext.getProperty("key");
			this.getRouter().getTargets().display(sKey, {});
			this.getRouter().navTo(sKey);
		},

		onSavePressed: function () {
			MessageToast.show("Save was pressed");
		},

		onCancelPressed: function () {
			MessageToast.show("Cancel was pressed");
		},
		onNavButtonPress: function  () {
			this.getOwnerComponent().myNavBack();
		}
	});
});