sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/CommercialLayerReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service'

], function (JSONModel, BaseController, MessageToast, MessageBox, Export, ExportTypeCSV, commonFunction, layerReportsService, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.CommercialLayer.LayerDailyConsumptionReport", {

        currentContext: null,

        onInit: function () {
            this.currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");

            // set location model
            var moduleids = 725;
            this.getLocations(this, moduleids);

            // set empty model to view 
            var emptyModel = this.getModelDefault();

            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "layerDailyconsumptionModel");
            this.getView().byId("txtdownload").setVisible(false);

        },

        getModelDefault: function () {
            return {
                layerbatchid: null,
                fromdate: null,
                todate: null
            }
        },

        getLocations: function (currentContext, moduleids) {
            commonService.getLocations({ moduleids: moduleids }, function (data) {
                var oLocationModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "locationname": "Select All" });
                    } else {
                        MessageBox.error("Location not available.")
                    }
                }

                oLocationModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oLocationModel, "locationList");
            });
        },

        handleSelectionFinish: function (oEvt) {
            // this.resetModel();
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedKeys = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedKeys.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });

            }
            var location = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                location.push(selectedKeys[i].key);
            }

            this.locationname = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                this.locationname.push(selectedKeys[i].text);
            }
           
            var locationStr = "";

            for (var i = 0; i < location.length; i++) {
                if (i == 0)
                    locationStr = parseInt(location[i]);
                else
                    locationStr = locationStr + "," + parseInt(location[i]);
            }
            this.getLocationwiseLayerbatches(locationStr);
            this.getView().byId("locationtbl").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        handleSelectionChange: function (oEvent) {
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

        getLocationwiseLayerbatches: function (location) {
            var currentContext = this;
            layerReportsService.getLocationwiselayerbatches({ locationid: location }, function (data) {

                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "batchname": "Select All" });
                        var oBatchModel = new sap.ui.model.json.JSONModel();
                        oBatchModel.setData({ modelData: data[0] });
                        currentContext.getView().setModel(oBatchModel, "layerBatchList");
                    } else {
                        MessageBox.error("Location wise batch not available.")
                    }
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

            var batchesStr = "";

            for (var i = 0; i < batchs.length; i++) {
                if (i == 0)
                    batchesStr = parseInt(batchs[i]);
                else
                    batchesStr = batchesStr + "," + parseInt(batchs[i]);
            }

            this.batchname = [];
            for (var i = 0; i < selectedbatches.length; i++) {
                this.batchname.push(selectedbatches[i].text);
            }
            


            var oModel = this.getView().getModel("layerDailyconsumptionModel");
            //update existing model to set locationid
            oModel.oData.layerbatchid = batchesStr;

            oModel.refresh();
            this.getView().byId("batchtb1").setValueState(sap.ui.core.ValueState.None);

            oModel.refresh();
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },
        ongetDate: function () {
            var isValid = true
            var oModel = this.getView().getModel("layerDailyconsumptionModel").oData

            var fromDate = oModel.fromdate;
            var todate = oModel.todate;

            if (fromDate) {
                var date1 = Date.parse(fromDate);
                this.getView().byId("txtFromdate").setValueState(sap.ui.core.ValueState.None);
            }
            if (todate) {
                var date3 = new Date(todate);
                this.getView().byId("txtTodate").setValueState(sap.ui.core.ValueState.None);
            }


            if (date3 < date1) {
                MessageBox.error("From date less than to date date");
                isValid = false;
            }
            return isValid
        },

        onSearchData: function () {
            if (this.validateForm()) {
                var currentContext = this;
                var oModel = this.getView().getModel("layerDailyconsumptionModel").oData

                var oModel = {
                    batchid: oModel.layerbatchid,
                    fromdate: commonFunction.getDate(this.getView().byId("txtFromdate").getValue()),
                    todate: commonFunction.getDate(this.getView().byId("txtTodate").getValue()),
                    companyid: commonFunction.session("companyId")
                }

                layerReportsService.getLayerDailyConsumptionReport(oModel, function (data) {
                    for (var i = 0; i < data[0].length; i++) {

                        data[0][i]["closingbalance"] = (data[0][i]["openingbalance"] + data[0][i].receivedquantity) - (data[0][i].outquantity + data[0][i].consumedquantity);

                        if (i == data[0].length - 1) {
                            var oModel = new sap.ui.model.json.JSONModel();
                            oModel.setData({ modelData: data[0] });
                            currentContext.getView().setModel(oModel, "dailyconsumpReportModel");
                        }
                    }

                });
            }
            this.getView().byId("txtdownload").setVisible(true);

        },

        validateForm: function () {
            var isValid = true;

            if (!commonFunction.ismultiComRequired(this, "locationtbl", "Location is required"))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "batchtb1", "Batch is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtFromdate", "From date is required"))
                isValid = false;
            if (!commonFunction.isRequired(this, "txtTodate", "To date is required"))
                isValid = false;

            if (!this.ongetDate())
                isValid = false;

            return isValid;
        },

        replaceStr: function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },


        replaceTemplateData: function (template) {
            // Item table Data --------------
            var tbleModel = this.getView().getModel("dailyconsumpReportModel").oData.modelData;
           

            var htmTable = "";
            for (var indx in tbleModel) {
                var model = tbleModel[indx];
                // Replace/create column sequence data table
                htmTable += "<tr>";
                htmTable += "<td align='center'>" + model["groupname"] + "</td>"
                htmTable += "<td>" + model["itemname"] + "</td>"
                htmTable += "<td align='right'>" + model["package"] + "</td>"
                htmTable += "<td align='right'>" + model["date"] + "</td>"
                htmTable += "<td>" + model["openingbalance"] + "</td>"
                htmTable += "<td>" + model["receivedquantity"] + "</td>"
                htmTable += "<td>" + model["outquantity"] + "</td>"
                htmTable += "<td align='center'>" + model["consumedquantity"] + "</td>"
                htmTable += "<td>" + model["cumconsumedquantity"] + "</td>"
                htmTable += "<td align='right'>" + model["closingbalance"] + "</td>"
                htmTable += "</tr>";
            }
            
            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;
            var location = this.locationname;
            var batchname = this.batchname;
            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);
            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##Location##", location);
            template = this.replaceStr(template, "##BatchName##", batchname);
            template = this.replaceStr(template, "##FROMDATE##", fromdate);
            template = this.replaceStr(template, "##TODATE##", todate);
            return template;

        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("Layer", "LayerDailyConReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Layer Daily Consumption Report");
            });
        },



        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {

            var location = this.locationname;
            var batchname = this.batchname;
            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
    
            var filename =fromdate+'_'+todate+'_'+location+'_'+batchname;

            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/



            var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ","
                }),

                // Pass in the model created above
                models: this.getView().getModel("dailyconsumpReportModel"),

                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content

                columns: [
                    {
                        name: "Batch Name",
                        template: { content: "{batchname}" }
                    },
                    {
                        name: "Group Name",
                        template: { content: "{groupname}" }
                    },
                    {
                        name: "Item Name",
                        template: { content: "{itemname}" }
                    },
                    {
                        name: "Date",
                        template: { content: "{date}" }
                    },
                    {
                        name: "Opening Balance",
                        template: { content: "{openingbalance}" }
                    },
                    {
                        name: "Received Quantity",
                        template: { content: "{receivedquantity}" }
                    },
                    {
                        name: "Out Quantity",
                        template: { content: "{outquantity}" }
                    },
                    {
                        name: "Consume Quantity",
                        template: { content: "{consumedquantity}" }
                    },
                    {
                        name: "Cumulative Quantity",
                        template: { content: "{cumconsumedquantity}" }
                    },

                    {
                        name: "Closing Balance",
                        template: { content: "{closingbalance}" }
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
