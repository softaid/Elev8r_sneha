sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/AccountsReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Accounts/JournalEntry.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service', 
    'sap/ui/core/Fragment',    
    "sap/ui/core/syncStyleClass"

], function (JSONModel, BaseController, MessageToast, MessageBox, Export, ExportTypeCSV, commonFunction, accountsReportsService, journalentryService, commonService, Fragment, syncStyleClass) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Accounts.BankBookRegister", {

        currentContext: null,

        onInit: function () {

            var currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");
            // this.imagepath = null;
            // this.toDataURL('../images/logical.png', function (dataUrl) {
            //     currentContext.imagepath = dataUrl;
            // });

            // set empty model to view 

            this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("bankreconciliationmaster", "bankRecoByBankBook", this.bankRecoByBankBook, this);
            this.bus.subscribe("bankbookmaster", "bankBookRegister", this.bankBookRegister, this);

            var emptyModel = this.getModelDefault();

            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "bankBookModel");

            var bModel = new JSONModel();
            bModel.setData({});
            this.getView().setModel(bModel, "BankReconciliationModel");

            // set empty model to view		
            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "tblBankBookModel");

            // get all parties
            // commonFunction.getRolewiseParties(31, this);
            commonFunction.getAllBank(this)
            this.getView().byId("txtdownload").setVisible(false);
            this.getView().byId("bankReco").setVisible(false);
        },

        onBeforeRendering: function () {


        },
        getModelDefault: function () {
            return {
                fromdate: commonFunction.getDateFromDB(new Date()),
                todate: commonFunction.getDateFromDB(new Date()),
            }
        },

        handleSelectBankList: function (oEvent) {
            var sInputValue = oEvent.getSource().getValue();

            this.inputId = oEvent.getSource().getId();
            // create value help dialog
            // if (!this._valueHelpDialog) {
            this._valueHelpDialog = sap.ui.xmlfragment(
                "sap.ui.elev8rerp.componentcontainer.fragmentview.Accounts.Master.BankDialog",
                this
            );
            this.getView().addDependent(this._valueHelpDialog);
            // }
            this._valueHelpDialog.open(sInputValue);

        },

        handleBankSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var columns = ['bankname', 'ifsccode'];
            var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
            }),
                false);  // false for OR condition
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        bindTbl: function () {
            if (this.validateForm()) {
            var pModel = this.getView().getModel("bankBookModel").oData;
            
            var bankstring = this.getView().byId("bankList").getSelectedItem();
            var bankStr = bankstring.mProperties.key;
            var bankidStr = bankstring.mProperties.additionalText;
            
            pModel["fromdate"] = commonFunction.getDate(pModel.fromdate);
            pModel["todate"] = commonFunction.getDate(pModel.todate);
            var tbleModel = this.getView().getModel("tblBankBookModel");
            accountsReportsService.getBankBookRegister({ ledgerid: bankStr, fromdate: pModel["fromdate"], todate: pModel["todate"] }, function (data) {

                if (data[0].length > 0) {
                    var closingbalance = 0;
                    var openingbalance = data[0][0].closingbalance;
                    for (var i = 0; i < data[0].length; i++) {
                        if (data[0][i].voucherdate != null) {
                            closingbalance = Math.abs(openingbalance - data[0][i].cramount);
                            data[0][i].closingbalance = closingbalance + data[0][i].dramount;
                        }
                    }

                    tbleModel.setData({ modelData: data[0] });
                    tbleModel.refresh();
                }
                else {
                    MessageToast.show("Data is not available.");
                    
                }
            })
            this.getView().byId("txtdownload").setVisible(true);
            }

            var currentContext = this;
            journalentryService.getPostdatedCheques({bankid : bankidStr, bankledgerid : bankStr}, function (data) {
                if(data[1].length && data[1][0].voucherdate != null){
                    currentContext.getView().byId("bankReco").setVisible(true);
                }
            });
        },

        bankBookRegister : function(channel, event, oData){
            
            let fromdate = commonFunction.getDate(oData.fromdate);
            let todate = commonFunction.getDate(oData.todate);
            var tbleModel = this.getView().getModel("tblBankBookModel");
            accountsReportsService.getBankBookRegister({ ledgerid: oData.bankledgerid, fromdate: fromdate, todate: todate }, function (data) {

                if (data[0].length > 0) {
                    var closingbalance = 0;
                    var openingbalance = data[0][0].closingbalance;
                    for (var i = 0; i < data[0].length; i++) {
                        if (data[0][i].voucherdate != null) {
                            closingbalance = Math.abs(openingbalance - data[0][i].cramount);
                            data[0][i].closingbalance = closingbalance + data[0][i].dramount;
                        }
                    }

                    tbleModel.setData({ modelData: data[0] });
                    tbleModel.refresh();
                }
                else {
                    MessageToast.show("Data is not available.");
                    
                }
            })
            this.getView().byId("txtdownload").setVisible(true);

            var currentContext = this;
            journalentryService.getPostdatedCheques({bankid : oData.bankid, bankledgerid : oData.bankledgerid}, function (data) {
                if(data[1].length && data[1][0].voucherdate != null){
                    currentContext.getView().byId("bankReco").setVisible(true);
                }
            });
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
            headertable1 += "<!DOCTYPE html> <html> <head> <title>" + "Bank Book Register Report" + "</title>" +
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
            var bankstring = this.getView().byId("bankList").getSelectedItem();
            var bank = bankstring.mProperties.text;
            var companyname = this.companyname;
            var phone = (this.companycontact === null || this.companycontact == undefined) ? "-" : this.companycontact;
            var email = (this.companyemail === null || this.companyemail == undefined) ? "-" : this.companyemail;
            var address = (this.address === null || this.address == undefined) ? "-" : this.address;
            var pincode = (this.pincode === null || this.pincode == undefined) ? "-" : this.pincode;

            var tbleModel = this.getView().getModel("tblBankBookModel").oData.modelData;
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
            headertable1 += "{text: 'Cash Book Register Report', style: 'title'},";
            headertable1 += "{columns: [{text:'From Date:-" + fromdate + "', style: 'subheader'},{text:'To Date:-" + todate + "', style: 'todatecss'}]},";
            headertable1 += "{text: 'Ledger Name:-" + bank + "', style: 'subheader'},";
            headertable1 += "{ style: 'tableExample',";
            headertable1 += " table: {";
            headertable1 += " body: [";
            headertable1 += "[ {text: 'Voucher Date', style: 'tableHeader'}, {text: 'JE No', style: 'tableHeader'},{text: 'Voucher Type', style: 'tableHeader'},{text: 'Cheque No', style: 'tableHeader'}, {text: 'Cheque Date', style: 'tableHeader'},{text: 'GL Code', style: 'tableHeader'},{text: 'Party', style: 'tableHeader'},{text: 'Narration', style: 'tableHeader'},{text: 'Debit Amt', style: 'tableHeader'},{text: 'Credit Amt', style: 'tableHeader'},{text: 'Closing Balance', style: 'tableHeader'}],";

            for (var i = 0; i < tbleModel.length; i++) {
                if (tbleModel[i].voucherdate == null) {
                    tbleModel[i].voucherdate = "-";
                }
                if (tbleModel[i].jeid == null) {
                    tbleModel[i].jeid = "-";
                }
                if (tbleModel[i].refname == null) {
                    tbleModel[i].refname = "-";
                }
                if (tbleModel[i].chequeno == null) {
                    tbleModel[i].chequeno = "-";
                }
                if (tbleModel[i].chequedate == null) {
                    tbleModel[i].chequedate = "-";
                }
                if (tbleModel[i].glcode == null) {
                    tbleModel[i].glcode = "-";
                }
                if (tbleModel[i].partyname == null) {
                    tbleModel[i].partyname = "-";
                }
                if (tbleModel[i].narration == null) {
                    tbleModel[i].narration = "-";
                }
                if (tbleModel[i].dramount == null) {
                    tbleModel[i].dramount = "-";
                }
                if (tbleModel[i].cramount == null) {
                    tbleModel[i].cramount = "-";
                }
                if (tbleModel[i].closingbalance == null) {
                    tbleModel[i].closingbalance = "-";
                }
                headertable1 += "['" + tbleModel[i].voucherdate + "','" + tbleModel[i].jeid + "','" + tbleModel[i].refname + "','" + tbleModel[i].chequeno + "','" + tbleModel[i].chequedate + "','" + tbleModel[i].glcode + "','" + tbleModel[i].partyname + "','" + tbleModel[i].narration + "','" + tbleModel[i].dramount + "','" + tbleModel[i].cramount + "','" + tbleModel[i].closingbalance + "'],"
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
                "pdfMake.createPdf(docDefinition).download('Bank_Book_Register_report.pdf');" +
                "} });";
            headertable1 += "</script></html>";
            fullHtml += headertable1;
            var wind = window.open();
            wind.document.write(fullHtml);
            setTimeout(function () {
                wind.close();
            }, 3000);

        },

        validateForm: function () {
            var isValid = true;

            if (!commonFunction.isSelectRequired(this, "bankList", "Bank is required."))
                isValid = false;    
            if (!commonFunction.isRequired(this, "txtFromDate", "Please Select Fromdate"))
                isValid = false;
            if (!commonFunction.isRequired(this, "txtToDate", "Please Select Todate"))
                isValid = false;

            return isValid;
        },

        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var fromdate = this.getView().byId("txtFromDate").getValue();
            var todate = this.getView().byId("txtToDate").getValue();
            var bank = this.selectedBankname;

            var filename = fromdate+'_'+todate+'_'+bank;


            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/

            var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ","
                }),

                // Pass in the model created above
                models: this.getView().getModel("tblBankBookModel"),

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
                        name: "Journal Entry No.",
                        template: { content: "{jeid}" }
                    },
                    {
                        name: "Voucher Type",
                        template: { content: "{refname}" }
                    },
                    {
                        name: "Cheque No",
                        template: { content: "{chequeno}" }
                    },
                    {
                        name: "Cheque Date",
                        template: { content: "{cheque Date}" }
                    },
                    {
                        name: "General Ledger Code",
                        template: { content: "{glcode}" }
                    },
                    {
                        name: "Party",
                        template: { content: "{partyname}" }
                    },
                    {
                        name: "Narration",
                        template: { content: "{narration}" }
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
                        name: "Closing Balance",
                        template: { content: "{closingbalance}" }
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

        goToBankReco : function(oEvent){
            let _this = this;
            
            _this.bus = sap.ui.getCore().getEventBus();

            var bankstring = _this.getView().byId("bankList").getSelectedItem();
            var bankStr = bankstring.mProperties.key;
            var bankname = bankstring.mProperties.text;
            var bankid = bankstring.mProperties.additionalText;

            var bankBookModel = _this.getView().getModel("bankBookModel");
            setTimeout(function () {
                _this.bus = sap.ui.getCore().getEventBus();
                _this.bus.publish("bankreconciliationmaster", "bankRecoByBankBook", { pagekey: "bankreconciliation", bankid : bankid, bankledgerid : bankStr, bankname : bankname, fromdate : bankBookModel.oData.fromdate, todate : bankBookModel.oData.todate});
            }, 1000);
            
             _this.bus.publish("bankreconciliationmaster", "bankRecoByBankBook", { pagekey: "bankreconciliation", bankid : bankid, bankledgerid : bankStr, bankname : bankname, fromdate : bankBookModel.oData.fromdate, todate : bankBookModel.oData.todate});
        },

        bankRecoByBankBook : function (sChannel, sEvent, oData) {
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.bus = sap.ui.getCore().getEventBus();
            oRouter.getTargets().display(oData.pagekey, { bankid : oData.bankid, bankledgerid : oData.bankledgerid, bankname : oData.bankname, fromdate : oData.fromdate, todate : oData.todate });
            oRouter.navTo(oData.pagekey, true);
        },

    });
}, true);
