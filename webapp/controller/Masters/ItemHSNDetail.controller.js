sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Masters/ItemHSN.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service'

], function (JSONModel, BaseController, MessageToast, MessageBox, commonFunction, itemhsnService, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Masters.ItemHSNDetail", {
        onInit: function () {
            this.fnShortCut();
        },

        onBeforeRendering: function () {
            var currentContext = this;
            this.model = this.getView().getModel("viewModel");
            var oModel = new JSONModel();
            if (this.model != undefined) {
                itemhsnService.getItemHSN(this.model, function (data) {
                    oModel.setData(data[0][0]);
                    oModel.oData.enabled = false;
                    oModel.refresh();
                });
            } else {
                oModel.oData.enabled = true;
                oModel.oData.subheading = '';
                oModel.oData.heading = '';
                oModel.refresh();
            }
            currentContext.getView().setModel(oModel, "editItemHSNModel");
        },

        fnShortCut: function () {
            var currentContext = this;
            $(document).keydown(function (evt) {
                if (evt.keyCode == 83 && (evt.altKey)) {
                    evt.preventDefault();
                    jQuery(document).ready(function ($) {
                        currentContext.onSave();
                    })
                }
                if (evt.keyCode == 69 && (evt.altKey)) {
                    evt.preventDefault();
                    jQuery(document).ready(function ($) {
                        currentContext.onCancel();
                    })
                }
            });
        },

        createChapterID: function () {
            var oModel = this.getView().getModel("editItemHSNModel");
            oModel.oData.chapterid = (oModel.oData.chapter).concat(oModel.oData.heading, oModel.oData.subheading);
            oModel.refresh();
            console.log(oModel.oData.chapterid);
        },

        validateForm: function () {
            var isValid = true;

            if (!commonFunction.isRequired(this, "txtChapter", "Chapter is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtHeading", "Heading is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtDescription", "Description is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtSubHeading", "Subheading is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtDescription", "Description is required"))
                isValid = false;

            let chapterLen = this.getView().byId("txtChapter").getValue();
            let headingLen = this.getView().byId("txtHeading").getValue();
            let subHeadingLen = this.getView().byId("txtSubHeading").getValue();

            if(chapterLen.length > 5 || headingLen.length > 5 || subHeadingLen.length > 5){
                MessageBox.error("The length of chapter, heading and subheading cannot be greater than 5!");
                isValid = false;
            }

            return isValid;
        },

          onSave: function () {
            if (this.validateForm()) {
                var currentContext = this;
                var model = this.getView().getModel("editItemHSNModel").oData;

                model["companyid"] = commonService.session("companyId");
                model["userid"] = commonService.session("userId");
                itemhsnService.saveItemHSN(model, function (data) {
                    if (data.id > 0) {
                        currentContext.onCancel();
                        MessageToast.show("HSN master saved successfully !");
                        currentContext.bus = sap.ui.getCore().getEventBus();
                        currentContext.bus.publish("loaddata", "loadData");
                    }
                    else if (data.id == -1) {

                        MessageToast.show("Chapter id is already exist.");
                    }
                });
            }
        },
        onDelete: function () {
            var currentContext = this;
            if (this.model != undefined) {
                MessageBox.confirm(
                    "Are yoy sure you want to delete?", {
                    styleClass: "sapUiSizeCompact",
                    onClose: function (sAction) {
                        if (sAction == "OK") {
                            itemhsnService.deleteItemHSN(currentContext.model, function (data) {
                                if (data) {
                                    currentContext.onCancel();
                                    MessageToast.show("Data deleted successfully");
                                    currentContext.bus = sap.ui.getCore().getEventBus();
                                    currentContext.bus.publish("loaddata", "loadData");
                                }
                            });
                        }
                    }
                }
                );

            }
        },

        onCancel: function () {
            this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---inventory--fclItemMaster");
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
        }
    });
}, true);
