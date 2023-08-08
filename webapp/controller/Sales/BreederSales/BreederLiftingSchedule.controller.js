sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/model/Filter',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',
    'sap/ui/elev8rerp/componentcontainer/services/Sales/BreederLiftingSchedule.service',
], function (JSONModel, BaseController, MessageBox, MessageToast, Filter, commonFunction, commonService, BrdliftingscheduleService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.controller.Sales.BreederSales.BreederLiftingSchedule", {

        onInit: function () {
            this.bus = sap.ui.getCore().getEventBus();
            // this.bus.subscribe("breederliftingschedule", "setDetailPage", this.setDetailPage, this);
            this.oFlexibleColumnLayout = this.byId("fclBreederLiftingSchedule");



            // set empty model to view for parent model
            var emptyModel = this.getModelDefault();
            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "breederLfsModel");

            // set empty model to view for batches			
            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "tblbreederLfsModel");

            this.handleRouteMatched(null);

            var currRouteName = this.getOwnerComponent().getModel("applicationModel").getProperty("/routeName");
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this._oRouter.getRoute(currRouteName).attachMatched(this.handleRouteMatched, this);
        },

        handleRouteMatched: function () {

            this.loadDialogList();
            // get employee
            var typeid = 1385;
            commonFunction.getEmployeeByRole(typeid, this);


            // status model
            commonFunction.getReference("BrBrdLfSchStatus", "statusModel", this);

            //get module name
            commonFunction.getReference("ModName", "moduleList", this);

        },

        moduleChange: function () {
            var moduleid = this.getView().byId("txtModuleid").getSelectedKey();
            // location help box	
            var moduleids = parseInt(moduleid);
            //get module wise location
            commonFunction.getLocations(this, moduleids);


        },


        getModelDefault: function () {

            return {
                id: null,
                scheduledate: commonFunction.setTodaysDate(new Date()),
                locationid: null,
                statusid: 4141
            }
        },

        onExit: function () {
            if (this._oDialog) {
                this._oDialog.destroy();
            }
        },

        getBatches: function () {
            var oModel = this.getView().getModel("breederLfsModel");
            var childModel = this.getView().getModel("tblbreederLfsModel");
            if (oModel.oData.scheduledate == null || oModel.oData.locationid == null) {
                MessageBox.error("Please select schedule date and Location to load the batches!")
            }
            else {
                var model = {
                    date: commonFunction.getDate(oModel.oData.scheduledate),
                    locationid: oModel.oData.locationid,
                    moduleid: parseInt(oModel.oData.moduleid),
                }

                BrdliftingscheduleService.getSalesOrderByLocation(model, function (data) {
                    if (data[0].length) {
                        childModel.setData({ modelData: data[0] });
                    } else {
                        childModel.setData({ modelData: [] });
                        MessageBox.error("No ready for sale batches are available for this location!")
                    }

                })
            }
        },

        calculateBatchCost: function (oEvent) {
            var childModel = this.getView().getModel("tblbreederLfsModel");
            for (var i = 0; i < childModel.oData.modelData.length; i++) {
                if (childModel.oData.modelData[i].approvedweight > 0) {
                    childModel.oData.modelData[i].batchcost = parseFloat(childModel.oData.modelData[i].approvedweight) * parseFloat(childModel.oData.modelData[i].rateperkg);

                    childModel.refresh();
                }
            }
        },



        onListIconPress: function (oEvent) {
            if (!this._oDialog) {
                this._oDialog = sap.ui.xmlfragment("sap.ui.elev8rerp.componentcontainer.fragmentview.Sales.BreederSales.BreederLiftingScheduleDialog", this);
            }

            // Multi-select if required
            var bMultiSelect = !!oEvent.getSource().data("multi");
            this._oDialog.setMultiSelect(bMultiSelect);

            // Remember selections if required
            var bRemember = !!oEvent.getSource().data("remember");
            this._oDialog.setRememberSelections(bRemember);

            this.getView().addDependent(this._oDialog);

            // toggle compact style
            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
            this._oDialog.open();
        },

        handleLfsSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var columns = ['locationname', 'scheduledate'];
            var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
            }),
                false);  // false for OR condition
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        handleLfsClose: function (oEvent) {

            var aContexts = oEvent.getParameter("selectedContexts");
            var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
            var sModel = this.getView().getModel("breederLfsModel");
            sModel.setData(selRow[0]);
            sModel.refresh();
            this.moduleChange();

            if (selRow[0].statusid == 4142) {
                this.getView().byId("btnSave").setEnabled(false);
            } else {
                this.getView().byId("btnSave").setEnabled(true);
            }
            this.bindDetailTable(selRow[0].id);
        },

        bindDetailTable: function (liftingscheduleid) {
            var oModel = this.getView().getModel("tblbreederLfsModel");

            var currentContext = this;
            BrdliftingscheduleService.getAllBreederLfScheduleDetail({ liftingscheduleid: liftingscheduleid }, function (data) {
                oModel.setData({ modelData: data[0] });
                oModel.refresh();
            })

        },





        onSave: function () {
            var currentContext = this;
            var childModel = this.getView().getModel("tblbreederLfsModel").oData.modelData;
            var parentModel = this.getView().getModel("breederLfsModel").oData;

            var companyId = commonService.session("companyId");
            var userId = commonService.session("userId");

            parentModel["scheduledate"] = commonFunction.getDate(parentModel["scheduledate"]);
            parentModel["companyid"] = companyId;
            parentModel["userid"] = userId;
            BrdliftingscheduleService.saveBreederLfSchedule(parentModel, function (data) {

                if (data.id > 0) {
                    var liftingscheduleid = data.id;

                    for (var i = 0; i < childModel.length; i++) {
                         if(childModel[i]["approvedweight"]>0){
                        childModel[i]["liftingscheduleid"] = liftingscheduleid;
                        childModel[i]["companyid"] = companyId;
                        childModel[i]["userid"] = userId;
                        childModel[i]["linesupervisorid"] = parseInt(childModel[i]["linesupervisorid"]);
                        var tempid = childModel[i]["id"]
                        BrdliftingscheduleService.saveBreederLfScheduleDetail(childModel[i], function (data) {
                            var saveMsg = "Lifting schedule saved successfully!";
                            var editMsg = "Lifting schedule updated successfully!";

                            var message = tempid == null ? saveMsg : editMsg
                            MessageToast.show(message);
                            currentContext.resetModel();
                            currentContext.loadDialogList();
                        });
                    }
                
                }
            }
            });
        },

        loadDialogList: function () {
            var currentContext = this;
            BrdliftingscheduleService.getAllBreederLfSchedule(function (data) {
                var sModel = new JSONModel();
                sModel.setData({ modelData: data[0] })
                currentContext.getView().setModel(sModel, "BreederLfsList");
            })
        },

        resetModel: function () {
            this.closeDetailPage();

            var emptyModel = this.getModelDefault();
            var model = this.getView().getModel("breederLfsModel");
            model.setData(emptyModel);

            var tblscheduleModel = this.getView().getModel("tblbreederLfsModel");
            tblscheduleModel.setData({ modelData: [] });
            this.getView().byId("btnSave").setEnabled(true);
        },

        closeDetailPage: function () {
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
        },

    });
}, true);
