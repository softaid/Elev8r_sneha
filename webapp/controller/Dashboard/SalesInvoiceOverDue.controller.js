
sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/elev8rerp/componentcontainer/services/DashBoard/CommonDashBoard.service',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service'

], function (BaseController, JSONModel, Filter, FilterOperator, commondashboardService, commonFunction, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Dashboard.SalesInvoiceOverDue", {

        onInit: function () {

            this.bus = sap.ui.getCore().getEventBus();
            this.bus.subscribe("commondashboard", "redirectToPage", this.redirectToPage, this);
            this.bus.subscribe("journalentry", "handleJournalEntryClose", this.handleJournalEntryClose, this);
            this.bus.subscribe("salesinvoice", "handleSalesInvoiceList", this.handleSalesInvoiceList, this);
            this.oFlexibleColumnLayout = this.byId("fcloverdue");
            this.bus = sap.ui.getCore().getEventBus();

        },
        redirectToPage: function () {
            var currentContext = this;
            let to_date = commonFunction.getDateFromDB(new Date());
            to_date = commonFunction.getDate(to_date);
            commondashboardService.getSalesInvoiceOverDue({ to_date: to_date }, function (data) {
                console.log("getSalesInvoiceOverDue", data)
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oModel, "overDueModel");
            });
        },

        /**
        * Function to redirect to view screen of jaurnal entry for particulat invoice
        * @param {*} oEvent 
        */
        goToJeTransaction: function (oEvent) {
            let currentContext = this;
            let viewModel = oEvent.getSource().getBindingContext("overDueModel").getObject();
            console.log("viewModel......", viewModel);
            commonService.getJeDetail({ vouchertype_id: 1291, transaction_id: 36 }, function (data) {
                console.log("getJeDetail........", data[0][0]);
                if (data.length > 0) {
                    currentContext.bus = sap.ui.getCore().getEventBus();
                    setTimeout(function () {
                        currentContext.bus = sap.ui.getCore().getEventBus();
                        currentContext.bus.publish("journalentry", "handleJournalEntryClose", { pagekey: "journalentryview", viewModel: data[0][0] });
                    }, 1000);
                    currentContext.bus.publish("journalentry", "handleJournalEntryClose", { pagekey: "journalentryview", viewModel: data[0][0] });
                }
            })
        },

        onSearch: function (oEvent) {
            var oTableSearchState = [],
                sQuery = oEvent.getParameter("query");
            if (sQuery && sQuery.length > 0) {
                oTableSearchState = [new Filter("bankname", FilterOperator.Contains, sQuery)];
            }

            this.getView().byId("tblBank").getBinding("items").filter(oTableSearchState, "Application");
        },
        handleJournalEntryClose: function (sChannel, sEvent, oData) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.bus = sap.ui.getCore().getEventBus();
            oRouter.getTargets().display(oData.pagekey, { viewModel: oData.viewModel });
            oRouter.navTo(oData.pagekey, true);
        },
        /**
       * Function to navigate to specified route.
       * @param {*} sChannel 
       * @param {*} sEvent 
       * @param {*} oData 
       */
        handleSalesInvoiceList: function (sChannel, sEvent, oData) {
            console.log("oData", oData);
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.bus = sap.ui.getCore().getEventBus();
            oRouter.getTargets().display(oData.pagekey, {viewModel: oData.viewModel });
            oRouter.navTo(oData.pagekey, true);
        },
        /**
 * Function to redirect to edit screen of sales invoice.
 * @param {*} oEvent 
 */
        goToPreview: function (oEvent) {

            let _this = this;
            let viewModel = oEvent.getSource().getBindingContext("overDueModel").getObject();

            _this.bus = sap.ui.getCore().getEventBus();

            setTimeout(function () {
                _this.bus = sap.ui.getCore().getEventBus();
                _this.bus.publish("salesinvoice", "handleSalesInvoiceList", { pagekey: "invoicegenerations", viewModel: viewModel });
            }, 1000);

            _this.bus.publish("salesinvoice", "handleSalesInvoiceList", { pagekey: "invoicegenerations", viewModel: viewModel });

        },

    });
});