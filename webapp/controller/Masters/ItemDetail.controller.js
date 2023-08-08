sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/elev8rerp/componentcontainer/services/Masters/Item.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',
    'sap/ui/elev8rerp/componentcontainer/utility/Validator',
    'sap/ui/core/ValueState',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Masters/ItemGroup.service',


], function (JSONModel, BaseController, MessageToast, MessageBox, itemService, commonService, Validator, ValueState, commonFunction) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Masters.ItemDetail", {
        onInit: function () {
            var currentContext = this;
            commonService.getAllItemgroup(function (data) {
                var itemGroupList = new sap.ui.model.json.JSONModel();
                itemGroupList.setData({ modelData: data[0] });
                currentContext.getView().setModel(itemGroupList, "itemGroupList");

            });

            commonFunction.getReference("BrdUnit", "unitList", this);

            commonFunction.getReference("ItmMatrTyp", "materialtypeList", this);
            commonFunction.getReference("GSTTaxCat", "taxcategoryList", this);
            commonFunction.getHSNList(this);

            //get all ledgers
            commonFunction.getAccountLedgerList(this);

            //revenue ledgers
            commonFunction.getCategorywiseLedgers(4, "revenueLedger", this);
            this.fnShortCut();
        },

        fnShortCut: function () {
            var currentContext = this;
            $(document).keydown(function (evt) {
            //     if (evt.keyCode == 83 && (evt.altKey)) {
            //         evt.preventDefault();
            //         jQuery(document).ready(function ($) {
            //             currentContext.onSave();
            //         })
            //     }
                if (evt.keyCode == 69 && (evt.altKey)) {
                    evt.preventDefault();
                    jQuery(document).ready(function ($) {
                        currentContext.onCancel();
                    })
                }
            });
        },

        onBeforeRendering: function () {
            //debugger;
            var currentContext = this;
            // currentContext.loadData();
            currentContext.model = this.getView().getModel("viewModel");

            console.log("viewModel",currentContext.model);
            var oModel = new JSONModel();

            this.isGST(false);

            if (this.model != undefined) {
                itemService.getItem(this.model, function (data) {
                    data[0][0].active = data[0][0].active == 1 ? true : false;
                    data[0][0].isgst = data[0][0].isgst == 1 ? true : false;
                    data[0][0].issalable = data[0][0].issalable == 1 ? true : false;
                    oModel.setData(data[0][0]);

                    if (data[0][0]["isgst"] != null) {  
                        var isgst = data[0][0].isgst;
                        currentContext.isGST(isgst);
                    }
                });
            } else {
                // var arr = {
                //     active : true
                // }
                this.getView().byId("txtItemCodeelement").setVisible(false);
                oModel.setData({ active: true, issalable: false, isgst: false,itemcode: null });
            }
            currentContext.getView().setModel(oModel, "editItemModel");
        },

        isGSTSelect: function (oEvent) {
            var input = oEvent.mParameters.state;
            this.isGST(input);
        },

        isGST: function (input) {

            var itemModel = this.getView().getModel("editItemModel");

            if (input === true) {
                this.getView().byId("eleHSN").setVisible(true);
                this.getView().byId("eleTaxCategory").setVisible(true);
            } else {
                this.getView().byId("eleHSN").setVisible(false);
                this.getView().byId("eleTaxCategory").setVisible(false);

                if (itemModel != undefined) {
                    itemModel.oData.hsnid = null;
                    itemModel.oData.taxcategoryid = null;
                }
            }
        },

        //Dialog for item
        handleItemGroupValueHelp: function (oEvent) {
            var sInputValue = oEvent.getSource().getValue();

            this.inputId = oEvent.getSource().getId();
            // create value help dialog
            //	if (!this._valueHelpDialog) {
            this._valueHelpDialog = sap.ui.xmlfragment(
                "sap.ui.elev8rerp.componentcontainer.fragmentview.Common.ItemGroupDialog",
                this
            );
            this.getView().addDependent(this._valueHelpDialog);
            //	}

            // open value help dialog filtered by the input value
            this._valueHelpDialog.open(sInputValue);
        },

        _handleItemGroupSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var columns = ['groupname'];
            var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
            }),
                false);  // false for OR condition
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        onItemGroupDialogClose: function (oEvent) {
            var currentContext = this;
            var aContexts = oEvent.getParameter("selectedContexts");

            if (aContexts != undefined) {
                var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
                var oModel = currentContext.getView().getModel("editItemModel");

                //update existing model to set locationid
                oModel.oData.itemgroupid = selRow[0].id;
                oModel.oData.groupname = selRow[0].groupname;
                oModel.refresh();

            }
        },

        validateForm: function () {
            var itemModel = this.getView().getModel("editItemModel");
            var isgst = itemModel.oData.isgst;
            var isValid = true;

            if (!commonFunction.isRequired(this, "cmbItemGroupId", "Please select item group!"))
                isValid = false;

            // if (!commonFunction.isRequired(this, "txtItemCode", "Please enter item code!"))
            //     isValid = false;

            if (!commonFunction.isRequired(this, "txtItemNmae", "Please enter item name!"))
                isValid = false;

            if (!commonFunction.isSelectRequired(this, "ddlUnit", "Unit is required."))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtItemUnitCost", "Please enter unit cost!"))
                isValid = false;

            if (!commonFunction.isSelectRequired(this, "ddlMaterialType", "Material type is required!"))
                isValid = false;

            if (!commonFunction.isSelectRequired(this, "ddlLedger", "Ledger is required!"))
                isValid = false;

            if (isgst == true) {
                if (!commonFunction.isSelectRequired(this, "ddlHSN", "HSN type is required!"))
                    isValid = false;

                if (!commonFunction.isSelectRequired(this, "ddlTaxCategory", "Tax Category is required!"))
                    isValid = false;
            }


            return isValid;
        },

         onSave: function () {
            //debugger;
            var isValid = this.validateForm();
            if (isValid) {
                var currentContext = this;
                var model = this.getView().getModel("editItemModel").oData;
                console.log("model",model);

                model["companyid"] = commonService.session("companyId");
                model["userid"] = commonService.session("userId");
                model["ledgerid"] = currentContext.getView().byId("ddlLedger").getSelectedItem().mProperties.key;

                if (model.isgst == false) {
                    model["taxcategoryid"] = 1523;
                }
                model.active = model.active ? 1 : 0;
                model.isgst = model.isgst ? 1 : 0;

                itemService.saveItem(model, function (data) {
                    console.log("data",data);
                    if (data.id > 0) {
                        currentContext.onCancel();
                        MessageToast.show("Item saved successfully");
                        currentContext.bus = sap.ui.getCore().getEventBus();
                        currentContext.bus.publish("loaddata", "loadData");
                    }
		    else if(data.id == -1)
		    {		
		    MessageToast.show("item is already exist.");
		    }
                });
            }
        },

        onDelete: function () {
            var currentContext = this;
            if (this.model != undefined) {
                MessageBox.confirm(
                    "Are you sure you want to delete?", {
                    styleClass: "sapUiSizeCompact",
                    onClose: function (sAction) {
                        if (sAction == "OK") {
                            itemService.deleteItem(currentContext.model, function (data) {
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
        },

    });
}, true);
