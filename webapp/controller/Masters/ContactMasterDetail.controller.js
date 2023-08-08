sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/ui/elev8rerp/componentcontainer/utility/Validator',
	'sap/ui/core/ValueState',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/elev8rerp/componentcontainer/services/Masters/Contact.service',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/Masters/Masters.service'


], function (JSONModel, BaseController, Validator, ValueState, MessageToast, MessageBox, contactService, commonService, commonFunction, masterService) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Masters.ContactMasterDetail", {
		onInit: function () {			
			this.fnShortCut();
		},

		onBeforeRendering: function () {
			var currentContext = this;
			this.model = this.getView().getModel("viewModel");
			var oModel = new JSONModel();

			masterService.getReferenceByTypeCode({ typecode: "CntType" }, function (data) {
				var oModel = new sap.ui.model.json.JSONModel();
				if(data.length && data[0].length){
					oModel.setData({ modelData: data[0] });
					currentContext.getView().setModel(oModel, "contactTypeModel");
				}else{
					oModel.setData({ modelData: [] });
					currentContext.getView().setModel(oModel, "contactTypeModel");
				}
			});
			masterService.getReferenceByTypeCode({ typecode: "CntCtgry" }, function (data) {
				var oModel = new sap.ui.model.json.JSONModel();
				if(data.length && data[0].length){
					oModel.setData({ modelData: data[0] });
					currentContext.getView().setModel(oModel, "categoryModel");
				}else{
					oModel.setData({ modelData: [] });
					currentContext.getView().setModel(oModel, "categoryModel");
				}
			});

			if (this.model.contactid != undefined) {
				contactService.getContact({id : this.model.contactid}, function (data) {
                    if(data.length && data[0].length){
                        oModel.setData(data[0][0]);
						currentContext.getView().byId("contacttype").setSelectedKey(data[0][0].contacttypeid);
						currentContext.getView().byId("category").setSelectedKey(data[0][0].contactcategoryid);
                    }
				});
				this.getView().byId("btnSave").setText("Update");
			} else {
				this.getView().byId("btnDelete").setVisible(false);
			}
			currentContext.getView().setModel(oModel, "editContactModel");
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
				var model = this.getView().getModel("editContactModel").oData;
				model["companyid"] = commonService.session("companyId");
				model["userid"] = commonService.session("userId");
				model["DOB"] = commonFunction.getDate(model.DOB);
				model["DOM"] = commonFunction.getDate(model.DOM);
				model["contacttypeid"] = this.getView().byId("contacttype").getSelectedKey();
				model["contactcategoryid"] = this.getView().byId("category").getSelectedKey();
                let saveMsg = currentContext.resourceBundle().getText("contactSaveMsg");
                let updateMsg = currentContext.resourceBundle().getText("contactUpdateMsg");
				var flag = 0;
				// for (var i = 0; i < this.model.contactModel.length; i++) {
				// 	if (model.contactname.toLowerCase() == this.model.contactModel[i].contactname.toLowerCase() && model.id != this.model.contactModel[i].id) {
				// 		flag = 1
				// 		MessageBox.error(ContactNameExist);
				// 	}
				// }
				if (flag == 0) {

					contactService.saveContact(model, function (data) {
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

			let contactNameValidate = this.resourceBundle().getText("contactNameValidate");
			let contactCompanyValidate = this.resourceBundle().getText("contactCompanyValidate");
			let contactEmailValidate = this.resourceBundle().getText("contactEmailValidate");
			let contactMobileValidate = this.resourceBundle().getText("contactMobileValidate");
			let contactDOBValidate = this.resourceBundle().getText("contactDOBValidate");
			let contactReferenceValidate = this.resourceBundle().getText("contactReferenceValidate");
			let contactDesignationValidate = this.resourceBundle().getText("contactDesignationValidate");
			let contactTypeValidate = this.resourceBundle().getText("contactTypeValidate");
			let contactCategoryValidate = this.resourceBundle().getText("contactCategoryValidate");

			if (!commonFunction.isRequired(this, "txtContactName", contactNameValidate))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtCompanyName", contactCompanyValidate))
				isValid = false;

			if (!commonFunction.isRequired(this, "emailp", contactEmailValidate))
				isValid = false;

			if (!commonFunction.isRequired(this, "mobilep", contactMobileValidate))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtdatedob", contactDOBValidate))
				isValid = false;

			if (!commonFunction.isRequired(this, "contactreference", contactReferenceValidate))
				isValid = false;

			if (!commonFunction.isRequired(this, "designation", contactDesignationValidate))
				isValid = false;

			if (!commonFunction.isSelectRequired(this, "contacttype", contactTypeValidate))
				isValid = false;

			if (!commonFunction.isSelectRequired(this, "category", contactCategoryValidate))
				isValid = false;

			return isValid;
		},

		onDelete: function () {
			var currentContext = this;
			let deleteMsg = currentContext.resourceBundle().getText("deleteMsg");
			let contactDeleteMsg = currentContext.resourceBundle().getText("contactDeleteMsg");
			if (this.model != undefined) {
				MessageBox.confirm(
					deleteMsg, {
					styleClass: "sapUiSizeCompact",
					onClose: function (sAction) {
						if (sAction == "OK") {
							contactService.deleteContact(currentContext.model, function (data) {
								if (data) {
									currentContext.onCancel();
									MessageToast.show(contactDeleteMsg);
									currentContext.bus = sap.ui.getCore().getEventBus();
									currentContext.bus.publish("loaddata", "loadData");
								}
							});
						}
					}
				}
				);

			}
		},

		onCancel: function () {
			this.getView().byId("txtContactName").setValue("");
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---contactmaster--fclContactMaster");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		},
	});
}, true);
