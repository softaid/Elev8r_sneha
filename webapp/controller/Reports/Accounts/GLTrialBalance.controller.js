sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/MockServer',
    // 'sap/ui/core/util/Spreadsheet',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/AccountsReports.service',

], function (JSONModel, BaseController, MessageToast, MessageBox, Export, MockServer, ExportTypeCSV, commonFunction, accountsReportsService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Accounts.GLTrialBalance", {

        currentContext: null,

        onInit: function () {
            var currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");

            // set empty model to view 
            var emptyModel = this.getModelDefault();

            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "gltbModel");

            // set empty model to view		
            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "tblGltbModel");

            // get all branches
            commonFunction.getAllCommonBranch(this);
            this.getView().byId("txtdownload").setVisible(false);
            // this.reportData = new JSONModel();
        },

        onBeforeRendering: function () {


        },
        getModelDefault: function () {
            return {
                fromdate: commonFunction.getDateFromDB(new Date()),
                todate: commonFunction.getDateFromDB(new Date()),
            }
        },


        handleSelectBranchList: function (oEvent) {
            var sInputValue = oEvent.getSource().getValue();

            this.inputId = oEvent.getSource().getId();
            // create value help dialog
            // if (!this._valueHelpDialog) {
            this._valueHelpDialog = sap.ui.xmlfragment(
                "sap.ui.elev8rerp.componentcontainer.fragmentview.Accounts.Master.BranchDialog",
                this
            );
            this.getView().addDependent(this._valueHelpDialog);
            // }
            this._valueHelpDialog.open(sInputValue);

        },

        handleBranchSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var columns = ['bankname', 'ifsccode'];
            var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
            }),
                false);  // false for OR condition
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        handleBranchClose: function (oEvent) {
            var currentContext = this;
            var aContexts = oEvent.getParameter("selectedContexts");

            if (aContexts != undefined) {
                var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
                var oModel = currentContext.getView().getModel("gltbModel");

                //update existing model to set supplier
                oModel.oData.branchid = selRow[0].id;
                oModel.oData.branchname = selRow[0].branchname;
                oModel.oData.branchcode = selRow[0].branchcode;
                oModel.refresh();
            }

        },

        bindTbl: function () {
            var currentContext = this;
            var pModel = this.getView().getModel("gltbModel").oData;

            pModel["fromdate"] = commonFunction.getDate(pModel.fromdate);
            pModel["todate"] = commonFunction.getDate(pModel.todate);

            var tbleModel = this.getView().getModel("tblGltbModel");

            accountsReportsService.getGeneralLedgerTB({ branchid: pModel["branchid"], fromdate: pModel["fromdate"], todate: pModel["todate"] }, function (data) {

                var drclosingbalance = 0;
                var crclosingbalance = 0
                for (var i = 0; i < data[0].length; i++) {
                    data[0][i].dramount = parseFloat(data[0][i].dramount).toFixed(2);
                    data[0][i].cramount = parseFloat(data[0][i].cramount).toFixed(2);

                    if (parseFloat(data[0][i].openingdramount) > parseFloat(data[0][i].openingcramount)) {
                        data[0][i].openingdramount = parseFloat(data[0][i].openingdramount).toFixed(2);
                        data[0][i].closingdramount = parseFloat(((parseFloat(data[0][i].openingdramount) - parseFloat(data[0][i].openingcramount)) + parseFloat(data[0][i].dramount)) - (parseFloat(data[0][i].cramount))).toFixed(2);
                        data[0][i].closingcramount = parseFloat(0).toFixed(2);

                    } if (parseFloat(data[0][i].openingdramount) < parseFloat(data[0][i].openingcramount)) {
                        data[0][i].openingcramount = parseFloat(data[0][i].openingcramount).toFixed(2);
                        data[0][i].closingcramount = parseFloat(((parseFloat(data[0][i].openingcramount) - parseFloat(data[0][i].openingdramount)) + parseFloat(data[0][i].cramount)) - (parseFloat(data[0][i].dramount))).toFixed(2);
                        data[0][i].closingdramount = parseFloat(0).toFixed(2);
                    }

                    if (data[0][i].openingdramount == 0 && data[0][i].openingcramount == 0) {
                        data[0][i].openingdramount = parseFloat(data[0][i].openingdramount).toFixed(2);
                        data[0][i].openingcramount = parseFloat(data[0][i].openingcramount).toFixed(2);

                        if (parseFloat(data[0][i].dramount) > parseFloat(data[0][i].cramount)) {
                            data[0][i].closingdramount = parseFloat(parseFloat(data[0][i].dramount) - parseFloat(data[0][i].cramount)).toFixed(2);
                            data[0][i].closingcramount = parseFloat(0).toFixed(2);
                        }

                        if (parseFloat(data[0][i].dramount) < parseFloat(data[0][i].cramount)) {
                            data[0][i].closingdramount = parseFloat(0).toFixed(2);
                            data[0][i].closingcramount = parseFloat(parseFloat(data[0][i].cramount) - (parseFloat(data[0][i].dramount))).toFixed(2);
                        }
                    }


                    if (data[0][i].openingdramount == data[0][i].openingcramount) {
                        if (parseFloat(data[0][i].dramount) > parseFloat(data[0][i].cramount)) {
                            data[0][i].closingdramount = parseFloat(parseFloat(data[0][i].dramount) - parseFloat(data[0][i].cramount)).toFixed(2);
                            data[0][i].closingcramount = parseFloat(0).toFixed(2);
                        }

                        if (parseFloat(data[0][i].dramount) < parseFloat(data[0][i].cramount)) {
                            data[0][i].closingdramount = parseFloat(0).toFixed(2);
                            data[0][i].closingcramount = parseFloat(parseFloat(data[0][i].cramount) - (parseFloat(data[0][i].dramount))).toFixed(2);
                        }
                    }

                    if (data[0][i].closingdramount != undefined && data[0][i].closingdramount != null) {
                        drclosingbalance += parseFloat(data[0][i].closingdramount);
                    }
                    if (data[0][i].closingcramount != undefined && data[0][i].closingcramount != null) {
                        crclosingbalance += parseFloat(data[0][i].closingcramount);
                    }
                    if (data[0][i].ledgername == 'Grand Total') {
                        data[0][i].openingdramount = parseFloat(data[0][i].openingdramount).toFixed(2);
                        data[0][i].openingcramount = parseFloat(data[0][i].openingcramount).toFixed(2);
                        data[0][i].closingdramount = parseFloat(drclosingbalance).toFixed(2);
                        data[0][i].closingcramount = parseFloat(crclosingbalance).toFixed(2);
                    }

                }
                tbleModel.setData({ modelData: data[0] });
                tbleModel.refresh();


            })
            this.getView().byId("txtdownload").setVisible(true);
        },


        toDataURL: function (url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                var reader = new FileReader();
                reader.onloadend = function () {
                    callback(reader.result);
                }
                reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.send();
            //}
        },
         // Change Done By Pooja For PDF Functionality
        onPdfExport: function () {
            var fullHtml = "";
            var headertable1 = "";
            headertable1 += "<!DOCTYPE html> <html> <head> <title>" + "GL Register Report" + "</title>" +
                "<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js'></script>" +
                "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.22/pdfmake.min.js'></script>" +
                "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.62/vfs_fonts.js'></script>" +
                "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js'></script>" +
                "<style type='text/css'>" +
                "table {font-family: arial, sans-serif;border-collapse: collapse;width: 100%; } td, th {border: 1px solid #000;text-align: left;padding: 5px; } th, td {width: 100px;overflow: hidden; } img { width: 180px; height: 120px; text-align: center; } </style> </head>";

            headertable1 += "<body id='tblCustomers' class='amin-logo'>";
            headertable1 += "</body>";
            headertable1 += "<script>";



            var fromdate = this.getView().byId("txtFromDate").getValue();
            var todate = this.getView().byId("txtToDate").getValue();
            var Branch = this.getView().byId("branch").getValue();
            var companyname = this.companyname;
            var phone = this.companycontact;
            var email = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;

            var phone = (this.companycontact === null || this.companycontact == undefined) ? "-" : this.companycontact;
            var email = (this.companyemail === null || this.companyemail == undefined) ? "-" : this.companyemail;
            var address = (this.address === null || this.address == undefined) ? "-" : this.address;
            var pincode = (this.pincode === null || this.pincode == undefined) ? "-" : this.pincode;

            var tbleModel = this.getView().getModel("tblGltbModel").oData.modelData;
            headertable1 += "html2canvas($('#tblCustomers')[0], {" +
                "onrendered: function (canvas) {" +
                "var data = canvas.toDataURL();" +
                "var width = canvas.width;" +
                "var height = canvas.height;" +
                "var docDefinition = {" +
                "pageMargins: [ 40, 60, 40, 60 ]," +
                "content: [";
            headertable1 += "{text: 'Company:-" + companyname + "', style: 'header'},";
            headertable1 += "{text: 'Email:-" + email + "', style: 'header'},";
            headertable1 += "{text: 'Phone:-" + phone + "', style: 'header'},";
            headertable1 += "{text: 'Address:-" + address + "', style: 'header'},";
            headertable1 += "{text: 'General Ledger Trial Balance Report', style: 'title'},";
            headertable1 += "{columns: [{text:'From Date:-" + fromdate + "', style: 'subheader'},{text:'To Date:-" + todate + "', style: 'todatecss'}]},";
            headertable1 += "{text: 'Ledger Name:-" + Branch + "', style: 'subheader'},";
            headertable1 += "{ style: 'tableExample',";
            headertable1 += " table: {";
            headertable1 += " body: [";
            headertable1 += "[ {text: 'GL Code', style: 'tableHeader'}, {text: 'Ledger Name', style: 'tableHeader'},{text: 'OP_DR', style: 'tableHeader'},{text: 'OP_CR', style: 'tableHeader'}, {text: 'Debit Amount', style: 'tableHeader'},{text: 'Credit Amount', style: 'tableHeader'},{text: 'CL_DR', style: 'tableHeader'},{text: 'CL_CR', style: 'tableHeader'}],";

            for (var i = 0; i < tbleModel.length; i++) {
                if (tbleModel[i].glcode == null) {
                    tbleModel[i].glcode = "-";
                }
                if (tbleModel[i].ledgername == null) {
                    tbleModel[i].ledgername = "-";
                }
                if (tbleModel[i].openingdramount == null) {
                    tbleModel[i].openingdramount = "-";
                }
                if (tbleModel[i].openingcramount == null) {
                    tbleModel[i].openingcramount = "-";
                }
                if (tbleModel[i].dramount == null) {
                    tbleModel[i].dramount = "-";
                }
                if (tbleModel[i].cramount == null) {
                    tbleModel[i].cramount = "-";
                }
                if (tbleModel[i].closingdramount == null) {
                    tbleModel[i].closingdramount = "-";
                }
                if (tbleModel[i].closingcramount == null) {
                    tbleModel[i].closingcramount = "-";
                }
                headertable1 += "['" + tbleModel[i].glcode + "','" + tbleModel[i].ledgername + "','" + tbleModel[i].openingdramount + "','" + tbleModel[i].openingcramount + "','" + tbleModel[i].dramount + "','" + tbleModel[i].cramount + "','" + tbleModel[i].closingdramount + "','" + tbleModel[i].closingcramount + "'],"
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
                "pdfMake.createPdf(docDefinition).download('General_Ledger_Trial_Balance_Report.pdf');" +
                "} });";
            headertable1 += "</script></html>";
            fullHtml += headertable1;
            var wind = window.open();
            wind.document.write(fullHtml);

            setTimeout(function () {
                wind.close();
            }, 3000);
        },




        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {

            var fromdate = this.getView().byId("txtFromDate").getValue();
            var todate = this.getView().byId("txtToDate").getValue();
            var Branch = this.getView().byId("branch").getValue();
            

            var filename = fromdate+'_'+todate+'_'+Branch;
            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/


            var oExport = new Export({

                // Branch: this.getView().byId("branch").getValue(),

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ","
                    // separatorChar:  ""

                }),

                // Pass in the model created above

                models: this.getView().getModel("tblGltbModel"),


                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },


                columns: [

                    {
                        name: "General Ledger Code",
                        template: { content: "{glcode}" }
                    },
                    {
                        name: "Ledger",
                        template: { content: "{ledgername}" }
                    },
                    {
                        name: "Opening Debit",
                        template: { content: "{openingdramount}" }
                    },
                    {
                        name: "Opening Credit",
                        template: { content: "{openingcramount}" }
                    },
                    {
                        name: "Debit Amount",
                        template: { content: "{dramount}" }
                    },
                    {
                        name: "Credit Amount",
                        template: { content: "{cramount}" }
                    },
                    {
                        name: "Closing Debit",
                        template: { content: "{closingdramount}" }
                    },
                    {
                        name: "Closing Credit",
                        template: { content: "{closingcramount}" }
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
