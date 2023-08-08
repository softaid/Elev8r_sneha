sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/ui/elev8rerp/componentcontainer/utility/Validator',
	'sap/ui/core/ValueState',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/elev8rerp/componentcontainer/services/Masters/Location.service',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function'



], function (JSONModel, BaseController, Validator, ValueState, MessageToast, MessageBox, locationService, commonService, commonFunction) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Masters.LocationMasterDetail", {
		onInit: function () {			
			this.fnShortCut();
		},

		onBeforeRendering: function () {
			var currentContext = this;
			this.model = this.getView().getModel("viewModel");
			var oModel = new JSONModel();


			if (this.model.locationid != undefined) {
				locationService.getLocation(this.model, function (data) {
                    if(data.length && data[0].length){
                        oModel.setData(data[0][0]);
                    }
				});
				this.getView().byId("btnSave").setText("Update");
			} else {
				this.getView().byId("btnDelete").setVisible(false);
			}
			currentContext.getView().setModel(oModel, "editLocationModel");
		},

		fnShortCut: function () {
			var currentContext = this;
			$(document).keydown(function (evt) {
				if (evt.keyCode == 83 && (evt.altKey)) {
					evt.preventDefault();
					jQuery(document).ready(function ($) {
						currentContext.onSave()
					})
				}
				if (evt.keyCode == 69 && (evt.altKey)) {
					evt.preventDefault();
					jQuery(document).ready(function ($) {
						currentContext.onCancel()
					})
				}
			});
		},

		resourceBundle: function () {
			var currentContext = this;
			var oBundle = this.getModel("i18n").getResourceBundle()
			return oBundle
		},

		onSave: function () {
			if (this.validateForm()) {
				var currentContext = this;
				var model = this.getView().getModel("editLocationModel").oData;
				model["companyid"] = commonService.session("companyId");
				model["userid"] = commonService.session("userId");
				let saveMsg = currentContext.resourceBundle().getText("saveLocationMsg");
                let updateMsg = currentContext.resourceBundle().getText("updateLocationMsg");
				let locationExist = currentContext.resourceBundle().getText("locationExist");
				var flag = 0;
				for (var i = 0; i < this.model.locationModel.length; i++) {
					if (model.locationname.toLowerCase() == this.model.locationModel[i].locationname.toLowerCase() && model.id != this.model.locationModel[i].id) {
						flag = 1
						MessageBox.error(locationExist);
					}
				}
				if (flag == 0) {

					locationService.saveLocation(model, function (data) {
						if (data.id > 0) {

							var message = model.id == null ? saveMsg : updateMsg;
							currentContext.onCancel();
							MessageToast.show(message);
							currentContext.bus = sap.ui.getCore().getEventBus();
							currentContext.bus.publish("loaddata", "loadData");
						}
					});
				}
			}
		},

		validateForm: function () {
			var isValid = true;
			let validateLocationName = this.resourceBundle().getText("validateLocationName");
			// let validateLocationBranch = this.resourceBundle().getText("validateLocationBranch");
			// let validateLocationCostCenter = this.resourceBundle().getText("validateLocationCostCenter");

			if (!commonFunction.isRequired(this, "txtLocationName", validateLocationName))
				isValid = false;

			// if (!commonFunction.isSelectRequired(this, "txtBranchName", validateLocationBranch))
			// 	isValid = false;

			// if (!commonFunction.isRequired(this, "costcenter", validateLocationCostCenter))
			// 	isValid = false;


			return isValid;
		},

		onDelete: function () {
			var currentContext = this;
			let deleteLocation = currentContext.resourceBundle().getText("deleteLocation");
			let deleteMsg = currentContext.resourceBundle().getText("deleteMsg");
			if (this.model != undefined) {
				MessageBox.confirm(
					deleteMsg, {
					styleClass: "sapUiSizeCompact",
					onClose: function (sAction) {
						if (sAction == "OK") {
							locationService.deleteLocation(currentContext.model, function (data) {
								if (data) {
									currentContext.onCancel();
									MessageToast.show(deleteLocation);
									currentContext.bus = sap.ui.getCore().getEventBus();
									currentContext.bus.publish("loaddata", "loadData");
								}
							});
						}
					}
				});
			}
		},

		onCancel: function () {
			this.getView().byId("txtLocationName").setValue("");
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---locationmaster--fclLocationMaster");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		},
	});
}, true);
