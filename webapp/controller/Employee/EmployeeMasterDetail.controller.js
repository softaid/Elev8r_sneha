sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageBox',
	'sap/m/MessageToast',
	'sap/ui/elev8rerp/componentcontainer/formatter/fragment.formatter',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/Employee/Employee.service'

], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, MessageBox, MessageToast, formatter, commonService, commonFunction, employeeService) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Employee.EmployeeMasterDetail", {

		formatter: formatter,
		onInit: function () {

			this.fnShortCut();
		},

		onBeforeRendering: function () {
			this.model = this.getView().getModel("viewModel");
			if (this.model != undefined) {
				this.loadEmpolyeeData(this.model.id);
				this.getView().byId("btnDelete").setVisible(true);
			}
			else {

				var oModel = new JSONModel();
				oModel.setData({ id: null, isactive: true });
				this.getView().byId("btnDelete").setVisible(false);
				this.getView().setModel(oModel, "editemployeeModel");
			}
		},

		fnShortCut: function () {
			var currentContext = this;
			$(document).keydown(function (evt) {
				//     if (evt.keyCode == 83 && (evt.altKey)) {
				//         evt.preventDefault();
				//         jQuery(document).ready(function ($) {
				//             currentContext.onSave();
				//         })
				//     }
				if (evt.keyCode == 69 && (evt.altKey)) {
					evt.preventDefault();
					jQuery(document).ready(function ($) {
						currentContext.onCancel();
					})
				}
			});
		},

		handleLedgerValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			this._valueHelpDialog = sap.ui.xmlfragment(
				"sap.ui.elev8rerp.componentcontainer.fragmentview.Accounts.Master.LedgerDialog",
				this
			);
			this.getView().addDependent(this._valueHelpDialog);
			this._valueHelpDialog.open(sInputValue);

		},

		loadEmpolyeeData: function (id) {
			var currentContext = this;
			
			employeeService.getEmployee({ id: id }, function (data) {
				var oModel = new sap.ui.model.json.JSONModel();
				data[0][0].isactive = data[0][0].isactive == 1 ? true : false;
				oModel.setData(data[0][0]);
				currentContext.getView().setModel(oModel, "editemployeeModel");
			});
		},

		onLedgerDialogClose: function (oEvent) {
			var currentContext = this;
			var aContexts = oEvent.getParameter("selectedContexts");
			var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
			var oModel = currentContext.getView().getModel("editemployeeModel");

			//update existing model to set ledgerid
			oModel.oData.ledgerid = selRow[0].id;
			oModel.oData.ledgername = selRow[0].ledgername;
			oModel.oData.glcode = selRow[0].glcode;
			oModel.refresh();
		},

		cahegeData: function (oEvent) {
			var id = oEvent.mParameters.id;
			var index = id.lastIndexOf('-');
			id = id.substring(index + 1);

			if (id == "txtMobile") {
				this.getView().byId("txtMobile").setValueState(sap.ui.core.ValueState.None);
			}
		},

		// get resource Model
		resourcebundle: function () {
			var oBundle = this.getModel("i18n").getResourceBundle()
			return oBundle
		},

		validemail: function () {
			var isValid = true
			if (!commonFunction.isEmail(this, "txtEmail", "Email is required!"))
				isValid = false;
			this.getView().byId("txtEmail").setValueState(sap.ui.core.ValueState.None);
			return isValid
		},

		validateForm: function () {
			var isValid = true;
			// if (!commonFunction.isChaonly(this, "txtName", "User name is required!"))
			// 	isValid = false;
			if (!commonFunction.isNumber(this, "txtMobile", "Mobile is required!"))
				isValid = false;
			if (!commonFunction.isEmail(this, "txtEmail", "Email is required!"))
				isValid = false;

			return isValid;
		},

		onSave: function () {
			if (this.validateForm()) {
				var currentContext = this;
				var model = this.getView().getModel("editemployeeModel").oData;
				console.log("-----------editemployeeModel--------",model);
				var tempId = model["id"];

				model["ledgerid"] = parseInt(model.ledgerid);
				model["companyid"] = commonService.session("companyId");
				model["userid"] = commonService.session("userId");
				employeeService.saveEmployee(model, function (data) {
					if (data.id > 0) {
						var saveMsg = currentContext.resourcebundle().getText("employeeMasterSaveMsg");
						var editMsg = currentContext.resourcebundle().getText("employeeMasterEditedMsg");
						var message = tempId == null ? saveMsg : editMsg;
						MessageToast.show(message);

						currentContext.bus = sap.ui.getCore().getEventBus();
						currentContext.bus.publish("employeemaster", "loadEmpolyeeData");
						currentContext.onCancel();
					}
					else if (data.id == -1) {
						MessageToast.show("Data is already exist.");
					}
				});
			}
		},

		onCancel: function () {
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---employeemaster--fclEmployeeMaster");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		},

		onDelete: function (oEvent) {
			var currentContext = this;
			var dleteMsg = currentContext.resourcebundle().getText("deleteMsg");
			var okText = currentContext.resourcebundle().getText("OKText");
			var deleteSuccessMsg = currentContext.resourcebundle().getText("employeeMasterDeleteMsg");

			if (this.model != undefined) {
				var model = {
					id: this.model.id
				};

				MessageBox.confirm(
					dleteMsg, {
					styleClass: "sapUiSizeCompact",
					onClose: function (sAction) {
						if (sAction == okText) {

							if (model.id != null) {
								model["companyid"] = commonService.session("companyId");
								model["userid"] = commonService.session("userId");
								employeeService.deleteEmployee(model, function (data) {
									currentContext.bus = sap.ui.getCore().getEventBus();
									currentContext.bus.publish("employeemaster", "loadEmpolyeeData");

									currentContext.onCancel();
									MessageToast.show(deleteSuccessMsg);
								});
							}

						}
					}
				}
				);
			}
		}
	});
}, true);

