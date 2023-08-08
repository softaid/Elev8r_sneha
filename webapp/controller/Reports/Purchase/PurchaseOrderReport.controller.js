sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/PurchaseOrderReports.service'

], function (JSONModel, BaseController, MessageToast, MessageBox, Export, ExportTypeCSV, commonFunction, purchaseOrderReportsService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Purchase.PurchaseOrderReport", {

        onInit: function () {
            this.currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");
            var emptyModel = this.getModelDefault();
            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "PurchaseOrderReportModel");
            this.getView().byId("txtdownload").setVisible(false);
        },

        getModelDefault: function () {
            return {
                fromdate: commonFunction.setTodaysDate(new Date()),
                todate: commonFunction.setTodaysDate(new Date()),
            }
        },

        resetModel: function () {
            var tbleModel = this.getView().getModel("PurchaseOrderReportModel");
            tbleModel.setData({ modelData: [] });

            var tbleModelone = this.getView().getModel("poModel");
            tbleModelone.setData({ modelData: [] });
        },

        getPurchaseReport: function () {
            if (this.validateForm()) {
                var currentContext = this;
                var tbleModel = this.getView().getModel("PurchaseOrderReportModel");
                var fromdate = commonFunction.getDate(tbleModel.oData.fromdate)
                var todate = commonFunction.getDate(tbleModel.oData.todate);

                purchaseOrderReportsService.getPurchaseOrderReport({ fromdate: fromdate, todate: todate }, function async(data) {
                    var oBatchModel = new sap.ui.model.json.JSONModel();
                    oBatchModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oBatchModel, "tblModel");

                    var oBatchModelFor = new sap.ui.model.json.JSONModel();
                    oBatchModelFor.setData({ modelData: data[2] });
                    currentContext.getView().setModel(oBatchModelFor, "fortblModel");

                    var pModel = new sap.ui.model.json.JSONModel();
                    pModel.setData({ modelData: data[1] });
                    currentContext.getView().setModel(pModel, "poModel");
                })
            }
            this.getView().byId("txtdownload").setVisible(true);
        },

        replaceStr: function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },

        // Function Used For PDF Download

        replaceTemplateData: function (template) {
            // Item table Data --------------
            var tbleModel = this.getView().getModel("tblModel").oData.modelData;
            var htmTable = "";
            for (var indx in tbleModel) {
                var model = tbleModel[indx];
                htmTable += "<tr>";
                htmTable += "<td align='center'>" + model["purchaseorderno"] + "</td>"
                htmTable += "<td>" + model["partyname"] + "</td>"
                htmTable += "<td align='right'>" + model["podate"] + "</td>"
                htmTable += "<td align='right'>" + model["itemname"] + "</td>"
                htmTable += "<td>" + model["itemunitname"] + "</td>"
                htmTable += "<td>" + model["quantity"] + "</td>"
                htmTable += "<td>" + model["unitprice"] + "</td>"
                htmTable += "<td>" + model["itemdiscount"] + "</td>"
                htmTable += "<td>" + model["linetotal"] + "</td>"
                htmTable += "<td>" + model["sgstamount"] + "</td>"
                htmTable += "<td>" + model["cgstamount"] + "</td>"
                htmTable += "<td>" + model["igstamount"] + "</td>"
                htmTable += "<td>" + model["Total"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;
            var fromdate = this.getView().byId("txtFromDate").getValue();
            var todate = this.getView().byId("txtToDate").getValue();

            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);
            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##FromDate##", fromdate);
            template = this.replaceStr(template, "##ToDate##", todate);
            return template;
        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("Purchase", "PurchaseOrder.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Purchase Order Register Report");
            });
        },

        // Validation Fun
        validateForm: function () {
            var isValid = true;
            if (!commonFunction.isRequired(this, "txtFromDate", "From Date is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtToDate", "To Date is required"))
                isValid = false;

            return isValid;
        },

        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var fromdate = this.getView().byId("txtFromDate").getValue();
            var todate = this.getView().byId("txtToDate").getValue();
            var filename = fromdate+'_'+todate;


            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/


            var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ","
                }),

                // Pass in the model created above
                models: this.getView().getModel("tblModel"),

                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content

                columns: [
                    {
                        name: "Purchase Order No.",
                        template: { content: "{purchaseorderno}" }
                    },
                    {
                        name: "Party Name",
                        template: { content: "{partyname}" }
                    },
                    {
                        name: "Purchase Order Date",
                        template: { content: "{podate}" }
                    },
                    {
                        name: "Item Name",
                        template: { content: "{itemname}" }
                    },
                    {
                        name: "Unit name",
                        template: { content: "{itemunitname}" }
                    },

                    {
                        name: "Quantity	",
                        template: { content: "{quantity}" }
                    },
                    {
                        name: "Unit Cost",
                        template: { content: "{unitprice}" }
                    },
                    {
                        name: "Discount%",
                        template: { content: "{discount}" }
                    },
                    {
                        name: "Line total",
                        template: { content: "{linetotal}" }
                    },
                    {
                        name: "SGST Amount",
                        template: { content: "{sgstamount}" }
                    },
                    {
                        name: "CGST Amount",
                        template: { content: "{cgstamount}" }
                    },
                    {
                        name: "IGST Amount",
                        template: { content: "{igstamount}" }
                    },
                    {
                        name: "Total",
                        template: { content: "{Total}" }
                    }
                ]


            });

            // download exported file
            oExport.saveFile(filename)
                .catch(function (oError) {
                    MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
                })
                .then(function () {

                    oExport.destroy();
                });
        }

    });
}, true);
