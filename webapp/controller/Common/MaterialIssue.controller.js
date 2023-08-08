sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageBox',
	'sap/m/MessageToast',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/Common/MaterialIssue.service',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',

	'sap/ui/elev8rerp/componentcontainer/utility/Validator',
], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, MessageBox, MessageToast, commonFunction, materialIssueService, commonService, Validator) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Common.MaterialIssue", {

		onInit: function () {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("materialissue", "setDetailPage", this.setDetailPage, this);
			this.oFlexibleColumnLayout = this.byId("fclMaterialIssue");

			var currentContext = this;
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("onMaterialIssueAdd", "onMaterialIssueAdd", this.onMaterialIssueAdd, this);
			this.bus.subscribe("onMaterialIssueDelete", "onMaterialIssueDelete", this.onMaterialIssueDelete, this);

			// location help box	
			commonFunction.getLocationList(this);

			//get status
			commonFunction.getReference("MtrIssueStatus", "materialIssueStatusList", this);
			commonFunction.getReference("MtrIssueType", "MtrIssueTypeList", this);

			// set empty model to view 
			var emptyModel = this.getModelDefault();

			var model = new JSONModel();
			model.setData(emptyModel);
			this.getView().setModel(model, "materialissueModel");

			// set empty model to view		
			var model = new JSONModel();
			model.setData({ modelData: [] });
			this.getView().setModel(model, "tblModel");
		},

		getModelDefault: function () {
			var currDate = Date();
			return {
				issuedate: null,
				issuetypeid: null,
				statusid: null,
				batchid: null,
				remark: null,
				fromwarehouseid: null,
				createdby: null,
				approvedby: null,
				approveddate: null
			}
		},
		typeSelected: function (oEvent) {
			var currentContext = this;
			var key = oEvent.getParameter("selectedItem").getKey();
			var parentModel = this.getView().getModel("materialissueModel").oData;
			parentModel.issuetypeid = key;

			if (key == "382")
				materialIssueService.getmaterialIssueTypeHatcherBatch(function (data) {
					if (data[0].length > 0) {
						var model = new sap.ui.model.json.JSONModel();
						model.setData({ modelData: data[0] });
						currentContext.getView().setModel(model, "hatcherbatchModel");
					}
				});
		},

		// Hatcher batch value help
		handleHatcherBatchValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			this._valueHelpDialog = sap.ui.xmlfragment(
				"sap.ui.elev8rerp.componentcontainer.fragmentview.Common.HatcherBatchLocationDialog",
				this
			);

			this.getView().addDependent(this._valueHelpDialog);

			// create a filter for the binding
			// this._valueHelpDialog.getBinding("items").filter([new Filter(
			// 	"hatchername",
			// 	sap.ui.model.FilterOperator.Contains, sInputValue
			// )]);

			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);
		},

		handleHatcherSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['hatchername'];
			var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
			}),
				false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		onHatcherDialogClose: function (oEvent) {
			var currentContext = this;
			var aContexts = oEvent.getParameter("selectedContexts");

			// close detail page if it is open
			this.closeDetailPage();

			if (aContexts != undefined) {
				var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
				var oModel = currentContext.getView().getModel("materialissueModel");
				// var model = currentContext.getView().getModel("tblModel").oData;

				//update existing model 
				oModel.oData.batchid = selRow[0].hatcherbatchno;
				oModel.oData.hatchername = selRow[0].hatchername;
				oModel.refresh();
			}
		},

		getDateFromDB: function (dt) {
			if (dt != undefined && dt != null) {
				var selecteddate = null;
				jQuery.sap.require("sap.ui.core.format.DateFormat");

				// var oDate = new Date(dt);
				var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "dd/MM/yyyy",
					source: {
						pattern: "yyyy-MM-ddThh:mm:ss"
					}
				});
				selecteddate = dateFormat.format(new Date(dt));
				return selecteddate;
			}
			return null;
		},

		onExit: function () {
			if (this._oDialog) {
				this._oDialog.destroy();
			}

			// this.bus.unsubscribe("materialreceipt", "setDetailPage", this.setDetailPage, this);
		},

		onMaterialIssueAdd: function (sChannel, sEvent, oData) {
			var jsonStr = oData.data;
			var oModel = this.getView().getModel("tblModel");

			if (jsonStr["id"] == null) { //add new shed pen
				// push new record in object
				oModel.oData.modelData.push(jsonStr);
			}
			else {  //update existing shed pen
				var tableData = oModel.getData();
				// Find the index of the object via id
				var index = tableData.modelData
					.map(function (pen) { return pen.id; })
					.indexOf(jsonStr["id"]);

				// Replace the record in the array
				tableData.modelData.splice(index, 1, jsonStr);
			}
			oModel.refresh();

		},

		onMaterialReceiptDelete: function (sChannel, sEvent, oData) {
			var oModel = this.getView().getModel("tblModel");
			var tableData = oModel.getData();
			// Find the index of the object via id
			var index = tableData.modelData
				.map(function (pen) { return pen.hatcherbatchno; })
				.indexOf(oData.data.hatcherbatchno);

			// Replace the record in the array
			tableData.modelData.splice(index, 1);
			oModel.refresh();
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
				var oModel = currentContext.getView().getModel("materialissueModel");

				oModel.oData.locationid = selRow[0].id;
				oModel.oData.locationcode = selRow[0].locationcode;
				oModel.oData.locationname = selRow[0].locationname;

				commonService.getLocationWiseWarehouse({ locationid: selRow[0].id }, function (data) {
					if (data[0].length > 0) {
						var model = new sap.ui.model.json.JSONModel();
						model.setData({ modelData: data[0] });
						currentContext.getView().setModel(model, "warehouseList");
						currentContext.getView().byId("txtWarehouse").setEnabled(true);
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
				var oModel = currentContext.getView().getModel("materialissueModel");
				oModel.oData.fromwarehouseid = selRow[0].id;
				oModel.oData.warehousecode = selRow[0].warehousecode;
				oModel.oData.warehousename = selRow[0].warehousename;

				oModel.refresh();
			}
		},



		validateForm: function () {
			var isValid = true;

			if (!commonFunction.isRequired(this, "txtLocation", "Please select location!"))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtSetterBatch", "Please select setter batch!"))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtDate", "Please select batch date!"))
				isValid = false;

			return isValid;
		},

		onSave: function () {
			var currentContext = this;
			var parentModel = this.getView().getModel("materialissueModel").oData;
			var childModel = this.getView().getModel("tblModel").oData.modelData;
			// insert/edit record in child table 
			for (var i = 0; i < parentModel.length; i++) {
				parentModel[i].statusid = "361";
				parentModel[i].createdby = commonFunction.session("userId"),
					parentModel[i].issuedate = commonFunction.getDate(parentModel.issuedate);
				parentModel[i].approveddate = commonFunction.getDate(parentModel.approveddate);
				materialIssueService.saveMaterialIssue(parentModel[i], function (data) {

				})
			}


			MessageToast.show("Chicks pullout saved successfully.");
			currentContext.resetModel();
			// }

		},

		resetModel: function () {
			this.closeDetailPage();
			var emptyModel = this.getModelDefault();
			var model = this.getView().getModel("materialissueModel");
			model.setData(emptyModel);

			// var tbleModel = this.getView().getModel("tblModel");
			// tbleModel.setData({ modelData: [] });

			this.getView().byId("btnAdd").setEnabled(false);
			// this.getView().byId("btnSave").setEnabled(false);

		},

		getDateFromDB: function (dt) {

			if (dt != undefined && dt != null) {
				var selecteddate = null;
				jQuery.sap.require("sap.ui.core.format.DateFormat");

				// var oDate = new Date(dt);
				var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "dd/MM/yyyy",
					source: {
						pattern: "yyyy-MM-ddThh:mm:ss"
					}
				});
				selecteddate = dateFormat.format(new Date(dt));
				return selecteddate;
			}
			return null;
		},

		onDelete: function () {
			var currentContext = this;
			var parentModel = this.getView().getModel("transferToHatcherModel").oData;
			if (parentModel.id != null) {
				MessageBox.confirm(
					"Are you sure you want to delete?", {
					styleClass: "sapUiSizeCompact",
					onClose: function (sAction) {
						if (sAction == "OK") {
							transferToHatcherService.deleteHatcherBatch(parentModel.id, function (data) {
								if (data) {
									MessageToast.show("Data deleted successfully");
									currentContext.resetModel();
									currentContext.loadDialogList();
								}
							});
						}
					}
				}
				);
			}
		},


		onAddNewRow: function () {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("materialissue", "setDetailPage", { viewName: "MaterialIssueDetail" });
		},

		onListIconPress: function (oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("sap.ui.elev8rerp.componentcontainer.fragmentview.Hatchery.Transaction.ForSetter.TransferToHatcherDialog", this);
			}
			// Multi-select if required
			var bMultiSelect = !!oEvent.getSource().data("multi");
			this._oDialog.setMultiSelect(bMultiSelect);
			// Remember selections if required
			var bRemember = !!oEvent.getSource().data("remember");
			this._oDialog.setRememberSelections(bRemember);
			this.getView().addDependent(this._oDialog);
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
		},



		onListItemPress: function (oEvent) {
			var currentContext = this;
			var Model = oEvent.getSource().getBindingContext("tblModel");
			var Model = {

				issueid: Model.getProperty("issueid") ? issueid.getProperty("issueid") : null,
				itemid: Model.getProperty("itemid"),
				itemname: Model.getProperty("itemname"),
				issuequantity: Model.getProperty("issuequantity"),
				unitcost: Model.getProperty("unitcost"),
				totalcost: Model.getProperty("totalcost"),
				itemunit: Model.getProperty("itemunit"),
				itembatch: Model.getProperty("itembatch"),
			};

			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("materialissue", "setDetailPage", { viewName: "MaterialIssueDetail", viewModel: Model });
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


		closeDetailPage: function () {
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		},


		onCancel: function () {
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---transfertohatcher--fclTransferToHatcher");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}
	});
}, true);
