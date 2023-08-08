sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/Common/MaterialTransfer.service',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',

], function (JSONModel, BaseController, MessageToast, MessageBox, commonFunction, materialTransferService, commonService) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Common.MaterialTransferDetail", {
		onInit: function () {
			//item group help box
			commonFunction.getItemGroups(this, "itemGroupModel");

		},

		itemgroupSelect: function () {
			var itemgroupid = this.getView().byId("txtItemGroup").getSelectedKey();
			commonFunction.getItemsByItemGroups(itemgroupid, this, "itemList");
		},

		onBeforeRendering: function () {
			commonFunction.getItemGroups(this, "itemGroupModel");

			this.model = this.getView().getModel("viewModel");
			var oModel = new JSONModel();
			if (this.model != undefined) {
				oModel.setData(this.model);
				this.getView().setModel(oModel, "materialTransferDetailModel");
				if (this.model.requestdetailid != null || this.model.requestid != null) {
					// this.getView().byId("btnSave").setEnabled(false);
					this.getView().byId("txtItemUnit").setEnabled(false);
					this.getView().byId("txtRequestedQuantity").setEnabled(false);
					// this.getView().byId("txtItemGroup").setEnabled(false);
				} else {
					this.getView().byId("txtRequestedQuantity").setVisible(false);
				}
				commonFunction.getItemsByItemGroups(this.model.itemgroupid, this, "itemList");
			}

			if (this.model.itemid != undefined) {
				var sModel = {
					itemid: this.model.itemid,
					warehouseid: this.model.fromwarehouseid,
					warehousebinid: this.model.fromwarehousebinid,
					companyid: commonFunction.session("companyId"),
					status: this.model.status
				}
				this.getItemLiveStock(sModel);
			}

			this.getView().setModel(oModel, "materialTransferDetailModel");

			var pModel = this.getView().getModel("materialTransferDetailModel");

			if (this.model.chkWithRequest == false) {
				this.getView().byId("txtRequestedQuantityEle").setVisible(false);
				pModel.oData.requestedquantity = 0;
			} else {
				this.getView().byId("txtRequestedQuantityEle").setVisible(true);
			}
		},

		getItemLiveStock: function (model) {
			var currentContext = this;
			commonService.getItemBatchbyitemid(model, function (data) {
				var oModel = currentContext.getView().getModel("materialTransferDetailModel");
				var batchModel = new sap.ui.model.json.JSONModel();
				if (data.length != 0) {
					if (data[0].length > 0) {
						currentContext.getView().byId("btnSave").setEnabled(true);
						var instock = 0
						for (var i = 0; data[0].length > i; i++) {
							var parts = data[0][i].collectiondate.split('/');
							var d1 = Number(parts[2] + parts[1] + parts[0]);
							var parts1 = oModel.oData.transferdate.split('/');
							var d2 = Number(parts1[2] + parts1[1] + parts1[0]);
							if (d1 <= d2)
								instock += parseFloat(data[0][i].batch_qty);
						} if (instock != 0) {
							batchModel.setData({ modelData: data[0] });
							currentContext.getView().setModel(batchModel, "itemBatchList");
							oModel.oData.instock = parseFloat(instock).toFixed(3);
							oModel.refresh();
						} else {
							MessageBox.error("item Batch not fount for this item.")
							currentContext.getView().byId("btnSave").setEnabled(false);
						}

					} else {
						MessageBox.error("item Batch not fount for this item.")
						currentContext.getView().byId("btnSave").setEnabled(false);
					}
				}
			});

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
				var oModel = currentContext.getView().getModel("materialTransferDetailModel");
				//update existing model to set settingno
				oModel.oData.itemid = selRow[0].id,
					oModel.oData.itemname = selRow[0].itemname;
				oModel.oData.unitid = selRow[0].itemunitid;
				oModel.oData.unit = selRow[0].itemunitname;
				oModel.refresh();

				currentContext.getView().byId("txtItemId").setValueState(sap.ui.core.ValueState.none);

				var model = {
					itemid: selRow[0].id,
					warehouseid: oModel.oData.fromwarehouseid,
					warehousebinid: oModel.oData.fromwarehoussebinid,
					companyid: commonFunction.session("companyId")
				}
				currentContext.getItemLiveStock(model);
			}
		},

		onSave: function () {

			if (this.validateForm()) {
				var model = this.getView().getModel("materialTransferDetailModel").oData;
				model["companyid"] = commonFunction.session("companyId");
				model["userid"] = commonFunction.session("userId");
				if (model.id == null && (model["status"] == "Edited" || model["status"] == "New"))
					model["status"] = "New";
				else
					model["status"] = "Edited";

				// pass model to parent(MaterialTransfer) controller to save
				this.bus = sap.ui.getCore().getEventBus();
				this.bus.publish("materialtransfer", "onItemDetailAdd", { data: model });
				this.onCancel();
			}
		},

		onDelete: function () {
			var currentContext = this;
			if (this.model != undefined) {
				var model = {
					id: this.model.id,
					companyid: commonFunction.session("companyId"),
					userid: commonFunction.session("userId")
				};

				MessageBox.confirm(
					"Are you sure you want to delete?", {
					styleClass: "sapUiSizeCompact",
					onClose: function (sAction) {
						if (sAction == "OK") {

							if (model.id != null) {
								setterService.deleteSetterSlot(model, function (data) {
								});
							}
							currentContext.bus = sap.ui.getCore().getEventBus();
							currentContext.bus.publish("settermaster", "onSlotDelete", { data: currentContext.model });
							currentContext.onCancel();
							MessageToast.show("Setter slot deleted successfully!");
						}
					}
				}
				);
			}
		},

		validateForm: function () {

			var isValid = true;
			var requestedQuantity = this.getView().byId("txtRequestedQuantity").getValue();
			var transferedQuantity = this.getView().byId("txtTransferedQuantity").getValue();
			var instock = this.getView().byId("txtStockQty").getValue();

			// if(!commonFunction.isRequired(this,"txtRequestedQuantity", "Requested quantity is required."))
			// 	isValid = false;

			if (!commonFunction.isRequired(this, "txtTransferedQuantity", "Transfered quantity is required."))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtItemId", "Item is required."))
				isValid = false;

			if (isValid) {
				// if(!commonFunction.isNumber(this, "txtRequestedQuantity"))
				// 	isValid = false;

				if (!commonFunction.isDecimal(this, "txtTransferedQuantity"))
					isValid = false;

				if (!this.checkQuantity(requestedQuantity, transferedQuantity, instock))
					isValid = false;
			}

			return isValid;
		},

		onQuantityChange: function (oEvent) {
			var requestedQuantity = this.getView().byId("txtRequestedQuantity").getValue();
			var transferedQuantity = this.getView().byId("txtTransferedQuantity").getValue();
			var instockqty = this.getView().byId("txtStockQty").getValue();
			var inputId = oEvent.getParameter("id");
			inputId = inputId.substring(inputId.lastIndexOf('-') + 1);

			if (parseFloat(transferedQuantity) > 0) {
				this.setItembatch();
			}
			if (parseFloat(transferedQuantity))

				var message = inputId == "txtRequestedQuantity" ? "Requested quantity is required." : "Transfered quantity is required.";
			if (commonFunction.isRequired(this, inputId, message)) {
			}


			if (!this.checkQuantity(requestedQuantity, transferedQuantity, instockqty)) {

				if (this.model.chkWithRequest == true) {
					MessageBox.error("Transfered quantity should be less than requested quantity and instock quantity.");
				} else {
console.log("in")
					MessageBox.error("Transfered quantity should be less than instock quantity.");
				}
			}

		},

		onWeightChange : function(oEvent){
			let weight = oEvent.getParameter("value");
			var transferedQuantity = this.getView().byId("txtTransferedQuantity").getValue();
			let model = this.getView().getModel("materialTransferDetailModel");

			if(transferedQuantity != null || transferedQuantity != ""){
				model.oData.avgweight = (parseFloat(weight) / parseFloat(transferedQuantity));
				model.refresh();
			}

		},

		setItembatch: function () {
			var totalCost = 0;
			var issueqty = this.getView().byId("txtTransferedQuantity").getValue();
			var remainingQty = issueqty;
			var arr = [];
			var batchModel = this.getView().getModel("itemBatchList").oData.modelData;

			for (var j = 0; batchModel.length > j; j++) {
				if (remainingQty > 0) {
					if (remainingQty > batchModel[j].batch_qty) {
						arr.push({
							batchqty: batchModel[j].batch_qty,
							batch_unitcost: batchModel[j].batch_unitcost,
							itembatch: batchModel[j].itembatch,
							actualBatchQty: batchModel[j].batch_qty,
							itemid: batchModel[j].itemid


						});
						remainingQty = issueqty - batchModel[j].batch_qty;
					} else {
						arr.push({
							batchqty: remainingQty,
							batch_unitcost: batchModel[j].batch_unitcost,
							itembatch: batchModel[j].itembatch,
							actualBatchQty: batchModel[j].batch_qty,
							itemid: batchModel[j].itemid

						});
						remainingQty = 0;
					}
				}
			}

			var itembatcstr = null;
			for (var i = 0; arr.length > i; i++) {
				totalCost += parseFloat(arr[i].batchqty * arr[i].batch_unitcost)
				if (i == 0) {
					itembatcstr = arr[i].itembatch;
				} else {
					itembatcstr = itembatcstr + "," + arr[i].itembatch;
				}
			}
			var model = this.getView().getModel("materialTransferDetailModel").oData;
			model.itembatch = itembatcstr;
		},

		checkQuantity: function (requestedQuantity, transferedQuantity, instock) {
			
			if (requestedQuantity != "" && requestedQuantity != 0 && transferedQuantity != "") {
				if (this.model.chkWithRequest == true) {
					if (parseInt(requestedQuantity) < parseInt(transferedQuantity)) {
						this.getView().byId("txtTransferedQuantity").setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("txtTransferedQuantity").setValueStateText("Transfered quantity should be less than requested quantity.")
						return false;
					}
				}
			}

			if (parseInt(instock) < parseInt(transferedQuantity)) {
				this.getView().byId("txtTransferedQuantity").setValueStateText("Transfered quantity should be less than instock quantity.")
				return false;
			}


			return true;
		},

		onCancel: function () {
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---materialrequestandtransfer--fclMaterialRequestTransfer");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}
	});
}, true);
