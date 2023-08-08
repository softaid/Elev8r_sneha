sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',

], function (JSONModel, BaseController, MessageToast, CommonService, commonFunction) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Common.CommonSetting", {

        onInit: function () {

            this.oFlexibleColumnLayout = this.byId("fclCommonSetting");

            var emptyModel = this.getModelDefault();
            // set model for parent table
            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "commonSettingModel");
            commonFunction.getAllLedgers(this);
            this.loadData();
            this.equetyLedger();
            this.assetLedger();
            this.liblityLedger();
            this.fnShortCut();
        },

        getModelDefault: function () {
            return {
                id: null,
                grpowithoutpo : false,
                purchaseinvoicewithoutgrpo : false,
                purchaseinvoicewithoutpo : false,
                deliverywithoutso : false,
                salesinvoicewithoutdelivery : false,
                salesinvoicewithoutso : false
            }
        },

        fnShortCut: function () {
			var currentContext = this;
			$(document).keydown(function (evt) {
				if (evt.keyCode == 83 && evt.ctrlKey) {
					jQuery(document).ready(function ($) {
						evt.preventDefault();
						currentContext.onSave();
					})
                }
			});
		},

        equetyLedger: function () {
			var currentContext = this;
			CommonService.getCategorywiseLedgers({ categoryid: 3 }, function (data) {
				if(data.length>0){
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: data[0] });
				oModel.setSizeLimit(data[0].length);
				currentContext.getView().setModel(oModel, "equetyledgerList");
				}
			});
		},

        assetLedger:function(){
            var currentContext = this;
			CommonService.getCategorywiseLedgers({ categoryid:1}, function (data) {
				if(data.length>0){
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: data[0] });
				oModel.setSizeLimit(data[0].length);
				currentContext.getView().setModel(oModel, "assetledgerList");
				}
			});
        },

        liblityLedger:function(){
            var currentContext = this;
			CommonService.getCategorywiseLedgers({ categoryid:2}, function (data) {
				if(data.length>0){
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: data[0] });
				oModel.setSizeLimit(data[0].length);
				currentContext.getView().setModel(oModel, "libledgerList");
				}
			});
        },

        loadData: function () {
            var currentContext = this;
            CommonService.getAllCommonSetting(function (data) {
		if(data.length){
                	if (data[0].length > 0) {
                    		var oModel = currentContext.getView().getModel("commonSettingModel");
                    		data[0][0].grpowithoutpo = data[0][0].grpowithoutpo == 1 ? true : false;
                    		data[0][0].purchaseinvoicewithoutgrpo = data[0][0].purchaseinvoicewithoutgrpo == 1 ? true : false;
                    		data[0][0].purchaseinvoicewithoutpo = data[0][0].purchaseinvoicewithoutpo == 1 ? true : false;
                    		data[0][0].deliverywithoutso = data[0][0].deliverywithoutso == 1 ? true : false;
                    		data[0][0].salesinvoicewithoutdelivery = data[0][0].salesinvoicewithoutdelivery == 1 ? true : false;
                    		data[0][0].salesinvoicewithoutso = data[0][0].salesinvoicewithoutso == 1 ? true : false;
                    		oModel.setData(data[0][0]);
                	}
		}
            })
        },

        onExit: function () {
            if (this._oDialog) {
                this._oDialog.destroy();
            }
        },

        onTabSelect: function (oControlEvent) {
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
        },

        setDetailPage: function (channel, event, data) {
            this.detailView = sap.ui.view({
                viewName: "sap.ui.elev8rerp.componentcontainer.view.Common." + data.viewName,
                type: "XML"
            });
            this.detailView.setModel(data.viewModel, "viewModel");
            this.oFlexibleColumnLayout.removeAllMidColumnPages();
            this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
        },

        handleLedgerValueHelp: function (oEvent) {
            var sInputValue = oEvent.getSource().getValue();

            this.inputId = oEvent.getSource().getId();
            // create value help dialog
            // if (!this._valueHelpDialog) {
            this._valueHelpDialog = sap.ui.xmlfragment(
                "sap.ui.elev8rerp.componentcontainer.fragmentview.Accounts.Master.LedgerDialog",
                this
            );
            this.getView().addDependent(this._valueHelpDialog);
            // }
            this._valueHelpDialog.open(sInputValue);

        },

        handleLedgerValueHelpEq: function (oEvent) {
            var sInputValue = oEvent.getSource().getValue();

            this.inputId = oEvent.getSource().getId();
            // create value help dialog
            // if (!this._valueHelpDialog) {
            this._valueHelpDialog = sap.ui.xmlfragment(
                "sap.ui.elev8rerp.componentcontainer.fragmentview.Accounts.Master.EquityDiallog",
                this
            );
            this.getView().addDependent(this._valueHelpDialog);
            // }
            this._valueHelpDialog.open(sInputValue);

        },

        handleLedgerSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var columns = ['glcode', 'ledgername'];
            var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
            }),
                false);  // false for OR condition
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        onLedgerDialogClose: function (oEvent) {
            var inputId = this.byId(this.inputId).sId;
            var currentContext = this;
            var aContexts = oEvent.getParameter("selectedContexts");

            inputId = inputId.substring(inputId.lastIndexOf('-') + 1);
            if (aContexts != undefined) {
                var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
                var oModel = currentContext.getView().getModel("commonSettingModel");

                if (inputId == "inventoryindrledgerid") {
                    oModel.oData.inventorygainandlossledgerid = selRow[0].id;
                    oModel.oData.inventoryledgercode = selRow[0].glcode;
                    oModel.oData.inventoryledgername = selRow[0].ledgername;
                } if (inputId == "grpowithoutinvoiceledgerid") {
                    oModel.oData.grpowithoutinvoiceledgerid = selRow[0].id;
                    oModel.oData.grpolegdgername = selRow[0].ledgername;
                    oModel.oData.grpoledgercode = selRow[0].glcode;

                } if (inputId == "discountledgerid") {
                    oModel.oData.discountledgerid = selRow[0].id;
                    oModel.oData.discountledgername = selRow[0].ledgername;
                    oModel.oData.discountledgercode = selRow[0].glcode;
                }
                if (inputId == "costofgoodsoldledgerid") {
                    oModel.oData.cogsledgerid = selRow[0].id;
                    oModel.oData.cogsledgername = selRow[0].ledgername;
                    oModel.oData.cogsledgercode = selRow[0].glcode;
                }
                if (inputId == "cashledgerid") {
                    oModel.oData.cashledgerid = selRow[0].id;
                    oModel.oData.cashledgercode = selRow[0].glcode;
                    oModel.oData.cashledgername = selRow[0].ledgername;
                }
                if (inputId == "profitandlossledgertxt") {
                    oModel.oData.profitandlossledgerid = selRow[0].id;
                    oModel.oData.profitandlossledger = selRow[0].ledgername;
                    oModel.oData.profitandlossledgercode = selRow[0].glcode;
                }
		if (inputId == "controlaccountledgerid") {
                    oModel.oData.controlaccountledgerid = selRow[0].id;
                    oModel.oData.controlaccountledger = selRow[0].ledgername;
                    oModel.oData.controlaccountledgercode = selRow[0].glcode;
                }

                oModel.refresh();
            }
        },        

        onClear: function () {

            var emptyModel = this.getModelDefault();
            var model = this.getView().getModel("commonSettingModel");
            model.setData(emptyModel);
        },

        validateForm: function () {
			var isValid = true;

			if (!commonFunction.isRequired(this, "cashledgerid", "Please select cash ledger!"))
				isValid = false;

            if (!commonFunction.isRequired(this, "txtopeningBalanceLeger", "Please select Opening Balance Ledger ledger!"))
				isValid = false;    

            if (!commonFunction.isRequired(this, "profitandlossledgertxt", "Profit and loss ledger is required!"))
				isValid = false;     
                
            if (!commonFunction.isRequired(this, "txtsupplier", "Supplier ledger is required!"))
				isValid = false;
                
            if (!commonFunction.isRequired(this, "txtcustomerledger", "Customer ledger is required!"))
				isValid = false;     

			if (!commonFunction.isRequired(this, "inventoryindrledgerid", "Please select inventory gain and loss ledger!"))
				isValid = false;

			if (!commonFunction.isRequired(this, "grpowithoutinvoiceledgerid", "Please select goods receipt but not invoice ledger!"))
				isValid = false;

            if (!commonFunction.isRequired(this, "discountledgerid", "Please select discount ledger!"))
				isValid = false;

            if (!commonFunction.isRequired(this, "costofgoodsoldledgerid", "Please select cost of good sold ledger!"))
				isValid = false;

            if (!commonFunction.isRequired(this, "profitandlossledgertxt", "Please select profit and loss ledger!"))
				isValid = false;

			if (!commonFunction.isRequired(this, "controlaccountledgerid", "Please select control account ledger!"))
				isValid = false;

			return isValid;
		},

        onSave: function () {
            if (this.validateForm()) {
                var settingModel = this.getView().getModel("commonSettingModel").oData;
                console.log(settingModel);

                settingModel["companyid"] = commonFunction.session("companyId");
                settingModel["userid"] = commonFunction.session("userId");
                settingModel["grpowithoutpo"] = settingModel["grpowithoutpo"] == 1 ? true : false;
                settingModel["purchaseinvoicewithoutgrpo"] = settingModel["purchaseinvoicewithoutgrpo"] == 1 ? true : false;
                settingModel["purchaseinvoicewithoutpo"] = settingModel["purchaseinvoicewithoutpo"] == 1 ? true : false;
                settingModel["deliverywithoutso"] = settingModel["deliverywithoutso"] == 1 ? true : false;
                settingModel["salesinvoicewithoutdelivery"] = settingModel["salesinvoicewithoutdelivery"] == 1 ? true : false;
                settingModel["salesinvoicewithoutso"] = settingModel["salesinvoicewithoutso"] == 1 ? true : false;
                var currentContext = this;

                CommonService.saveCommonSetting(settingModel, function (data) {
                    if (data.id > 0) {
                        MessageToast.show("Common Setting Save successfully.");
                        currentContext.loadData();

                    }
                })
            }
        }
    });
}, true);
