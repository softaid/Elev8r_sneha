sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter',
    'sap/m/MessageBox',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Masters/Masters.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',
    'sap/m/MessageToast',

], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, MessageBox, commonFunction, masterService, commonService, MessageToast) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Masters.ProjectMasterDetail", {

        onInit: function () {
            var currentContext = this;
            currentContext.flag = 1;

        },

        onBeforeRendering: function () {
            var currentContext = this;
            this.model = this.getView().getModel("viewModel");
            var oModel = new JSONModel();
            console.log("this.model", this.model);
            // bind Pipeline dropdown
            commonFunction.getReferenceStages("ProMilestones", "parentStageModel", this);

            commonFunction.getReferenceStages("RefType", "refTypeModel", this);

            // get all departments
            commonFunction.getAllDepartments("departmentModel", this);

            this.getView().byId("parentStageEle").setVisible(false);

            if (this.model.typecode == "ProMilestones") {
                this.getView().byId("departmentEle").setVisible(true);
                this.getView().byId("switchEle").setVisible(true);
            }
            else {
                this.getView().byId("departmentEle").setVisible(false);
                this.getView().byId("switchEle").setVisible(false);
            }

            if (this.model.id != null) {
                currentContext.getView().byId("btnSave").setText("Update");
                masterService.getReference({ id: this.model.id }, function (data) {
                    if (data.length && data[0].length) {
                        console.log(data[0][0]);
                        data[0][0].active = data[0][0].active == 1 ? true : false;
                        data[0][0].defaultvalue = data[0][0].defaultvalue == 1 ? true : false;
                        data[0][0].intialprojectper = data[0][0].projectper
                        oModel.setData(data[0][0]);
                    }
                });
                this.flag = 0;
            } else {
                oModel.setData(this.model);
                currentContext.getView().byId("btnSave").setText("Save");
                this.flag = 1;
                (this.model.typecode == "ProMilestones") ? this.getView().byId("switchEle").setVisible(true) : this.getView().byId("switchEle").setVisible(false);
            }


            currentContext.getView().setModel(oModel, "editMasterModel");
            var pModel = currentContext.getView().getModel("editMasterModel");
        },

        onCancel: function () {
            this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---chartofaccounts--fclChartOfAccounts");
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
        },

        // get resource Model
        resourceBundle: function () {
            var currentContext = this;
            var oBundle = this.getModel("i18n").getResourceBundle()
            return oBundle
        },

        typeChanged : function(oEvent){
            console.log(oEvent.mParameters);
        },

        getSwitchValue: function (oEvent) {
            let parentState = oEvent.mParameters.state;
            if (parentState) {
                this.getView().byId("parentStageEle").setVisible(true);
            } else {
                this.getView().byId("parentStageEle").setVisible(false);
            }
        },

        validateForm: function () {
            var isValid = true;
            var currentContext = this;
            let sequencearray = [];

            var editMasterModel = this.getView().getModel("editMasterModel").oData;
             // validation  for department 
            if (editMasterModel.departmentid == null) {
                isValid = false;
                MessageToast.show(" Department of stage  is not defined");
            };
             // validation  for project per
            if (editMasterModel.projectper == null) {
                isValid = false;
                MessageToast.show("Project weightage of stage  is not defined");
            };
             // validation  for sequence
            if (editMasterModel.sequenceno == null) {
                isValid = false;
                MessageToast.show("Sequence  no. of stage  is not defined");
            };


            if (!commonFunction.isRequired(this, "description", "Description is mandatory!"))
                isValid = false;

            var model = this.getView().getModel("masterDetailModel").oData.modelData;

            let savetext = currentContext.getView().byId("btnSave").getText();
            let projectper = 0;

            model.some((stage) => {
                if (stage.projectper != undefined && stage.active == true) {
                    projectper = projectper + stage.projectper;
                }
                if (stage.id != editMasterModel?.id ?? null) {
                    sequencearray.push(`${stage.sequenceno}`);
                }
            });

            projectper = (projectper + editMasterModel.projectper - (editMasterModel.intialprojectper ?? 0));


            if (sequencearray.indexOf(editMasterModel?.sequenceno?? "notFound") != -1) {
                let error = `You can't assign same sequence  number to multiple stages `;
                MessageBox.warning(error);
                isValid = false;

            }

            if (projectper > 100) {
                let error = `Sum of project percentage of all stage  is ${projectper} and it needs to be 100`;
                MessageBox.warning(error);
                // MessageToast.show(` sum of project percentage of all stage  is ${projectper} and it is greater than 100`);
                isValid = editMasterModel.defaultvalue == true ? false : true;
            }
            else if (projectper < 100) {
                let error = `Sum of project percentage of all stage  is ${projectper} and it needs to be 100`;
                MessageBox.warning(error);
                isValid = editMasterModel.defaultvalue == true ? false : true;
            }

            return isValid;
        },

        onSave: function () {
            var isValid = this.validateForm();
            if (isValid) {
                var model = this.getView().getModel("editMasterModel").oData;


                console.log("model : ", model);
                model["companyid"] = commonService.session("companyId");
                model["userid"] = commonService.session("userId");

                var COASaveSuccess = this.resourceBundle().getText("COASaveSuccess");
                var COAUpdateSuccess = this.resourceBundle().getText("COAUpdateSuccess");

                console.log(model);
                var currentContext = this;

                masterService.saveReference(model, function (data) {
                    console.log("data : ", data);
                    if (data.id > 0) {
                        currentContext.onCancel();
                        if (currentContext.flag == 1)
                            MessageToast.show("Data saved successfully.");
                        else
                            MessageToast.show("Data updated successfully.");

                        currentContext.bus = sap.ui.getCore().getEventBus();
                        currentContext.bus.publish("loaddata", "loadData", { typecode: model["typecode"] });
                    }
                });
            }
        },

        onDelete: function () {
            var currentContext = this;

            var confirmMsg = currentContext.resourceBundle().getText("DeleteConfirm");
            var deleteSucc = currentContext.resourceBundle().getText("deleteSucc");
            var model = this.getView().getModel("editMasterModel").oData;
            console.log(currentContext.model);
            if (currentContext.model.id != undefined) {
                MessageBox.confirm(
                    confirmMsg, {
                    styleClass: "sapUiSizeCompact",
                    onClose: function (sAction) {
                        if (sAction == "OK") {
                            masterService.deleteReference({ id: currentContext.model.id }, function (data) {
                                if (data) {
                                    currentContext.onCancel();
                                    MessageToast.show("Deleted Successfully.");
                                    currentContext.bus = sap.ui.getCore().getEventBus();
                                    currentContext.bus.publish("loaddata", "loadData", { typecode: model["typecode"] });
                                }
                            });
                        }
                    }
                });
            }
        },

        onCancel: function () {
            this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---projectmaster--fclLeadMaster");
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
        }

    });
}, true);
