sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/CommercialLayerReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/CommercialLayer/LayerBatch.service',
   

], function (JSONModel, BaseController, MessageBox, Export, ExportTypeCSV, commonFunction, layerReportsService, layerBatchService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.CommercialLayer.LayerFlockDetailReport", {

        currentContext: null,
        onInit: function () {
            this.currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");
            // set location model
            var emptyModel = this.getModelDefault();

            var flockDetailModel = new JSONModel();
            flockDetailModel.setData(emptyModel);
            this.getView().setModel(flockDetailModel, "flockDetailModel");

            var tblModel = new JSONModel();
            tblModel.setData({ modelData: [] });
            this.getView().setModel(tblModel, "tblModel");

            this.handleRouteMatched(null);

            var currRouteName = this.getOwnerComponent().getModel("applicationModel").getProperty("/routeName");
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this._oRouter.getRoute(currRouteName).attachMatched(this.handleRouteMatched, this);
            this.getView().byId("txtdownload").setVisible(false);

        },

        getModelDefault: function () {
            return {
                layerbatchid: null,
                fromdate: commonFunction.setTodaysDate(new Date()),
                todate: commonFunction.setTodaysDate(new Date()),
            }
        },
        resetModel: function () {
            var tbleModel = this.getView().getModel("tblModel");
            tbleModel.setData({ modelData: [] });

        },

        handleRouteMatched: function () {
            //Breeder batch help box
            this.getAllLayerBatches(status);
        },

        validateForm: function () {
            var isValid = true;
            if (!commonFunction.isRequired(this, "txtBreederToBatch", "batch is required"))
                isValid = false;
            if (!commonFunction.isRequired(this, "txtFromDate", "From Date is required"))
                isValid = false;
            if (!commonFunction.isRequired(this, "txtToDate", "To Date is required"))
                isValid = false;
            if (!this.ongetDate())
                isValid = false;
            return isValid;
        },

        getAllLayerBatches: function () {
            var currentContext = this;
            layerBatchService.getAllBatches(function (data) {

                if (data[0].length > 0) {
                    var oBatchModel = new sap.ui.model.json.JSONModel();
                    oBatchModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oBatchModel, "layerBatchList");
                } else {
                    MessageBox.error("Layer batch not availabel!");
                }
            });
        },

        // Breeder batch value help
        handleBreederValueHelp: function (oEvent) {
            var sInputValue = oEvent.getSource().getValue();
            this.inputId = oEvent.getSource().getId();

            // create value help dialog
            this._valueHelpDialog = sap.ui.xmlfragment(
                "sap.ui.elev8rerp.componentcontainer.fragmentview.Common.LayerBatchDialog",
                this
            );
            this.getView().addDependent(this._valueHelpDialog);

            // open value help dialog filtered by the input value
            this._valueHelpDialog.open(sInputValue);
        },

        handleLayerBatchSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var columns = ['batchname', 'locationname', 'warehousename'];
            var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
            }),
                false);  // false for OR condition
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        onLayerBatchDialogClose: function (oEvent) {
            this.resetModel();
            var inputId = this.byId(this.inputId).sId;
            var currentContext = this;
            var aContexts = oEvent.getParameter("selectedContexts");
            inputId = inputId.substring(inputId.lastIndexOf('-') + 1);


            // if(aContexts != undefined){
            var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
            var oModel = currentContext.getView().getModel("flockDetailModel");
            oModel.oData.layerbatchid = selRow[0].id;
            oModel.oData.batchname = selRow[0].batchname;
            oModel.refresh();
            // }
        },

        ongetDate: function () {
            var isValid = true
            var oModel = this.getView().getModel("flockDetailModel").oData
            var fromDate = oModel.fromdate;
            var todate = oModel.todate;

            if (fromDate) {
                var parts1 = fromDate.split('-');

                fromDate = Date.parse(new Date(parts1[2], parts1[1], parts1[0]));
                var date1 = new Date(fromDate);
                this.getView().byId("txtFromDate").setValueState(sap.ui.core.ValueState.None);
            }
            if (todate) {

                var parts2 = todate.split('-');

                todate = Date.parse(new Date(parts2[2], parts2[1], parts2[0]));
                var date3 = new Date(todate);
                this.getView().byId("txtToDate").setValueState(sap.ui.core.ValueState.None);
            }



            if (date3 < date1) {
                MessageBox.error("From Date less than todate date");
                isValid = false;
            }
            return isValid
        },
        onSearchData: function () {
            if (this.validateForm()) {
                var currentContext = this;
                var oModel = this.getView().getModel("flockDetailModel").oData;
                oModel["fromdate"] = commonFunction.getDate(oModel["fromdate"]);
                oModel["todate"] = commonFunction.getDate(oModel["todate"]);

                layerReportsService.getLayerFlockDetailReport(oModel, function async(data) {
                    for (var i = 0; i < data[0].length; i++) {
                        data[0][i].femaleclosingbalance = (data[0][i].femaleopeningbalance + data[0][i].femaletransferedinquantity) - (data[0][i].femaletransferedquantity);

                        if (i == (data[0].length - 1)) {
                            var childModel = currentContext.getView().getModel("tblModel");
                            childModel.setData({ modelData: data[0] });
                            childModel.refresh();
                        }
                    }

                });
            }
            this.getView().byId("txtdownload").setVisible(true);
        },

        replaceStr: function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },


        replaceTemplateData: function (template) {
            // Item table Data --------------
            var tbleModel = this.getView().getModel("tblModel").oData.modelData;
            var htmTable = "";
            for (var indx in tbleModel) {
                var model = tbleModel[indx];
                // Replace/create column sequence data table
                htmTable += "<tr>";
                htmTable += "<td align='center'>" + model["finaltransactiondate"] + "</td>"
                htmTable += "<td>" + model["itemname"] + "</td>"
                htmTable += "<td align='right'>" + model["femaleopeningbalance"] + "</td>"
                htmTable += "<td align='right'>" + model["femaletransferedinquantity"] + "</td>"
                htmTable += "<td align='right'>" + model["femaletransferedquantity"] + "</td>"
                htmTable += "<td>" + model["femaleculls"] + "</td>"
                htmTable += "<td>" + model["cummalefemaleculls"] + "</td>"
                htmTable += "<td>" + model["femalemortality"] + "</td>"
                htmTable += "<td align='center'>" + model["cummalefemalemortality"] + "</td>"
                htmTable += "<td>" + model["sexingerrorqty"] + "</td>"
                htmTable += "<td align='right'>" + model["cummalefemalesexingerror"] + "</td>"
                htmTable += "<td align='center'>" + model["femaleclosingbalance"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;
            var batchname = this.getView().byId("txtBreederToBatch").getValue();
            var fromdate = this.getView().byId("txtFromDate").getValue();
            var todate = this.getView().byId("txtToDate").getValue();

            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);
            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##BatchName##", batchname);
            template = this.replaceStr(template, "##FROMDATE##", fromdate);
            template = this.replaceStr(template, "##TODATE##", todate);
            return template;
        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("Layer", "LayerFlockDetailReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Layer Flock Detail Report");
            });
        },

        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var batchname = this.getView().byId("txtBreederToBatch").getValue();
            var fromdate = this.getView().byId("txtFromDate").getValue();
            var todate = this.getView().byId("txtToDate").getValue();
            var filename =fromdate+'_'+todate+'_'+batchname;
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
                        name: "Date",
                        template: { content: "{finaltransactiondate}" }
                    },
                    {
                        name: "Item Name",
                        template: { content: "{itemname}" }
                    },
                    {
                        name: "Female Opening Balance",
                        template: { content: "{femaleopeningbalance}" }
                    },
                    {
                        name: "Female Inward Quantity",
                        template: { content: "{femaleinqty}" }
                    },

                    {
                        name: "Female Transfer Quantity",
                        template: { content: "{femaleoutqty}" }
                    },
                    {
                        name: "Female Culls",
                        template: { content: "{femaleculls}" }
                    },

                    {
                        name: "Cumulative Female Culls",
                        template: { content: "{cumufemaleculls}" }
                    },

                    {
                        name: "Female Mortality",
                        template: { content: "{femalemortality}" }
                    },

                    {
                        name: "Cumulative Female Mortality",
                        template: { content: "{cumufemalemortality}" }
                    },
                    {
                        name: "Sexing Error",
                        template: { content: "{sexingerrorqty}" }
                    },

                    {
                        name: "Cumulative Sexing Error",
                        template: { content: "{cummalefemalesexingerror}" }
                    },

                    {
                        name: "Female Closing Balance",
                        template: { content: "{femaleclosingbalancefinal}" }
                    },]


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
