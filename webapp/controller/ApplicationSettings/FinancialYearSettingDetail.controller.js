sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/ValueState',
    'sap/ui/elev8rerp/componentcontainer/services/FinancialYearSetting.service',	
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function'
		
    ], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, MessageToast, MessageBox, ValueState, financialyearsettingService, commonFunction) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.ApplicationSettings.FinancialYearSettingDetail", {
        onInit: function () {
            var currentContext = this;            
            this.bus = sap.ui.getCore().getEventBus();
           
            
        },

        onBeforeRendering : function(){
			var currentContext = this;
		    this.model = this.getView().getModel("viewModel");
			var oModel = new JSONModel();

			oModel.oData.isactive = true;

            commonFunction.getReference("FincYrSts", "financialyearstatusModel", this);
            
		    if(this.model != undefined){	
				if(this.model.id != null){			
					financialyearsettingService.getFinancialYearSetting(this.model, function(data){
						data[0][0].active = (data[0][0].active == 1) ? true : false;
						oModel.setData(data[0][0]); 
						
						// show delete button
						currentContext.getView().byId("btnDelete").setVisible(false);
						var updateText = currentContext.resourcebundle().getText("UpdateText");
						currentContext.getView().byId("btnSave").setText(updateText);
					});	   
				}else{
					oModel.setData(this.model);
				}
				
			}
			else{
				// hide delete button
				this.getView().byId("btnDelete").setVisible(false);
			}
    	  
			currentContext.getView().setModel(oModel,"FinancialYearModel");	


		},
       
		// get resource Model
		resourcebundle : function(){
           var oBundle= this.getModel("i18n").getResourceBundle();
            return oBundle
        },
        
        onSave : function()
		{
			var currentContext = this;
                  
			if(this.validateForm()){
				var model = this.getView().getModel("FinancialYearModel").oData;
				model["companyid"] = commonFunction.session("companyId"); 
				model["userid"] = commonFunction.session("userId"); 
                
                model["startfrom"] = commonFunction.getDate(model.startfrom),
                model["endto"] = commonFunction.getDate(model.endto),

                model["active"] = model.active? 1 : 0,

				financialyearsettingService.saveFinancialYearSetting(model, function(data){
					console.log(data)
					if(data.id > 0){
						currentContext.onCancel();
						MessageToast.show("Financial year data submitted!");
						currentContext.bus = sap.ui.getCore().getEventBus();
						currentContext.bus.publish("loaddata", "loadData");
					}
					else if(data.id == -1){
						MessageBox.error("Year name or Year code or start date is duplicate!");						
                    }
                    else if(data.id == -2){
						MessageBox.error("Start date and End Date should not be in between another financial Year record!");						
					}
					else if(data.id == -3){
						MessageBox.error("Start date should not be greater then End Date!");						
					}
					else if(data.id == -4){
						MessageBox.error("More then one fiancial year can not active at a time!");						
					}
				});
			}
		},

		onDelete : function(){
			var currentContext = this;						
			if(this.model != undefined){
                this.model["companyid"] = commonFunction.session("companyId"); 
				this.model["userid"] = commonFunction.session("userId"); 
				
				var deleteMsg = this.resourcebundle().getText("deleteMsg");
				var OKText = this.resourcebundle().getText("OKText")
                var HatchDelete = this.resourcebundle().getText("hatcherDetailFinancialYearSettingDelete")
				
				MessageBox.confirm(
					deleteMsg, {
						styleClass:  "sapUiSizeCompact",
						onClose: function(sAction) {
							if(sAction == OKText){
								financialyearsettingService.deleteFinancialYearSetting(currentContext.model, function(data){
				                if(data){
				                    currentContext.onCancel();
				                    MessageToast.show(HatchDelete);
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
        
        validateForm : function(){
		var isValid = true;
			
		if(!commonFunction.isRequired(this,"txtYearName", "Year name is required!"))
			isValid = false;

		if(!commonFunction.isRequired(this, "txtYearCode","Year code is required!"))
                	isValid = false;
                 
            	if(!commonFunction.isRequired(this, "txtFromdate", "From Date is required!"))
                	isValid = false;
                
            	if(!commonFunction.isRequired(this, "txtTodate", "To Date is required!"))
			isValid = false;
                
            	if(!commonFunction.isRequiredDdl(this, "cmbStatus", "Status is required!"))
                	isValid = false;
			
		return isValid;
	},

	
        onCancel: function () {
            this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---financialyearsetting--fclFinancialYearSetting");
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
        }

    });

}, true);
