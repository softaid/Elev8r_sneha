
sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',

], function (BaseController, JSONModel, Filter, FilterOperator, Sorter, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.ApplicationSettings.PageShortcutKeys", {

        metadata: {
            manifest: "json"
        },

        onInit: function () {
            // this.bus = sap.ui.getCore().getEventBus();
            // this.bus.subscribe("flockmaster", "setDetailPage", this.setDetailPage, this);
            this.oFlexibleColumnLayout = this.byId("fclPageShortCut");

            this.bus = sap.ui.getCore().getEventBus();
            this.bus.subscribe("pagekeyshortcut", "setDetailPage", this.setDetailPage, this);     
            this.bus.subscribe("loaddata", "loadData", this.loadData, this);
            this.loadData();
            // this.getRole();


            
        },

        onExit: function () {
            // this.bus.unsubscribe("flockmaster", "setDetailPage", this.setDetailPage, this);
        },

        onSearch: function (oEvent) {
            var oTableSearchState = [],
                sQuery = oEvent.getParameter("query");
            var contains = sap.ui.model.FilterOperator.Contains;
            var columns = ['locationname', 'warehousename', 'batchname', 'batchstatus'];
            var filters = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, contains, sQuery);
            }),
                false);  // false for OR condition

            if (sQuery && sQuery.length > 0) {
                oTableSearchState = [filters];
            }

            this.getView().byId("tblBatch").getBinding("items").filter(oTableSearchState, "Application");
        },


        loadData: function () {
            var currentContext = this;
            
            var roleIds = commonService.session("roleIds");
            commonService.getRolewisePageKey({roleids : roleIds},function (data) {
                console.log("role data : ",data);
                var oModel = new sap.ui.model.json.JSONModel();

                if (data[0].length) {
                    oModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oModel, "pageKeyModel");
                }

            });
        },
        
        onRoleChange: function (oEvent) {
            this.roleid = null;
            this.roleid = oEvent.getParameter("selectedItem").getKey();;
            this.getRolewiseEntity(this.roleid);
		},

        getRolewiseEntity : function(roleid){
            var currentContext = this;
            commonService.getRolewiseEntity({roleid : roleid},function(data){
                var oModel = new sap.ui.model.json.JSONModel();
                console.log("entity : ",data);
                if (data[0].length) {
                    oModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oModel, "pageModel");
                }
            })
        },

        onListItemPress : function(oEvent){
            var viewModel = oEvent.getSource().getBindingContext("pageKeyModel");     
            console.log("view model : ",viewModel);                           			
			var model = {
				"id" : viewModel.getProperty("id"),
				"roleid" : viewModel.getProperty("roleid"),
				"key" : viewModel.getProperty("key"),
				"pagename" : viewModel.getProperty("pagename"),
				"pagekey" : viewModel.getProperty("pagekey"),
				"default" : viewModel.getProperty("default")
			}
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("pagekeyshortcut", "setDetailPage", { viewName: "PageShortcutKeysDetail", viewModel : model });            
        },
        
        setDetailPage: function (channel, event, data) {
            this.detailView = sap.ui.view({
                viewName: "sap.ui.elev8rerp.componentcontainer.view.ApplicationSettings." + data.viewName,
                type: "XML"
            });
            
            this.detailView.setModel(data.viewModel,"viewModel"); 
            this.oFlexibleColumnLayout.removeAllMidColumnPages();          
            this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
        },

    });
});
