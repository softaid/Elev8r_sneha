sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/CommercialLayerReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service'

], function (JSONModel, BaseController, MessageBox, Export, ExportTypeCSV, commonFunction, layerReportsService, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.CommercialLayer.LayerDailyBrodGrowReport", {

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
            this.getView().setModel(model, "layerdailybrodGrowModel");

            var frequencymodel = [{ key: "daily", value: "Daily" },
            { key: "weekly", value: "Weekly" },
            { key: "monthly", value: "Monthly" }]
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({ modelData: frequencymodel });
            this.getView().setModel(oModel, "frequemodel");
            this.getView().byId("txtdownload").setVisible(false);
        },

        getModelDefault: function () {
            return {
                layerbatchid: null,
                shedid: null,
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
                        //var locMsg = currentContext.resourceBundle().getText("layerFutureEggscolletionErrorMsgLoc");
                        MessageBox.error("Location is not available.");
                    }
                }

                oLocationModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oLocationModel, "locationList");
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


        handleSelectionFinish: function (oEvt) {
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
            this.getLocationwiselayerbatches(locationStr);
            this.getView().byId("locationtbl").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },


        handleLyrBatchValueHelp: function (oEvent) {
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
            var currentContext = this;
            var aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts != undefined) {
                var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });

                var oModel = currentContext.getView().getModel("layerdailybrodGrowModel");

                //update existing model to set locationid
                oModel.oData.layerbatchid = selRow[0].id;
                oModel.oData.batchname = selRow[0].batchname
                oModel.oData.placementdate = selRow[0].placementdate

                oModel.refresh();
                // get all shed by layerbatchid 
                currentContext.getLayershed(selRow[0].id);

            } else {

            }
        },

        getLocationwiselayerbatches: function (location) {
            var currentContext = this;
            layerReportsService.getLocationwiselayerbatches({ locationid: location }, function (data) {
                var oBatchModel = new sap.ui.model.json.JSONModel();

                oBatchModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oBatchModel, "layerBatchList");
            });
            // }
        },


        getLayershed: function (layerbatchid) {
            var currentContext = this;
            layerReportsService.getLayershed({ layerbatchid: layerbatchid }, function (data) {

                if (data[0].length > 0) {
                    data[0].push({ "layershedid": "All", "shedname": "Select All" });
                    var oBatchModel = new sap.ui.model.json.JSONModel();
                    oBatchModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oBatchModel, "shedModel");
                } else {
                    MessageBox.error("Layer shed not availbale .")
                }
            });

        },

        shedSelectionFinish: function (oEvt) {

            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedsheds = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedsheds.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }

            this.shedname = [];
            for (var i = 0; i < selectedItems.length; i++) {
                this.shedname.push(selectedItems[i].text);
            }
            
            this.getView().byId("shedtb1").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }

            });

        },
        frequChange: function () {
            // this.resetTable();
            var oModel = this.getView().getModel("layerdailybrodGrowModel").oData;
            if (oModel.frequency == "daily") {
                oModel.showweek = false;
                oModel.showdate = true;
                oModel.showmonth = false;
            }
            else if (oModel.frequency == "weekly") {
                oModel.showweek = true;
                oModel.showdate = false;
                oModel.showmonth = false;

            } else if (oModel.frequency == "monthly") {
                oModel.showweek = false;
                oModel.showdate = false;
                oModel.showmonth = true;
            }
            this.getView().byId("Frequency").setValueState(sap.ui.core.ValueState.None);
        },

        OnSearchData: function () {
            if (this.validateForm()) {

                var currentContext = this;
                var oModel = this.getView().getModel("layerdailybrodGrowModel").oData

                var shedids = this.getView().byId("shedtb1").getSelectedKeys();


                var i = shedids.length - 1;

                if (shedids == "All") {
                    shedids = shedids.slice(0, -1);
                }
                var shedStr = "";

                for (var i = 0; i < shedids.length; i++) {
                    if (i == 0)
                        shedStr = parseInt(shedids[i]);
                    else
                        shedStr = shedStr + "," + parseInt(shedids[i]);
                }
             
                var oModel = {
                    layerbatchid: oModel.layerbatchid,
                    shedid: shedStr,
                    frequency: oModel.frequency,
                    fromdate: commonFunction.getDate(this.getView().byId("txtFromdate").getValue()),
                    todate: commonFunction.getDate(this.getView().byId("txtTodate").getValue()),
                    companyid: commonFunction.session("companyId")
                }

                layerReportsService.getLayerDailyBrodGrowReport(oModel, function (data) {
                    for (var i = 0; i < data[1].length; i++) {  

                        data[1][i].femaletransferedinquantity = data[1][i].femaletransferedinquantity;
                        data[1][i].week_end =  commonFunction.getDateFromDB(data[1][i].week_end);
                        data[1][i].week_start =  commonFunction.getDateFromDB(data[1][i].week_start);
                        data[1][i].week_end =  commonFunction.getDateFromDB(data[1][i].month_end);
                        data[1][i].month_end =  commonFunction.getDateFromDB(data[1][i].month_start);
                        data[1][i].femaleopeningbalance = data[1][i].femaleclosingbalance;
                        data[1][i].femalestandardweight = data[0][0].femalestandardweight;
                        data[1][i].feedopeningbalance = data[1][i].totalreceivedfeed;
                        data[1][i].totalfeedconsumption = data[1][i].femalefeedconsumption + data[1][i].transferedfeed;
                        data[1][i].balance = (data[1][i].feedopeningbalance + data[1][i].receivedfeed) - (data[1][i].totalfeedconsumption);
                        data[1][i].perbirdfeedfemale = parseFloat(data[1][i].femalefeedconsumption / (data[1][i].femalefeedopeningbalancefinal)).toFixed(2);
			  if(data[1][i].femaleopeningbalancefinal != 0)
                        {
                            data[1][i].cumufemalemortalityper = parseFloat((data[1][i].cumulativefemalemortality / data[1][i].femaleopeningbalancefinal) * 100).toFixed(2);
                        }
                        else
                        {
                            data[1][i].cumufemalemortalityper = parseFloat((data[1][i].cumulativefemalemortality / data[1][i].femaletransferedinquantity) * 100).toFixed(2);
;
                        }

			  if(data[1][i].femaleopeningbalancefinal != 0)
                        {
                            data[1][i].perbirdfeedfemale = parseFloat((data[1][i].femalefeedconsumption / data[1][i].femaleopeningbalancefinal) * 1000).toFixed(2);
                        }
                        else
                        {
                            data[1][i].perbirdfeedfemale =  parseFloat((data[1][i].femalefeedconsumption / data[1][i].femaletransferedinquantity) * 1000).toFixed(2);
                            
                        }    
                    }
                    
                    var oModel = new sap.ui.model.json.JSONModel();
                    oModel.setData({ modelData: data[1] });
                    currentContext.getView().setModel(oModel, "dailybrodgrowReportModel");
                    console.log("dailybrodgrowReportModel",oModel);
                });
            }
            this.getView().byId("txtdownload").setVisible(true);
        },


        validateForm: function () {
            var isValid = true;

            if (!commonFunction.ismultiComRequired(this, "locationtbl", "Location is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "textBatch", "Batch is required."))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "shedtb1", "Shed is required."))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtFromdate", "From Date is required"))
                isValid = false;
            if (!commonFunction.isRequired(this, "txtTodate", "To Date is required"))
                isValid = false;


            if (!this.ongetDate())
                isValid = false;

            return isValid;
        },



        ongetDate: function () {
            // this.resetModel();
            var isValid = true
            var oModel = this.getView().getModel("layerdailybrodGrowModel").oData

            var fromDate = oModel.fromdate;
            var todate = oModel.todate;
            var placementdate = commonFunction.getDate(oModel.placementdate);

            // var parts = placementdate.split('-');

            placementdate = Date.parse(placementdate);
            if (fromDate) {
                // var parts1 = fromDate.split('-');

                fromDate = Date.parse(fromDate);
                this.getView().byId("txtFromdate").setValueState(sap.ui.core.ValueState.None);
            }

            if (placementdate > fromDate) {
                MessageBox.error("From Date grater than placment date.");
                isValid = false;
            }
            if (todate) {

                // var parts2 = todate.split('-');

                todate = Date.parse(todate);
                this.getView().byId("txtTodate").setValueState(sap.ui.core.ValueState.None);
                if (fromDate > todate) {
                    MessageBox.error("From Date less than todate date");
                    isValid = false;
                }
            }

            return isValid
        },

        shedSelectionChange: function (oEvent) {
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

        replaceStr: function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },


        replaceTemplateData: function (template) {
            // Item table Data --------------
            var tbleModel = this.getView().getModel("dailybrodgrowReportModel").oData.modelData;
           

            var htmTable = "";
            for (var indx in tbleModel) {
                var model = tbleModel[indx];
                // Replace/create column sequence data table
                htmTable += "<tr>";
                htmTable += "<td align='center'>" + model["shedname"] + "</td>"
                htmTable += "<td>" + model["transactiondate"] + "</td>"
                htmTable += "<td align='right'>" + model["weekno"] + "</td>"
                htmTable += "<td align='right'>" + model["week_start"] + "</td>"
                htmTable += "<td>" + model["week_end"] + "</td>"
                htmTable += "<td>" + model["monthno"] + "</td>"
                htmTable += "<td>" + model["month_start"] + "</td>"
                htmTable += "<td align='center'>" + model["month_end"] + "</td>"
                htmTable += "<td>" + model["femaleopeningbalance"] + "</td>"
                htmTable += "<td>" + model["femaletransferedinquantity"] + "</td>"
                htmTable += "<td>" + model["femaletransferedquantity"] + "</td>"
                htmTable += "<td>" + model["femaleclosingbalancefinal"] + "</td>"
                htmTable += "<td align='right'>" + model["femalemortality"] + "</td>"

                htmTable += "<td align='center'>" + model["cumulativefemalemortality"] + "</td>"
                htmTable += "<td>" + model["cumufemalemortalityper"] + "</td>"
                htmTable += "<td align='right'>" + model["cumulativefemaleculls"] + "</td>"
                htmTable += "<td align='right'>" + model["sexingerrorquantity"] + "</td>"
                htmTable += "<td>" + model["cumsexingerrorquantity"] + "</td>"
                htmTable += "<td>" + model["feedopeningbalance"] + "</td>"
                htmTable += "<td>" + model["receivedfeed"] + "</td>"
                htmTable += "<td align='center'>" + model["femalefeedconsumption"] + "</td>"
                htmTable += "<td>" + model["cummulativefeedconsumption"] + "</td>"
                htmTable += "<td align='right'>" + model["perbirdfeedfemale"] + "</td>"

                htmTable += "<td align='center'>" + model["femalestandardweight"] + "</td>"
                htmTable += "<td>" + model["femaleactualweight"] + "</td>"
                htmTable += "<td align='right'>" + model["transferedfeed"] + "</td>"
                htmTable += "<td align='right'>" + model["balance"] + "</td>"
                htmTable += "</tr>";
            }
            
            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;
            var location = this.locationname;
            var shedname = this.shedname;
            var batchname = this.getView().byId("textBatch").getValue();
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
            template = this.replaceStr(template, "##SHEDNAME##", shedname);
            template = this.replaceStr(template, "##FROMDATE##", fromdate);
            template = this.replaceStr(template, "##TODATE##", todate);
            return template;

        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("Layer", "LayerdailyBrodGroReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generateLargePDF(template, "Layer Daily BrodGrow Report");
            });
        },



        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var location = this.locationname;
            var shedname = this.shedname;
            var batchname = this.getView().byId("textBatch").getValue();
            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            

        var filename =location+'_'+shedname+'_'+batchname+'_'+fromdate+'_'+todate;
            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/



            var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ","
                }),

                // Pass in the model created above
                models: this.getView().getModel("dailybrodgrowReportModel"),

                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content

                columns: [
                    {
                        name: "Date",
                        template: { content: "{transactiondate}" }
                    },
                    {
                        name: "Shed Name",
                        template: { content: "{shedname}" }
                    },
                    {
                        name: "Female Opening Balance",
                        template: { content: "{femaleopeningbalance}" }
                    },
                    {
                        name: "Transfer In Quantity",
                        template: { content: "{femaletransferedinquantity}" }
                    },
                    {
                        name: "Transfer Out Quantity",
                        template: { content: "{femaletransferedquantity}" }
                    },


                    {
                        name: "Female Culls",
                        template: { content: "{femaleculls}" }
                    },

                    {
                        name: "Cumulative Female Culls",
                        template: { content: "{cumulativefemaleculls}" }
                    },

                    {
                        name: "Female Mortality",
                        template: { content: "{femalemortality}" }
                    },

                    {
                        name: "Cumulative Female Mortality",
                        template: { content: "{cumulativefemalemortality}" }
                    },
                    {
                        name: "Cumulative Female %",
                        template: { content: "{cumufemalemortalityper}" }
                    },
                    {
                        name: "Sexing Error",
                        template: { content: "{sexingerrorquantity}" }
                    },

                    {
                        name: "Cumulative Sexing Error",
                        template: { content: "{cumsexingerrorquantity}" }
                    },

                    {
                        name: "Feed Opening Balance",
                        template: { content: "{feedopeningbalance}" }
                    },
                    {
                        name: "Received Feed",
                        template: { content: "{receivedfeed}" }
                    },
                    {
                        name: "Feed Consumption",
                        template: { content: "{femalefeedconsumption}" }
                    },
                    {
                        name: "Cumulative Feed",
                        template: { content: "{cumulativefeed}" }
                    },
                    {
                        name: "Per Bird Feeds",
                        template: { content: "{perbirdfeedfemale}" }
                    },
                    {
                        name: "Female Standared Weight",
                        template: { content: "{femalestandardweight}" }
                    },
                    {
                        name: "Female Actual Weight",
                        template: { content: "{femaleactualweight}" }
                    },
                    {
                        name: "Transfer Feeds",
                        template: { content: "{transferedfeed}" }
                    },
                    {
                        name: "Balance",
                        template: { content: "{balance}" }
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
