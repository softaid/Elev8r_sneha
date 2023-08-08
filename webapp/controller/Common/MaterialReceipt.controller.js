sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageBox',
	'sap/m/MessageToast',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/Common/MaterialReceipt.service',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/ui/elev8rerp/componentcontainer/utility/Validator',
], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, MessageBox, MessageToast, commonFunction, materialReceiptService, commonService, Validator) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Common.MaterialReceipt", {

		onInit: function () {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("materialreceipt", "setDetailPage", this.setDetailPage, this);
			this.oFlexibleColumnLayout = this.byId("fclMaterialReceipt");

			var currentContext = this;
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("onMaterialReceiptAdd", "onMaterialReceiptAdd", this.onMaterialReceiptAdd, this);
			this.bus.subscribe("onMaterialReceiptDelete", "onMaterialReceiptDelete", this.onMaterialReceiptDelete, this);

			// bind hatcher batch list dialog					
			this.loadDialogList();

			//get status
			commonFunction.getReference("MtrReceiptStatus", "materialReceiptStatusList", this);
			commonFunction.getReference("MtrReceiptType", "materialReceiptTypeList", this);
			// set empty model to view 
			var emptyModel = this.getModelDefault();

			var model = new JSONModel();
			model.setData(emptyModel);
			this.getView().setModel(model, "materialReceiptModel");

			// set empty model to view		
			var model = new JSONModel();
			model.setData({ modelData: [] });
			this.getView().setModel(model, "tblModel");
		},

		getModelDefault: function () {
			var receiptdate = Date();
			return {
				id: null,
				batchid: null,
				statusid: null,
				receipttype: null,
				receiptdate: this.getDateFromDB(receiptdate),
				remark: null
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

		typeSelected: function (oEvent) {
			var currentContext = this;
			var key = oEvent.getParameter("selectedItem").getKey();
			if (key == 342) {
				materialReceiptService.getAllMaterialReceiptHatcherBatches(function (data) {
					var hatcherBatchModel = new sap.ui.model.json.JSONModel();
					hatcherBatchModel.setData({ modelData: data[0] });
					currentContext.getView().setModel(hatcherBatchModel, "hatcherBatchModel");
				});
			}
		},

		//hatcher batch dialog
		handleHatcherBatchValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			this._valueHelpDialog = sap.ui.xmlfragment(
				"sap.ui.elev8rerp.componentcontainer.fragmentview.Hatchery.Transaction.ForSetter.TransferToHatcherDialog",
				this
			);
			this.getView().addDependent(this._valueHelpDialog);
			this._valueHelpDialog.open(sInputValue);
		},

		handleSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['hatchername', 'hatchingbatchdate'];
			var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
			}),
				false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleClose: function (oEvent) {
			var currentContext = this;
			var aContexts = oEvent.getParameter("selectedContexts");

			if (aContexts != undefined) {
				var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
				var oModel = currentContext.getView().getModel("materialReceiptModel");
				oModel.oData.batchid = selRow[0].hatcherbatchno;

				oModel.refresh();
			}
		},

		onExit: function () {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
		},

		onMaterialReceiptAdd: function (sChannel, sEvent, oData) {
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


		validateForm: function () {
			var isValid = true;

			if (!commonFunction.isRequired(this, "txtStatus", "Please select status!"))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtType", "Please select receipt type!"))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtPostingDate", "Please select posting date!"))
				isValid = false;

			return isValid;
		},

		onSave: function () {
			var isValid = this.validateForm();
			if (isValid) {
				var currentContext = this;
				var parentModel = this.getView().getModel("materialReceiptModel").oData;
				var childModel = this.getView().getModel("tblModel").oData.modelData;

				var companyId = commonService.session("companyId");
				var userId = commonService.session("userId");
				parentModel["companyid"] = companyId;
				parentModel["userid"] = userId;
				parentModel["receiptdate"] = commonFunction.getDate(parentModel["receiptdate"]);
				parentModel["createdby"] = userId;
				materialReceiptService.saveMaterialReceipt(parentModel, function (data) {
					if (data.id > 0) {
						var materialreceiptid = data.id;

						// insert/edit record in child table 
						for (var i = 0; i < childModel.length; i++) {

							if (childModel[i]["id"] == null)
								childModel[i]["materialreceiptid"] = materialreceiptid;
							childModel[i]["companyid"] = companyId;
							childModel[i]["userid"] = userId;
							materialReceiptService.saveMaterialReceiptDetail(childModel[i], function (data) {
								currentContext.loadDialogList();
							});
							// }			
						}
					}
				});

				MessageToast.show("Hatcher batch saved successfully.");
				currentContext.resetModel();
				this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
			} else {
				MessageToast.show("Please enter hatcher batch details!");
			}

		},

		resetModel: function () {
			this.closeDetailPage();
			var emptyModel = this.getModelDefault();
			var model = this.getView().getModel("materialReceiptModel");
			model.setData(emptyModel);

			var tbleModel = this.getView().getModel("tblModel");
			tbleModel.setData({ modelData: [] });

			this.getView().byId("btnAdd").setEnabled(false);
			this.getView().byId("btnSave").setEnabled(false);

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
			var parentModel = this.getView().getModel("materialReceiptModel").oData;
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
			this.bus.publish("materialreceipt", "setDetailPage", { viewName: "MaterialReceiptDetail" });
		},

		onListIconPress: function (oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("sap.ui.elev8rerp.componentcontainer.fragmentview.Common.MaterialReceiptDialog", this);
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

		handleSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['receiptdate'];
			var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
			}),
				false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		onMaterialReceiptDialogClose: function (oEvent) {
			var receiptdate = Date();
			var currentContext = this;

			var aContexts = oEvent.getParameter("selectedContexts");
			var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
			this.getView().byId("txtType").setValue(selRow[0].receipttypename);
			this.getView().byId("txtHatcherBatch").setValue(selRow[0].batchid);
			this.getView().byId("txtStatus").setValue(selRow[0].refname);
			this.getView().byId("txtPostingDate").setValue(selRow[0].receiptdate);
			this.getView().byId("txtDocDate").setValue(selRow[0].approveddate);
			this.getView().byId("txtRemark").setValue(selRow[0].remark);

			this.bindTable(selRow[0].id);

		},

		bindTable: function (materialreceiptid) {
			var currentContext = this;
			materialReceiptService.getAllMaterialReceiptDetail({ materialreceiptid: materialreceiptid }, function (data) {
				if (data[0].length > 0) {
					var oModel = currentContext.getView().getModel("tblModel");
					oModel.setData({ modelData: data[0] });
					oModel.refresh();
				}
				else {
					var oModel = currentContext.getView().getModel("tblModel");
					oModel.setData({ modelData: [] });
					oModel.refresh();
				}
			})
			this.getView().byId("btnAdd").setEnabled(true);
			this.getView().byId("btnSave").setEnabled(true);
		},

		onListItemPress: function (oEvent) {
			var currentContext = this;
			var viewModel = oEvent.getSource().getBindingContext("tblModel");
			var oModel = currentContext.getView().getModel("materialReceiptModel").oData;
			var model = {
				id: viewModel.getProperty("id") ? viewModel.getProperty("id") : null,
				itemid: viewModel.getProperty("itemid"),
				itemname: viewModel.getProperty("itemname"),
				receiptquantity: viewModel.getProperty("receiptquantity"),
				unitname: viewModel.getProperty("refname"),
				unitcost: viewModel.getProperty("unitcost"),
				totalcost: viewModel.getProperty("totalcost"),
				locationname: viewModel.getProperty("locationname"),
				warehousename: viewModel.getProperty("warehousename"),
			};
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("materialreceipt", "setDetailPage", { viewName: "MaterialReceiptDetail", viewModel: model });
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


		loadDialogList: function () {
			var currentContext = this;
			materialReceiptService.getAllMaterialReceipt(function (data) {
				var materialReceiptsModel = new sap.ui.model.json.JSONModel();
				materialReceiptsModel.setData({ modelData: data[0] });
				currentContext.getView().setModel(materialReceiptsModel, "materialReceiptsModel");
				//
			});
		},

		closeDetailPage: function () {
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		},


		onCancel: function () {
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---materialreceipt--fclMaterialReceipt");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}
	});
}, true);
