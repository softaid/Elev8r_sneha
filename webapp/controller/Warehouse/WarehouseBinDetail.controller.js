sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/elev8rerp/componentcontainer/services/Warehouse/WarehouseBin.service',
	'sap/ui/elev8rerp/componentcontainer/services/Warehouse/Warehouse.service',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',

], function (JSONModel, BaseController, MessageToast, MessageBox, warehouseBinService, warehouseService, commonService, commonFunction) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Warehouse.WarehouseBinDetail", {
		onInit: function () {
			//get countries
			this.bus = sap.ui.getCore().getEventBus();

			//bind location type combo box			
			var currentContext = this;

			warehouseService.getAllWarehouse(function (data) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: data[0] });
				currentContext.getView().setModel(oModel, "warehouseModel");
			});
			this.fnShortCut();
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

		onBeforeRendering: function () {
			var currentContext = this;
			this.model = this.getView().getModel("viewModel");
			var oModel = new JSONModel();
			if (this.model.id != null) {
				warehouseBinService.getWarehouseBin({ id: this.model.id }, function (data) {
					if (data) {
						oModel.setData(data[0][0]);
					}

				});
			} else {
				oModel.setData(this.model);
			}
			currentContext.getView().setModel(oModel, "warehouseBinDetailModel");

		},
		warehouseBinDetail: function (oEvent) {
			var id = oEvent.mParameters.id;
			var index = id.lastIndexOf('-');
			id = id.substring(index + 1);
			if (id == "txtWarehouseBinCode") {

				this.getView().byId("txtWarehouseBinCode").setValueState(sap.ui.core.ValueState.None);
			}
			if (id == "txtWarehouseBinName") {
				this.getView().byId("txtWarehouseBinName").setValueState(sap.ui.core.ValueState.None);
			}
		},

		handleSelectionChange: function () {
			if (id == "ddlMtxtModuleNameodule") {
				this.getView().byId("ddlMtxtModuleNameodule").setValueState(sap.ui.core.ValueState.None);
			}
		},

		onSave: function () {
			if (this.validateForm()) {
				var currentContext = this;
				var model = this.getView().getModel("warehouseBinDetailModel").oData;
				model["companyid"] = commonService.session("companyId");
				model["userid"] = commonService.session("userId");
				model["isdefault"] = 0;

				warehouseBinService.saveWarehouseBin(model, function (data) {
					if (data.id > 0) {
						currentContext.onCancel();
						MessageToast.show("Data saved successfully");
						currentContext.bus = sap.ui.getCore().getEventBus();
						currentContext.bus.publish("onWarehouseBinAdd", "onWarehouseBinAdd", { data: model });
					}
				});
			}
		},

		validateForm: function () {
			var isValid = true;
			var warehouseBinCode = "Warehouse bin code id required.";
			var warehouseBinName = "Warehouse bin name id required."
			if (!commonFunction.isRequired(this, "txtWarehouseBinCode", warehouseBinCode))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtWarehouseBinName", warehouseBinName))
				isValid = false;


			return isValid;
		},


		onDelete: function () {
			var currentContext = this;
			if (this.model != undefined) {
				MessageBox.confirm(
					"Are yoy sure you want to delete?", {
					styleClass: "sapUiSizeCompact",
					onClose: function (sAction) {
						if (sAction == "OK") {
							warehouseBinService.deleteWarehouseBin(currentContext.model, function (data) {
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
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---warehousemaster--fclWarehouseMaster");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}
	});
}, true);
