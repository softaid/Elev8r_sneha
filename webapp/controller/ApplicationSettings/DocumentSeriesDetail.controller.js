sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/core/ValueState',
	'sap/ui/elev8rerp/componentcontainer/services/FinancialYearDocSeries.service',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function'

], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, MessageToast, MessageBox, ValueState, documentseriesService, commonFunction) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.ApplicationSettings.DocumentSericeDetail", {
		onInit: function () {
			var currentContext = this;
			this.bus = sap.ui.getCore().getEventBus();

			// Attaches validation handlers
			sap.ui.getCore().attachValidationError(function (oEvent) {
				oEvent.getParameter('element').setValueState(ValueState.Error);
			});

			sap.ui.getCore().attachValidationSuccess(function (oEvent) {
				oEvent.getParameter('element').setValueState(ValueState.None);
			});

		},

		onBeforeRendering: function () {
			var currentContext = this;
			this.model = this.getView().getModel("viewModel");

			var oModel = new JSONModel();
			if (this.model != undefined) {
				oModel.setData(this.model);
			}

			currentContext.getView().setModel(oModel, "edtDocumentseriesModel");
		},

		// get resource Model
		resourcebundle: function () {
			var oBundle = this.getModel("i18n").getResourceBundle();
			return oBundle
		},

		onSave: function () {
			var currentContext = this;

			if (this.validateForm()) {
				var model = this.getView().getModel("edtDocumentseriesModel").oData;
				model["companyid"] = commonFunction.session("companyId");
				model["userid"] = commonFunction.session("userId");

				var zerolength = model["length"] - (model["prefix"].length + model["startwith"].length);
				
				var zeros = "";
				for(var i=0;i<zerolength;i++){
					zeros += "0".toString();
				}

				var numSeries = model["prefix"] + zeros + model["startwith"];

				MessageBox.confirm(
					"Document series will not be modified once it is created.\n Number series will be look like - "+numSeries +" \nDo you want to submit it now? ", {
						styleClass: "sapUiSizeCompact",
						onClose: function (sAction) {
							if (sAction == "OK") {

								documentseriesService.saveFinancialYearDocSeries(model, function (data) {
									if (data.id > 0) {
										currentContext.onCancel();
										MessageToast.show("Document series data submitted!");
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

		onDelete: function () {
			var currentContext = this;
			if (this.model != undefined) {
				this.model["companyid"] = commonFunction.session("companyId");
				this.model["userid"] = commonFunction.session("userId");

				var deleteMsg = this.resourcebundle().getText("deleteMsg");
				var OKText = this.resourcebundle().getText("OKText")
				var HatchDelete = this.resourcebundle().getText("hatcherDetailDocumentSeriesDelete")

				MessageBox.confirm(
					deleteMsg, {
						styleClass: "sapUiSizeCompact",
						onClose: function (sAction) {
							if (sAction == OKText) {
								documentseriesService.deleteDocumentSeries(currentContext.model, function (data) {
									if (data) {
										currentContext.onCancel();
										MessageToast.show(HatchDelete);
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

		validateForm: function () {
			var isValid = true;

			if (!commonFunction.isRequired(this, "txtDocName", "Document name is required!"))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtDocCode", "Document code is required!"))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtLength", "Length is required!"))
				isValid = false;

			if(this.getView().byId("txtLength").getValue() !="")
				if(!commonFunction.isNumberGreaterThanZero(this, "txtLength"))
					isValid = false;

			if (!commonFunction.isRequired(this, "txtStartWith", "Start Number is required!"))
				isValid = false;

			if(this.getView().byId("txtStartWith").getValue() !="")
				if(!commonFunction.isNumberGreaterThanZero(this, "txtStartWith"))
					isValid = false;
				

			if (!commonFunction.isRequired(this, "txtEndTo", "End Number is required!"))
				isValid = false;

			if(this.getView().byId("txtEndTo").getValue() !="")
				if(!commonFunction.isNumberGreaterThanZero(this, "txtEndTo"))
					isValid = false;

			if (!commonFunction.isRequired(this, "txtPrefix", "Status is required!"))
				isValid = false;

			if(isValid){
				var model = this.getView().getModel("edtDocumentseriesModel").oData;
		
				if(model["startwith"].length > model["endto"].length){
					MessageBox.error("Start Number must be greater than End Number.");						
				}
				else if(model["length"] < model["endto"].length + model["prefix"].length){
					MessageBox.error("Sum of end number length and Prefix length must be greater than or equal to Length value.");						
				}
			}
			return isValid;
		},

		onCancel: function () {
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---documentseries--fclDocumentSeries");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}

	});

}, true);
