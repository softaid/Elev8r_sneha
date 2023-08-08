
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

   return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.CompanySettings.StateMaster", {

        metadata: {
           manifest: "json"
        },

        onInit: function() {
         
            var oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.elev8rerp.componentcontainer.model.accounts.master", "/stateMaster.json"));

			this.getView().setModel(oModel, "stateMasterModel");
            
           
        },
 
        
        onListItemPress : function(oEvent){
            var model = oEvent.getSource().getBindingContext("stateMaster");                                
                  
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("commonmaster", "setDetailPage", {viewName : "stateMaster", viewModel : model});
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
            this.bus.publish("commonmaster", "setDetailPage", {viewName:"StateMasterDetail"});
        },

      
       
        
    });
});