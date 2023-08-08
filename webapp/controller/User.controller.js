sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter',
    'sap/ui/elev8rerp/componentcontainer/formatter/fragment.formatter',
    'sap/ui/elev8rerp/componentcontainer/services/Company/ManageUser.service'

], function (BaseController, JSONModel, Filter, FilterOperator, Sorter,formatter, manageuserService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.User", {

        formatter: formatter,

        metadata: {
            manifest: "json"
        },

        onInit: function () {
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.subscribe("manageuser", "loadUserData", this.loadUserData, this);
            this.loadUserData();
        },

        onExit: function () {
            this.bus.unsubscribe("usermanagement", "setDetailPage", this.setDetailPage, this);
        },

        onSearch: function (oEvent) {
            var oTableSearchState = [],
                sQuery = oEvent.getParameter("query");
            var contains = sap.ui.model.FilterOperator.Contains;
            var columns = ['username', 'mobile'];
            var filters = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, contains, sQuery);
            }),
                false);  // false for OR condition

            if (sQuery && sQuery.length > 0) {
                oTableSearchState = [filters];
            }

            this.getView().byId("userTable").getBinding("items").filter(oTableSearchState, "Application");
        },

        onAddNew: function (oEvent) {
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("usermanagement", "setDetailPage", { viewName: "UserDetail" });
        },

        onListItemPress: function (oEvent) {
            var viewModel = oEvent.getSource().getBindingContext("userModel");
            var model = { "id": viewModel.getProperty("id") };
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("usermanagement", "setDetailPage", { viewName: "UserDetail", viewModel: model });
        },

        loadUserData: function () {
            var currentContext = this;

            manageuserService.searchUser(function (data) {
                var oModel = new JSONModel();
                oModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oModel, "userModel");
            });
        }
    });
});