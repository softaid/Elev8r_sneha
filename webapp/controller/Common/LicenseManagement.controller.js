
sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter',
    'sap/ui/elev8rerp/componentcontainer/utility/SessionManager',
    'sap/ui/elev8rerp/componentcontainer/services/Company/ManageSubscription.service',
    'jquery.sap.storage',

], function (BaseController, JSONModel, Filter, FilterOperator, Sorter, SessionManager, manageSubscriptionService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.CompanySettings.LicenseManagement", {

        onInit: function () {

            this.bus = sap.ui.getCore().getEventBus();
            this.bus.subscribe("licensemanagementmaster", "setDetailPage", this.setDetailPage, this);
            this.bus.subscribe("licensemanagementmaster", "activelicenselist", this.getActiveLicenseList, this);
            this.bus.subscribe("licensemanagementmaster", "userlicenselist", this.getUserLicenseList, this);

            this.oFlexibleColumnLayout = this.byId("fclLicenseDetail");

            this.handleRouteMatched(null);

            var currRouteName = this.getOwnerComponent().getModel("applicationModel").getProperty("/routeName");
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this._oRouter.getRoute(currRouteName).attachMatched(this.handleRouteMatched, this);

        },

        handleRouteMatched: function () {
            // Get Current Active License List
            this.getActiveLicenseList();

            // Get Current User License List
            this.getUserLicenseList();
        },


        setDetailPage: function (channel, event, data) {
            this.detailView = sap.ui.view({
                viewName: "sap.ui.elev8rerp.componentcontainer.view.CompanySettings." + data.viewName,
                type: "XML"
            });

            this.detailView.setModel(data.viewModel, "viewModel");
            this.oFlexibleColumnLayout.removeAllMidColumnPages();
            this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
        },

        getActiveLicenseList: function () {
            var currentContext = this;
            manageSubscriptionService.activeLicenses(function (data) {
                var oModel = new JSONModel();
                oModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oModel, "activeLicenseModel");
            });
        },

        getUserLicenseList: function () {
            var currentContext = this;
            manageSubscriptionService.userLicenses(function (data) {
                var oModel = new JSONModel();
                oModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oModel, "userLicenseModel");
            });
        },

        onListItemPress: function (oEvent) {

            var viewModel = oEvent.getSource().getBindingContext("userLicenseModel");
            var model = {
                "id": viewModel.getProperty("id"),
                "username": viewModel.getProperty("username"),
                "licenses": viewModel.getProperty("licenses"),
                "subscriptionids": viewModel.getProperty("subscriptionids"),
            };
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("licensemanagementmaster", "setDetailPage", { viewName: "LicenseManagementDetail", viewModel: model });
        },

        onSearch: function (oEvent) {
            var oTableSearchState = [],
                sQuery = oEvent.getParameter("query");
            var contains = sap.ui.model.FilterOperator.Contains;
            var columns = ['username', 'licenses'];
            var filters = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, contains, sQuery);
            }),
                false);  // false for OR condition

            if (sQuery && sQuery.length > 0) {
                oTableSearchState = [filters];
            }

            this.getView().byId("tblUserLicenses").getBinding("items").filter(oTableSearchState, "Application");
        },


        onAddNew: function (oEvent) {
            //sap.ui.core.BusyIndicator.show();            

            this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("licensemanagementmaster", "setDetailPage", { viewName: "licenseManagementDetail" });
        },

        handleLinkPress: function (oEvent) {
            this.getView().byId("licenesesecondtable").setVisible(true);
            this.getView().byId("licenesesecondtable2").setVisible(false);
        },

        handleLinkPress1: function (oEvent) {
            this.getView().byId("licenesesecondtable2").setVisible(true);
            this.getView().byId("licenesesecondtable").setVisible(false);
        }
    });
});