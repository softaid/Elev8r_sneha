sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/BreederReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service'

], function (JSONModel, BaseController, MessageToast, MessageBox, Export, ExportTypeCSV, commonFunction, breederReportsService, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Breeder.FeedDeviationReport", {

        currentContext: null,

        onInit: function () {
            this.currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");

            // set location se
            var moduleids = 721;
            this.getLocations(this, moduleids);

            // set empty model to view 
            var emptyModel = this.getModelDefault();
            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "feedDeviationModel");
            this.getView().byId("txtdownload").setVisible(false);

        },

        getModelDefault: function () {
            return {
                breederbatchid: null,
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
                        MessageBox.error("location not availabel.")
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
            this.getLocationwisebreederbatches(locationStr);
            this.getView().byId("locationtbl").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        handleBrdBatchValueHelp: function (oEvent) {
            var sInputValue = oEvent.getSource().getValue();
            this.inputId = oEvent.getSource().getId();

            // create value help dialog
            this._valueHelpDialog = sap.ui.xmlfragment(
                "sap.ui.elev8rerp.componentcontainer.fragmentview.BreederReports.BreederbatchDialog",
                this
            );
            this.getView().addDependent(this._valueHelpDialog);

            // open value help dialog filtered by the input value
            this._valueHelpDialog.open(sInputValue);
        },

        handleBreederBatchSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var columns = ['batchname', 'locationname', 'warehousename'];
            var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
            }),
                false);  // false for OR condition
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        onBreederBatchDialogClose: function (oEvent) {
            var currentContext = this;
            var aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts != undefined) {
                var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });

                var oModel = currentContext.getView().getModel("feedDeviationModel");
                //update existing model to set locationid
                oModel.oData.breederbatchid = selRow[0].id;
                oModel.oData.batchname = selRow[0].batchname
                oModel.oData.placementdate = selRow[0].placementdate

                oModel.refresh();
                this.getView().byId("textBatch").setValueState(sap.ui.core.ValueState.None);
                // get all shed by breederbatchid 
                currentContext.getbreedershed(selRow[0].id);



            } else {

            }
        },

        getLocationwisebreederbatches: function (location) {
            var currentContext = this;
            breederReportsService.getLocationwisebreederbatches({ locationid: location }, function (data) {
                var oBatchModel = new sap.ui.model.json.JSONModel();

                oBatchModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oBatchModel, "breederBatchList");
            });
            // }
        },


        getbreedershed: function (breederbatchid) {
            var currentContext = this;
            breederReportsService.getbreedershed({ breederbatchid: breederbatchid }, function (data) {

                var oBatchModel = new sap.ui.model.json.JSONModel();
                oBatchModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oBatchModel, "shedModel");
            });
        },

        shedSelectionFinish: function (oEvt) {

            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedsheds = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedsheds.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }

            this.shedname = [];
            for (var i = 0; i < selectedsheds.length; i++) {
                this.shedname.push(selectedsheds[i].text);
            }
          this.getView().byId("shedtb1").setValueState(sap.ui.core.ValueState.None);

        },

        resetModel: function () {
            var tbleModel = this.getView().getModel("deviationReportModel");
            tbleModel.setData({ modelData: [] });

        },


        onSearchData: function () {
            if (this.validateForm()) {
                var currentContext = this;
                var oModel = this.getView().getModel("feedDeviationModel").oData

                var shedids = this.getView().byId("shedtb1").getSelectedKeys();
                var shedStr = "";

                for (var i = 0; i < shedids.length; i++) {
                    if (i == 0)
                        shedStr = parseInt(shedids[i]);
                    else
                        shedStr = shedStr + "," + parseInt(shedids[i]);
                }

                var oModel = {
                    frequency: oModel.frequency,
                    breederbatchid: oModel.breederbatchid,
                    shedid: shedStr,
                    fromdate: commonFunction.getDate(this.getView().byId("txtFromdate").getValue()),
                    todate: commonFunction.getDate(this.getView().byId("txtTodate").getValue()),
                    companyid: commonFunction.session("companyId")
                }

                breederReportsService.getFeedDeviationReport(oModel, function (data) {
                    var oModel = new sap.ui.model.json.JSONModel();
                    oModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oModel, "deviationReportModel");
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
            if (!commonFunction.isRequired(this, "txtFromdate", "FromDate is required"))
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
            var oModel = this.getView().getModel("feedDeviationModel").oData

            var fromDate = oModel.fromdate;
            var todate = oModel.todate;


            if (fromDate) {
                var parts1 = fromDate.split('-');

                fromDate = Date.parse(new Date(parts1[2], parts1[1], parts1[0]));
                this.getView().byId("txtFromdate").setValueState(sap.ui.core.ValueState.None);
            }
            if (todate) {

                var parts2 = todate.split('-');

                todate = Date.parse(new Date(parts2[2], parts2[1], parts2[0]));
                this.getView().byId("txtTodate").setValueState(sap.ui.core.ValueState.None);
            }


            if (fromDate > todate) {
                MessageBox.error("From Date less than todate date");
                isValid = false;
            }
            return isValid
        },

        replaceStr: function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },

        // Function Used For PDF Download

        replaceTemplateData: function (template) {

            // Item table Data --------------

            var tbleModel = this.getView().getModel("deviationReportModel").oData.modelData;
            var htmTable = "";
            for (var indx in tbleModel) {
                var model = tbleModel[indx];
                // Replace/create column sequence data table
                htmTable += "<tr>";
                htmTable += "<td align='center'>" + model["shedname"] + "</td>"
                htmTable += "<td>" + model["weekno"] + "</td>"
                htmTable += "<td align='right'>" + model["itemname"] + "</td>"
                htmTable += "<td align='right'>" + model["livestock"] + "</td>"
                htmTable += "<td>" + model["stfeedconsumed"] + "</td>"
                htmTable += "<td>" + model["stfeedconsumedperbird"] + "</td>"
                htmTable += "<td>" + model["atfeedconsumption"] + "</td>"
                htmTable += "<td>" + model["recommendedfeed"] + "</td>"
                htmTable += "<td>" + model["difffeedconsumption"] + "</td>"
                htmTable += "<td>" + model["diffatandrefeed"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;

            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var batchname = this.getView().byId("textBatch").getValue();
            var location = this.locationname;
            var shedname = this.shedname;


            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);
            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##ReportFromDate##", fromdate);
            template = this.replaceStr(template, "##ReporToDate##", todate);
            template = this.replaceStr(template, "##LocationName##", location);
            template = this.replaceStr(template, "##BatchName##", batchname);
            template = this.replaceStr(template, "##ShedName##", shedname);
            return template;

        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("Breeder", "FeeddeviationReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Feed Deviation Report");
            });
        },



        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var batchname = this.getView().byId("textBatch").getValue();
            var location = this.locationname;
            var shedname = this.shedname;

            var filename =fromdate+'_'+todate+'_'+location+'_'+shedname+'_'+batchname;

            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/



            var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ","
                }),

                // Pass in the model created above
                models: this.currentContext.getView().getModel("deviationReportModel"),

                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content

                columns: [
                    {
                        name: "shed",
                        template: { content: "{shedname}" }
                    },
                    {
                        name: "Week NO",
                        template: { content: "{weekno}" }
                    },

                    {
                        name: "Item Name",
                        template: { content: "{itemname}" }
                    },
                    {
                        name: "Live Bird",
                        template: { content: "{livestock}" }
                    },
                    {
                        name: "Weekly Standared Feed Consumption",
                        template: { content: "{stfeedconsumed}" }
                    },
                    {
                        name: "Weekly Standared Feed Consumption Per Bird",
                        template: { content: "{stfeedconsumedperbird}" }
                    },
                    {
                        name: "Weekly Actual Feed Consumption",
                        template: { content: "{atfeedconsumption}" }
                    },
                    {
                        name: "Cumulative Female Mortality",
                        template: { content: "{cumulativefemalemortality}" }
                    },
                    {
                        name: "Recommended Feed Consumption",
                        template: { content: "{recommendedfeed}" }
                    },
                    {
                        name: "Difference Feed Consumption",
                        template: { content: "{difffeedconsumption}" }
                    },
                    {
                        name: "Diffference Actual And Recommended Feed Consumption",
                        template: { content: "{diffatandrefeed}" }
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
