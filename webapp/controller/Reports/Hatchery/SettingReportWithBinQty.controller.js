sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/HatcheryReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',

], function (JSONModel, BaseController, MessageToast, MessageBox, Export, ExportTypeCSV, commonFunction, hatcheryReportsService, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Hatchery.SettingReportWithBinQty", {

        currentContext: null,

        onInit: function () {
            this.currentContext = this;
            var emptyModel = this.getModelDefault();

            var settingreportwithbinqty = new JSONModel();
            settingreportwithbinqty.setData(emptyModel);
            this.getView().setModel(settingreportwithbinqty, "settingreportwithbinqty");


            //this.onSearchData();
        },

        onBeforeRendering: function () {


        },

        getModelDefault: function () {
            return {
                partyid: null,
                fromdate: commonFunction.setTodaysDate(new Date()),
                todate: commonFunction.setTodaysDate(new Date()),
            }
        },

        // ongetDate: function () {
        //     var isValid = true
        //     var oModel = this.getView().getModel("itemWiseSaleReport").oData

        //     var fromDate = oModel.fromdate;
        //     var todate = oModel.todate;

        //     if (fromDate) {
        //         // var parts1 = fromDate.split('-');

        //         // fromDate = Date.parse(new Date(parts1[2], parts1[1], parts1[0]));
        //         var date1 = Date.parse(fromDate);
        //         this.getView().byId("txtFromDate").setValueState(sap.ui.core.ValueState.None);
        //     }
        //     if (todate) {

        //         // var parts2 = todate.split('-');

        //         // todate = Date.parse(new Date(parts2[2], parts2[1], parts2[0]));
        //         var date3 = Date.parse(todate);
        //         this.getView().byId("txtToDate").setValueState(sap.ui.core.ValueState.None);
        //     }


        //     if (date3 < date1) {
        //         MessageBox.error("From Date less thsn todate date");
        //         isValid = false;
        //     }
        //     return isValid
        // },




        onSearchData: function () {
            if (this.validateForm()) {
                var currentContext = this;
                var fromdate = this.getView().byId("txtFromDate").getValue();
                var todate = this.getView().byId("txtToDate").getValue()

                var FModel = {
                    fromdate: commonFunction.getDate(fromdate),
                    todate: commonFunction.getDate(todate)
                }

                console.log("FModel", FModel);
                hatcheryReportsService.getSettingReportWithBinQty(FModel, function (data) {
                    console.log("data", data);
                    var oModel = new sap.ui.model.json.JSONModel();
                    oModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oModel, "hatchReportModel");
                    console.log("hatchReportModel", oModel);
                });
            }
        },

        onDateChange: function () {

            if (commonFunction.isDate(this, "txtFromDate")) {

                var fromDate = this.getView().byId("txtFromDate").getValue();
                var toDate = this.getView().byId("txtToDate").getValue();

                fromDate = commonFunction.parseDate(fromDate);
                toDate = commonFunction.parseDate(toDate);

                var date1 = new Date(fromDate);
                var date2 = new Date(toDate);

                if (date1 > date2) {
                    this.getView().byId("txtToDate").setValueState(sap.ui.core.ValueState.Error);
                    this.getView().byId("txtToDate").setValueStateText("To Date should be greater than From Date.");
                    return false;
                }
                else {

                    this.getView().byId("txtToDate").setValueStateText("").setValueState(sap.ui.core.ValueState.None);
                    return true;
                }
            }
            else {
                return true;
            }
        },

        validateForm: function () {
            var isValid = true;

            if (!commonFunction.isRequired(this, "txtFromDate", "From Date is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtToDate", "To Date is required"))
                isValid = false;

            if (!this.onDateChange())
                isValid = false;

            return isValid;
        },


        replaceStr: function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },

        // Function Used For PDF Download

        replaceTemplateData: function (template) {
           // Item table Data --------------
            var tbleModel = this.getView().getModel("hatchReportModel").oData.modelData;

            var htmTable = "";
            for (var indx in tbleModel) {
                var model = tbleModel[indx];
                // Replace/create column sequence data table
                htmTable += "<tr>";
                htmTable += "<td align='center'>" + model["batchdate"] + "</td>"
                htmTable += "<td>" + model["settingno"] + "</td>"
                htmTable += "<td align='right'>" + model["refname"] + "</td>"
                htmTable += "<td align='right'>" + model["locationname"] + "</td>"
                htmTable += "<td>" + model["setterbatchno"] + "</td>"
                htmTable += "<td>" + model["Warehousebinname"] + "</td>"
                htmTable += "<td>" + model["machineqty"] + "</td>"
                htmTable += "<td>" + model["receivedqty"] + "</td>"
                htmTable += "<td>" + model["crackedeggs"] + "</td>"
                htmTable += "<td>" + model["crackper"] + "</td>"
                htmTable += "<td>" + model["crackedeggs"] + "</td>"
                htmTable += "<td>" + model["crackper"] + "</td>"
                htmTable += "<td>" + model["noofeggset"] + "</td>"
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
            template = this.replaceStr(template, "##ReportFromDate##", fromdate);
            template = this.replaceStr(template, "##ReporToDate##", todate);
            return template;

        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("Hatchery", "SettingReportWithBinQty.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generateLargePDF(template, "Setting Report With Bin Qty");
            });
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
                models: this.currentContext.getView().getModel("hatchReportModel"),

                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content

                columns: [
                    {
                        name: "Setting Date",
                        template: { content: "{batchdate}" }
                    },
                    {
                        name: "Setting No",
                        template: { content: "{settingno}" }
                    },
                    {
                        name: "Source Name",
                        template: { content: "{refname}" }
                    },
                    {
                        name: "Breeder Location",
                        template: { content: "{locationname}" }
                    },
                    {
                        name: "Batch No",
                        template: { content: "{setterbatchno}" }
                    },
                    {
                        name: "Machine Name",
                        template: { content: "{Warehousebinname}" }
                    },
                    {
                        name: "Machine Qty",
                        template: { content: "{machineqty}" }
                    },
                    {
                        name: "No Of Eggs Received",
                        template: { content: "{receivedqty}" }
                    },
                    {
                        name: "No of Eggs Set",
                        template: { content: "{crackedeggs}" }
                    },
                    {
                        name: "No of Chicks Received",
                        template: { content: "{crackper}" }
                    },
                    {
                        name: "Burst Eggs",
                        template: { content: "{crackedeggs}" }
                    },
                    {
                        name: "Burst Eggs %",
                        template: { content: "{crackper}" }
                    },
                    {
                        name: "Cracked Eggs",
                        template: { content: "{noofeggset}" }
                    },
                    {
                        name: "Cracked Eggs %",
                        template: { content: "{sellable}" }
                    },
                    {
                        name: "No Of Eggs Set",
                        template: { content: "{sellablepercent}" }
                    }]
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
