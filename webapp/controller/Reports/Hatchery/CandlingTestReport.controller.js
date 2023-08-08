sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/HatcheryReports.service',

], function (BaseController, MessageBox, Export, ExportTypeCSV, commonFunction, hatcheryReportsService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Hatchery.CandlingTestReport", {

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

        /*get candling test report all data*/
        onSearchData: function () {
            if (this.validateForm()) {
                var currentContext = this;
                var oModel = {
                    fromdate: commonFunction.getDate(this.getView().byId("txtFromDate").getValue()),
                    todate: commonFunction.getDate(this.getView().byId("txtToDate").getValue()),
                    companyid: commonFunction.session("companyId")
                }
                hatcheryReportsService.getCandlingTestReport(oModel, function (data) {
                    var oModel = new sap.ui.model.json.JSONModel();
                    oModel.setData({ modelData: data });
                    currentContext.getView().setModel(oModel, "candlingTestReportModel");
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

        /* Generate PDF for Candling Test Report */
        onPdfExport: function () {
            var fullHtml = "";
            var headertable1 = "";
            headertable1 += "<!DOCTYPE html> <html> <head> <title>" + "Candling Test Report" + "</title>" +
                "<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js'></script>" +
                "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.22/pdfmake.min.js'></script>" +
                "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.62/vfs_fonts.js'></script>" +
                "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js'></script>" +
                "<style type='text/css'>" +
                "table {font-family: arial, sans-serif;border-collapse: collapse;width: 100%; } td, th {border: 1px solid #000;text-align: left;padding: 5px; } th, td {width: 100px;overflow: hidden; } img { width: 180px; height: 120px; text-align: center; } </style> </head>";

            headertable1 += "<body id='tblCustomers' class='amin-logo'>";
            headertable1 += "</body>";
            headertable1 += "<script>";

            /* Header data for PDF */
            let companyname = commonFunction.session("companyname");
            let companycontact = commonFunction.session("companycontact");
            let companyemail = commonFunction.session("companyemail");
            let address = commonFunction.session("address");

            let fromdate = this.getView().byId("txtFromDate").getValue();
            let todate = this.getView().byId("txtToDate").getValue();
            let companyname1 = companyname;
            let phone1 = (companycontact === null || companycontact == undefined) ? "-" : companycontact;
            let email1 = (companyemail === null || companyemail == undefined) ? "-" : companyemail;
            let address1 = (address === null || address == undefined) ? "-" : address;

            var tbleModel = this.getView().getModel("candlingTestReportModel").oData.modelData;
            headertable1 += "html2canvas($('#tblCustomers')[0], {" +
                "onrendered: function (canvas) {" +
                "var data = canvas.toDataURL();" +
                "var width = canvas.width;" +
                "var height = canvas.height;" +
                "var docDefinition = {" +
                "pageMargins: [ 40, 60, 40, 60 ]," +
                "content: [";
            headertable1 += "{text: 'Company:-" + companyname1 + "', style: 'header'},";
            headertable1 += "{text: 'Email:-" + email1 + "', style: 'header'},";
            headertable1 += "{text: 'Phone:-" + phone1 + "', style: 'header'},";
            headertable1 += "{text: 'Address:-" + address1 + "', style: 'header'},";
            headertable1 += "{text: 'Candling Test Report', style: 'title'},";
            headertable1 += "{columns: [{text:'From Date:-" + fromdate + "', style: 'subheader'},{text:'To Date:-" + todate + "', style: 'todatecss'}]},";
            headertable1 += "{ style: 'tableExample',";
            headertable1 += " table: {";
            headertable1 += " body: [";
            headertable1 += "[ {text: 'Sr.No.', style: 'tableHeader'}, {text: 'Date', style: 'tableHeader'},{text: 'Test No.', style: 'tableHeader'},{text: 'Source', style: 'tableHeader'}, {text: 'Breeder Batch No', style: 'tableHeader'},{text: 'Setter No', style: 'tableHeader'},{text: 'Total Setting Eggs', style: 'tableHeader'},{text: 'No. Of Eggs Tested', style: 'tableHeader'},{text: 'Infertile Eggs', style: 'tableHeader'},{text: 'Infertile Eggs %', style: 'tableHeader'},{text: 'Clears Eggs', style: 'tableHeader'},{text: 'Expected Chicks %', style: 'tableHeader'},{text: 'Expected Chicks Quantity', style: 'tableHeader'}],";

            for (var i = 0; i < tbleModel.length; i++) {
                if (tbleModel[i].sqno == null) {
                    tbleModel[i].sqno = "-";
                }
                if (tbleModel[i].testdate == null) {
                    tbleModel[i].testdate = "-";
                }
                if (tbleModel[i].testno == null) {
                    tbleModel[i].testno = "-";
                }
                if (tbleModel[i].sourcename == null) {
                    tbleModel[i].sourcename = "-";
                }
                if (tbleModel[i].batchno == null) {
                    tbleModel[i].batchno = "-";
                }
                if (tbleModel[i].setterno == null) {
                    tbleModel[i].setterno = "-";
                }
                if (tbleModel[i].stdeggsquantity == null) {
                    tbleModel[i].stdeggsquantity = "-";
                }
                if (tbleModel[i].noofeggstested == null) {
                    tbleModel[i].noofeggstested = "-";
                }
                if (tbleModel[i].infertileeggs == null) {
                    tbleModel[i].infertileeggs = "-";
                }
                if (tbleModel[i].infertileeggspercent == null) {
                    tbleModel[i].infertileeggspercent = "-";
                }
                if (tbleModel[i].clears == null) {
                    tbleModel[i].clears = "-";
                }
                if (tbleModel[i].expectedchickspercent == null) {
                    tbleModel[i].expectedchickspercent = "-";
                }
                if (tbleModel[i].chicksquantity == null) {
                    tbleModel[i].chicksquantity = "-";
                }
                headertable1 += "['" + tbleModel[i].sqno + "','" + tbleModel[i].testdate + "','" + tbleModel[i].testno + "','" + tbleModel[i].sourcename + "','" + tbleModel[i].batchno + "','" + tbleModel[i].setterno + "','" + tbleModel[i].stdeggsquantity + "','" + tbleModel[i].noofeggstested + "','" + tbleModel[i].infertileeggs + "','" + tbleModel[i].infertileeggspercent + "','" + tbleModel[i].clears + "','" + tbleModel[i].expectedchickspercent + "','" + tbleModel[i].chicksquantity + "'],"
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
                "pdfMake.createPdf(docDefinition).download('Candling_Test_report.pdf');" +
                "} });";
            headertable1 += "</script></html>";
            fullHtml += headertable1;
            var wind = window.open();
            wind.document.write(fullHtml);
            setTimeout(function () {
                wind.close();
            }, 3000);
        },
        /* generate CSV for Candling Test Report */
        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            let fromdate = this.getView().byId("txtFromDate").getValue();
            let todate = this.getView().byId("txtToDate").getValue();
            let filename = fromdate + '_' + todate;

            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/

            var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ","
                }),

                // Pass in the model created above
                models: this.currentContext.getView().getModel("candlingTestReportModel"),

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
                        name: "Date",
                        template: { content: "{testdate}" }
                    },
                    {
                        name: "Test No.",
                        template: { content: "{testno}" }
                    },
                    {
                        name: "Source",
                        template: { content: "{sourcename}" }
                    },
                    {
                        name: "Breeder Batch No.",
                        template: { content: "{batchno}" }
                    },
                    {
                        name: "Setter No.",
                        template: { content: "{setterno}" }
                    },
                    {
                        name: "Total Setting Eggs",
                        template: { content: "{stdeggsquantity}" }
                    },
                    {
                        name: "No. Of Eggs Tested",
                        template: { content: "{noofeggstested}" }
                    },
                    {
                        name: "Infertile Eggs",
                        template: { content: "{infertileeggs}" }
                    },
                    {
                        name: "Infertile Eggs %",
                        template: { content: "{infertileeggspercent}" }
                    },

                    {
                        name: "Clears Eggs",
                        template: { content: "{clears}" }
                    },
                    {
                        name: "Expected Chicks %",
                        template: { content: "{expectedchickspercent}" }
                    },
                    {
                        name: "Expected Chicks Quantity",
                        template: { content: "{chicksquantity}" }
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
