
sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    "sap/ui/model/json/JSONModel",   
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter',
    'sap/ui/elev8rerp/componentcontainer/services/Breeder/BreederBatch.service',
    
], function (BaseController,JSONModel, Filter, FilterOperator, Sorter, breederbatchService) {
        "use strict";

     return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.CompanySettings.LicenseManagementDetail", {

        metadata: {
           manifest: "json"
        },

        onInit: function() {
           
        },

        onCancel : function()
		{
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---licensemanagement--fclLicenseDetail");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}
    });
});