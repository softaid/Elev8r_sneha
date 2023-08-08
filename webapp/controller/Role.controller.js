
sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter', 
     
], function (BaseController,JSONModel, Filter, FilterOperator, Sorter, SessionManager) {
        "use strict";

   return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Role", {

        metadata: {
           manifest: "json"
        },

        onInit: function() {
            // var oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.elev8rerp.componentcontainer.model", "/roles.json"));
            // this.getView().setModel(oModel, "roleModel");
            
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.subscribe("usermanagement", "loadRoleData", this.loadUserData, this);
            this.loadRoleData();
        },

        loadRoleData: function () {
            var currentContext = this;

            manageuserService.searchUser(function (data) {
                var oModel = new JSONModel();
                oModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oModel, "roleModel");
            });
        },
 
        onListItemPress : function(oEvent){
            var viewModel = oEvent.getSource().getBindingContext("roleModel");                                
            var model = {
                            "name" : viewModel.getProperty("name"),
                            "description" : viewModel.getProperty("description"),
                        }
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("usermanagement", "setDetailPage", {viewName : "RoleDetail", viewModel : model});
        },

        onSearch: function (oEvent) {          
            var oTableSearchState = [],
			sQuery = oEvent.getParameter("query");
			var contains = sap.ui.model.FilterOperator.Contains;
			var columns = ['name', 'description'];
			var filters = new sap.ui.model.Filter(columns.map(function(colName) {
							 return new sap.ui.model.Filter(colName, contains, sQuery); }),
						  false);  // false for OR condition
			
			if (sQuery && sQuery.length > 0) {
			   oTableSearchState = [filters];
			}
			
			this.getView().byId("roleTable").getBinding("items").filter(oTableSearchState, "Application");
        },

        onAddNew: function (oEvent) {            
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("usermanagement", "setDetailPage", {viewName:"RoleDetail"});
        },

        onSort: function (oEvent) {
            this._bDescendingSort = !this._bDescendingSort;
            var oView = this.getView(),
            oTable = oView.byId("roleTable"),
            oBinding = oTable.getBinding("items"),
            oSorter = new Sorter("name", this._bDescendingSort);
            oBinding.sort(oSorter);
        }
    });
});