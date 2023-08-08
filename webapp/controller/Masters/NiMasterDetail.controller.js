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

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Masters.NiMasterDetail", {

        onInit: function () {
            var currentContext = this;  
            currentContext.flag = 1;
            
        },

        onBeforeRendering:  async function() {
            let oThis=this;
            let departmentid=6;
            var currentContext = this;
			this.model = this.getView().getModel("viewModel");
			var oModel = new JSONModel();
            console.log("this.model",this.model);
             // bind Pipeline dropdown

            // get all departments
                masterService.getAllDepartments(function (data) {
                    if(data.length && data[0].length){
                        var selectModel = new sap.ui.model.json.JSONModel();
                        selectModel.setData({ modelData: data[0] });
                        currentContext.getView().setModel(selectModel, "departmentModel");
                    }
                })

			commonFunction.getReferenceStagesbyDepartment("ProMilestones",departmentid,"parentStageModel", this);
            

            this.getView().byId("parentStageEle").setVisible(true);

            
            if (this.model.id != null) {    
                currentContext.getView().byId("btnSave").setText("Update");
				masterService.getReference({id : this.model.id}, function(data){
                    if(data.length && data[0].length){
                        console.log(data[0][0]);
                        data[0][0].active = data[0][0].active == 1 ? true : false;
                        data[0][0].defaultvalue = data[0][0].defaultvalue == 1 ? true : false;
                        data[0][0].departmentid=6;
                        oModel.setData(data[0][0]);
                        oThis.getView().byId("switchEle").setVisible(false);
                    }
                });
				this.flag = 0;
			} else {
                oModel.setData(this.model);
				currentContext.getView().byId("btnSave").setText("Save");
				this.flag = 1;
                (this.model.typecode == "Nimaster") ? this.getView().byId("switchEle").setVisible(false): this.getView().byId("switchEle").setVisible(false);
			}
			
            currentContext.getView().setModel(oModel, "editMasterModel");
            currentContext.getView().getModel("editMasterModel").oData.departmentid=6;
            var pModel = currentContext.getView().getModel("editMasterModel");
            pModel.refresh();
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

        getSwitchValue : function(oEvent){
            let parentState = oEvent.mParameters.state;
            if(parentState){
                this.getView().byId("parentStageEle").setVisible(true);
            }else{
                this.getView().byId("parentStageEle").setVisible(false);
            }
        },

        validateForm: function () {
			var isValid = true;
			if (!commonFunction.isRequired(this, "description", "Description is mandatory!"))
				isValid = false;
	
			return isValid;
		},
        
        onSave : function(){
            var isValid = this.validateForm();
			if(isValid){
                var model = this.getView().getModel("editMasterModel").oData;

                console.log("model : ",model);
                model["companyid"] = commonService.session("companyId");
                model["userid"] = commonService.session("userId");
                model["typecode"] ="Nimaster";

                var COASaveSuccess = this.resourceBundle().getText("COASaveSuccess");
                var COAUpdateSuccess = this.resourceBundle().getText("COAUpdateSuccess");

                console.log(model);
                var currentContext = this;

                masterService.saveReference(model, function (data) {
                    console.log("data : ",data);
                    if (data.id > 0) {
                        currentContext.onCancel();
                        if(currentContext.flag == 1)
                        MessageToast.show("Data saved successfully.");
                        else
                        MessageToast.show("Data updated successfully.");
                        
                        currentContext.bus = sap.ui.getCore().getEventBus();
                        currentContext.bus.publish("loaddata", "loadData",{typecode : model["typecode"]});
                    }
                });
            }
        },

        onDelete : function(){
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
								masterService.deleteReference({id : currentContext.model.id}, function (data) {
									if (data) {
										currentContext.onCancel();
										MessageToast.show("Deleted Successfully.");
										currentContext.bus = sap.ui.getCore().getEventBus();
										currentContext.bus.publish("loaddata", "loadData",{typecode : model["typecode"]});
									}
								});
							}
						}
					});
			}
        },

        onCancel: function () {
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---nimaster--fclLeadMaster");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}

    });
}, true);
