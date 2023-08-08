sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageBox',
	'sap/m/MessageToast',
	'sap/ui/elev8rerp/componentcontainer/formatter/fragment.formatter',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/LeadManagement/LeadActivity.service',
    'sap/ui/elev8rerp/componentcontainer/services/Employee/Employee.service',
	'sap/ui/elev8rerp/componentcontainer/services/LeadManagement/Lead.service'

], function (JSONModel, BaseController, MessageBox, MessageToast, formatter, commonService, commonFunction, leadActivityService, employeeService, leadService) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.LeadManagement.LeadActivity", {

		formatter: formatter,
		onInit: function () {
			var oThis = this;
            oThis.getAllEmployee();

			oThis.getAllLeads();

            commonFunction.getReference("Priority", "priorityModel", this);
            commonFunction.getReference("ActStatus", "statusModel", this);
            commonFunction.getReference("ActType", "typeModel", this);

		},

		onBeforeRendering: function () {
			this.model = this.getView().getModel("viewModel");
			var oModel = new JSONModel();

			if (this.model != undefined) {
				this.getLeadActivity(this.model.id);
				this.getView().byId("btnDelete").setVisible(true);
			}
			else {
				oModel.setData({ id: null, isactive: true });
				this.getView().byId("btnDelete").setVisible(false);
			}
			
			this.getView().setModel(oModel, "editLeadActivityModel");
			let editLeadActivityModel = this.getView().getModel("editLeadActivityModel");
			console.log(editLeadActivityModel);
			editLeadActivityModel.oData.progres = 0;
			editLeadActivityModel.refresh();
		},

		getAllLeads : function(){
            let oThis = this;
            leadService.getAllLeads(function (data) {
                if(data.length && data[0].length){
                    let oModel = new sap.ui.model.json.JSONModel();
                    oModel.setData({ modelData: data[0] });
                    oThis.getView().setModel(oModel, "LeadsModel");
                    console.log("LeadsModel",oModel);
                }
            });
        },

        getAllEmployee : function(){
            var currentContext = this;
            employeeService.getAllEmployee(function (data) {
                var oModel = new JSONModel();
                if(data.length && data[0].length){
                    oModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oModel, "employeeModel");
                }else{
                    oModel.setData({ modelData: [] });
                    currentContext.getView().setModel(oModel, "employeeModel");
                }
                
            });
        },

		getLeadActivity: function (id) {
			var currentContext = this;
            var oModel = new JSONModel();
			leadActivityService.getLeadActivity({ id: id }, function (data) {
                if(data.length && data[0].length){
                    oModel.setData(data[0][0]);
				    currentContext.getView().setModel(oModel, "editLeadActivityModel");
                }else{
                    oModel.setData([]);
				    currentContext.getView().setModel(oModel, "editLeadActivityModel");
                }
			});
		},

		// get resource Model
		resourcebundle: function () {
			var oBundle = this.getModel("i18n").getResourceBundle()
			return oBundle
		},

		validateForm: function () {
			var isValid = true;
			if (!commonFunction.isChaonly(this, "txtName", "User name is required!"))
				isValid = false;
			if (!commonFunction.isNumber(this, "txtMobile", "Mobile is required!"))
				isValid = false;
			if (!commonFunction.ismultiComRequired(this, "ddlMtxtModuleNameodule", " Role is required!"))
				isValid = false;
			if (!commonFunction.isEmail(this, "txtEmail", "Email is required!"))
				isValid = false;
	                if (!commonFunction.isRequired(this, "txtemployee", "Ledger is required!"))
				isValid = false;

			return isValid;
		},

		onSave: function () {
			// if (this.validateForm()) {
				var currentContext = this;
				var model = this.getView().getModel("editLeadActivityModel").oData;
				var tempId = model["id"];

				model["companyid"] = commonService.session("companyId");
				model["userid"] = commonService.session("userId");
                model["createddate"] = commonFunction.getDate(model.createddate);
                model["duedate"] = commonFunction.getDate(model.duedate);
                
				leadActivityService.saveLeadActivity(model, function (data) {
					if (data.id > 0) {
						var saveMsg = currentContext.resourcebundle().getText("activitySaveMsg");
						var editMsg = currentContext.resourcebundle().getText("activityEditedMsg");
						var alreadyExistMsg = currentContext.resourcebundle().getText("activityAlreadyExist");
						var message = tempId == null ? saveMsg : editMsg;
						MessageToast.show(message);

						currentContext.bus = sap.ui.getCore().getEventBus();
						currentContext.bus.publish("leadactivity", "LeadActivity");
						currentContext.onCancel();
					}
					else if (data.id == -1) {
						MessageToast.show(alreadyExistMsg);
					}
				});
			// }
		},



		onCancel: function () {
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---leadactivities--fclLeadActivity");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		},

		onDelete: function (oEvent) {
			var currentContext = this;
			var dleteMsg = currentContext.resourcebundle().getText("deleteMsg");
			var okText = currentContext.resourcebundle().getText("OKText");
			var activityDeletedMsg = currentContext.resourcebundle().getText("activityDeletedMsg");

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
								leadActivityService.deleteLeadActivity(model, function (data) {
									currentContext.bus = sap.ui.getCore().getEventBus();
									currentContext.bus.publish("leadactivity", "loadLeadActivities");

									currentContext.onCancel();
									MessageToast.show(activityDeletedMsg);
								});
							}

						}
					}
				}
				);
			}
		},



	});
}, true);

