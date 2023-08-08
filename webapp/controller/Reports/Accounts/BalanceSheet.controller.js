sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/AccountsReports.service',

], function (JSONModel, BaseController, MessageBox, Export, ExportTypeCSV, commonFunction, accountsReportsService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Accounts.BalanceSheet", {

        currentContext: null,

        onInit: function () {


            this.currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");
            this.imagepath = null;
            // this.toDataURL('../images/logical.png', function (dataUrl) {
            //     currentContext.imagepath = dataUrl;
            // });

            // set empty model to view 
            var emptyModel = this.getModelDefault();

            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "balanceSheet");

            // set empty model to view		
            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "tblAssetBalanceSheet");

            var model2 = new JSONModel();
            model2.setData(emptyModel);
            this.getView().setModel(model2, "tblAssetBalanceSheetexport");

            var model1 = new JSONModel();
            model1.setData({ modelData: [] });
            this.getView().setModel(model1, "tblLiabBalanceSheet");

            var model2 = new JSONModel();
            model2.setData(emptyModel);
            this.getView().setModel(model2, "childmodel");

            var model3 = new JSONModel();
            model3.setData(emptyModel);
            this.getView().setModel(model3, "newchildmodel");

            var model4 = new JSONModel();
            model4.setData(emptyModel);
            this.getView().setModel(model4, "newmodel");

            // this.getView().byId("aAmount").setTextAlign(sap.ui.core.TextAlign.End);
            // this.getView().byId("lAmount").setTextAlign(sap.ui.core.TextAlign.End);

            // get all parties
        },

        onBeforeRendering: function () {
        },
        getModelDefault: function () {
            return {
                todate: commonFunction.getDateFromDB(new Date()),
            }
        },

        replaceStr: function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },

        // Function Used For PDF Download

        replaceTemplateData: function (template) {
            // Item table Data --------------

            var tbleParentModel = this.getView().getModel("balanceSheet").oData;
            var tbleModel = this.getView().getModel("tblAssetBalanceSheet").oData.modelData;
            var tbleModelTwo = this.getView().getModel("tblLiabBalanceSheet").oData.modelData;



            var htmTableTwo = "";
            var htmTable = "";

            for (var indx in tbleModel) {
                var model = tbleModel[indx];

                htmTable += "<tr>";
                htmTable += "<td align='left'>" + model["ledgername"]

                var htmlLegerName = "";
                var htmlAmount = "";

                for (var index in tbleModel[indx]["children"]) {


                    var child = tbleModel[indx]["children"][index];
                    htmlLegerName += "<br>" + child["ledgername"];
                    htmlAmount += "<br>" + child["amount"];

                    if (index == tbleModel[indx]["children"].length - 1) {
                        htmTable += htmlLegerName + "</td>";
                        htmTable += "<td align='right'>" + htmlAmount + "</td>";
                        htmTable += "</tr>";
                    }
                }
            }

            for (var indx in tbleModelTwo) {
                var model = tbleModelTwo[indx];

                htmTableTwo += "<tr>";
                if (model["ledgername"] == null) {

                }

                htmTableTwo += "<td align='left'>" + model["ledgername"]

                var htmlLegerNameTWO = "";
                var htmlAmountTwo = "";

                for (var index in tbleModelTwo[indx]["children"]) {



                    var childtwo = tbleModelTwo[indx]["children"][index];
                    htmlLegerNameTWO += "<br>" + childtwo["ledgername"];
                    htmlAmountTwo += "<br>" + childtwo["amount"];

                    if (index == tbleModelTwo[indx]["children"].length - 1) {
                        if (childtwo["ledgername"] == null) {

                        }
                        htmTableTwo += htmlLegerNameTWO + "</td>";
                        htmTableTwo += "<td align='right'>" + htmlAmountTwo + "</td>";
                        htmTableTwo += "</tr>";
                    }
                }
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;

            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);
            var date = this.getView().byId("txtToDate").getValue();
            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, " ##ItemLisTwo##", htmTableTwo);
            template = this.replaceStr(template, "##ReportFromDate##", date);
            return template;

        },

        createPDF: function () {

            var currentContext = this;
            commonFunction.getHtmlTemplate("Accounts", "BalanceSheet.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Balance Sheet Report");
            });
        },

        bindTbl: function () {
            var pModel = this.getView().getModel("balanceSheet").oData;
            var currentContext = this;
            pModel["todate"] = commonFunction.getDate(pModel.todate);

            var tblAssetModel = this.getView().getModel("tblAssetBalanceSheet");
            var tblLiabilityModel = this.getView().getModel("tblLiabBalanceSheet");
            var tblAssetModelexport = this.getView().getModel("tblAssetBalanceSheetexport");
            var tblexport = this.getView().getModel("childmodel");
            var newtblexport = this.getView().getModel("newchildmodel");
            var newxport = this.getView().getModel("newmodel");
            var Profit = '';
            var loss = '';
            accountsReportsService.getProfitAndLossDiff({ todate: pModel["todate"] }, function (data2) {
                console.log(data2)
                if(data2.length && data2[0].length && data2[0][0].balance >0){
                    Profit = data2[0][0];
                }else{
                    loss = data2[0][0];
                }
            accountsReportsService.getBalanceSheet({ todate: pModel["todate"] }, function (data) {
               
                var map = {}, node, roots = [], i;
                var len = (data[0].length-1);
                var len2 = (data[1].length-1);
                if(loss){
                    data[0].splice(len, 0,loss);
                }if(Profit){
                    data[1].splice(len2, 0,Profit);
                }
                if(data.length){
                    if (data[0].length) {

                        var tamount = 0;
                        for (var i = 0; i < data[0].length; i++) {
                            data[0][i].amount = parseFloat(data[0][i].amount).toFixed(2);
                            if (data[0][i].amount < 0) {
                                data[0][i].amount = data[0][i].amount * (-1);
                            }
                            if (data[0][i].id !== null) {
                                tamount = tamount + data[0][i].amount
                                // data[0][i].tamount = tamount;
                            }
                            var index = roots.findIndex(function (item, j) {
                                return item.groupid === data[0][i].groupid
                            });


                            if (index == -1) {
                                roots.push({
                                    groupid: data[0][i].groupid,
                                    ledgername: data[0][i].groupname,
                                    children: [data[0][i]]
                                })
                            } else {
                                roots[index].children.push(data[0][i]);
                            }
                        }

                        tblAssetModel.setData({ modelData: roots });
                        tblAssetModel.oData.tamount = Math.abs(tamount);
                        tblAssetModel.refresh();

                    }else{
                        MessageBox.error("No income is booked.");
                    }

                    var map1 = {}, node1, roots1 = [];
                    if (data[1].length) {
                        var tamount1 = 0;
                        for (var i = 0; i < data[1].length; i++) {
                            data[1][i].amount = parseFloat(data[1][i].amount).toFixed(2);
                            if (data[1][i].amount < 0) {
                                data[1][i].amount = data[1][i].amount * (-1);
                            }
                            if (data[1][i].id !== null) {
                                tamount1 = tamount1 + data[1][i].amount
                                // data[0][i].tamount = tamount;
                            }
                            var index1 = roots1.findIndex(function (item, j) {
                                return item.groupid === data[1][i].groupid
                            });

                            if (index1 == -1) {
                                roots1.push({
                                    groupid: data[1][i].groupid,
                                    ledgername: data[1][i].groupname,
                                    children: [data[1][i]]
                                })
                            } else {
                                roots1[index1].children.push(data[1][i]);
                            }
                        }

                        tblexport.setData(roots1);

                        var array = [];


                        for (var i = 0; i < tblexport.oData.length; i++) {

                            array.push(
                                {
                                    "amount": tblexport.oData[i].amount,
                                    "ledgername": tblexport.oData[i].ledgername,
                                }
                            )

                            for (var j = 0; j < tblexport.oData[i].children.length; j++) {

                                array.push
                                    ({
                                        "Childamount": tblexport.oData[i].children[j].amount,
                                        "childledgername": tblexport.oData[i].children[j].ledgername
                                    })

                            }

                        }
                        // First Table data for Xlsheet  

                        newxport.setData(roots);


                        for (var i = 0; i < newxport.oData.length; i++) {

                            array.push(
                                {
                                    "firsttableamount": newxport.oData[i].amount,
                                    "firsttableledgername": newxport.oData[i].ledgername,
                                }
                            )

                            for (var j = 0; j < newxport.oData[i].children.length; j++) {

                                array.push
                                    ({
                                        "firsttblchildamount": newxport.oData[i].children[j].amount,
                                        "firsttblchildledgername": newxport.oData[i].children[j].ledgername
                                    })

                            }

                        }
                        newtblexport.setData({ modelData: array });
                        newtblexport.setData({ modelData: array });
                        tblLiabilityModel.setData({ modelData: roots1 });
                        tblLiabilityModel.oData.tamount1 = Math.abs(tamount1);
                        tblLiabilityModel.refresh();
                    }
                }else{
                    MessageBox.error("No income or expense is booked.");
                }
            })
        })
        },


        // Function for PDF 

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

        onPdfExport: function (oEvent) {


            var that = this;
            //  map the bound data of the table to a pdfMake array
            var createListData = function () {

                // var sumone = { count: 0, totalDistance: 0 };
                //var fromdate = that.getView().byId("txtFromDate").getValue();
                var todate = that.getView().byId("txtToDate").getValue();

                // var branch = that.getView().byId("branch").getValue();
                //  var partyrole = that.getView().byId("partyrole").getValue();

                var retone = [{
                    columns: [
                        {
                            ul: [
                                todate,
                            ]
                        }
                    ]
                },
                ];
                return retone;
            };


            var createTableData = function () {


                var sum = { count: 0, totalDistance: 0 };

                var mapArr = that.getView().byId("treeTable").getItems().map(function (obj) {
                    sum.count += 1;
                    sum.totalDistance += Number.parseInt(obj.getCells()[1].getProperty("text"));
                    var ret = [{
                        text: obj.getCells()[0].getProperty("text"),
                        style: 'table',
                        fontSize: 8,
                        fonts: 'sans-serif'
                    },
                    {
                        text: obj.getCells()[1].getProperty("text"),
                        style: 'table',
                        fontSize: 8,
                        fonts: 'sans-serif'
                    }
                    ];
                    return ret;
                });

                // add a header to the pdf table
                mapArr.unshift(

                    [{
                        text: "Particulars",
                        style: 'tableHeader'
                    },
                    {
                        text: "Amount",
                        style: 'tableHeader'
                    }
                    ]
                );
                // add a summary row at the end

                mapArr.push([

                    { text: 'sum' },
                    { text: "" }
                ]);
                return mapArr;
            };

            var docDefinition = {

                info: {
                    author: 'TAMMEN IT SOLUTIONS',
                    subject: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('pdfReportSubject')
                },

                pageOrientation: 'portrait',
                pageMargins: [50, 60, -70, 60],
                style: 'border',

                footer: function (currentPage, pageCount) {
                    return { text: currentPage.toString() + ' / ' + pageCount, alignment: 'center' };
                },


                content: [

                    {
                        image: this.imagepath,
                        width: 150,
                        margin: [380, -30, 0, 0]
                    },


                    {
                        text: "LogicalDNA",
                        style: 'hone',
                        margin: [0, -60, 0, 6],
                    },
                    {
                        text: "LogicalDNA Group Of Companies",
                        style: 'htwo',

                    },
                    {
                        text: "Ground Floor, Unit 003, Pentagon 1",
                        style: 'htwo'
                    },
                    {
                        text: "Magarpatta Cyber City",
                        style: 'htwo'
                    },
                    {
                        text: "Hadpsar Pune 411028",
                        style: 'htwo'
                    },
                    {
                        text: "Maharashtra, India",
                        style: 'htwo'
                    },
                    {
                        text: "Mobile No: +91 985 097 7384 (INDIA)",
                        style: 'htwo'
                    },
                    {
                        text: "Email: hr@logicaldnacom",
                        style: 'htwo',
                        margin: [0, 0, 0, 14]
                    },
                    {

                        title: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Logical DNA'),
                        text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('BalanceSheet Report'),

                        style: 'title',
                        margin: [0, 100, 150, 10]
                    },


                    {
                        text: "To Date:",
                        style: 'filter',
                        bold: true
                    },

                    {

                        ul: [


                            createListData(),

                        ],
                        style: 'filter',
                        margin: [60, -23, 0, 14]

                    },

                    {
                        table: {
                            headerRows: 1,
                            widths: [80, 80],
                            margin: [380, -30, 0, 0],
                            body: createTableData(),
                        },

                        // # Apply layout with color wise gray and white               

                        layout: {
                            fillColor: function (rowIndex, node, columnIndex) {
                                return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                            },

                        }
                    },

                    {
                        text: "Logical DNA",
                        style: 'bottom',
                        margin: [450, 30, 0, 14]

                    },
                    {
                        text: "Authorised By",
                        style: 'bottom',
                        margin: [450, 0, 0, 14]
                    },
                ],

                styles: {
                    header: {
                        fontSize: 12,
                        bold: true,
                        margin: [0, 0, 0, 0]
                    },

                    leftline: {
                        bold: true,
                        margin: [0, 0, 0, 0]
                    },

                    title: {
                        fontSize: 15,
                        fonts: 'sans-serif',
                        padding: 15,
                        bold: true,
                        alignment: 'center',
                        margin: [0, 0, 0, 0]
                    },

                    hone: {
                        fontSize: 12,
                        bold: true,
                        lineheight: 4,
                        fonts: 'sans-serif'
                    },

                    bottom: {
                        fontSize: 12,
                        bold: true,
                        fonts: 'sans-serif'
                    },

                    htwo: {
                        fontSize: 8,

                    },

                    filter: {
                        fontSize: 10,
                    },

                    tableHeader: {
                        bold: true,
                        bordercollapse: 'collapse',
                        padding: 15,
                        fonts: 'sans-serif',
                        fontsize: 25,
                        lineheight: 1,
                        width: '*',
                        columnGap: 10,
                        topmargin: 10
                    },

                    border: {
                        border: [1, 'solid', '#ccc']
                    },

                    sum: {
                        fontSize: 8,
                        italics: true
                    }
                }
            };
            pdfMake.createPdf(docDefinition).open();
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
                models: this.getView().getModel("newchildmodel"),


                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },


                // column definitions with column name and binding info for the content

                columns: [
                    {
                        name: "Particulars",
                        template: { content: "{ledgername}" }
                    },
                    {
                        name: "Amount",
                        template: { content: "{amount}" }
                    },
                    {
                        name: "ChildLedgerName",
                        template: { content: "{childledgername}" }
                    },
                    {
                        name: "Childamount",
                        template: { content: "{Childamount}" }
                    },
                    {
                        name: "Firsttblamount",
                        template: { content: "{firsttableamount}" }
                    },
                    {
                        name: "FirsttblLedgerName",
                        template: { content: "{firsttableledgername}" }
                    },
                    {
                        name: "FirsttblChildLedgerName",
                        template: { content: "{firsttblchildledgername}" }
                    },
                    {
                        name: "firsttblchildamount",
                        template: { content: "{firsttblchildamount}" }
                    }

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
