sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/BreederReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',


], function (JSONModel, BaseController, MessageToast, MessageBox, Export, ExportTypeCSV, commonFunction, breederReportsService, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Breeder.EggsCollectionReport", {

        currentContext: null,

        onInit: function () {
            this.currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");
            // set location model
            var moduleids = 721;
            this.getLocations(this, moduleids);

            // set empty model to view 
            var emptyModel = this.getModelDefault();
            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "eggsCollRepModel");
            // this.loadData();

            var cmblocation = this.getView().byId("locationtbl");
            cmblocation.onAfterRenderingPicker = function () {
                if (sap.m.MultiComboBox.prototype.onAfterRenderingPicker) {
                    sap.m.MultiComboBox.prototype.onAfterRenderingPicker.apply(this);
                }
            }
            var frequencymodel = [{ key: "day", value: "Daily" },
            { key: "week", value: "Weekly" },
            { key: "month", value: "Monthly" }]
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({ modelData: frequencymodel });
            this.getView().setModel(oModel, "frequemodel");

            this.csvdata = [];

        },


        getModelDefault: function () {
            return {
                breederbatchid: null,
                shedid: null,
                collectiondate: commonFunction.getDateFromDB(new Date()),
                showdate: true,
                showweek: false,
                showmonth: false,
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
            this.getBreederBatches(locationStr);
            this.getView().byId("locationtbl").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        getBreederBatches: function (location) {
            var currentContext = this;
            breederReportsService.gatAllBreederBatch({ locationid: location }, function (data) {
                var oBatchModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "breederbatchid": "All", "batchname": "Select All" });
                    }
                    oBatchModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oBatchModel, "batchModel");
                } else {
                    MessageBox.error("Breeder Batch not availabel.")
                }
            });
            // }
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


            var batchesStr = "";

            for (var i = 0; i < batchs.length; i++) {
                if (i == 0)
                    batchesStr = parseInt(batchs[i]);
                else
                    batchesStr = batchesStr + "," + parseInt(batchs[i]);
            }
            this.getShedByBatchid(batchesStr);
            this.getView().byId("batchtb1").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        getShedByBatchid: function (breederbatchid) {
            var currentContext = this;
            breederReportsService.getShedByBatchid({ breederbatchid: breederbatchid }, function (data) {
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "Shedid": "All", "shedname": "Select All" });
                    }
                    var oBatchModel = new sap.ui.model.json.JSONModel();
                    oBatchModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oBatchModel, "shedModel");
                } else {
                    MessageBox.error("Breeder Shed not availabel.")
                }
            });
            // }
        },


        shedSelectionFinish: function (oEvt) {


            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedsheds = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedsheds.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }
            var i = selectedsheds.length - 1;

            if (selectedsheds[i].key == "ALL") {

                selectedsheds = selectedsheds.slice(0, -1);
            }

            var shedids = [];
            for (var i = 0; i < selectedsheds.length; i++) {
                shedids.push(selectedsheds[i].key);
            }
            this.shedname = [];
            for (var i = 0; i < selectedsheds.length; i++) {
                this.shedname.push(selectedsheds[i].text);
            }

            var shedStr = "";

            for (var i = 0; i < shedids.length; i++) {
                if (i == 0)
                    shedStr = parseInt(shedids[i]);
                else
                    shedStr = shedStr + "," + parseInt(shedids[i]);
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
            var oModel = this.getView().getModel("eggsCollRepModel").oData;
            if (oModel.frequency == "day") {
                oModel.showweek = false;
                oModel.showdate = true;
                oModel.showmonth = false;
            }
            else if (oModel.frequency == "week") {
                oModel.showweek = true;
                oModel.showdate = false;
                oModel.showmonth = false;

            } else if (oModel.frequency == "month") {
                oModel.showweek = false;
                oModel.showdate = false;
                oModel.showmonth = true;
            }
            this.getView().byId("statustype").setValueState(sap.ui.core.ValueState.None);
        },


        onSearchData: function () {

            var pnlEggColtable = this.getView().byId("pnlEggColtable");
            pnlEggColtable.destroyContent();
            if (this.validateForm()) {

                var currentContext = this;
                currentContext.frquencytype = this.getView().byId("statustype").getSelectedItem();

                var oModel = this.getView().getModel("eggsCollRepModel").oData;

                var batchids = this.getView().byId("batchtb1").getSelectedKeys();
                var shedids = this.getView().byId("shedtb1").getSelectedKeys();

                var batchesStr = "";
                    for (var i = 0; i < batchids.length; i++) {
                        if (i == 0)
                            batchesStr = parseInt(batchids[i]);
                        else
                            batchesStr = batchesStr + "," + parseInt(batchids[i]);
                    }

                    var i = batchesStr.length - 1;
                    if (batchesStr == "All") {
                        batchesStr = batchesStr.slice(0, -1);
                    }

                    var i = shedids.length - 1;
                    if (shedids == "All") {
                        shedids = shedids.slice(0, -1);
                    }

                    var shedString = "";

                    for (var i = 0; i < shedids.length; i++) {
                        if (i == 0)
                            shedString = parseInt(shedids[i]);
                        else
                            shedString = shedString + "," + parseInt(shedids[i]);
                    }
                    var oModel = {
                        breederbatchid: batchesStr,
                        shedid: shedString,
                        frequency: oModel.frequency,

                        fromdate: commonFunction.getDate(this.getView().byId("txtFromdate").getValue()),
                        todate: commonFunction.getDate(this.getView().byId("txtTodate").getValue()),
                        companyid: commonFunction.session("companyId")
                    }

                    breederReportsService.getEggscollectionReport(oModel, function (data) {

                        if (data.length > 0) {
                            if (data[0].length > 0) {
                                for (var i = 0; i < data[0].length; i++) {


                                    for (var j = 0; j < data[2].length; j++) {
                                        if (data[0][i].collectiondate != undefined) {
                                            if (data[2][j].Collectiondate == data[0][i].collectiondate) {
                                                data[2][j]["Collection-Quantity"] = data[0][i].Quantity;
                                                break;
                                            }

                                        } else if (data[0][i].week_start != undefined) {
                                            if (data[2][j].week_start == data[0][i].week_start) {
                                                data[2][j]["Collection-Quantity"] = data[0][i].Quantity;
                                                break;
                                            }
                                        }
                                        else if (data[0][i].month != undefined) {
                                            if (data[2][j].Month == data[0][i].month) {
                                                data[2][j]["Collection-Quantity"] = data[0][i].Quantity;
                                                break;
                                            }
                                        }

                                    }
                                }



                                var keys = [];

                                Object.keys(data[2][0]).forEach(function (key) {
                                    keys.push(key);
                                });


                                var arr = [];
                                for (var i = 0; i < keys.length; i++) {
                                    arr.push({ columnId: keys[i] })
                                }
                                currentContext.csvdata.push({
                                    columns: arr,
                                    rows: data[2]
                                });
                                var oModel = new sap.ui.model.json.JSONModel();

                                oModel.setData({
                                    columns: arr,
                                    rows: data[2]
                                });

                                var oTable = new sap.ui.table.Table({
                                    showNoData: true,
                                    columnHeaderHeight: 10,
                                    visibleRowCount: 5,
                                    selectionMode: sap.ui.table.SelectionMode.None

                                });
                                oTable.setModel(oModel);
                                oTable.bindColumns("/columns", function (index, context) {
                                    var sColumnId = context.getObject().columnId;

                                    return new sap.ui.table.Column({
                                        id: sColumnId,
                                        label: sColumnId,
                                        template: sColumnId,
                                    });
                                });
                                oTable.bindRows("/rows");

                                var pnlEggColtable = currentContext.getView().byId("pnlEggColtable");
                                pnlEggColtable.addContent(oTable);

                                // set empty model to view		
                                var tblModel = new JSONModel();
                                tblModel.setData({ modelData: data[2] });
                                currentContext.getView().setModel(tblModel, "tblModel");
                            }
                        }
                    });
                
            }

        },


        onDateChange: function () {
            var isValid = true
            var tDate = this.getView().byId("txtTodate").getValue();
            if (tDate) {
                this.getView().byId("txtTodate").setValueState(sap.ui.core.ValueState.None);
            }
            var fDate = this.getView().byId("txtFromdate").getValue();
            if (fDate) {
                this.getView().byId("txtFromdate").setValueState(sap.ui.core.ValueState.None);
            }
            var pModel = this.getView().getModel("eggsCollRepModel");
            if (tDate) {
                if (fDate > tDate) {
                    isValid = false
                    MessageBox.error("To date should be greater than from date.");

                }
            }
            return isValid
        },

        validateForm: function () {
            var isValid = true;
            if (!commonFunction.isSelectRequired(this, "statustype", "Frequesncy is required"))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "locationtbl", "location is required"))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "batchtb1", "batch is required"))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "shedtb1", "shed is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtFromdate", "From Date is required"))
                isValid = false;
            if (!commonFunction.isRequired(this, "txtTodate", "To Date is required"))
                isValid = false;


            if (!this.onDateChange())
                isValid = false;

            return isValid;
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

        // Function Used For PDF Download

        replaceTemplateData: function (template) {
            // Item table Data --------------

            var tbleModel = this.getView().getModel("tblModel").oData.modelData;


            var htmTable = "";
            for (var indx in tbleModel) {
                var model = tbleModel[indx];
                // Replace/create column sequence data table
                htmTable += "<tr>";
                htmTable += "<td align='center'>" + model["Month"] + "</td>"
                htmTable += "<td>" + model["Commercial-Eggs"] + "</td>"
                htmTable += "<td align='right'>" + model["Cracked-Eggs"] + "</td>"
                htmTable += "<td align='right'>" + model["Double-Yolk"] + "</td>"
                htmTable += "<td>" + model["Hatching-B"] + "</td>"
                htmTable += "<td>" + model["Hatching-Egg-C"] + "</td>"
                htmTable += "<td>" + model["Hatching-Eggs-A"] + "</td>"
                htmTable += "<td>" + model["Hatching-Eggs"] + "</td>"
                htmTable += "<td>" + model["Collection-Quantity"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;

            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var frquency = this.frquencytype.mProperties.text;
            var location = this.locationname;
            var batchname = this.batchsname;
            var shedname = this.shedname;

            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);


            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##ReportFromDate##", fromdate);
            template = this.replaceStr(template, "##ReporToDate##", todate);
            template = this.replaceStr(template, "##Frequencytype##", frquency);
            template = this.replaceStr(template, "##LocationName##", location);
            template = this.replaceStr(template, "##BatchName##", batchname);
            template = this.replaceStr(template, "##ShedName##", shedname);
            return template;

        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("Breeder", "EggsCollectionReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "EggsCollection Report");
            });
        },


        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {

            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var frquency = this.frquencytype.mProperties.text;
            var location = this.locationname;
            var batchname = this.batchsname;
            var shedname = this.shedname;

             
            var filename =fromdate+'_'+todate+'_'+frquency+'_'+location+'_'+batchname+'_'+shedname;



            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/


            var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ","
                }),

                // Pass in the model created above
                models: this.currentContext.getView().getModel("tblModel"),


                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content

                columns: [
                    this.csvdata.columns
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