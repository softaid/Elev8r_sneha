
sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    "sap/ui/model/json/JSONModel",
    'sap/ui/model/Sorter', 
    'sap/ui/elev8rerp/componentcontainer/formatter/fragment.formatter', 
    'sap/ui/elev8rerp/componentcontainer/services/Application/NotificationSetting.service',    
     
], function (BaseController, JSONModel, Sorter, formatter, notificationSettingService) {
        "use strict";

   return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Application.NotificationSetting", {

        metadata: {
           manifest: "json"
        },

        formatter : formatter,

        onInit: function() {
            this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("loaddata", "loadData", this.loadData, this);     			
            this.loadData(); 	
        },
 
        loadData : function(){
			var currentContext = this;	

			notificationSettingService.getAllNotificationSetting(function(data){
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({modelData : data[0]}); 
				currentContext.getView().setModel(oModel,"notificationModel");
			});
        },

        onAddNew: function (oEvent) {        
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("manageapplication", "setDetailPage", {viewName:"NotificationSettingDetail",  viewModel : {}});
        },

        onListItemPress : function(oEvent){
            var viewModel = oEvent.getSource().getBindingContext("notificationModel");
            var model = {
                "id" : viewModel.getProperty("id"),
            };            
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("manageapplication", "setDetailPage", {viewName : "NotificationSettingDetail", viewModel : model});
        },

        onSearch: function (oEvent) {
            var oTableSearchState = [],
            sQuery = oEvent.getParameter("query");
            var contains = sap.ui.model.FilterOperator.Contains;
            var columns = ['transactionname', 'modulename','rolename','actionname'];
            var filters = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, contains, sQuery);
            }),false);

            if (sQuery && sQuery.length > 0) {
                oTableSearchState = [filters];
            }

            this.getView().byId("tblNotificationSetting").getBinding("items").filter(oTableSearchState, "Application");
        },       

        onSort: function (oEvent) {
            this._bDescendingSort = !this._bDescendingSort;
            var oView = this.getView(),
            oTable = oView.byId("tblNotificationSetting"),
            oBinding = oTable.getBinding("items"),
            oSorter = new Sorter("reasontype", this._bDescendingSort);
            oBinding.sort(oSorter);
        }
    });
});