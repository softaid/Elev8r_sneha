sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/PurchaseReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',

], function (JSONModel, BaseController, MessageBox, Export, ExportTypeCSV, commonFunction, PurchaseReportsService, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Purchase.PendingPurchaseOrderReport", {

        currentContext: null,

        onInit: function () {
            this.currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");
            var model = new JSONModel();
            model.setData([]);
            this.getView().setModel(model, "reportModel");

            var emptyModel = this.getModelDefault();
            model.setData(emptyModel)
            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "tblModel");
            this.getView().byId("txtdownload").setVisible(false);
        },

        getModelDefault: function () {
            return {

                fromdate: null,
                todate: null
            }
        },

        resetModel: function () {
            var tbleModel = this.getView().getModel("tblModel");
            tbleModel.setData({ modelData: [] });

            var pModel = this.getView().getModel("reportModel");
            pModel.setData([]);

        },

        // Function for pdf start

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
                // Replace/create column sequence data table
                htmTable += "<tr>";
                htmTable += "<td align='center'>" + model["purchaseorderno"] + "</td>"
                htmTable += "<td>" + model["partyname"] + "</td>"
                htmTable += "<td align='right'>" + model["podate"] + "</td>"
                htmTable += "<td align='right'>" + model["itemname"] + "</td>"
                htmTable += "<td>" + model["quantity"] + "</td>"
                htmTable += "<td>" + model["inwardqty"] + "</td>"
                htmTable += "<td>" + model["pendinggrpoquantity"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;

            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();

            // var batchname = this.batchname;

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
            commonFunction.getHtmlTemplate("Purchase", "PendingPurchaseOrderReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Pending Purchase Order Report");
            });
        },

        // Function for pdf finish

        onSearchPendingPurchaseOrderReport: function () {
            // if (this.validateForm()) {


            var currentContext = this;
            var oModel = this.getView().getModel("reportModel");
            var fromdate = commonFunction.getDate(oModel.oData.fromdate);
            var todate = commonFunction.getDate(oModel.oData.todate);

            PurchaseReportsService.getPendingPurchaseOrderReport({ fromdate: fromdate, todate: todate }, function async(data) {
                var oBatchModel = currentContext.getView().getModel("tblModel");
                oBatchModel.setData({ modelData: data[0] });


            })

            this.getView().byId("txtdownload").setVisible(true);
            // }

        },


        // Validation Fun

        // validateForm: function () {
        //     var isValid = true;

        //     if (!commonFunction.ismultiComRequired(this, "partyList", "Branch is required is required"))
        //         isValid = false;

        //     if (!commonFunction.isRequired(this, "txtFromdate", "From Date is required"))
        //         isValid = false;

        //     if (!commonFunction.isRequired(this, "txtTodate", "To Date is required"))
        //         isValid = false;

        //     if (!commonFunction.ismultiComRequired(this, "farmerList", "farmer is required"))
        //         isValid = false;

        //     return isValid;
        // },


        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var filename = fromdate+'_'+todate;


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
                        name: "Purchase Order No",
                        template: { content: "{purchaseorderno}" }
                    },
                    {
                        name: "Supplier Name",
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
                        name: "Purchase Order Quantity",
                        template: { content: "{quantity}" }
                    },
                    {
                        name: "Inward Quantity",
                        template: { content: "{inwardqty}" }
                    },
                    {
                        name: "Balance Quantity",
                        template: { content: "{pendinggrpoquantity}" }
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
