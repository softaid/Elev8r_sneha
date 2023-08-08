sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/elev8rerp/componentcontainer/services/Masters/ItemGroup.service',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',

], function (JSONModel, BaseController, MessageToast, MessageBox, itemgroupService, commonService, commonFunction) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Masters.ItemGroupDetail", {
		onInit: function () {
			this.fnShortCut();
		},

		onBeforeRendering: function () {
			var currentContext = this;
			this.model = this.getView().getModel("viewModel");
			var oModel = new JSONModel();

			if (this.model != undefined) {
				itemgroupService.getItemGroup(this.model, function (data) {
					if (data[0][0].moduleid != null) {
						currentContext.moduleIds = data[0][0].moduleid;
						var moduleArray = data[0][0].moduleid.split(',');
						currentContext.getView().byId("ddlMtxtModuleNameodule").setSelectedKeys(moduleArray);
					}

					oModel.setData(data[0][0]);
					oModel.oData.enabled = false;
					oModel.refresh();
				});
			} else {
				oModel.oData.enabled = true;
				oModel.refresh();
			}
			currentContext.getView().setModel(oModel, "editItemGroupModel");
			//Load module references
			commonFunction.getReference("ModName", "moduleModel", this);
			commonFunction.getReference("ItemGrpoupType", "groupTypeList", this);
		},

		fnShortCut: function () {
			var currentContext = this;
			$(document).keydown(function (evt) {
			// 	if (evt.keyCode == 83 && (evt.altKey)) {
			// 		evt.preventDefault();
			// 		jQuery(document).ready(function ($) {
			// 			currentContext.onSave();
			// 		})
			// 	}
				if (evt.keyCode == 69 && (evt.altKey)) {
					evt.preventDefault();
					jQuery(document).ready(function ($) {
						currentContext.onCancel();
					})
				}
			});
		},


		handleSelectionChange: function () {
			this.getView().byId("ddlMtxtModuleNameodule").setValueState(sap.ui.core.ValueState.None);
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
			var model = this.getView().getModel("editItemGroupModel")
			model.oData.moduleid = moduleids;
		},

		getValidId: function (oEvent) {
			var id = oEvent.mParameters.id;
			var index = id.lastIndexOf('-');
			id = id.substring(index + 1);
			if (id == "txtItemGroupName") {

				this.getView().byId("txtItemGroupName").setValueState(sap.ui.core.ValueState.None);
			}
			if (id == "txtItemSeriesStartWith") {
				this.getView().byId("txtItemSeriesStartWith").setValueState(sap.ui.core.ValueState.None);
			}
			if (id == "txtItemSeriesPrefix") {

				this.getView().byId("txtItemSeriesPrefix").setValueState(sap.ui.core.ValueState.None);
			}
			if (id == "txtItemSeriesSeparator") {
				this.getView().byId("txtItemSeriesSeparator").setValueState(sap.ui.core.ValueState.None);
			}
		},

		onSave: function () {
			if (this.validateForm()) {
				var currentContext = this;
				var model = this.getView().getModel("editItemGroupModel").oData;
				model["companyid"] = commonService.session("companyId");
				model["userid"] = commonService.session("userId");
				itemgroupService.saveItemGroup(model, function (data) {
					if (data.id > 0) {
						currentContext.onCancel();
						MessageToast.show("Item Group Save successfully!");
						currentContext.bus = sap.ui.getCore().getEventBus();
						currentContext.bus.publish("loaddata", "loadData");
					}
						else if(data.id == -1){
						
						MessageToast.show("itemgroup is already exist.");
					}
				});
			}
		},
		validateForm: function () {
			var isValid = true;
			var moduleName = "Module name is required";
			var GrroupMsg = "Group name is required.";
			var seriesMsg = "Series start with is required.";
			var SeriesPreoMsg = "Series Prefix  is required.";
			var SeriesSeparatorMsg = "Series separator  is required.";
			if (!commonFunction.ismultiComRequired(this, "ddlMtxtModuleNameodule", moduleName))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtItemGroupName", GrroupMsg))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtItemSeriesStartWith", seriesMsg))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtItemSeriesPrefix", SeriesPreoMsg))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtItemSeriesSeparator", SeriesSeparatorMsg))
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
							itemgroupService.deleteItemGroup(currentContext.model, function (data) {
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
