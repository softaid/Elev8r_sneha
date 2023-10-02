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

            this.model.dependency != null ? currentContext.getView().byId("prerequisites").setSelectedKeys(this.model.dependency.split(',')) : "data not available";
            this.model.attributetypes != null ? currentContext.getView().byId("attributetype").setSelectedKeys(this.model.attributetypes.split(',')) : "data not available";
            this.model.parentid != null ? currentContext.getView().byId("parentstage").setSelectedKey(this.model.parentid) : "data not available";

            commonFunction.getReferenceStages("RefType", "refTypeModel", this);

            commonFunction.getReferenceStages("ProjStgType", "stgTypeModel", this);

            commonFunction.getReferenceStages("ProMilestones", "prerequisiteModel", this);

            // get all departments
            commonFunction.getAllDepartments("departmentModel", this);

            if (this.model.typecode == "ProMilestones" && this.model.type == "Stage") {
                
                this.getView().byId("departmentEle").setVisible(true);
                this.getView().byId("typeEle").setVisible(true);
                this.getView().byId("stgTypeEle").setVisible(true);
                this.getView().byId("parentStageEle").setVisible(false);
                this.getView().byId("sequenceEle").setVisible(true);
                this.getView().byId("activeEle").setVisible(true);
                this.getView().byId("projectPerEle").setVisible(true);
                this.getView().byId("stagePerEle").setVisible(false);
                this.getView().byId("prerequisitesEle").setVisible(true);
                this.getView().byId("attributeEle").setVisible(false);
            }else if(this.model.typecode == "ProMilestones" && this.model.type == "Activity"){
                this.getView().byId("stgTypeEle").setVisible(false);
                this.getView().byId("departmentEle").setVisible(false);
                this.getView().byId("sequenceEle").setVisible(false);
                this.getView().byId("prerequisitesEle").setVisible(false);
                this.getView().byId("projectPerEle").setVisible(false);
                this.getView().byId("stagePerEle").setVisible(true);
                this.getView().byId("parentStageEle").setVisible(true);
                this.getView().byId("attributeEle").setVisible(false);
            }else if(this.model.typecode == "ProMilestones" && this.model.type == "Attribute"){
                this.getView().byId("stgTypeEle").setVisible(false);
                this.getView().byId("departmentEle").setVisible(false);
                this.getView().byId("sequenceEle").setVisible(false);
                this.getView().byId("prerequisitesEle").setVisible(false);
                this.getView().byId("projectPerEle").setVisible(false);
                this.getView().byId("stagePerEle").setVisible(false);
                this.getView().byId("parentStageEle").setVisible(true);
                this.getView().byId("attributeEle").setVisible(true);
            }
            else {
                this.getView().byId("departmentEle").setVisible(false);
                this.getView().byId("typeEle").setVisible(false);
                this.getView().byId("stgTypeEle").setVisible(false);
                this.getView().byId("parentStageEle").setVisible(false);
                this.getView().byId("sequenceEle").setVisible(false);
                this.getView().byId("activeEle").setVisible(false);
                this.getView().byId("projectPerEle").setVisible(false);
                this.getView().byId("stagePerEle").setVisible(false);
                this.getView().byId("prerequisitesEle").setVisible(false);
                this.getView().byId("attributeEle").setVisible(false);
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
                // (this.model.typecode == "ProMilestones") ? this.getView().byId("switchEle").setVisible(true) : this.getView().byId("switchEle").setVisible(false);
            }


            currentContext.getView().setModel(oModel, "editMasterModel");
            var pModel = currentContext.getView().getModel("editMasterModel");

            commonFunction.getReferenceByTypeCodeAndParentType("ProMilestones", pModel.oData.parenttypeid, "parentStageModel", this);
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
            let typeTxt = this.getView().byId("type").getSelectedItem().mProperties.text;

            if(typeTxt == "Stage"){
                commonFunction.getReferenceStages("ProMilestones", "prerequisiteModel", this);
                this.getView().byId("stgTypeEle").setVisible(true);
                this.getView().byId("departmentEle").setVisible(true);
                this.getView().byId("sequenceEle").setVisible(true);
                this.getView().byId("prerequisitesEle").setVisible(true);
                this.getView().byId("projectPerEle").setVisible(true);
                this.getView().byId("stagePerEle").setVisible(false);
                this.getView().byId("parentStageEle").setVisible(false);
                this.getView().byId("attributeEle").setVisible(false);
            }else if(typeTxt == "Activity"){
                commonFunction.getReferenceByTypeCodeAndParentType("ProMilestones", "Stage", "parentStageModel", this);
                this.getView().byId("stgTypeEle").setVisible(false);
                this.getView().byId("departmentEle").setVisible(false);
                this.getView().byId("sequenceEle").setVisible(false);
                this.getView().byId("prerequisitesEle").setVisible(false);
                this.getView().byId("projectPerEle").setVisible(false);
                this.getView().byId("stagePerEle").setVisible(true);
                this.getView().byId("parentStageEle").setVisible(true);
                this.getView().byId("attributeEle").setVisible(false);
            }else if(typeTxt == "Attribute"){
                commonFunction.getReferenceByTypeCodeAndParentType("ProMilestones", "Activity", "parentStageModel", this);
                commonFunction.getReferenceStages("InputAttribute", "attributeModel", this);
                this.getView().byId("stgTypeEle").setVisible(false);
                this.getView().byId("departmentEle").setVisible(false);
                this.getView().byId("sequenceEle").setVisible(false);
                this.getView().byId("prerequisitesEle").setVisible(false);
                this.getView().byId("projectPerEle").setVisible(false);
                this.getView().byId("stagePerEle").setVisible(false);
                this.getView().byId("parentStageEle").setVisible(true);
                this.getView().byId("attributeEle").setVisible(true);
            }
        },

        getSwitchValue: function (oEvent) {
            let parentState = oEvent.mParameters.state;
            if (parentState) {
                this.getView().byId("parentStageEle").setVisible(true);
            } else {
                this.getView().byId("parentStageEle").setVisible(false);
            }
        },

        handleSelectionFinish: function (oEvt) {

			let oprojectModel = this.getView().getModel("editMasterModel");
			let oprojectModeldata = oprojectModel.oData;
			let selectedItems = oEvt.getParameter("selectedItems");
			let stageortype = [];

            console.log(oEvt.mParameters.id);

			for (var i = 0; i < selectedItems.length; i++) {
				stageortype.push(selectedItems[i].getProperty("key"));
			}
			if (oEvt.mParameters.id == "__xmlview0--prerequisites") {
				oprojectModeldata.dependency = stageortype.join(",");
			}
			else {
				oprojectModeldata.attributetypes = stageortype.join(",");
			}

		},

        validateForm: function () {
            var isValid = true;
            var currentContext = this;
            let sequencearray = [];

            if (!commonFunction.isRequired(this, "description", "Description is mandatory!"))
                isValid = false;
            
            var editMasterModel = this.getView().getModel("editMasterModel").oData;

            if(editMasterModel.typecode != "ProjStgType" && editMasterModel.type == "Stage"){
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
                model["type"] = this.getView().byId("type").getSelectedItem().mProperties.text;
                if(model["type"] == "Stage")
                    model["stgtypeid"] = this.getView().byId("stgtype").getSelectedItem().mProperties.key;
                else
                    model["stgtypeid"] = null;

                // var COASaveSuccess = this.resourceBundle().getText("COASaveSuccess");
                // var COAUpdateSuccess = this.resourceBundle().getText("COAUpdateSuccess");

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
