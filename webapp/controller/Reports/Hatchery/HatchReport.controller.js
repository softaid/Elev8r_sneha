sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/HatcheryReports.service',

], function (BaseController, MessageBox, Export, ExportTypeCSV, commonFunction, hatcheryReportsService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Hatchery.HatchReport", {

        currentContext: null,

        onInit: function () {
            this.currentContext = this;
            this.getView().byId("txtdownload").setVisible(false);
            // set financical year date to from date and to date
            this.setCurrentFinancialYear();
            // call function which get data and bind to screen at first time 
            this.onSearchData();
        },

        /* Set financical year date to fromdate and todate when we load screen first time */
        setCurrentFinancialYear: function () {
            var date = new Date();
            if ((date.getMonth() + 1) <= 3) {
                var firstDay = new Date(date.getFullYear() - 1, 3, 1);
                var lastDay = new Date(date.getFullYear(), 3, 0);
            } else {
                var firstDay = new Date(date.getFullYear(), 3, 1);
                var lastDay = new Date(date.getFullYear() + 1, 3, 0);
            }

            var firstDayDD = firstDay.getDate();
            var firstDayMM = firstDay.getMonth() + 1;
            var firstDayYYYY = firstDay.getFullYear();

            if (firstDayDD < 10) {
                firstDayDD = '0' + firstDayDD;
            }

            if (firstDayMM < 10) {
                firstDayMM = '0' + firstDayMM;
            }

            var lastDayDD = lastDay.getDate();
            var lastDayMM = lastDay.getMonth() + 1;
            var lastDayYYYY = lastDay.getFullYear();

            if (lastDayDD < 10) {
                lastDayDD = '0' + lastDayDD;
            }

            if (lastDayMM < 10) {
                lastDayMM = '0' + lastDayMM;
            }

            this.getView().byId("txtFromDate").setValue(firstDayYYYY + '-' + firstDayMM + '-' + firstDayDD);
            this.getView().byId("txtToDate").setValue(lastDayYYYY + '-' + lastDayMM + '-' + lastDayDD);
        },

        /*get Hatch report all data and bind to hatchReportModel*/
        onSearchData: function () {
            if (this.validateForm()) {
                var currentContext = this;
                var oModel = {
                    fromdate: commonFunction.getDate(this.getView().byId("txtFromDate").getValue()),
                    todate: commonFunction.getDate(this.getView().byId("txtToDate").getValue()),
                    companyid: commonFunction.session("companyId")
                }

                hatcheryReportsService.getHatchReport(oModel, function (data) {
                    var oModel = new sap.ui.model.json.JSONModel();
                    oModel.setData({ modelData: data });
                    //set data to hatchReportModel
                    currentContext.getView().setModel(oModel, "hatchReportModel");
                });
            }
            this.getView().byId("txtdownload").setVisible(true);
        },

        // Add validation for Filters in report
        validateForm: function () {
            var isValid = true;
            if (!commonFunction.isRequired(this, "txtFromDate", "From Date is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtToDate", "To Date is required"))
                isValid = false;
            return isValid;
        },

        /* Generate PDF for Hatcher Report */
        onPdfExport: function () {
            var fullHtml = "";
            var headertable1 = "";
            headertable1 += "<!DOCTYPE html> <html> <head> <title>" + "Hatcher Report" + "</title>" +
                "<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js'></script>" +
                "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.22/pdfmake.min.js'></script>" +
                "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.62/vfs_fonts.js'></script>" +
                "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js'></script>" +
                "<style type='text/css'>" +
                "table {font-family: arial, sans-serif;border-collapse: collapse;width: 100%; } td, th {border: 1px solid #000;text-align: left;padding: 5px; } th, td {width: 100px;overflow: hidden; } img { width: 180px; height: 120px; text-align: center; } </style> </head>";

            headertable1 += "<body id='tblCustomers' class='amin-logo'>";
            headertable1 += "</body>";
            headertable1 += "<script>";

            let fromdate = this.getView().byId("txtFromDate").getValue();
            let todate = this.getView().byId("txtToDate").getValue();
            /* Header data for PDF */
            let companyname = commonFunction.session("companyname");
            let companycontact = commonFunction.session("companycontact");
            let companyemail = commonFunction.session("companyemail");
            let address = commonFunction.session("address");

            let companyname1 = companyname;
            let phone1 = (companycontact === null || companycontact == undefined) ? "-" : companycontact;
            let email1 = (companyemail === null || companyemail == undefined) ? "-" : companyemail;
            let address1 = (address === null || address == undefined) ? "-" : address;

            var tbleModel = this.getView().getModel("hatchReportModel").oData.modelData;
            headertable1 += "html2canvas($('#tblCustomers')[0], {" +
                "onrendered: function (canvas) {" +
                "var data = canvas.toDataURL();" +
                "var width = canvas.width;" +
                "var height = canvas.height;" +
                "var docDefinition = {" +
                "pageMargins: [ 5, 60, 20, 5 ]," +
                "pageOrientation: 'landscape'," +
                "pageSize: 'A4'," +
                "content: [";
            headertable1 += "{text: 'Company:-" + companyname1 + "', style: 'header'},";
            headertable1 += "{text: 'Email:-" + email1 + "', style: 'header'},";
            headertable1 += "{text: 'Phone:-" + phone1 + "', style: 'header'},";
            headertable1 += "{text: 'Address:-" + address1 + "', style: 'header'},";
            headertable1 += "{text: 'Hatcher Report', style: 'title'},";
            headertable1 += "{columns: [{text:'From Date:-" + fromdate + "', style: 'subheader'},{text:'To Date:-" + todate + "', style: 'todatecss'}]},";
            headertable1 += "{ style: 'tableExample',";
            headertable1 += " table: {";
            headertable1 += " body: [";
            headertable1 += "[ {text: 'Sr.No.', style: 'tableHeader'}, {text: 'Location', style: 'tableHeader'},{text: 'Hatcher Date', style: 'tableHeader'},{text: 'Hatcher Name', style: 'tableHeader'}, {text: 'Setter Name', style: 'tableHeader'},{text: 'Slot Name', style: 'tableHeader'},{text: 'Source Name', style: 'tableHeader'},{text: 'Hatcher Batch No', style: 'tableHeader'},{text: 'No of Eggs Set', style: 'tableHeader'},{text: 'No of Chicks Received', style: 'tableHeader'},{text: 'Hatch %', style: 'tableHeader'},{text: 'Culls', style: 'tableHeader'},{text: 'Culls %', style: 'tableHeader'},{text: 'Infertile', style: 'tableHeader'},{text: 'Infertile %', style: 'tableHeader'},{text: 'Dead In Gram', style: 'tableHeader'},{text: 'Dead In Gram %', style: 'tableHeader'},{text: 'Early Chicks Mor', style: 'tableHeader'},{text: 'Early Chicks Mort %', style: 'tableHeader'},{text: 'Middle Chicks Mort', style: 'tableHeader'},{text: 'Middle Chicks Mort %', style: 'tableHeader'},{text: 'Dead In Shell', style: 'tableHeader'},{text: 'Dead In Shell %', style: 'tableHeader'},{text: 'LCM', style: 'tableHeader'},{text: 'LCM %', style: 'tableHeader'},{text: 'Burst', style: 'tableHeader'},{text: 'Burst %', style: 'tableHeader'},{text: 'Saleable Chicks', style: 'tableHeader'},{text: 'Saleable Chicks %', style: 'tableHeader'}],";

            for (var i = 0; i < tbleModel.length; i++) {
                if (tbleModel[i].sqno == null) {
                    tbleModel[i].sqno = "-";
                }
                if (tbleModel[i].locationname == null) {
                    tbleModel[i].locationname = "-";
                }
                if (tbleModel[i].hatcherbatchdate == null) {
                    tbleModel[i].hatcherbatchdate = "-";
                }
                if (tbleModel[i].hatchername == null) {
                    tbleModel[i].hatchername = "-";
                }
                if (tbleModel[i].settername == null) {
                    tbleModel[i].settername = "-";
                }
                if (tbleModel[i].slotname == null) {
                    tbleModel[i].slotname = "-";
                }
                if (tbleModel[i].sourcename == null) {
                    tbleModel[i].sourcename = "-";
                }
                if (tbleModel[i].hatcherbatchid == null) {
                    tbleModel[i].hatcherbatchid = "-";
                }
                if (tbleModel[i].noofeggsset == null) {
                    tbleModel[i].noofeggsset = "-";
                }
                if (tbleModel[i].noofchicksreceived == null) {
                    tbleModel[i].noofchicksreceived = "-";
                }
                if (tbleModel[i].noofchicksreceivedpercent == null) {
                    tbleModel[i].noofchicksreceivedpercent = "-";
                }
                if (tbleModel[i].culls == null) {
                    tbleModel[i].culls = "-";
                }
                if (tbleModel[i].cullspercent == null) {
                    tbleModel[i].cullspercent = "-";
                }
                if (tbleModel[i].infertile == null) {
                    tbleModel[i].infertile = "-";
                }
                if (tbleModel[i].infertilepercent == null) {
                    tbleModel[i].infertilepercent = "-";
                }
                if (tbleModel[i].deadingerm == null) {
                    tbleModel[i].deadingerm = "-";
                }
                if (tbleModel[i].deadingrampercent == null) {
                    tbleModel[i].deadingrampercent = "-";
                }
                if (tbleModel[i].earlymortality == null) {
                    tbleModel[i].earlymortality = "-";
                }
                if (tbleModel[i].earlymortalitypercent == null) {
                    tbleModel[i].earlymortalitypercent = "-";
                }
                if (tbleModel[i].middlemortality == null) {
                    tbleModel[i].middlemortality = "-";
                }
                if (tbleModel[i].middlemortalitypercent == null) {
                    tbleModel[i].middlemortalitypercent = "-";
                }
                if (tbleModel[i].deadinshell == null) {
                    tbleModel[i].deadinshell = "-";
                }
                if (tbleModel[i].deadinshellpercent == null) {
                    tbleModel[i].deadinshellpercent = "-";
                }
                if (tbleModel[i].LCM == null) {
                    tbleModel[i].LCM = "-";
                }
                if (tbleModel[i].lcmpercent == null) {
                    tbleModel[i].lcmpercent = "-";
                }
                if (tbleModel[i].burst == null) {
                    tbleModel[i].burst = "-";
                }
                if (tbleModel[i].burstpercent == null) {
                    tbleModel[i].burstpercent = "-";
                }
                if (tbleModel[i].sellable == null) {
                    tbleModel[i].sellable = "-";
                }
                if (tbleModel[i].sellablepercent == null) {
                    tbleModel[i].sellablepercent = "-";
                }
                headertable1 += "['" + tbleModel[i].sqno + "','" + tbleModel[i].locationname + "','" + tbleModel[i].hatcherbatchdate + "','" + tbleModel[i].hatchername + "','" + tbleModel[i].settername + "','" + tbleModel[i].slotname + "','" + tbleModel[i].sourcename + "','" + tbleModel[i].hatcherbatchid + "','" + tbleModel[i].noofeggsset + "','" + tbleModel[i].noofchicksreceived + "','" + tbleModel[i].noofchicksreceivedpercent + "','" + tbleModel[i].culls + "','" + tbleModel[i].cullspercent + "','" + tbleModel[i].infertile + "','" + tbleModel[i].infertilepercent + "','" + tbleModel[i].deadingerm + "','" + tbleModel[i].deadingrampercent + "','" + tbleModel[i].earlymortality + "','" + tbleModel[i].earlymortalitypercent + "','" + tbleModel[i].middlemortality + "','" + tbleModel[i].middlemortalitypercent + "','" + tbleModel[i].deadinshell + "','" + tbleModel[i].deadinshellpercent + "','" + tbleModel[i].LCM + "','" + tbleModel[i].lcmpercent + "','" + tbleModel[i].burst + "','" + tbleModel[i].burstpercent + "','" + tbleModel[i].sellable + "','" + tbleModel[i].sellablepercent + "'],"
            }
            headertable1 += "]";
            headertable1 += "}";
            headertable1 += "}";
            headertable1 += "]," +
                "footer: function (currentPage, pageCount) {" +
                "return {" +
                "style: 'Footer'," +
                "table: {" +
                "widths: ['*', 100]," +
                "body: [" +
                "[" +
                "{ text: 'Page ' + currentPage.toString() + ' of ' + pageCount, alignment: 'center', style: 'normalText' }" +
                "]," +
                "]" +
                "}," +
                "layout: 'noBorders'" +
                "};" +
                "}," +
                "styles: {" +
                "header: {" +
                "fontSize:10," +
                "bold: true," +
                "margin: [0, 0, 0, 8]" +
                "}," +
                "title: {" +
                "fontSize:12," +
                "bold: true," +
                "alignment: 'center'" +
                "}," +
                "Footer: {" +
                "fontSize: 7," +
                "margin: [5, 5, 5, 5]," +
                "}," +
                "subheader: {" +
                "fontSize:9," +
                "bold: true," +
                "margin: [0, 10, 0, 4]" +
                "}," +
                "todatecss: {" +
                "fontSize:9," +
                "bold: true," +
                "alignment:'right'" +
                "}," +
                "tableExample: {" +
                "margin: [0, 15, 0, 0]," +
                "fontSize: 8" +
                "}," +
                "tableHeader: {" +
                "bold: true," +
                "fontSize: 8," +
                "color: 'black'" +
                "}" +
                "}," +
                "defaultStyle: {" +
                "fontSize: 8" +
                "}" +
                "};" +
                "pdfMake.createPdf(docDefinition).download('Hatcher_report.pdf');" +
                "} });";
            headertable1 += "</script></html>";
            fullHtml += headertable1;
            var wind = window.open();
            wind.document.write(fullHtml);
            setTimeout(function () {
                wind.close();
            }, 3000);
        },

        /* generate CSV for  Hatch  Report */
        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var fromdate = this.getView().byId("txtFromDate").getValue();
            var todate = this.getView().byId("txtToDate").getValue();
            var filename = fromdate + '_' + todate;
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
                        name: "Sr.No.",
                        template: { content: "{sqno}" }
                    },
                    {
                        name: "Location",
                        template: { content: "{ocationname}" }
                    },
                    {
                        name: "Hatcher Date",
                        template: { content: "{hatcherbatchdate}" }
                    },
                    {
                        name: "Hatcher Name",
                        template: { content: "{hatchername}" }
                    },
                    {
                        name: "Setter Name",
                        template: { content: "{settername}" }
                    },
                    {
                        name: "Slot Name",
                        template: { content: "{slotname}" }
                    },
                    {
                        name: "Source Name",
                        template: { content: "{sourcename}" }
                    },
                    {
                        name: "Hatcher Batch No",
                        template: { content: "{hatcherbatchid}" }
                    },
                    {
                        name: "No of Eggs Set",
                        template: { content: "{noofeggsset}" }
                    },
                    {
                        name: "No of Chicks Received",
                        template: { content: "{noofchicksreceived}" }
                    },
                    {
                        name: "Hatch %",
                        template: { content: "{noofchicksreceivedpercent}" }
                    },
                    {
                        name: "Culls",
                        template: { content: "{culls}" }
                    },
                    {
                        name: "Culls %",
                        template: { content: "{cullspercent}" }
                    },
                    {
                        name: "Infertile",
                        template: { content: "{infertile}" }
                    },
                    {
                        name: " Infertile %",
                        template: { content: "{infertilepercent}" }
                    },
                    {
                        name: "Dead In Gram",
                        template: { content: "{deadingerm}" }
                    },
                    {
                        name: " Dead In Gram %",
                        template: { content: "{deadingrampercent}" }
                    },
                    {
                        name: "Early Chicks Mor",
                        template: { content: "{earlymortality}" }
                    },
                    {
                        name: "Early Chicks Mort %",
                        template: { content: "{earlymortalitypercent}" }
                    },
                    {
                        name: "Middle Chicks Mort",
                        template: { content: "{middlemortality}" }
                    },
                    {
                        name: "Middle Chicks Mort %",
                        template: { content: "{middlemortalitypercent}" }
                    },
                    {
                        name: "Dead In Shell",
                        template: { content: "{deadinshell}" }
                    },
                    {
                        name: " Dead In Shell %",
                        template: { content: "{deadinshellpercent}" }
                    },
                    {
                        name: "LCM",
                        template: { content: "{LCM}" }
                    },
                    {
                        name: " LCM %",
                        template: { content: "{lcmpercent}" }
                    },
                    {
                        name: "Burst",
                        template: { content: "{burst}" }
                    },

                    {
                        name: " Burst %",
                        template: { content: "{burstpercent}" }
                    },
                    {
                        name: "Saleable Chicks",
                        template: { content: "{sellable}" }
                    },
                    {
                        name: "Saleable Chicks   %",
                        template: { content: "{sellablepercent}" }
                    }]
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
