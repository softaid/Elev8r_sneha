sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/AccountsReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',

], function (JSONModel, BaseController, MessageToast, MessageBox, Export, ExportTypeCSV, commonFunction, accountsReportsService, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Accounts.GLRegister", {

        currentContext: null,

        onInit: function () {

            this.currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");

            // fun for PDF img
            // var currentContext = this;
            // this.imagepath = null;
            // this.toDataURL('../images/logical.png', function (dataUrl) {
            //     currentContext.imagepath = dataUrl;
            // });

            var model = new JSONModel();
            var emptyModel = this.getModelDefault();
            model.setData(emptyModel);
            this.getView().setModel(model, "subledgerModel");

            var emptyModel = this.getModelDefault();

            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "glLedgerModel");

            // set empty model to view		
            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "tblGLRegiModel");

            // get all ledgers

            //global model for report
            this.reportData = new JSONModel();

            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "tblglsingleledgerModel");

            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "tblSubledgerRegiModelmultipleledger");
            this.handleRouteMatched(null);
            this.getView().byId("txtdownload").setVisible(false);



        },

        handlePrint: function (oEvent) {
            var fullHtml = "";
            var fullHtml1 = "";
            var FROMDATE = "From Date:";
            var createInvoice = this.getView().getModel('tblSubledgerRegiModelmultipleledger');
            var fromdate = this.getView().byId("txtFromDate").getValue();
            var todate = this.getView().byId("txtToDate").getValue();
            var ledger = this.selectedLedgername;

            var invoice = createInvoice.oData.modelData;
            var headertable1 = "<table  border='1' style='margin-top:150px;width: 1000px;' align='center'>" +
                "<caption style='color:black;font-weight: bold;font-size: large;'>GL Register Report</caption>" +

                "<tr><th style='color:black'>Voucher Date</th>" +
                "<th style='color:black'>JE No</th>" +
                "<th style='color:black'>Voucher Type</th>" +
                "<th style='color:black'>Ledger</th>" +
                "<th style='color:black'>OP_DR</th>" +

                "<th style='color:black'>OP_CR</th>" +
                "<th style='color:black'>Debit Amt</th>" +
                "<th style='color:black'>Credit Amt</th>" +

                "<th style='color:black'>CL_DR</th>" +
                "<th style='color:black'>CL_CR</th>" +
                "<th style='color:black'>Narration</th></tr>";

            var fromdate1 = "<table   style='margin-top:150px;width: 500px;' align='left'>"
            fromdate1 += "<tr>" +
                "<th align='left'>" + FROMDATE + "<td align='left'>" + fromdate + "</td>" + "</th>"
            "</tr>";
            //Adding row dynamically to student table....

            for (var i = 0; i < invoice.length; i++) {
                headertable1 += "<tr>" +
                    "<td>" + invoice[i].voucherdate + "</td>" +
                    "<td>" + invoice[i].jeno + "</td>" +
                    "<td>" + invoice[i].transactiontype + "</td>" +
                    "<td>" + invoice[i].coaname + "</td>" +
                    "<td>" + invoice[i].op_dr + "</td>" +
                    "<td>" + invoice[i].op_cr + "</td>" +
                    "<td>" + invoice[i].dramount + "</td>" +
                    "<td>" + invoice[i].cramount + "</td>" +
                    "<td>" + invoice[i].cl_dr + "</td>" +
                    "<td>" + invoice[i].cl_cr + "</td>" +
                    "<td>" + invoice[i].narration + "</td>" +
                    "</tr>";
            }

            fromdate1 += "</table>";
            fullHtml1 += fromdate1;

            headertable1 += "</table>";
            fullHtml += headertable1;
            var wind = window.open("", "prntExample");
            wind.document.write(fullHtml1);
            wind.document.write(fullHtml);

            wind.print();
            wind.close();
            wind.stop();
        },

        handleRouteMatched: function (evt) {
            this.getLedgerList();
            this.getView().byId("secondContainer").setVisible(true);
            // this.getView().byId("singlesupplier").setVisible(false);
        },

        getLedgerList: function () {
            var currentContext = this;
            commonService.getAccountLedgers(function (data) {
                if (data[0].length) {
                    data[0].unshift({ "id": "All", "ledgername": "Select All" });

                    var oLedgerModel = new sap.ui.model.json.JSONModel();
                    oLedgerModel.setData({ modelData: data[0] });

                    oLedgerModel.setSizeLimit(data[0].length);
                    currentContext.getView().setModel(oLedgerModel, "ledgerList");
                                    } else {
                    MessageBox.error("Ledger not available.")
                }

            });
        },

        getModelDefault: function () {
            return {
                fromdate: commonFunction.getDateFromDB(new Date()),
                todate: commonFunction.getDateFromDB(new Date()),
            }
        },

        resetModel: function () {
            var tbleParentModel = this.getView().getModel("glLedgerModel");
            tbleParentModel.setData({ modelData: [] });
            var tbleModel = this.getView().getModel("tblGLRegiModel");
            tbleModel.setData({ modelData: [] });
        },

        ledgerSelectionChange: function (oEvent) {
            var changedItem = oEvent.getParameter("changedItem");
            var isSelected = oEvent.getParameter("selected");
            var state = "Selected";

            if (!isSelected) {
                state = "Deselected"
            }

            //Check if "Selected All is selected
            if (changedItem.mProperties.key == "All") {
                var oName, res;

                //If it is Selected
                if (state == "Selected") {

                    var oItems = oEvent.oSource.mAggregations.items;
                    for (var i = 0; i < oItems.length; i++) {
                        if (i == 0) {
                            oName = oItems[i].mProperties.key;
                        } else {
                            oName = oName + ',' + oItems[i].mProperties.key;
                        } //If i == 0									
                    } //End of For Loop

                    res = oName.split(",");
                    oEvent.oSource.setSelectedKeys(res);

                } else {
                    res = null;
                    oEvent.oSource.setSelectedKeys(res);
                }
            }

            var ledgerstring = this.getView().byId("ledgerList").getSelectedKeys();
            if (ledgerstring.length > 1) {
                this.getView().byId("txtFromDate").setVisible(true);
                this.getView().byId("txtToDate").setVisible(true);
                this.getView().byId("multiplesupplier").setVisible(true);
                // this.getView().byId("singlesupplier").setVisible(false);
                this.getView().byId("secondContainer").setVisible(true);

                // } else if (ledgerstring.length = 1) {
                //     this.getView().byId("txtFromDate").setVisible(true);
                //     this.getView().byId("txtToDate").setVisible(true);
                //     this.getView().byId("multiplesupplier").setVisible(false);
                // }

            }
        },

        ledgerSelectionFinish: function (oEvt) {
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedsheds = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedsheds.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }
            this.selectedLedgername = [];
            for (var i = 0; selectedsheds.length > i; i++) {
                this.selectedLedgername.push(selectedsheds[i].text);
            }
        },

        bindTbl: function () {
            var currentContext = this;
            var pModel = this.getView().getModel("subledgerModel").oData;
            var currentContext = this;
            var ledgerstring = this.getView().byId("ledgerList").getSelectedKeys();

            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });

            var ledgerStr = "";
            for (var i = 0; i < ledgerstring.length; i++) {
                if (i == 0)
                    ledgerStr = parseInt(ledgerstring[i]);
                else
                    ledgerStr = ledgerStr + "," + parseInt(ledgerstring[i]);
            }

            pModel["fromdate"] = commonFunction.getDate(pModel.fromdate);
            pModel["todate"] = commonFunction.getDate(pModel.todate);
            var tbleModel = this.getView().getModel("tblGLRegiModel");

            accountsReportsService.getGLRegister({ ledgerid: ledgerStr, fromdate: pModel["fromdate"], todate: pModel["todate"] }, function (data) {
                var closingbal = 0;
                var openingbal = 0;
                for (var i = 0; i < data[0].length; i++) {

                    openingbal = parseFloat(data[0][i].op_dr) - parseFloat(data[0][i].op_cr);
                    closingbal = (openingbal + parseFloat(data[0][i].dramount)) - parseFloat(data[0][i].cramount);
                    if (openingbal > 0) {
                        data[0][i].op_dr = openingbal;
                        data[0][i].op_cr = 0;
                    } else {
                        data[0][i].op_cr = Math.abs(openingbal);
                        data[0][i].op_dr = 0;
                    }
                    if (closingbal <= 0) {
                        data[0][i].cl_cr = Math.abs(closingbal);
                        data[0][i].cl_dr = 0;
                    } else {
                        data[0][i].cl_cr = 0;
                        data[0][i].cl_dr = closingbal;
                    }
                }

                tbleModel.setData({ modelData: data[0] });
                tbleModel.refresh();
                currentContext.reportData.setData({ modelData: data[0] });
                currentContext.reportData.refresh();

            })
        },

        bindTblone: function () {
            var currentContext = this;
            var currentContext = this;
            var pModel = this.getView().getModel("subledgerModel").oData;
            var ledgerstring = this.getView().byId("ledgerList").getSelectedKeys();

            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
            var ledgerStr = "";
            for (var i = 0; i < ledgerstring.length; i++) {
                if (i == 0)
                    ledgerStr = parseInt(ledgerstring[i]);
                else
                    ledgerStr = ledgerStr + "," + parseInt(ledgerstring[i]);
            }

            pModel["fromdate"] = commonFunction.getDate(pModel.fromdate);
            pModel["todate"] = commonFunction.getDate(pModel.todate);

            // if (ledgerstring.length > 1) {
            accountsReportsService.getGLRegister({ ledgerid: ledgerStr, fromdate: pModel["fromdate"], todate: pModel["todate"] }, function (data) {

                var closingbal = 0;
                var openingbal = 0;
                //if (data[0].length > 0) {

                for (var i = 0; i < data[0].length; i++) {
                    openingbal = parseFloat(data[0][i].op_dr) - parseFloat(data[0][i].op_cr);
                    closingbal = (openingbal + parseFloat(data[0][i].dramount)) - parseFloat(data[0][i].cramount);

                    if (openingbal > 0) {
                        data[0][i].op_dr = openingbal;
                        data[0][i].op_cr = 0;
                    } else {
                        data[0][i].op_cr = Math.abs(openingbal);
                        data[0][i].op_dr = 0;
                    }
                    if (closingbal <= 0) {
                        data[0][i].cl_cr = Math.abs(closingbal);
                        data[0][i].cl_dr = 0;
                    } else {
                        data[0][i].cl_cr = 0;
                        data[0][i].cl_dr = closingbal;
                    }
                }
                // }
                // else {
                //      MessageBox.error("data not availabel!");
                //  }

                var multiplepartydataArray = [];
                var openingbalsingleledger = 0;

                if (data[0].length > 0) {
                    for (var i = 0; data[0].length > i; i++) {
                        openingbalsingleledger = parseFloat(data[0][i].op_dr) - parseFloat(data[0][i].op_cr);
                        multiplepartydataArray.push({
                            op_cr: data[0][i].op_cr.toFixed(3),
                            op_dr: data[0][i].op_dr.toFixed(3),
                            voucherdate: data[0][i].voucherdate,
                            cl_cr: data[0][i].cl_cr.toFixed(3),
                            cl_dr: data[0][i].cl_dr.toFixed(3),
                            dramount: data[0][i].dramount.toFixed(3),
                            cramount: data[0][i].cramount.toFixed(3),
                            acledgerid: data[0][i].acledgerid,
                            openingbalsingleledger: openingbalsingleledger,
                            jeno: data[0][i].jeno,
                            transactiontype: data[0][i].transactiontype,
                            narration: data[0][i].narration,
                            coaname: data[0][i].coaname,
                            glcode: data[0][i].glcode,
                            glcode: data[0][i].glcode,

                        });
                    }
                }

                else {
                    MessageBox.error("data not availabel!");
                }
                var tbleModelmultipleledger = currentContext.getView().getModel("tblSubledgerRegiModelmultipleledger");
                tbleModelmultipleledger.setData({ modelData: multiplepartydataArray });
            })
            // }


            // else if (ledgerstring.length == 1) {
            //     accountsReportsService.getGLRegistersingleledger({ ledgerid: ledgerStr, fromdate: pModel["fromdate"], todate: pModel["todate"] }, function (data) {

            //         var closingbal = 0;
            //         var openingbal = 0;

            //         if (data.length > 0) {
            //             for (var i = 0; i < data[0].length; i++) {
            //                 openingbal = parseFloat(data[0][i].op_dr) - parseFloat(data[0][i].op_cr);
            //                 closingbal = (openingbal + parseFloat(data[0][i].dramount)) - parseFloat(data[0][i].cramount);

            //                 if (openingbal > 0) {
            //                     data[0][i].op_dr = openingbal;
            //                     data[0][i].op_cr = 0;
            //                 } else {
            //                     data[0][i].op_cr = Math.abs(openingbal);
            //                     data[0][i].op_dr = 0;
            //                 }
            //                 if (closingbal <= 0) {
            //                     data[0][i].cl_cr = Math.abs(closingbal);
            //                     data[0][i].cl_dr = 0;
            //                 } else {
            //                     data[0][i].cl_cr = 0;
            //                     data[0][i].cl_dr = closingbal;
            //                 }
            //             }
            //         }
            //         else {
            //             MessageBox.error("Data not availabel.")
            //         }

            //         var dataArray = [];
            //         var openingbalsingleledger = 0;
            //         var valueone = 0;

            //         if (data.length > 0) {
            //             for (var i = 0; data[0].length > i; i++) {
            //                 openingbalsingleledger = parseFloat(data[0][i].op_dr) - parseFloat(data[0][i].op_cr);
            //                 openingbal = parseFloat(data[0][i].Ob) + parseFloat(data[0][i].op_dr) - parseFloat(data[0][i].op_cr)
            //                 var temp = i == 0 ? openingbalsingleledger : valueone;
            //                 valueone = (temp + parseFloat(data[0][i].dramount) - parseFloat(data[0][i].cramount));


            //                 if (valueone == NaN) {
            //                     dataArray.push({
            //                         op_cr: data[0][i].op_cr.toFixed(3),
            //                         op_dr: data[0][i].op_dr.toFixed(3),
            //                         voucherdate: data[0][i].voucherdate,
            //                         cl_cr: data[0][i].cl_cr.toFixed(3),
            //                         cl_dr: data[0][i].cl_dr.toFixed(3),
            //                         dramount: data[0][i].dramount,
            //                         cramount: data[0][i].cramount,
            //                         acledgerid: data[0][i].acledgerid,
            //                         Ob: data[0][i].Ob,
            //                         narration: data[0][i].narration,
            //                         coaname: data[0][i].coaname,
            //                         glcode: data[0][i].glcode,
            //                         openingbalsingleledger: openingbalsingleledger,
            //                         openingbal: openingbal,
            //                         jeno: data[0][i].jeno,
            //                         transactiontype: data[0][i].transactiontype,
            //                         opamt: " "

            //                     });

            //                 }
            //                 else {
            //                     dataArray.push({
            //                         op_cr: data[0][i].op_cr.toFixed(3),
            //                         op_dr: data[0][i].op_dr.toFixed(3),
            //                         voucherdate: data[0][i].voucherdate,
            //                         cl_cr: data[0][i].cl_cr.toFixed(3),
            //                         cl_dr: data[0][i].cl_dr.toFixed(3),
            //                         dramount: data[0][i].dramount,
            //                         cramount: data[0][i].cramount,
            //                         acledgerid: data[0][i].acledgerid,
            //                         Ob: data[0][i].Ob,
            //                         narration: data[0][i].narration,
            //                         coaname: data[0][i].coaname,
            //                         glcode: data[0][i].glcode,
            //                         openingbalsingleledger: openingbalsingleledger,
            //                         openingbal: openingbal,
            //                         jeno: data[0][i].jeno,
            //                         transactiontype: data[0][i].transactiontype,
            //                         opamt: valueone

            //                     });
            //                 }
            //             }
            //         }

            //         else {
            //             MessageBox.error("Data not availabel.");
            //         }
            //         var singleledgertbleModel = currentContext.getView().getModel("tblglsingleledgerModel");
            //         singleledgertbleModel.setData({ modelData: dataArray });
            //     })
            // }
            this.getView().byId("txtdownload").setVisible(true);
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
            var companyname = this.companyname;
            var phone = this.companycontact;
            var email = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;
            var ledger = this.selectedLedgername;

            var phone = (this.companycontact === null || this.companycontact == undefined) ? "-" : this.companycontact;
            var email = (this.companyemail === null || this.companyemail == undefined) ? "-" : this.companyemail;
            var address = (this.address === null || this.address == undefined) ? "-" : this.address;
            var pincode = (this.pincode === null || this.pincode == undefined) ? "-" : this.pincode;
            // console.log("pincode", pincode);
            var tbleModel = this.getView().getModel("tblSubledgerRegiModelmultipleledger").oData.modelData;
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
            headertable1 += "{text: 'GL Register Report', style: 'title'},";
            headertable1 += "{columns: [{text:'From Date:-" + fromdate + "', style: 'subheader'},{text:'To Date:-" + todate + "', style: 'todatecss'}]},";
            headertable1 += "{text: 'Ledger Name:-" + ledger + "', style: 'subheader'},";
            headertable1 += "{ style: 'tableExample',";
            headertable1 += " table: {";
            headertable1 += " body: [";
            headertable1 += "[ {text: 'Voucher Date', style: 'tableHeader'}, {text: 'JE No', style: 'tableHeader'},{text: 'Voucher Type', style: 'tableHeader'},{text: 'Ledger', style: 'tableHeader'}, {text: 'OP_DR', style: 'tableHeader'},{text: 'OP_CR', style: 'tableHeader'},{text: 'Debit Amt', style: 'tableHeader'},{text: 'Credit Amt', style: 'tableHeader'},{text: 'CL_DR', style: 'tableHeader'},{text: 'CL_CR', style: 'tableHeader'},{text: 'Narration', style: 'tableHeader'}],";

            for (var i = 0; i < tbleModel.length; i++) {
                if (tbleModel[i].voucherdate == null) {
                    tbleModel[i].voucherdate = "-";
                }
                if (tbleModel[i].jeno == null) {
                    tbleModel[i].jeno = "-";
                }
                if (tbleModel[i].transactiontype == null) {
                    tbleModel[i].transactiontype = "-";
                }
                if (tbleModel[i].coaname == null) {
                    tbleModel[i].coaname = "-";
                }
                if (tbleModel[i].op_dr == null) {
                    tbleModel[i].op_dr = "-";
                }
                if (tbleModel[i].op_cr == null) {
                    tbleModel[i].op_cr = "-";
                }
                if (tbleModel[i].dramount == null) {
                    tbleModel[i].dramount = "-";
                }
                if (tbleModel[i].cramount == null) {
                    tbleModel[i].cramount = "-";
                }
                if (tbleModel[i].cl_dr == null) {
                    tbleModel[i].cl_dr = "-";
                }
                if (tbleModel[i].cl_cr == null) {
                    tbleModel[i].cl_cr = "-";
                }
                if (tbleModel[i].narration == null) {
                    tbleModel[i].narration = "-";
                }
                headertable1 += "['" + tbleModel[i].voucherdate + "','" + tbleModel[i].jeno + "','" + tbleModel[i].transactiontype + "','" + tbleModel[i].coaname + "','" + tbleModel[i].op_dr + "','" + tbleModel[i].op_cr + "','" + tbleModel[i].dramount + "','" + tbleModel[i].cramount + "','" + tbleModel[i].cl_dr + "','" + tbleModel[i].cl_cr + "','" + tbleModel[i].narration + "'],"
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
                "pdfMake.createPdf(docDefinition).download('GL_Register_report.pdf');" +
                "} });";
            headertable1 += "</script></html>";
            fullHtml += headertable1;
            var wind = window.open();
            wind.document.write(fullHtml);

            setTimeout(function () {
                wind.close();
            }, 3000);
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
            var companyname = this.companyname;
            var phone = this.companycontact;
            var email = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;
            var ledger = this.selectedLedgername;

            var phone = (this.companycontact === null || this.companycontact == undefined) ? "-" : this.companycontact;
            var email = (this.companyemail === null || this.companyemail == undefined) ? "-" : this.companyemail;
            var address = (this.address === null || this.address == undefined) ? "-" : this.address;
            var pincode = (this.pincode === null || this.pincode == undefined) ? "-" : this.pincode;
            // console.log("pincode", pincode);
            var tbleModel = this.getView().getModel("tblSubledgerRegiModelmultipleledger").oData.modelData;
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
            headertable1 += "{text: 'GL Register Report', style: 'title'},";
            headertable1 += "{columns: [{text:'From Date:-" + fromdate + "', style: 'subheader'},{text:'To Date:-" + todate + "', style: 'todatecss'}]},";
            headertable1 += "{text: 'Ledger Name:-" + ledger + "', style: 'subheader'},";
            headertable1 += "{ style: 'tableExample',";
            headertable1 += " table: {";
            headertable1 += " body: [";
            headertable1 += "[ {text: 'Voucher Date', style: 'tableHeader'}, {text: 'JE No', style: 'tableHeader'},{text: 'Voucher Type', style: 'tableHeader'},{text: 'Ledger', style: 'tableHeader'}, {text: 'OP_DR', style: 'tableHeader'},{text: 'OP_CR', style: 'tableHeader'},{text: 'Debit Amt', style: 'tableHeader'},{text: 'Credit Amt', style: 'tableHeader'},{text: 'CL_DR', style: 'tableHeader'},{text: 'CL_CR', style: 'tableHeader'},{text: 'Narration', style: 'tableHeader'}],";

            for (var i = 0; i < tbleModel.length; i++) {
                if (tbleModel[i].voucherdate == null) {
                    tbleModel[i].voucherdate = "-";
                }
                if (tbleModel[i].jeno == null) {
                    tbleModel[i].jeno = "-";
                }
                if (tbleModel[i].transactiontype == null) {
                    tbleModel[i].transactiontype = "-";
                }
                if (tbleModel[i].coaname == null) {
                    tbleModel[i].coaname = "-";
                }
                if (tbleModel[i].op_dr == null) {
                    tbleModel[i].op_dr = "-";
                }
                if (tbleModel[i].op_cr == null) {
                    tbleModel[i].op_cr = "-";
                }
                if (tbleModel[i].dramount == null) {
                    tbleModel[i].dramount = "-";
                }
                if (tbleModel[i].cramount == null) {
                    tbleModel[i].cramount = "-";
                }
                if (tbleModel[i].cl_dr == null) {
                    tbleModel[i].cl_dr = "-";
                }
                if (tbleModel[i].cl_cr == null) {
                    tbleModel[i].cl_cr = "-";
                }
                if (tbleModel[i].narration == null) {
                    tbleModel[i].narration = "-";
                }
                headertable1 += "['" + tbleModel[i].voucherdate + "','" + tbleModel[i].jeno + "','" + tbleModel[i].transactiontype + "','" + tbleModel[i].coaname + "','" + tbleModel[i].op_dr + "','" + tbleModel[i].op_cr + "','" + tbleModel[i].dramount + "','" + tbleModel[i].cramount + "','" + tbleModel[i].cl_dr + "','" + tbleModel[i].cl_cr + "','" + tbleModel[i].narration + "'],"
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
                "pdfMake.createPdf(docDefinition).download('GL_Register_report.pdf');" +
                "} });";
            headertable1 += "</script></html>";
            fullHtml += headertable1;
            var wind = window.open();
            wind.document.write(fullHtml);

            setTimeout(function () {
                wind.close();
            }, 3000);
        },

        // downloadData : function () {
        //     var ledgerstring = this.getView().byId("ledgerList").getSelectedKeys();
        //     if (ledgerstring.length > 1) {
        //         this.onDataExport(null);
        //     }
        //     else{
        //         this.onDataExportone(null);
        //     }

        // },

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
                models: this.getView().getModel("tblSubledgerRegiModelmultipleledger"),

                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content

                columns: [
                    {
                        name: "Voucher Date",
                        template: { content: "{voucherdate}" }
                    },
                    {
                        name: "Journal Entry No",
                        template: { content: "{jeno}" }
                    },
                    {
                        name: "Voucher Type",
                        template: { content: "{transactiontype}" }
                    },
                    {
                        name: "Ledger.",
                        template: { content: "{coaname}" }
                    },
                    {
                        name: "Opening Debit",
                        template: { content: "{op_dr}" }
                    },
                    {
                        name: "Opening Credit",
                        template: { content: "{op_cr}" }
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
                        template: { content: "{cl_dr}" }
                    },
                    {
                        name: "Closing Credit",
                        template: { content: "{cl_cr}" }
                    },
                    {
                        name: "Narration",
                        template: { content: "{narration}" }
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
        },




        onDataExportone: sap.m.Table.prototype.exportData || function (oEvent) {
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
                models: this.getView().getModel("tblglsingleledgerModel"),

                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content

                columns: [
                    {
                        name: "Ledger Name",
                        template: { content: "{coaname}" }
                    },
                    {
                        name: "Journal Entry No",
                        template: { content: "{jeno}" }
                    },
                    {
                        name: "Transaction Date",
                        template: { content: "{voucherdate}" }
                    },
                    {
                        name: "Transaction Type.",
                        template: { content: "{transactiontype}" }
                    },
                    {
                        name: "Debit",
                        template: { content: "{dramount}" }
                    },
                    {
                        name: "Credit",
                        template: { content: "{cramount}" }
                    },
                    {
                        name: "Opening Amount",
                        template: { content: "{opamt}" }
                    },
                    {
                        name: "Opening/Closing Balance",
                        template: { content: "{Ob}" }
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
