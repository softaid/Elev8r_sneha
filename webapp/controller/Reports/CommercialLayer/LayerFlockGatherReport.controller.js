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

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.CommercialLayer.LayerFlockGatherReport", {

        currentContext: null,

        onInit: function () {
            this.currentContext = this;
            // set location model
            var moduleids = 725;
            this.getLocations(this, moduleids);
            // set empty model to view 
            var emptyModel = this.getModelDefault();
            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "floackModel");
            this.getView().byId("txtdownload").setVisible(false);

            // set  model for each  Detail
            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "chicksDetail");

            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "feedDetail");

            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "medicineDetail");

            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "itemDetail");

            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "saleDetail");

        },
        // get all loctions under layer
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

        // Default Model
        getModelDefault: function () {
            return {
                layerbatchid: null,
            }
        },

        // getlocation wise layerbatches
        handleSelectionFinish: function (oEvt) {
            this.resetModel();
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

        // select All functionality
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


        handleBrdBatchValueHelp: function (oEvent) {
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

        // search functionality for layer batch
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
                var oModel = currentContext.getView().getModel("floackModel");
                //update existing model to set locationid
                oModel.oData.layerbatchid = selRow[0].id;
                oModel.oData.batchname = selRow[0].batchname
                oModel.refresh();

            } else {

            }
        },

        // reset parent and child model
        resetModel: function () {
            var emptyModel = this.getModelDefault();
            var model = this.getView().getModel("floackModel");
            model.setData(emptyModel);

            if (this.getView().getModel("flockgatherReportModel") != undefined) {
                var tbleModel = this.getView().getModel("flockgatherReportModel");
                tbleModel.setData({ modelData: [] });
            }
        },

        // get layer batches under location
        getLocationwiselayerbatches: function (location) {
            var currentContext = this;
            layerReportsService.getLocationwiselayerbatches({ locationid: location }, function (data) {
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        var oBatchModel = new sap.ui.model.json.JSONModel();
                        oBatchModel.setData({ modelData: data[0] });
                        currentContext.getView().setModel(oBatchModel, "layerBatchList");
                    } else {
                        MessageBox.error("location wise batch not availabel.")
                    }
                }
            });
        },

        // get data for layer flock gather report
        onSearchData: function () {
            var oModel = this.getView().getModel("floackModel");
            var batchid = oModel.oData.layerbatchid;
            if (this.validateForm()) {
                var currentContext = this;
                layerReportsService.getlayerflockgatherReport({ batchid: batchid, companyid: commonFunction.session("companyId") }, function (data) {

                    var oBatchModel = currentContext.getView().getModel("chicksDetail");
                    oBatchModel.setData({ modelData: data[0] });
                    console.log("chicksDetail", oBatchModel);


                    var oFeedModel = currentContext.getView().getModel("feedDetail");
                    oFeedModel.setData({ modelData: data[1] });
                    console.log("feedDetail", oFeedModel);

                    var oMedicineModel = currentContext.getView().getModel("medicineDetail");
                    oMedicineModel.setData({ modelData: data[2] });
                    console.log("feedDmedicineDetailetail", oMedicineModel);

                    var oItemModel = currentContext.getView().getModel("itemDetail");
                    oItemModel.setData({ modelData: data[3] });
                    console.log("itemDetail", oItemModel);

                    var osaleModel = currentContext.getView().getModel("saleDetail");
                    osaleModel.setData({ modelData: data[4] });
                    console.log("saleDetail", osaleModel);

                });
            }
            this.getView().byId("txtdownload").setVisible(true);
        },

        //validation function for report filters
        validateForm: function () {
            var isValid = true;
            var BatchMsg = "Batch is required.";

            if (!commonFunction.ismultiComRequired(this, "locationtbl", "Location is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "textBatch", BatchMsg))
                isValid = false;
            return isValid;
        },

        // generate CSV file for LayerFolckGather Report
        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var location = this.locationname;
            var batchname = this.getView().byId("textBatch").getValue();

            var filename = location + '_' + batchname;

            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/



            var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ","
                }),

                // Pass in the model created above
                models: this.currentContext.getView().getModel("flockgatherReportModel"),

                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content


                columns: [
                    {
                        name: "Group Name",
                        template: { content: "{groupname}" }
                    },
                    {
                        name: "Date",
                        template: { content: "{date}" }
                    },
                    {
                        name: "Description",
                        template: { content: "{itemname}" }
                    },
                    {
                        name: "Total Quantity",
                        template: { content: "{quantity}" }
                    },
                    {
                        name: "Rate",
                        template: { content: "{unitcost}" }
                    },
                    {
                        name: "Amount",
                        template: { content: "{amount}" }
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
