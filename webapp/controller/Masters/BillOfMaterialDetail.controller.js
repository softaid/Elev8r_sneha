sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/elev8rerp/componentcontainer/services/FeedMill/BillOfMaterial.service',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service'
], function (JSONModel, BaseController, MessageToast, MessageBox, billofMaterialService, commonFunction, commonService) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.FeedMill.Master.BillOfMaterialDetail", {
		onInit: function () {

			commonFunction.getItemList(this);
			commonFunction.getReference("BOMType", "materialTypeList", this);
			this.fnShortCut();
			commonFunction.getFeedMillSettingData(this, 726);

		},

		onBeforeRendering: function () {

			this.model = this.getView().getModel("viewModel");
			var oModel = new JSONModel();

			if (this.model != undefined) {

				oModel.setData(this.model);
				this.getView().byId("btnSave").setText("Update");

			}
			else {
				oModel.setData({
					id: null,
					itemname: null,
					itemid: null,
					unitcost: null,
					index: null,
					quantity: null,
					isparent: true,
					rowstatus: "NEW"
				});
			}
			this.getView().setModel(oModel, "editbillofmaterialModel");
		},

		

		fnShortCut:function(){
			var currentContext = this;
			$(document).keydown(function(event){
				if (event.keyCode== 83 && (event.altKey)){
					event.preventDefault();
					jQuery(document).ready(function($) {
						currentContext.onSave()
					})
				}

				if (event.keyCode== 69 && (event.altKey)){
					event.preventDefault();
					jQuery(document).ready(function($) {
						currentContext.onCancel()
					})
				}

			 });
			},


		//Dialog for item
		handleItemValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			// if (!this._valueHelpDialog) {
			this._valueHelpDialog = sap.ui.xmlfragment(
				"sap.ui.elev8rerp.componentcontainer.fragmentview.Common.ItemDialog",
				this
			);
			this.getView().addDependent(this._valueHelpDialog);
			// }
			this._valueHelpDialog.open(sInputValue);
		},

		_handleItemSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['itemcode', 'itemname'];
			var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
			}),
				false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		onItemDialogClose: function (oEvent) {
			var inputId = this.byId(this.inputId).sId;
			inputId = inputId.substring(inputId.lastIndexOf('-') + 1);
			var currentContext = this;
			var aContexts = oEvent.getParameter("selectedContexts");

			// if(aContexts != undefined){
			var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
			var oModel = currentContext.getView().getModel("editbillofmaterialModel");


			oModel.refresh();

			if (inputId == "txtitemname") {
				this.getLastPurchaseCost(selRow[0].id, selRow[0].unitcost);
				oModel.oData.itemid = selRow[0].id;
				oModel.oData.itemname = selRow[0].itemname;
				// oModel.oData.unitcost = selRow[0].unitcost;
				oModel.oData.itemunitname = selRow[0].unitname;
				oModel.oData.unitid = selRow[0].itemunitid;

			}

			oModel.refresh();
		},
		getLastPurchaseCost: function (itemid, unitcost) {
			var currentContext = this;
			billofMaterialService.getItemLastPucrchaseCost({ itemid: itemid }, function (data) {
				var oModel = currentContext.getView().getModel("editbillofmaterialModel");
				if (data.length > 0) {
					if (data[0].length > 0) {
						oModel.oData.unitcost = data[0][0].lastpurchaseprice;
						
					}else {
						oModel.oData.unitcost = unitcost;
					}
				}
				
				oModel.refresh();
			});


		},


		onSave: function () {
			if (this.validateForm()) {
				var flag = true;
				var model = this.getView().getModel("editbillofmaterialModel").oData;

				var materialtype = this.getView().byId("txtMaterialType").getSelectedItem().getText();
				model["materialtype"] = materialtype;

				if (model.rowstatus === "Edited") {
					var totalQty = parseInt(model.curitemQty) + parseInt(model.quantity);
					if (model.bomplanedQty >= totalQty) {
						flag = true;
					} else {
						flag = false;


					}
				}


				if (flag == true) {
					model["companyid"] = commonService.session("companyId");
					model["userid"] = commonService.session("userId");
					this.bus = sap.ui.getCore().getEventBus();
					this.bus.publish("billofmaterial", "onAddbillofmaterial", { data: model });
					this.onCancel();
				} else {
					MessageBox.error("BOM qty should match total item qty.");
				}

			}

		},



		validateForm: function () {
			var isValid = true;
			var ItemNameMsg = this.resourcebundle().getText("feedMillBOMvalidMsgItem");
			var qtyMsg = this.resourcebundle().getText("feedMillBOMvalidMsgQty");
			var unitcostMsg = this.resourcebundle().getText("feedMillBOMvalidMsgUnitCost");
			var matTypeMsg = "Material type is required"

			if (!commonFunction.isRequired(this, "txtitemname", ItemNameMsg))
				isValid = false;


			if (!commonFunction.isRequired(this, "textqty", qtyMsg))
				isValid = false;

			if (!commonFunction.isRequired(this, "textunitcost", unitcostMsg))
				isValid = false;

			if (!commonFunction.isSelectRequired(this, "txtMaterialType", matTypeMsg))
				isValid = false;
				if (!commonFunction.isDecimal(this, "textqty"))
				isValid = false;
				

			return isValid;
		},
		resourcebundle: function () {
			var currentContext = this;
			var oBundle = this.getModel("i18n").getResourceBundle()
			return oBundle
		},


		onDelete: function () {
			var currentContext = this;
			var dleteMsg = currentContext.resourcebundle().getText("deleteMsg");
			var okText = currentContext.resourcebundle().getText("OKText");

			if (this.model != undefined) {

				MessageBox.confirm(
					dleteMsg, {
					styleClass: "sapUiSizeCompact",
					onClose: function (sAction) {
						if (sAction == okText) {
							currentContext.model["companyid"] = commonService.session("companyId"); //  sessionStorage.getItem('companyid'); 
							currentContext.model["userid"] = commonService.session("userId"); // sessionStorage.getItem('userid'); 
							billofMaterialService.deleteBillOfMaterialDetail(currentContext.model, function (data) {

								if (data) {
									currentContext.bus = sap.ui.getCore().getEventBus();
									currentContext.bus.publish("billofmaterial", "onDeletebillofmaterial", { data: currentContext.model });
									currentContext.onCancel();
									var deleteMsg = currentContext.resourcebundle().getText("feedMillBOMDeleteMSg");
									MessageToast.show(deleteMsg);
								}
							});

						}
					}
				}
				);
			}
		},


		onCancel: function () {
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---billofmaterial--fclBillOfMaterial");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}
	});
}, true);
