sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/CommercialLayerReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/CommercialLayer/LayerBatch.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',

], function (JSONModel, BaseController, MessageToast, MessageBox, Export, ExportTypeCSV, commonFunction, CommercialLayerReports, LayerBatch, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.CommercialLayer.FlockExpencesBefore19WeekReport", {

        currentContext: null,

        onInit: function () {
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");
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
        },

        getModelDefault: function () {
            return {
                breederbatchid: null,

            }
        },

        handleRouteMatched: function () {
            //Breeder batch help box
            this.getAllLayerBatches(status);
        },
        
        getAllLayerBatches: function () {
            var currentContext = this;
            LayerBatch.getAllBatches(function (data) {
                if (data[0].length > 0) {
                    data[0].unshift({ "id": "All", "batchname": "Select All" });
                    var oBatchModel = new sap.ui.model.json.JSONModel();
                    oBatchModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oBatchModel, "batchModel");
                } else {
                    MessageBox.error("Layer batch not available!");
                }
            });
        },


        batchSelectionChange: function (oEvent) {
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

        batchSelectionFinish: function (oEvt) {
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedbatches = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedbatches.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }
            var i = selectedbatches.length - 1;

            if (selectedbatches[i].key == "ALL") {

                selectedbatches = selectedbatches.slice(0, -1);
            }
            var batchs = [];
            for (var i = 0; i < selectedbatches.length; i++) {
                batchs.push(selectedbatches[i].key);
            }

            this.batchsname = [];
            for (var i = 0; i < selectedbatches.length; i++) {
                this.batchsname.push(selectedbatches[i].text);
            }

            this.batchesStr = "";

            for (var i = 0; i < batchs.length; i++) {
                if (i == 0)
                    this.batchesStr = parseInt(batchs[i]);
                else
                    this.batchesStr = this.batchesStr + "," + parseInt(batchs[i]);
            }

            var oModel = this.getView().getModel("flockDetailModel");
            oModel.oData.breederbatchid = this.batchesStr
            this.getView().byId("txtBreederToBatch").setValueState(sap.ui.core.ValueState.None);
            oModel.refresh();
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },


        resetModel: function () {
            var tbleModel = this.getView().getModel("tblModel");
            tbleModel.setData({ modelData: [] });

        },

        validateForm: function () {
            var isValid = true;
            if (!commonFunction.ismultiComRequired(this, "txtBreederToBatch", "Batch is required."))
                isValid = false;
            if (!commonFunction.isRequired(this, "todate", "To date is required . "))
                isValid = false;
            return isValid;
        },

        onSearchData: function () {
            var todate = this.getView().byId("todate").getValue();
            var fromdate = this.getView().byId("fromdate").getValue()

            var FModel = {
                batchid: this.batchesStr,
                todate: commonFunction.getDate(todate),
                fromdate: commonFunction.getDate(fromdate)
            }

            if (this.validateForm()) {
                var currentContext = this;
                    CommercialLayerReports.getFlockExpencesBefore19Week(FModel, function async(data) {
                    var childModel = currentContext.getView().getModel("tblModel");
                    childModel.setData({ modelData: data[0] });
                });
            }
        },

        replaceStr: function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },

        // Function Used For PDF Download

        replaceTemplateData: function (template) {
            // Item table Data --------------
            var tbleModel = this.getView().getModel("tblModel").oData.modelData;


            var htmTable = "";
            for (var indx in tbleModel) {
                var model = tbleModel[indx];
                // Replace/create column sequence data table
                htmTable += "<tr>";
                htmTable += "<td align='center'>" + model["jedate"] + "</td>"
                htmTable += "<td>" + model["glcode"] + "</td>"
                htmTable += "<td align='right'>" + model["coaname"] + "</td>"
                htmTable += "<td align='right'>" + model["dramount"] + "</td>"
                htmTable += "<td>" + model["cramount"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;
            var todate = this.getView().byId("todate").getValue();
            var fromdate = this.getView().byId("fromdate").getValue();
            var batchname = this.batchsname; 

            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);

            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##ReporToDate##", todate);
            template = this.replaceStr(template, "##ReporFromDate##", fromdate);
            template = this.replaceStr(template, "##BatchName##", batchname);
            return template;

        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("Layer", "FlockExpencesBefore19week.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generateLargePDF(template, "Flock Expences Before 19 Week Report");
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
                models: this.getView().getModel("tblModel"),

                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content

                columns: [

                    {
                        name: "Date",
                        template: { content: "{jedate}" }
                    },
                    {
                        name: "G/L Code",
                        template: { content: "{glcode}" }
                    },
                    {
                        name: "G/L Description",
                        template: { content: "{coaname}" }
                    },
                    {
                        name: "Debit",
                        template: { content: "{dramount}" }
                    },
                    {
                        name: "Credit",
                        template: { content: "{cramount}" }
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
