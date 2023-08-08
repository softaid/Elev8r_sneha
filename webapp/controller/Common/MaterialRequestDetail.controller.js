sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageBox',
	'sap/m/MessageToast',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',



], function (JSONModel, BaseController, MessageBox, MessageToast, commonFunction) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Common.InventoryRequestDetail", {
		onInit: function () {

			//item group help box
			commonFunction.getItemGroups(this, "itemGroupModel");

		},

		itemgroupSelect: function () {
			var itemgroupid = this.getView().byId("txtItemGroup").getSelectedKey();
			commonFunction.getItemsByItemGroups(itemgroupid, this, "itemList");
		},

		onBeforeRendering: function () {
			this.model = this.getView().getModel("viewModel");
			var oModel = new JSONModel();
			if (this.model != undefined) {
				oModel.setData(this.model);
				commonFunction.getItemsByItemGroups(this.model.itemgroupid, this, "itemList");
			}

			this.getView().setModel(oModel, "inventoryRequestDetailModel");
		},

		// item value help
		handleItemValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			this._valueHelpDialog = sap.ui.xmlfragment(
				"sap.ui.elev8rerp.componentcontainer.fragmentview.Common.ItemDialog",
				this
			);
			this.getView().addDependent(this._valueHelpDialog);

			// open value help dialog filtered by the input value
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

			if (aContexts != undefined) {
				var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
				var oModel = currentContext.getView().getModel("inventoryRequestDetailModel");
				//update existing model to set settingno
				oModel.oData.itemid = selRow[0].id,
					oModel.oData.itemname = selRow[0].itemname;
				oModel.oData.unitid = selRow[0].itemunitid;
				oModel.oData.itemcode = selRow[0].itemcode;
				oModel.oData.unit = selRow[0].itemunitname;
				oModel.refresh();

			}
		},

		onSave: function () {

			if (this.validateForm()) {
				var model = this.getView().getModel("inventoryRequestDetailModel").oData;
				var fertility = (model.samplequantity) - (model.trueinfertile);
				var fertilityPercentage = (fertility / model.samplequantity) * 100;
				model.fertility = fertility;
				model.fertilitypercentage = fertilityPercentage;

				if (model.id == null && (model["status"] == "Edited" || model["status"] == "New"))
					model["status"] = "New";
				else
					model["status"] = "Edited";

				// pass model to parent(CandlingTest) controller to save
				this.bus = sap.ui.getCore().getEventBus();

				this.bus.publish("materialtransfer", "onMaterialRequestAdd", { data: model });
				this.onCancel();
			}
		},

		onDelete: function () {
			// var currentContext = this;

			// MessageBox.confirm(
			// 	"Are you sure you want to delete?", {
			// 	styleClass:  "sapUiSizeCompact",
			// 	onClose: function(sAction){
			// 		if(sAction == "OK"){

			// 			if(currentContext.model.id != null) {
			// 				var model = {
			// 					id : currentContext.model.id,
			// 					companyid : commonFunction.session("companyId"),
			// 					userid : commonFunction.session("userId")
			// 				};

			// 				candlingTestService.deleteCandlingTest(model, function(data){						
			// 					currentContext.bus = sap.ui.getCore().getEventBus();
			// 					currentContext.bus.publish("candlingtestmaster", "onTestDelete", {data : currentContext.model });
			// 					currentContext.onCancel();
			// 					MessageToast.show("Candling test deleted successfully!");
			// 				});
			// 			}
			// 			else{
			// 				currentContext.bus = sap.ui.getCore().getEventBus();
			// 				currentContext.bus.publish("candlingtestmaster", "onTestDelete", {data : currentContext.model });
			// 				currentContext.onCancel();
			// 				MessageToast.show("Candling test deleted successfully!");
			// 			}
			// 		}		
			// 	}
			// });          
		},

		validateForm: function () {
			var isValid = true;

			if (!commonFunction.isRequired(this, "txtItem", "Please select an item."))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtQuantity", "please enter a quantity."))
				isValid = false;

			return isValid;
		},

		onNumberInputChange: function (oEvent) {
			var inputId = oEvent.getParameter('id');
			commonFunction.isNumber(this, inputId);
		},

		checkQuantity: function (settingQuantity, sampleQuantity) {

		},

		onCancel: function () {
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---materialrequestandtransfer--fclMaterialRequestTransfer");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}
	});
}, true);
