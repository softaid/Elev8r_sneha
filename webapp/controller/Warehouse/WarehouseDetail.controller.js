sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/elev8rerp/componentcontainer/services/Warehouse/Warehouse.service',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function'

], function (JSONModel, BaseController, MessageToast, MessageBox, warehouseService, commonService, commonFunction) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Warehouse.WarehouseDetail", {
		onInit: function () {
			// //bind country type combo box			
			var currentContext = this;
			commonService.getAllCountries(function (data) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: data[0] });
				currentContext.getView().setModel(oModel, "countryModel");
			});
			//Load module references
			commonFunction.getReference("ModName", "moduleModel", this);
			// Load location list
			commonFunction.getLocationList(currentContext);
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

		getCountry: function () {

			var currentContext = this;
			var cid = currentContext.getView().byId("txtcountry").getSelectedKey();
			cid = parseInt(cid);


			commonService.getStatesByCountryid({ countryid: cid }, function (data) {
				if (data[0].length > 0) {
					var sModel = new sap.ui.model.json.JSONModel();
					sModel.setData({ modelData: data[0] });
					currentContext.getView().setModel(sModel, "stateModel");
				} else {
					MessageBox.error("State not available for selected country.")
				}
			});
			currentContext.getView().byId("txtcountry").setValueState(sap.ui.core.ValueState.None);
		},

		getState: function () {
			var currentContext = this;
			var sid = currentContext.getView().byId("txtstate").getSelectedKey();
			sid = parseInt(sid);
			commonService.getCitiesByStateid({ stateid: sid }, function (data) {
				if (data[0].length > 0) {
					var cModel = new sap.ui.model.json.JSONModel();
					cModel.setData({ modelData: data[0] });
					currentContext.getView().setModel(cModel, "cityModel");
				} else {

					MessageBox.error("City not available for selected state.")

				}
			});

			currentContext.getView().byId("txtstate").setValueState(sap.ui.core.ValueState.None);
		},
		getcity: function () {
			this.getView().byId("txtcity").setValueState(sap.ui.core.ValueState.None);
		},

		handleSelectionFinish: function (oEvent) {
			var inputId = oEvent.mParameters.id;
			var id = inputId.substring(inputId.lastIndexOf('-') + 1);

			var selectedItems = oEvent.getParameter("selectedItems");
			var moduleids = "";

			for (var i = 0; i < selectedItems.length; i++) {

				moduleids += selectedItems[i].getKey();

				if (i != selectedItems.length - 1) {
					moduleids += ",";
				}
			}
			var model = this.getView().getModel("warehouseDetailModel")
			model.oData.moduleid = moduleids;
		},

		onBeforeRendering: function () {
			var currentContext = this;
			commonFunction.getReference("BrdName", "selectModel", this);
			commonFunction.getLocationList(currentContext);
			this.model = this.getView().getModel("viewModel");
			var oModel = new JSONModel();

			if (this.model.id != null) {
				warehouseService.getWarehouse({ id: this.model.id }, function (data) {
					if (data) {
						data[0][0].active = data[0][0].active == 1 ? true : false;
						oModel.setData(data[0][0]);

						currentContext.moduleIds = data[0][0].moduleid;
						var moduleArray = data[0][0].moduleid.split(',');
						currentContext.getView().byId("ddlMtxtModuleNameodule").setSelectedKeys(moduleArray);
						currentContext.getCountry();
						currentContext.getState();
					}

				});
			} else {
				oModel.setData(this.model);
			}
			currentContext.getView().setModel(oModel, "warehouseDetailModel");
		},

		// location value help
		handleLocationValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog

			this._valueHelpDialog = sap.ui.xmlfragment(
				"sap.ui.elev8rerp.componentcontainer.fragmentview.Common.LocationDialog",
				this
			);
			this.getView().addDependent(this._valueHelpDialog);

			// open value help dialog filtered by the input value
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
				var oModel = currentContext.getView().getModel("warehouseDetailModel");

				//update existing model to set locationid
				oModel.oData.locationid = selRow[0].id;
				oModel.oData.locationname = selRow[0].locationname;

				oModel.refresh();
			} else {

			}
			currentContext.getView().byId("txtLocation").setValueState(sap.ui.core.ValueState.None);

		},

		onSave: function () {
			if (this.validateForm()) {
				var currentContext = this;
				var model = this.getView().getModel("warehouseDetailModel").oData;
				model["companyid"] = commonService.session("companyId");
				model["userid"] = commonService.session("userId");
				warehouseService.saveWarehouse(model, function (data) {
					if (data.id > 0) {
						currentContext.onCancel();
						MessageToast.show("Data saved successfully");
						currentContext.bus = sap.ui.getCore().getEventBus();
						currentContext.bus.publish("onWarehouseAdd", "onWarehouseAdd", { data: model });
					}
				});
			}
		},
		zipcodechange: function () {
			var isValid = true
			if (!commonFunction.isNumber(this, "txtzipcode"))
				isValid = false;
			this.getView().byId("txtzipcode").setValueState(sap.ui.core.ValueState.None);

			return isValid
		},

		validateForm: function () {
			var isValid = true;

			var CodeMsg = "Warehouse code is required";
			var NameMsg = "Warehouse name is required";
			var shipToMsg = "Ship to address  is required";
			var addressMsg = "Address  is required";
			var countryMsg = "Country is required."
			var stateMsg = "State is required."
			var cityMsg = "City is required."
			var locationMsg = "Location is required."
			var moduleName = "Module Name is required."
			var zipCode = "Zip Code is required."

			if (!commonFunction.isRequired(this, "txtWarehouseCode", CodeMsg))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtWarehouseName", NameMsg))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtShiptoName", shipToMsg))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtLocation", locationMsg))
				isValid = false;

			if (!commonFunction.ismultiComRequired(this, "ddlMtxtModuleNameodule", moduleName))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtAddress", addressMsg))
				isValid = false;

			if (!commonFunction.isSelectRequired(this, "txtcountry", countryMsg))
				isValid = false;

			if (!commonFunction.isSelectRequired(this, "txtstate", stateMsg))
				isValid = false;

			if (!commonFunction.isSelectRequired(this, "txtcity", cityMsg))
				isValid = false;
			if (!commonFunction.isRequired(this, "txtzipcode", zipCode))
				isValid = false;
			if (!commonFunction.isPostalCode(this, "txtzipcode", zipCode))
				isValid = false;	
			if (!this.zipcodechange())
				isValid = false;

			return isValid;
		},

		handleSelectionChange: function () {
			this.getView().byId("ddlMtxtModuleNameodule").setValueState(sap.ui.core.ValueState.None);
		},


		onDelete: function () {
			var currentContext = this;
			if (this.model != undefined) {
				MessageBox.confirm(
					"Are yoy sure you want to delete?", {
					styleClass: "sapUiSizeCompact",
					onClose: function (sAction) {
						if (sAction == "OK") {
							warehouseService.deleteWarehouse(currentContext.model, function (data) {
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
		},


	});
}, true);
