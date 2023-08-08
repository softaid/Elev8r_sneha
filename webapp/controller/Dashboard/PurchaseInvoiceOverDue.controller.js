
sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/ui/elev8rerp/componentcontainer/services/DashBoard/CommonDashBoard.service',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service'

], function (BaseController, commondashboardService, commonFunction, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Dashboard.PurchaseInvoiceOverDue", {
        /**
          * Function to initialize purchase invoice
          */
        onInit: function () {
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.subscribe("commondashboard", "redirectToPage", this.redirectToPage, this);
            this.bus.subscribe("purchaseinvoice", "handlePurchaseInvoiceList", this.handlePurchaseInvoiceList, this);
            this.bus.subscribe("journalentry", "handleJournalEntryClose", this.handleJournalEntryClose, this);
            this.oFlexibleColumnLayout = this.byId("fcloverdue");
            this.bus = sap.ui.getCore().getEventBus();
            jQuery.sap.delayedCall(1000, this, function () {
                this.getView().byId("onSearchId").focus();
            });
        },
        /**
         * Function to Show overdue invoices
         */
        redirectToPage: function () {
            let currentContext = this;
            let to_date = commonFunction.getDateFromDB(new Date());
            to_date = commonFunction.getDate(to_date);
            commondashboardService.getPurchaseInvoiceOverDue({ to_date: to_date }, function (data) {
                console.log("getPurchaseInvoiceOverDue", data)
                let oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oModel, "overDueModel");
            });
        },
        /**
         * Function to serach a purchase invoice by column name
         * @param {*} oEvent 
         */
        onSearch: function (oEvent) {
            var oTableSearchState = [],
                sQuery = oEvent.getParameter("query");
            var contains = sap.ui.model.FilterOperator.Contains;
            var columns = ['purchaseinvoiceno', 'suppliername', 'invoicedate', 'duedate', 'subtotal'];
            var filters = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, contains, sQuery);
            }),
                false);

            if (sQuery && sQuery.length > 0) {
                oTableSearchState = [filters];
            }

            this.getView().byId("tblOverdueinvoice").getBinding("items").filter(oTableSearchState, "Application");
        },

        /**
         *Function to redirect to view screen of purchase invoice.
         * @param {*} oEvent 
         */
        goToPreview: function (oEvent) {
            let currentContext = this;
            let viewModel = oEvent.getSource().getBindingContext("overDueModel").getObject();
            console.log(viewModel);
            // let model = { "id": viewModel.getProperty("id")}
            this.bus = sap.ui.getCore().getEventBus();
            setTimeout(function () {
                this.bus = sap.ui.getCore().getEventBus();
                this.bus.publish("purchaseinvoice", "handlePurchaseInvoiceList", { pagekey: "purchaseinvoice", viewModel: viewModel });
            }, 1000);
            this.bus.publish("purchaseinvoice", "handlePurchaseInvoiceList", { pagekey: "purchaseinvoice", viewModel: viewModel });
        },
        /**
         * Function to redirect to view screen of jaurnal entry for particulat invoice
         * @param {*} oEvent 
         */
        goToJeTransaction: function (oEvent) {
            let currentContext = this;
            let viewModel = oEvent.getSource().getBindingContext("overDueModel").getObject();
            console.log("viewModel......", viewModel);
            commonService.getJeDetail({ vouchertype_id: 1294, transaction_id: viewModel.id }, function (data) {
                console.log(data);
                if (data.length > 0) {
                    currentContext.bus = sap.ui.getCore().getEventBus();
                    setTimeout(function () {
                        currentContext.bus = sap.ui.getCore().getEventBus();
                        currentContext.bus.publish("journalentry", "handleJournalEntryClose", { pagekey: "journalentryview", viewModel: viewModel });
                    }, 1000);
                    currentContext.bus.publish("journalentry", "handleJournalEntryClose", { pagekey: "journalentryview", viewModel: viewModel });
                }
            })
        },
        /**
          * Function to navigate to specified route.
         * @param {*} sChannel 
         * @param {*} sEvent 
         * @param {*} oData 
         */
        handlePurchaseInvoiceList: function (sChannel, sEvent, oData) {
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.bus = sap.ui.getCore().getEventBus();
            oRouter.getTargets().display(oData.pagekey, { viewModel: oData.viewModel });
            oRouter.navTo(oData.pagekey, true);
        },

        handleJournalEntryClose: function (sChannel, sEvent, oData) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.bus = sap.ui.getCore().getEventBus();
            oRouter.getTargets().display(oData.pagekey, { viewModel: oData.viewModel });
            oRouter.navTo(oData.pagekey, true);
        },



    });
});