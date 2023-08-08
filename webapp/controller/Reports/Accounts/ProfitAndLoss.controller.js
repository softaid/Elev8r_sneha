sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/AccountsReports.service',

], function (JSONModel, BaseController, MessageToast, MessageBox, Export, ExportTypeCSV, commonFunction, accountsReportsService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Accounts.ProfitAndLoss", {

        currentContext: null,
        onInit: function () {
            // set empty model to view 
            var emptyModel = this.getModelDefault();
            this.currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");
            this.imagepath = null;

            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "pnfSheet");

            // set empty model to view		
            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "tblRevenuePnfSheet");

            var model1 = new JSONModel();
            model1.setData({ modelData: [] });
            this.getView().setModel(model1, "tblExpensePnfSheet");

            var model2 = new JSONModel();
            model2.setData(emptyModel);
            this.getView().setModel(model2, "childmodel");

            var model3 = new JSONModel();
            model3.setData(emptyModel);
            this.getView().setModel(model3, "newchildmodel");

            // this.getView().byId("rAmount").setTextAlign(sap.ui.core.TextAlign.End);
            // this.getView().byId("eAmount").setTextAlign(sap.ui.core.TextAlign.End);
            // get all parties
        },

        onBeforeRendering: function () {

        },
        getModelDefault: function () {
            return {
                todate: commonFunction.getDateFromDB(new Date()),
                fromdate: commonFunction.getDateFromDB(new Date()),
            }
        },

        replaceStr: function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },

        // Function Used For PDF Download

        replaceTemplateData: function (template) {

            // Item table Data --------------
            var tbleParentModel = this.getView().getModel("pnfSheet").oData;
            var tbleModel = this.getView().getModel("tblRevenuePnfSheet").oData.modelData;
            var tbleModelTwo = this.getView().getModel("tblExpensePnfSheet").oData.modelData;


            // var htmTableTwo = "";
            var htmTable = "";

            for (var indx in tbleModel) {
                var model = tbleModel[indx];

                htmTable += "<tr>";
                if (model["ledgername"] == null) {

                }
                htmTable += "<td align='left'>" + "<br>" + model["ledgername"]
                var htmlLegerName = "";
                var htmlAmount = "";

                for (var index in tbleModel[indx]["children"]) {

                    var child = tbleModel[indx]["children"][index];
                    if (child["ledgername"] == null) {

                    }

                    htmlLegerName += "<br>" + child["ledgername"];
                    htmlAmount += "<span align='right'>" + child["amount"] + "</span>";

                    if (index == tbleModel[indx]["children"].length - 1) {
                        htmTable += htmlLegerName + "<div align='right'>" + htmlAmount + "</div>" + "</td>";

                    }
                }

                for (var indx in tbleModelTwo) {
                    var model = tbleModelTwo[indx];
                    if (model["ledgername"] == null) {

                    }
                    htmTable += "<td align='left'>" + "<br>" + model["ledgername"]
                    var htmlLegerNameTWO = "";
                    var htmlAmountTwo = "";
                    for (var index in tbleModelTwo[indx]["children"]) {


                        var childtwo = tbleModelTwo[indx]["children"][index];
                        if (childtwo["ledgername"] == null) {

                        }
                        htmlLegerNameTWO += "<br>" + childtwo["ledgername"];
                        htmlAmountTwo += "<br>" + childtwo["amount"];
                        if (index == tbleModelTwo[indx]["children"].length - 1) {
                            htmTable += htmlLegerNameTWO + "<div align='right'>" + htmlAmountTwo + "</div>" + "</td>";
                            htmTable += "</tr>";
                        }
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

            // var fromdate = this.getView().byId("txtFromDate").getValue();
            var todate = this.getView().byId("txtToDate").getValue();
            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##ReportFromDate##", fromdate);
            template = this.replaceStr(template, "##ReportToDate##", todate);
            return template;
        },

        createPDF: function () {

            var currentContext = this;
            commonFunction.getHtmlTemplate("Accounts", "ProfitandLossStatmentReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Profit and Loss Statment Report");
            });
        },


        bindTbl: function () {
            var pModel = this.getView().getModel("pnfSheet").oData;

            pModel["todate"] = commonFunction.getDate(pModel.todate);
            pModel["fromdate"] = commonFunction.getDate(pModel.fromdate);

            var tblRModel = this.getView().getModel("tblRevenuePnfSheet");
            var tblEModel = this.getView().getModel("tblExpensePnfSheet");

            var tblexport = this.getView().getModel("childmodel");


            var newtblexport = this.getView().getModel("newchildmodel");
            var Profit = '';
            var loss = '';
            accountsReportsService.getProfitAndLossDiff({ todate: pModel["todate"] }, function (data2) {
                if(data2.length && data2[0].length && data2[0][0].balance >0){
                    Profit = data2[0][0];
                }else{
                    loss = data2[0][0];
                }

            accountsReportsService.getProfitAndLoss({ fromdate: pModel["fromdate"], todate: pModel["todate"] }, function (data) {

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



                        tblRModel.setData({ modelData: roots });
                        tblRModel.oData.tamount = Math.abs(tamount);
                        tblRModel.refresh();
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
                                tamount1 = tamount1 + data[1][i].amount;
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
                                        "childamount": tblexport.oData[i].children[j].amount,
                                        "childledgername": tblexport.oData[i].children[j].ledgername
                                    })

                            }

                        }

                        newtblexport.setData({ modelData: array });
                        tblEModel.setData({ modelData: roots1 });
                        tblEModel.oData.tamount1 = Math.abs(tamount1);
                        tblEModel.refresh();
                    }
                }else{
                    MessageBox.error("No profit or loss is done.")
                }

            })
        })
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
                        name: "Particular",
                        template: { content: "{ledgername}" }
                    },
                    {
                        name: "Amount",
                        template: { content: "{amount}" }
                    },
                    {
                        name: "Childledger",
                        template: { content: "{childledgername}" }
                    },
                    {
                        name: "Childamount",
                        template: { content: "{childamount}" }
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
