sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/Hatchery/TransferToHatcher.service',
	'sap/ui/elev8rerp/componentcontainer/services/Hatchery/Hatcher.service',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/ui/elev8rerp/componentcontainer/utility/Validator',
	'sap/m/MessageBox',
	'sap/m/MessageToast',
], function (JSONModel, BaseController, commonFunction, transferToHatcherService, hatcherService, commonService, Validator, MessageBox, MessageToast) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Common.MaterialReceiptDetail", {
		onInit: function () {
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
			var currentContext = this;
			var aContexts = oEvent.getParameter("selectedContexts");

			// if(aContexts != undefined){
			var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
			var oModel = currentContext.getView().getModel("editMaterialReceiptDetailModel");
			//update existing model to set locationid
			oModel.oData.itemid = selRow[0].id;
			oModel.oData.itemcode = selRow[0].itemcode;
			oModel.oData.itemname = selRow[0].itemname;
			oModel.oData.unitcost = selRow[0].unitcost;
			oModel.oData.unitid = selRow[0].itemunitid;
			oModel.oData.unitname = selRow[0].refname;
			oModel.refresh();

			// }
		},

		handleValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			// if (!this._valueHelpDialog) {
			this._valueHelpDialog = sap.ui.xmlfragment(
				"sap.ui.elev8rerp.componentcontainer.fragmentview.Common.LocationDialog",
				this
			);
			this.getView().addDependent(this._valueHelpDialog);
			// }
			this._valueHelpDialog.open(sInputValue);
		},

		handleLocationSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['locationcode', 'locationname'];
			var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
			}),
				false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		onLocationDialogClose: function (oEvent) {
			var currentContext = this;
			var aContexts = oEvent.getParameter("selectedContexts");

			if (aContexts != undefined) {
				var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
				var oModel = currentContext.getView().getModel("editMaterialReceiptDetailModel");

				oModel.oData.locationid = selRow[0].id;
				oModel.oData.locationcode = selRow[0].locationcode;
				oModel.oData.locationname = selRow[0].locationname;

				commonService.getLocationWiseWarehouse({ locationid: selRow[0].id }, function (data) {
					if (data[0].length > 0) {
						var model = new sap.ui.model.json.JSONModel();
						model.setData({ modelData: data[0] });
						currentContext.getView().setModel(model, "warehouseList");
						currentContext.getView().byId("txtWarehouse").setEnabled(true);
					} else {
						MessageBox.error("No warehouse is available for " + selRow[0].locationname + ".");
					}
				});
				oModel.refresh();
			}
		},

		//Warehouse dialog
		handleWarehouseValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			this._valueHelpDialog = sap.ui.xmlfragment(
				"sap.ui.elev8rerp.componentcontainer.fragmentview.Common.WarehouseDialog",
				this
			);
			this.getView().addDependent(this._valueHelpDialog);
			this._valueHelpDialog.open(sInputValue);
		},

		handleWarehouseSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['warehousecode', 'warehousename'];
			var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
			}),
				false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		onWarehouseDialogClose: function (oEvent) {
			var currentContext = this;
			var aContexts = oEvent.getParameter("selectedContexts");

			if (aContexts != undefined) {
				var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
				var oModel = currentContext.getView().getModel("editMaterialReceiptDetailModel");
				oModel.oData.towarehouse = selRow[0].id;
				oModel.oData.warehousecode = selRow[0].warehousecode;
				oModel.oData.warehousename = selRow[0].warehousename;

				oModel.refresh();
			}
		},

		onBeforeRendering: function () {

			this.model = this.getView().getModel("viewModel");
			commonFunction.getItemList(this);
			commonFunction.getLocationList(this);
			var oModel = new JSONModel();

			if (this.model != undefined) {
				oModel.setData(this.model);
			}
			else {
				oModel.setData({ id: null, itemid: null, unitcost: null, itemcost: null, totalcost: null, warehouse: null, receiptquantity: null, itemunitid: null });
			}
			this.getView().setModel(oModel, "editMaterialReceiptDetailModel");
		},

		validateForm: function () {
			var isValid = true;

			if (!commonFunction.isRequired(this, "txtItem", "Please Select Item!"))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtQuantity", "Please enter Item quantity!"))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtUnitPrice", "Please enter Item Unit Price!"))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtLocation", "Please select Location!"))
				isValid = false;

			if (isValid) {
				if (!commonFunction.isNumber(this, "txtQuantity"))
					isValid = false;

			}

			return isValid;
		},

		onQuantityChange: function (oEvent) {
			var newValue = oEvent.getParameter("value");
			var model = this.getView().getModel("editMaterialReceiptDetailModel");
			model.oData.itemcost = model.oData.unitcost * newValue;
			model.oData.totalcost = model.oData.unitcost * newValue;
			model.refresh();
		},

		onSave: function () {
			var isValid = this.validateForm();
			if (isValid) {
				var model = this.getView().getModel("editMaterialReceiptDetailModel").oData;
				model["companyid"] = commonService.session("companyId");
				model["userid"] = commonService.session("userId");
				model["itembatch"] = 1;
				if (model.id == null && (model["status"] == "Edited" || model["status"] == "New"))
					model["status"] = "New";
				else
					model["status"] = "Edited";
				// pass model to parent(shed) controller to save
				this.bus = sap.ui.getCore().getEventBus();
				this.bus.publish("onMaterialReceiptAdd", "onMaterialReceiptAdd", { data: model });
				this.onCancel();
			}
		},

		onDelete: function () {
			var currentContext = this;
			if (this.model != undefined) {
				MessageBox.confirm(
					"Are you sure you want to delete child data?", {
					styleClass: "sapUiSizeCompact",
					onClose: function (sAction) {
						if (sAction == "OK") {
							transferToHatcherService.deleteHatcherBatch(currentContext.model, function (data) {
								if (data) {

								}
							});
							currentContext.bus = sap.ui.getCore().getEventBus();
							currentContext.bus.publish("onMaterialReceiptDelete", "onMaterialReceiptDelete", { data: currentContext.model });
							currentContext.onCancel();
							MessageToast.show("Hatcher batch deleted successfully.");
						}
					}
				}
				);
			}
		},

		onCancel: function () {
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---materialreceipt--fclMaterialReceipt");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}
	});
}, true);
