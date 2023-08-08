sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function', 
    'sap/ui/elev8rerp/componentcontainer/services/ProjectManagement/Subcontractor.service', 
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',
    'sap/m/MessageToast',

], function (JSONModel, BaseController, MessageBox, commonFunction, subcontractorService, commonService, MessageToast) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Masters.SubContractorDetail", {

        onInit: function () {
            this.flag = null;
        },

        onBeforeRendering:  async function() {
            let oThis=this;
            let departmentid=6;
            var currentContext = this;
			this.model = this.getView().getModel("viewModel");
			var oModel = new JSONModel();
            
            if (this.model.id != null) {    
                this.flag = 0;
                currentContext.getView().byId("btnSave").setText("Update");
				subcontractorService.getSubcontractor({id : this.model.id}, function(data){
                    if(data.length && data[0].length){
                        oModel.setData(data[0][0]);
                    }
                });
			} else {
                this.flag = 1;
                oModel.setData(this.model);
				currentContext.getView().byId("btnSave").setText("Save");
			}
			
            currentContext.getView().setModel(oModel, "editSubContractorModel");
        },

        // get resource Model
		resourceBundle: function () {
			var oBundle = this.getModel("i18n").getResourceBundle()
			return oBundle
		},

        validateForm: function () {
			var isValid = true;
			if (!commonFunction.isRequired(this, "subconname", "Subcontractor name is mandatory!"))
				isValid = false;

            if (!commonFunction.isRequired(this, "designation", "Designation is mandatory!"))
				isValid = false;

            if (!commonFunction.isRequired(this, "email", "Email name is mandatory!"))
				isValid = false;
                
            if (!commonFunction.isRequired(this, "mobileno", "Mobile no. is mandatory!"))
				isValid = false;
	
			return isValid;
		},
        
        onSave : function(){
            var isValid = this.validateForm();
			if(isValid){
                var model = this.getView().getModel("editSubContractorModel").oData;

                model["companyid"] = commonService.session("companyId");
                model["userid"] = commonService.session("userId");

                var currentContext = this;

                subcontractorService.saveSubcontractor(model, function (data) {
                    if (data.id > 0) {
                        currentContext.onCancel();
                        if(currentContext.flag)
                        MessageToast.show("Data saved successfully.");
                        else
                        MessageToast.show("Data updated successfully.");
                        
                        currentContext.onCancel();
                        currentContext.bus = sap.ui.getCore().getEventBus();
                        currentContext.bus.publish("loaddata", "loadData");
                    }
                });
            }
        },

        onDelete : function(){
            var currentContext = this;

			var confirmMsg = currentContext.resourceBundle().getText("DeleteConfirm");
			var deleteSucc = currentContext.resourceBundle().getText("deleteSucc");
			var model = this.getView().getModel("editSubContractorModel").oData;
			console.log(currentContext.model);
			if (currentContext.model.id != undefined) {
				MessageBox.confirm(
					confirmMsg, {
						styleClass: "sapUiSizeCompact",
						onClose: function (sAction) {
							if (sAction == "OK") {
								subcontractorService.deleteSubcontractor({id : currentContext.model.id}, function (data) {
									if (data) {
										currentContext.onCancel();
										MessageToast.show("Deleted Successfully.");
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
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---subcontractor--fclSubcontractor");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}

    });
}, true);
