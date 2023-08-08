sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/formatter/fragment.formatter',
    'sap/ui/elev8rerp/componentcontainer/services/LeadManagement/LeadActivity.service'

], function (BaseController, JSONModel, formatter, leadActivityService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.LeadManagement.LeadActivity", {

        formatter: formatter,
        onInit: function () {
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.subscribe("leadactivity", this.setDetailPage, this);
            this.oFlexibleColumnLayout = this.byId("fclLeadActivity");
            this.bus.subscribe("leadactivity", "LeadActivity", this.loadLeadActivities, this);
            this.loadLeadActivities();
        },

        onExit: function () {
            this.bus.unsubscribe("leadactivity", this.setDetailPage, this);
        },

        setDetailPage: function (channel, event, data) {
            this.detailView = sap.ui.view({
                viewName: "sap.ui.elev8rerp.componentcontainer.view.LeadManagement." + data.viewName,
                type: "XML"
            });

            this.detailView.setModel(data.viewModel, "viewModel");
            this.oFlexibleColumnLayout.removeAllMidColumnPages();
            this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
        },

        onSearch: function (oEvent) {
            var oTableSearchState = [],
                sQuery = oEvent.getParameter("query");
            var contains = sap.ui.model.FilterOperator.Contains;
            var columns = ['subject', 'assignedtoemp','type','priority','status'];
            var filters = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, contains, sQuery);
            }),
                false);  // false for OR condition

            if (sQuery && sQuery.length > 0) {
                oTableSearchState = [filters];
            }

            this.getView().byId("activityTable").getBinding("items").filter(oTableSearchState, "Application");
        },

        onAddNew: function (oEvent) {
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("leadactivity", { viewName: "LeadActivityDetail" });
        },

        onListItemPress: function (oEvent) {
            var viewModel = oEvent.getSource().getBindingContext("leadActivityModel");
            var model = { "id": viewModel.getProperty("id") };
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("leadactivity", { viewName: "LeadActivityDetail", viewModel: model });
        },

        loadLeadActivities: function () {
            var currentContext = this;

            leadActivityService.getAllLeadActivities(function (data) {
                var oModel = new JSONModel();
                if(data.length && data[0].length){
                    oModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oModel, "leadActivityModel");
                }else{
                    oModel.setData({ modelData: [] });
                    currentContext.getView().setModel(oModel, "leadActivityModel");
                }
            });
        },
    });
});