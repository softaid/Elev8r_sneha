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

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Breeder.FeedRequirementPlan", {

        currentContext: null,

        onInit: function () {
            this.currentContext = this;

            // set location model


            // set empty model to view 
            var emptyModel = this.getModelDefault();
            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "requiredPlanList");
            commonFunction.getReference("ModName", "moduleModel", this);




        },
        onModeuleChange: function () {
            this.currentContext = this;
            var moduleids = this.getView().byId("txtModeule").getSelectedKey();
            commonFunction.getLocations(this, moduleids);

        },
        onLocationChange: function () {
            var locationid = this.getView().byId("txtLocation").getSelectedKey();
            this.getLocationWiseWarehouse(locationid);
        },

        getLocationWiseWarehouse: function (locationid) {
            var currentContext = this;
            commonService.getLocationWiseWarehouse({ locationid: locationid }, function (data) {

                if (data[0].length > 0) {
                    var warehouseModel = new sap.ui.model.json.JSONModel();
                    warehouseModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(warehouseModel, "warehouseList");
                } else {
                    MessageBox.error("Warehouse not availabel!");
                }

            });
        },
        getWarehousewiseBreederBatch: function (warehouseid) {
            var currentContext = this;
            commonService.getWarehousewiseBreederBatch({ warehouseid: warehouseid }, function (data) {

                if (data[0].length > 0) {
                    if (data[0].length > 0) {
                        data[0].push({ "breederbatchid": "All", "breederbatchname": "Select All" });
                    }
                    var warehouseModel = new sap.ui.model.json.JSONModel();
                    warehouseModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(warehouseModel, "btachList");
                } else {
                    MessageBox.error("Batch not availabel!");
                }

            });
        },
        onWarehouseChange: function () {
            var warehouseid = this.getView().byId("txtWarehouse").getSelectedKey();
            this.getWarehousewiseBreederBatch(warehouseid);
            var pModel = this.getView().getModel("requiredPlanList");
            pModel.oData.warehouseid = warehouseid
            pModel.refresh();
        },

        getModelDefault: function () {
            return {
                breederbatchid: null,
            }
        },

        breederbatchSelect: function (oEvent) {
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

        breederbatchFinesh: function (oEvt) {
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectbatch = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectbatch.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }
            var i = selectbatch.length - 1;

            if (selectbatch[i].key == "ALL") {

                selectbatch = selectbatch.slice(0, -1);
            }
            var batch = [];
            for (var i = 0; i < selectbatch.length; i++) {
                batch.push(selectbatch[i].key);
            }

            var batchStrg = "";

            for (var i = 0; i < batch.length; i++) {
                if (i == 0)
                    batchStrg = parseInt(batch[i]);
                else
                    batchStrg = batchStrg + "," + parseInt(batch[i]);
            }
            var pModel = this.getView().getModel("requiredPlanList");
            pModel.oData.breederbatchid = batchStrg
            pModel.refresh();
        },
        onDateChange: function () {
            var oModel = this.getView().getModel("requiredPlanList").oData;
        },



        onSearchData: function () {

            var currentContext = this;
            var oModel = this.getView().getModel("requiredPlanList").oData;

            oModel["fromdate"] = commonFunction.setDateToDB(oModel["fromdate"]);
            oModel["todate"] = commonFunction.setDateToDB(oModel["todate"]);
            oModel["companyid"] = commonFunction.session("companyId");

            breederReportsService.getFeedRequiredPlanReport(oModel, function async(data) {

                if (data[0].length > 0) {


                    var totalrequerfeed = null;
                    var closingbalance = null;
                    var requiredfeed = null;
                    for (var i = 0; data[0].length > i; i++) {

                        totalrequerfeed = data[0][i].firesfeed + data[0][i].secfeed + data[0][i].tiredfeed
                        data[0][i].totalrequerfeed = parseFloat(((totalrequerfeed * data[0][i].birdebalance) / 1000)).toFixed(2);

                        data[0][i].requiredfeed = data[0][i].totalrequerfeed - data[0][i].closingbalnce;

                    }

                    var tblModel = new sap.ui.model.json.JSONModel();
                    tblModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(tblModel, "tblModel");
                    tblModel.refresh();

                }
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
                models: this.currentContext.getView().getModel("tblModel"),

                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content


                columns: [
                    {
                        name: "Supplier Name",
                        template: { content: "{partyname}" }
                    },
                    {
                        name: "Item Name",
                        template: { content: "{itemname}" }
                    },
                    {
                        name: "Batch Number",
                        template: { content: "{breederbatchid}" }
                    },
                    {
                        name: "Bird Suppplied",
                        template: { content: "{quantity}" }
                    },
                    {
                        name: "Bird Balance",
                        template: { content: "{birdebalance}" }
                    },
                    {
                        name: "Bird Palacement Date",
                        template: { content: "{scheduledate}" }
                    },
                    {
                        name: "Flock Age week",
                        template: { content: "{flockage}" }
                    },
                    {
                        name: "Required Age",
                        template: { content: "{requiredage}" }
                    },
                    {
                        name: "Total Feed Required As per std",
                        template: { content: "{totalrequerfeed}" }
                    },
                    {
                        name: "Closing Balance Of Feed",
                        template: { content: "{closingbalnce}" }
                    },
                    {
                        name: "Required Feed",
                        template: { content: "{requiredfeed}" }
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
