
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

   return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.CompanySettings.LicenseManagement", {

        metadata: {
           manifest: "json"
        },

        onInit: function() {

            this.bus = sap.ui.getCore().getEventBus();
            this.bus.subscribe("licensemanagementmaster", "setDetailPage", this.setDetailPage, this);
            this.oFlexibleColumnLayout = this.byId("fclLicenseDetail");

            var oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.elev8rerp.componentcontainer.model.accounts.master", "/LicenseManagement.json"));

			this.getView().setModel(oModel, "licenesemanagementModel");
            
           
        },
 
        setDetailPage: function (channel, event, data) {
            this.detailView = sap.ui.view({
               viewName: "sap.ui.elev8rerp.componentcontainer.view.CompanySettings." + data.viewName,
               type: "XML"
            });
 
            this.detailView.setModel(data.viewModel,"viewModel");             
            this.oFlexibleColumnLayout.removeAllMidColumnPages();            
            this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
        },

        onListItemPress : function(oEvent){
            var model = oEvent.getSource().getBindingContext("licenesemanagementModel");                                
                  
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("commonmaster", "setDetailPage", {viewName : "LicenseManagementDetail", viewModel : model});
        },

        onSearch: function (oEvent) {          
            var oTableSearchState = [],
            sQuery = oEvent.getParameter("query");
            if (sQuery && sQuery.length > 0) {
              oTableSearchState = [new Filter("phasename", FilterOperator.Contains, sQuery)];
            }

            this.getView().byId("tblPhase").getBinding("items").filter(oTableSearchState, "Application");
        },

        onAddNew: function (oEvent) {
            //sap.ui.core.BusyIndicator.show();            
            
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("licensemanagementmaster", "setDetailPage", {viewName:"licenseManagementDetail"});
        },

        handleLinkPress: function (oEvent) {

            this.getView().byId("licenesesecondtable").setVisible(true);

		}

       
       
        
    });
});