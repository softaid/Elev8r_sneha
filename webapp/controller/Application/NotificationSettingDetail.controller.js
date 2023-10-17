sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/elev8rerp/componentcontainer/formatter/fragment.formatter',
	'sap/ui/elev8rerp/componentcontainer/formatter/common.formatter',
	'sap/ui/elev8rerp/componentcontainer/services/Application/NotificationSetting.service',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',

], function (JSONModel, BaseController, MessageToast, MessageBox, formatter, commonFormatter, notificationSettingService, commonService, commonFunction) {

	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Application.NotificationSettingDetail", {

		formatter: formatter,
		commonFormatter: commonFormatter,

		onInit: function () {

			this.bus = sap.ui.getCore().getEventBus();

			//bind  type dropdown			
			commonFunction.getReferenceByType("PLOSMod", "moduleModel", this);
			commonFunction.getReferenceByType("PLOSNotiRoles", "rolesModel", this);
			commonFunction.getReferenceByType("PLOSNotiAct", "actionModel", this);

			this.getTransactionData();

		},


		onAfterRendering: function () {

		},

		uniqueByColumn : function(arr, fn) {
			
			var unique = {};
			var distinct = [];
			arr.forEach(function (x) {
			  var key = fn(x);
			  if (!unique[key]) {
				distinct.push(key);
				unique[key] = true;
			  }
			});
			return distinct;
		  },

		// Notification Placeholders
		getNotificationPlaceholders: function (currentContext, transactiontypeid) {
			debugger;
			commonService.getNotificationPlaceholders({ transactiontypeid: transactiontypeid }, function (data) {
				var oModel = new sap.ui.model.json.JSONModel();
				
				var placeholder = currentContext.uniqueByColumn(data[0], function(x){return x.valuetype;});
				oModel.setData({ modelData: placeholder });
				currentContext.getView().setModel(oModel, "placeholderModel");
				console.log("------placeholderModel---------",oModel)
			});
		},

		getTransactionData: function () {
			var currentContext = this;

			notificationSettingService.getAppTransactions(function (data) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: data[0] });
				currentContext.getView().setModel(oModel, "transactionModel");

				currentContext.getView().byId("ddlModule").setValueState(sap.ui.core.ValueState.None);
				currentContext.getView().byId("ddlTransaction").setValueState(sap.ui.core.ValueState.None);
			});
		},

		onTransactionChange: function (oEvent) {
			debugger;
			var transactiontypeid = this.getView().byId('ddlTransaction').getSelectedKey();
			this.getNotificationPlaceholders(this, transactiontypeid);
		},

		onModuleChange: function (oEvent) {
			var moduleid = this.getView().byId('ddlModule').getSelectedKey();
		},

		onPlaceholderChange: function (oEvent) {
			var placeholder = this.getView().byId('ddlPlaceholders').getSelectedKey();

			for (name in CKEDITOR.instances) {
				CKEDITOR.instances[name].insertText(placeholder);
			}

		},

		resourcebundle: function () {
			var currentContext = this;
			var oBundle = this.getModel("i18n").getResourceBundle()
			return oBundle
		},

		onTemplateChange: function (oEvent) {
			this.getView().byId("txtTemplate").setValueState(sap.ui.core.ValueState.None);
		},

		onRoleChange: function (oEvent) {
			this.getView().byId("ddlRole").setValueState(sap.ui.core.ValueState.None);
		},

		onActionChange: function (oEvent) {
			this.getView().byId("ddlAction").setValueState(sap.ui.core.ValueState.None);
		},


		onBeforeRendering: function () {
			debugger;
			var currentContext = this;
			this.model = this.getView().getModel("viewModel");
			var oModel = new JSONModel();

			jQuery.sap.registerModulePath('openui5', 'ckeditor');
			jQuery.sap.require("openui5.ckeditor");
			if (this.model.id != undefined) {

				notificationSettingService.getNotificationSettingById({ id: this.model.id }, function (data) {
					oModel.setData(data[0][0]);
					data[0][0].inapp = data[0][0].inapp == 1 ? true : false;
					data[0][0].sms = data[0][0].sms == 1 ? true : false;
					data[0][0].email = data[0][0].email == 1 ? true : false;

					data[0][0].roleids = data[0][0].roleids != null ? data[0][0].roleids.split(',') : [];

					currentContext.getNotificationPlaceholders(currentContext, data[0][0].transactiontypeid);

					setTimeout(function () {
						currentContext.getView().byId("ddlRole").setSelectedKeys(data[0][0].roleids);
					}, 1000);

				});
				currentContext.getView().byId("btnSave").setText("Update");

			} else {
				currentContext.getView().byId("btnDelete").setVisible(false);
			}

			setTimeout(function () {
				currentContext.getView().setModel(oModel, "editNotificationModel");

			}, 800);
		},

		onSave: function () {

			if (this.validateForm()) {

				var currentContext = this;
				var model = this.getView().getModel("editNotificationModel").oData;
				console.log("------editNotificationModel---------",model);
				model["companyid"] = model["companyid"] == null ? commonService.session("companyId") : model["companyid"];
				model["userid"] = commonService.session("userId");
				model["roleids"] = model["roleids"] instanceof Array ? model["roleids"].join() : "";

				model["inapp"] = model["inapp"] ? 1 : 0;
				model["sms"] = model["sms"] ? 1 : 0;
				model["email"] = model["email"] ? 1 : 0;
				
				notificationSettingService.saveNotificationSetting(model, function (data) {

					if (data.id > 0) {

						var saveMSg = "Transaction notification created successfully!";
						var editMsg = "Transaction notification updated successfully!";

						var message = model.id == null ? saveMSg : editMsg;
						currentContext.onCancel();
						MessageToast.show(message);
						currentContext.bus = sap.ui.getCore().getEventBus();
						currentContext.bus.publish("loaddata", "loadData");
					}
				});
			}
		},

		validateForm: function () {

			var isValid = true;

			if (!commonFunction.isRequiredDdl(this, "ddlModule", "Module selection is required!"))
				isValid = false;

			if (!commonFunction.isRequiredDdl(this, "ddlTransaction", "Transaction selection is required!"))
				isValid = false;

			var model = this.getView().getModel("editNotificationModel").oData;
			if (isValid && model["template"] == "") {
				MessageBox.error("Template is required!");
				isValid = false;
			}

			return isValid;
		},

		onChangeReason: function () {
			var Msg = this.resourcebundle().getText("manageApplicationNotificationSettingValidMsg");
			commonFunction.isRequired(this, "txtReason", Msg);
		},

		onDelete: function () {

			var currentContext = this;

			var delseteMsg = "Do you want to delete this record?";

			if (this.model != undefined) {

				this.model["companyid"] = this.model["companyid"] == null ? commonService.session("companyId") : this.model["companyid"];
				this.model["userid"] = commonService.session("userId");

				MessageBox.confirm(
					delseteMsg, {
						styleClass: "sapUiSizeCompact",
						onClose: function (sAction) {

							if (sAction == "OK") {

								notificationSettingService.deleteNotificationSetting(currentContext.model, function (data) {
									if (data) {
										currentContext.onCancel();

										var deleteMsg = "Transaction notification delete successfully!"

										MessageToast.show(deleteMsg);
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
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---manageapplication--fclManageApplication");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		},
	});
}, true);
