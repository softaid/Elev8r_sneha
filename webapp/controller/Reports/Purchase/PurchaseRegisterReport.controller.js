sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/PurchaseReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',

], function (JSONModel, BaseController, MessageToast, MessageBox, Export, ExportTypeCSV, commonFunction, purchaseReportsService, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Purchase.PurchaseRegisterReport", {

        currentContext: null,

        onInit: function () {
            // set location model
            this.currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");

            var emptyModel = this.getModelDefault();

            var purchaseRegisterModel = new JSONModel();
            purchaseRegisterModel.setData(emptyModel);
            this.getView().setModel(purchaseRegisterModel, "purchaseRegisterModel");

            var tblModel = new JSONModel();
            tblModel.setData({ modelData: [] });
            this.getView().setModel(tblModel, "tblModel");

            var tblModel = new JSONModel();
            tblModel.setData({ modelData: [] });
            this.getView().setModel(tblModel, "summaryModel");

            var tblModel = new JSONModel();
            tblModel.setData({ modelData: [] });
            this.getView().setModel(tblModel, "freightModel");

            // breederBatchService

            this.handleRouteMatched(null);

            var currRouteName = this.getOwnerComponent().getModel("applicationModel").getProperty("/routeName");
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this._oRouter.getRoute(currRouteName).attachMatched(this.handleRouteMatched, this);
            this.getView().byId("txtdownload").setVisible(false);
        },

        getModelDefault: function () {
            return {
                vendorid: null,
                fromdate: commonFunction.setTodaysDate(new Date()),
                todate: commonFunction.setTodaysDate(new Date()),
            }
        },

        handleRouteMatched: function () {

            //Breeder batch help box
            this.getAllparty();
        },



        getAllparty: function () {
            var currentContext = this;
            purchaseReportsService.getAllParty(function (data) {

                if (data.length > 0) {
                    if (data[0].length > 0) {
                        if (data[0].length > 0) {
                            data[0].push({ "vendorid": "All", "partyname": "Select All" });
                        }
                        var oBatchModel = new sap.ui.model.json.JSONModel();
                        oBatchModel.setData({ modelData: data[0] });
                        currentContext.getView().setModel(oBatchModel, "partyList");
                    } else {
                        MessageBox.error("Party not availabel!");
                    }
                }
            });
        },
        partySelectionChange: function (oEvent) {
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
        },

        partySelectionFinish: function (oEvt) {

            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedparty = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedparty.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }
            var i = selectedparty.length - 1;

            if (selectedparty[i].key == "ALL") {

                selectedparty = selectedparty.slice(0, -1);
            }
            var partys = [];
            for (var i = 0; i < selectedparty.length; i++) {
                partys.push(selectedparty[i].key);
            }
            this.partyname = [];
            for (var i = 0; i < selectedparty.length; i++) {
                this.partyname.push(selectedparty[i].text);
            }


            var partysstri = "";

            for (var i = 0; i < partys.length; i++) {
                if (i == 0)
                    partysstri = parseInt(partys[i]);
                else
                    partysstri = partysstri + "," + parseInt(partys[i]);
            }

            var pModel = this.getView().getModel("purchaseRegisterModel");
            pModel.oData.vendorids = partysstri
            pModel.refresh();
        },
        onDateChange: function (oEvent) {
            var tDate = this.getView().byId("txtToDate").getValue();
            var toDate = new Date(commonFunction.parseDate(tDate));
            var fDate = this.getView().byId("txtFromDate").getValue();
            var frDate = new Date(commonFunction.parseDate(fDate));
            var todayDate = new Date();
            var pModel = this.getView().getModel("purchaseRegisterModel");
            if (frDate > toDate) {
                MessageBox.error("To date should be equal or greater than from date.");
                pModel.oData.todate = commonFunction.setTodaysDate(frDate);
            }

            pModel.refresh();
        },

        onSearchData: function () {
            var currentContext = this;
            var oModel = this.getView().getModel("purchaseRegisterModel").oData;

            oModel["fromdate"] = commonFunction.getDate(oModel["fromdate"]);
            oModel["todate"] = commonFunction.getDate(oModel["todate"]);
            oModel["companyid"] = commonFunction.session("companyId");

            purchaseReportsService.getPurchaseRegisterReport(oModel, function async(data) {
                var amount = 0;
                var billamount = 0;
                if (data[0].length > 0) {
                    for (var i = 0; data[0].length > i; i++) {
                        amount = data[0][i].amount;
                        billamount = (amount - data[0][i].discountamount) + (data[0][i].taxamount);
                        data[0][i].billamount = parseFloat(billamount).toFixed(2);
                    }

                    var childModel = currentContext.getView().getModel("tblModel");
                    childModel.setData({ modelData: data[0] });
                    childModel.refresh();
                }

                if (data[1].length > 0) {

                    var summaryModel = currentContext.getView().getModel("summaryModel");
                    summaryModel.setData({ modelData: data[1] });
                    summaryModel.refresh();
                }
            });
            this.getView().byId("txtdownload").setVisible(true);
        },

        replaceStr: function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },

        // Function Used For PDF Download

        replaceTemplateData: function (template) {
            // Item table Data --------------

            var tbleModel = this.getView().getModel("tblModel").oData.modelData;
            var tbleModeltwo = this.getView().getModel("summaryModel").oData.modelData;

            var htmTableTwo = "";
            var htmTable = "";
            for (var indx in tbleModel) {
                var model = tbleModel[indx];
                // Replace/create column sequence data table
                htmTable += "<tr>";
                htmTable += "<td align='center'>" + model["docno"] + "</td>"
                htmTable += "<td align='center'>" + model["date"] + "</td>"
                htmTable += "<td>" + model["billno"] + "</td>"
                htmTable += "<td align='right'>" + model["billdate"] + "</td>"
                htmTable += "<td align='right'>" + model["partnername"] + "</td>"
                htmTable += "<td>" + model["itemcode"] + "</td>"
                htmTable += "<td>" + model["itemname"] + "</td>"
                htmTable += "<td>" + model["quantity"] + "</td>"
                htmTable += "<td align='center'>" + model["rate"] + "</td>"
                htmTable += "<td>" + model["amount"] + "</td>"
                htmTable += "<td align='right'>" + model["discountamount"] + "</td>"
                htmTable += "<td align='right'>" + model["totalsgstamount"] + "</td>"
                htmTable += "<td align='right'>" + model["totalcgstamount"] + "</td>"
                htmTable += "<td align='right'>" + model["totaligstamount"] + "</td>"
                htmTable += "<td align='right'>" + model["taxcode"] + "</td>"
                htmTable += "<td>" + model["taxamount"] + "</td>"
                htmTable += "<td>" + model["frieght"] + "</td>"
                htmTable += "<td>" + model["total"] + "</td>"
                htmTable += "</tr>";
            }

            for (var indx in tbleModeltwo) {
                var model = tbleModeltwo[indx];
                // Replace/create column sequence data table
                htmTableTwo += "<tr>";
                htmTableTwo += "<td align='center'>" + model["totalsgstamount"] + "</td>"
                htmTableTwo += "<td>" + model["totalcgstamount"] + "</td>"
                htmTableTwo += "<td align='right'>" + model["totaligstamount"] + "</td>"
                htmTableTwo += "<td align='right'>" + model["taxcode"] + "</td>"

                htmTableTwo += "<td>" + model["purchaseamount"] + "</td>"
                htmTableTwo += "<td align='right'>" + model["freightamount"] + "</td>"
                htmTableTwo += "<td align='right'>" + model["total"] + "</td>"
                htmTableTwo += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;

            var fromdate = this.getView().byId("txtFromDate").getValue();
            var todate = this.getView().byId("txtToDate").getValue();
            var partyname = this.partyname;
            // var batchname = this.batchname;

            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);


            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, " ##ItemListTwo##", htmTableTwo);
            template = this.replaceStr(template, "##FromDate##", fromdate);
            template = this.replaceStr(template, "##ToDate##", todate);
            template = this.replaceStr(template, "##PartyName##", partyname);

            return template;

        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("Purchase", "PrchaseRegisterReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Purchase Register Report");
            });
        },

        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var fromdate = this.getView().byId("txtFromDate").getValue();
            var todate = this.getView().byId("txtToDate").getValue();
            var partyname = this.partyname;

            var filename = fromdate+'_'+todate+'_'+partyname;


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
                        name: "Invoice No.",
                        template: { content: "{docno}" }
                    },
                    {
                        name: " Invoice Date", 
                        template: { content: "{date}" }
                    },
                    {
                        name: "Reference No.",
                        template: { content: "{docno}" }
                    },
                    {
                        name: "Reference Date", 
                        template: { content: "{date}" }
                    },
                    {
                        name: "Party Name",
                        template: { content: "{partnername}" }
                    },
                    {
                        name: "Item Code",
                        template: { content: "{itemcode}" }
                    },
                    {
                        name: "Item Name",
                        template: { content: "{itemname}" }
                    },
                    {
                        name: "Quantity",
                        template: { content: "{quantity}" }
                    },
                    {
                        name: "Rate",
                        template: { content: "{rate}" }
                    },

                    {
                        name: "Taxeble Amount",
                        template: { content: "{amount}" }
                    },
                    {
                        name: "Discount Amount",
                        template: { content: "{discountamount}" }
                    },
                    {
                        name: "SCST Amount",
                        template: { content: "{totalsgstamount}" }
                    },
                    {
                        name: "CGST Amount",
                        template: { content: "{totalcgstamount}" }
                    },
                    {
                        name: "IGST Amount",
                        template: { content: "{totaligstamount}" }
                    },
                   
                    {
                        name: "Tax Code",
                        template: { content: "{taxcode}" }
                    },
                    {
                        name: "Freight Amount",
                        template: { content: "{freightamount}" }
                    },
                    {
                        name: "Total",
                        template: { content: "{total}" }
                    },

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
