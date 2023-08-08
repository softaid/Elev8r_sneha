sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/FeedMill/ProductionOrder.service',

], function (JSONModel, BaseController, MessageToast, MessageBox, Export, ExportTypeCSV, commonFunction, productionOrderService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.FeedMill.ProductionRegisterReports", {


        onInit: function () {
            this.currentContext = this;
            // set empty model to view 
            var emptyModel = this.getModelDefault();
            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "proRgeisterReortModel");

        },


        getModelDefault: function () {
            return {
                fromdate: null,
                todate: null
            }
        },

        getProductionRegReport: function () {

            if (this.validateForm()) {
                var currentContext = this;
                var oModel = {
                    fromdate: commonFunction.getDate(this.getView().byId("txtfromdate").getValue()),
                    todate: commonFunction.getDate(this.getView().byId("txttodate").getValue()),
                    companyid: commonFunction.session("companyId")
                }

                productionOrderService.productionRegisterReport(oModel, function (data) {

                    var registerModel = new sap.ui.model.json.JSONModel();
                    registerModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(registerModel, "tblModel");


                });
            }
        },

        validateForm: function () {
            var isValid = true;

            if (!commonFunction.isRequired(this, "txtfromdate", "From Date is required"))
                isValid = false;
            if (!commonFunction.isRequired(this, "txttodate", "To Date is required"))
                isValid = false;
            return isValid;
        },



        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {

            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/



            var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ","
                }),

                // Pass in the model created above
                models: this.currentContext.getView().getModel("tblModel"),

                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content


                columns: [
                    {
                        name: "Order No.",
                        template: { content: "{productionorderno}" }
                    },
                    {
                        name: "Date",
                        template: { content: "{orderdate}" }
                    },
                    {
                        name: "Group Name",
                        template: { content: "{groupname}" }
                    },
                    {
                        name: "item Name",
                        template: { content: "{itemname}" }
                    },
                    {
                        name: "Plenned Quantity",
                        template: { content: "{plannedqty}" }
                    },
                    {
                        name: "Receipt Quantity",
                        template: { content: "{receipt_qty}" }
                    },
                    {
                        name: "Access Shortage",
                        template: { content: "{accesshortage}" }
                    },
                    {
                        name: "UOM",
                        template: { content: "{refname}" }
                    },
                    {
                        name: "UOM",
                        template: { content: "{warehousename}" }
                    },



                ]
            });

            // download exported file
            oExport.saveFile()
                .catch(function (oError) {
                    MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
                })
                .then(function () {

                    oExport.destroy();
                });
        }




    });
}, true);
