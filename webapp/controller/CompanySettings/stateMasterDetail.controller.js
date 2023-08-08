
sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter', 
    'sap/ui/elev8rerp/componentcontainer/utility/SessionManager', 
    'sap/ui/elev8rerp/componentcontainer/services/Breeder/Phase.service',    
    'jquery.sap.storage',
     
], function (BaseController,JSONModel, Filter, FilterOperator, Sorter, SessionManager, phaseService) {
        "use strict";

   return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.CompanySettings.stateMasterDetail", {

        metadata: {
           manifest: "json"
        },

        onInit: function() {

            this.bus = sap.ui.getCore().getEventBus();
            this.bus.subscribe("licensemanagementmaster", "setDetailPage", this.setDetailPage, this);
            this.oFlexibleColumnLayout = this.byId("fclLicenseDetail");

            var oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.elev8rerp.componentcontainer.model.accounts.master", "/stateMaster.json"));

			this.getView().setModel(oModel, "licenesemanagementModel");
            
           
        },
        onCancel : function(){
            this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---commonmaster--fclCommonMaster");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
        }
 
      
    

        
    });
});