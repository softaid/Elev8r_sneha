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

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Masters.LiftMasterDetail", {

        onInit: function () {
            var currentContext = this;  

            currentContext.flag = 1;

            // bind Door dropdown
			commonFunction.getReferenceByType("LftMdl", "liftModel", this);
            
        },

        onBeforeRendering: function () {
            var currentContext = this;
			currentContext.model = currentContext.getView().getModel("viewModel");
			var oModel = new JSONModel();
            
            if (currentContext.model.id != null) {
                currentContext.getView().byId("btnSave").setText("Update");
				masterService.getReference({id : currentContext.model.id}, function(data){
                    if(data.length && data[0].length){
                        data[0][0].active = data[0][0].active == 1 ? true : false;
                        data[0][0].defaultvalue = data[0][0].defaultvalue == 1 ? true : false;
                        oModel.setData(data[0][0]);
                    }
                });
				this.flag = 0;
			} else {
                oModel.setData(this.model);
				currentContext.getView().byId("btnSave").setText("Save");
				this.flag = 1;
			}
             
			
            currentContext.getView().setModel(oModel, "editMasterModel");
            var pModel = currentContext.getView().getModel("editMasterModel");
        },

        onCancel: function () {
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---liftmaster--fclLiftMaster");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
        },

        // get resource Model
		resourceBundle: function () {
			var currentContext = this;
			var oBundle = this.getModel("i18n").getResourceBundle()
			return oBundle
		},

        validateForm: function () {
			var isValid = true;

            var masterDescription = this.resourceBundle().getText("masterDescription");
                
			if (!commonFunction.isRequired(this, "description", masterDescription))
				isValid = false;
	
			return isValid;
		},
        
        onSave : function(){
            var isValid = this.validateForm();
			if(isValid){
                var model = this.getView().getModel("editMasterModel").oData;

                
                model["companyid"] = commonService.session("companyId");
                model["userid"] = commonService.session("userId");

                var liftMasterSaveSuccess = this.resourceBundle().getText("liftMasterSaveSuccess");
                var liftMasterUpdateSuccess = this.resourceBundle().getText("liftMasterUpdateSuccess");

                if(this.model.typecode == "Stage"){
                    model["parentid"] = this.getView().byId("pipeline").getSelectedKey();
                    model["parenttypecode"] = "Pipeline";
                }

                var currentContext = this;

                masterService.saveReference(model, function (data) {
                    console.log("data : ",data);
                    if (data.id > 0) {
                        currentContext.onCancel();
                        if(currentContext.flag == 1)
                        MessageToast.show(liftMasterSaveSuccess);
                        else
                        MessageToast.show(liftMasterUpdateSuccess);
                        
                        currentContext.bus = sap.ui.getCore().getEventBus();
                        currentContext.bus.publish("loaddata", "loadData",{typecode : model["typecode"]});
                    }
                });
            }
        },

        onDelete : function(){
            var currentContext = this;

			var confirmMsg = currentContext.resourceBundle().getText("deleteMsg");
			var liftMasterDeleteSucc = currentContext.resourceBundle().getText("liftMasterDeleteSucc");
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
										MessageToast.show(liftMasterDeleteSucc);
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
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---liftmaster--fclLiftMaster");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}

    });
}, true);
