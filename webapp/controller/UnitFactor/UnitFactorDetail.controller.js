sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageBox',
	'sap/m/MessageToast',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/FactorMaster/FactorMaster.service'

], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, MessageBox, MessageToast, commonService, commonFunction, factormasterService) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.UnitFactor.UnitFactorDetail", {

		onInit: function () {
			commonFunction.getReference("BrdUnit", "unitList", this);
			this.fnShortCut();
        },

        onBeforeRendering: function () {
            this.model = this.getView().getModel("viewModel");
		    if(this.model != undefined){
			  this.loadFectorMaster(this.model.id);
			}
			else{
				var oModel = new JSONModel();
				oModel.setData({ id : null} ); 
				this.getView().setModel(oModel,"editFactorModel");
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

		loadFectorMaster: function (id) {
			var currentContext = this;
            factormasterService.getFactorMaster({id : id}, function (data) {
                var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(data[0][0]);
                currentContext.getView().setModel(oModel, "editFactorModel");
            });
		},
		
		bagUnitChange : function(){
			var baseUnit = this.getView().byId("TextUnit").getSelectedItem().getText();
			var convertedUnit = this.getView().byId("Textbagunit").getSelectedItem().getText();
			var factor = null;
			if(baseUnit == 'KG'){
				factor = parseInt(convertedUnit);
			}
			this.getView().byId("txtFactor").setValue(factor);
			
		},
		
		// get resource Model
		resourcebundle: function () {
			var currentContext = this;
			var oBundle = this.getModel("i18n").getResourceBundle()
			return oBundle
		},
		

		validateForm: function (id) {
            var isValid = true;
			if (!commonFunction.isSelectRequired(this, "TextUnit", "Base Unit is required!"))
				isValid = false;
			if (!commonFunction.isSelectRequired(this, "Textbagunit", "Converted Unit is required!"))
				isValid = false;
		
            return isValid;
        },

	onSave: function () {
            if (this.validateForm()) {
			var currentContext = this;
			var model = this.getView().getModel("editFactorModel").oData;
			var tempId = model["id"];
				model["companyid"] = commonService.session("companyId");
				model["userid"] = commonService.session("userId");
                factormasterService.saveFactorMaster(model, function (data) {
                    if (data.id > 0) {
						var saveMsg = "Unit Factor Master Save Successfully.";
						var editMsg = "Unit Factor Master Updated Successfully.";
						var message = tempId == null ? saveMsg : editMsg;
						MessageToast.show(message);
						
						currentContext.bus = sap.ui.getCore().getEventBus();
                        currentContext.bus.publish("unitfactormasteradd", "loadFactorMaster");
                        currentContext.onCancel();
                    }else if(data.id == -1){
						MessageBox.error("Unit factor should be unique!")
					}
                });
            }
        },
		onCancel: function () {
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---unitfactormaster--fclfactormaster");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		},
        
        
	});
}, true);

