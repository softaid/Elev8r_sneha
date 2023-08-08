sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/Common/MaterialRequest.service',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/ui/elev8rerp/componentcontainer/formatter/fragment.formatter',

], function (JSONModel, BaseController, MessageToast, MessageBox, commonFunction, materialRequestService, commonService, formatter) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Common.MaterialRequest", {
		formatter: formatter,
		onInit: function () {

			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("materialtransfer", "onMaterialRequestAdd", this.onMaterialRequestAdd, this);
			// bind request source dropdown
			commonFunction.getReference("MtrReqTransferSrcTrgt", "sourceModel", this);

			// bind status dropdown
			commonFunction.getReference("MtrReqAndTrsfr", "statusModel", this);
			// set empty model to view for parent table 
			var emptyModel = this.getModelDefault();

			var model = new JSONModel();
			model.setData(emptyModel);
			this.getView().setModel(model, "inventoryRequestModel");

			// set empty model for child table 			
			var detailmodel = new JSONModel();
			detailmodel.setData({ modelData: [] });
			this.getView().setModel(detailmodel, "detailModel");

			// load material request dialog data
			this.loadData();
		},

		getModelDefault: function () {
			return {
				// 	id : null,
				// 	duedate : null,
				requestdate: commonFunction.setTodaysDate(new Date()),
				duedate: commonFunction.setTodaysDate(new Date()),
				fromwarehouseid: null,
				fromwarehousecode: null,
				fromwarehousename: null,
				towarehouseid: null,
				towarehousecode: null,
				towarehousename: null,
				requestsource: 501,
				requesttarget: null,
				statusid: 441
			}
		},

		onAddNew: function () {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("materialrequestandtransfer", "setDetailPage", { viewName: "MaterialRequestDetail" });
		},

		onListItemPress: function (oEvent) {
			var viewModel = oEvent.getSource().getBindingContext("detailModel");
			var spath = viewModel.sPath.split("/");
			var rowIndex = spath[spath.length - 1];
			var parentmodel = this.getView().getModel("inventoryRequestModel");
			var requestid = parentmodel.oData.requestid;

			var model = {
				// id : viewModel.getProperty("id") ? viewModel.getProperty("id") : null,
				requestdetailid: viewModel.getProperty("requestdetailid") ? viewModel.getProperty("requestdetailid") : null,
				materialrequestid: viewModel.getProperty("materialrequestid") ? viewModel.getProperty("materialrequestid") : null,
				itemid: viewModel.getProperty("itemid"),
				itemname: viewModel.getProperty("itemname"),
				unitid: viewModel.getProperty("unitid"),
				unit: viewModel.getProperty("unit"),
				requestedquantity: viewModel.getProperty("requestedquantity"),
				status: viewModel.getProperty("status") ? viewModel.getProperty("status") : null,
				itemgroupid: viewModel.getProperty("itemgroupid")

			}
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("materialrequestandtransfer", "setDetailPage", { viewName: "MaterialRequestDetail", viewModel: model });
		},

		// warehouse value help
		handleWarehouseValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();

			// create value help dialog
			this._valueHelpDialog = sap.ui.xmlfragment(
				"sap.ui.elev8rerp.componentcontainer.fragmentview.Common.WarehouseDialog",
				this
			);
			this.getView().addDependent(this._valueHelpDialog);

			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);
		},

		handleWarehouseSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['warehousecode', 'warehousename', 'locationname'];
			var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
			}),
				false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		onWarehouseDialogClose: function (oEvent) {
			var inputId = this.byId(this.inputId).sId;
			var currentContext = this;
			var aContexts = oEvent.getParameter("selectedContexts");

			inputId = inputId.substring(inputId.lastIndexOf('-') + 1);


			if (aContexts != undefined) {
				var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
				var oModel = currentContext.getView().getModel("inventoryRequestModel");

				if (inputId == "txtFromWarehouseCode") {
					oModel.oData.fromwarehouseid = selRow[0].id;
					oModel.oData.fromwarehousecode = selRow[0].warehousecode;
					oModel.oData.fromwarehousename = selRow[0].warehousename;
					this.getView().byId("txtFromWarehouseCode").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("txtFromWarehouseBinCode").setEnabled(true);
					commonFunction.getWarehousewiseWarehouseBin(selRow[0].id, this);
				}
				// else 
				if (inputId == "txtToWarehouseCode") {
					oModel.oData.towarehouseid = selRow[0].id;
					oModel.oData.towarehousecode = selRow[0].warehousecode;
					oModel.oData.towarehousename = selRow[0].warehousename;
					this.getView().byId("txtToWarehouseCode").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("txtToWarehouseBinCode").setEnabled(true);
					commonFunction.getWarehousewiseWarehouseBin(selRow[0].id, this);
				}

				oModel.refresh();
			}
		},

		//warehouse bin fragment open
		handleWarehouseBinValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			this._valueHelpDialog = sap.ui.xmlfragment(
				"sap.ui.elev8rerp.componentcontainer.fragmentview.Common.WarehouseBinDialog",
				this
			);
			this.getView().addDependent(this._valueHelpDialog);
			this._valueHelpDialog.open(sInputValue);
		},


		handleWarehouseBinSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['bincode', 'binname'];
			var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
			}),
				false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);

		},

		onWarehouseBinDialogClose: function (oEvent) {
			var inputId = this.byId(this.inputId).sId;
			var currentContext = this;
			var aContexts = oEvent.getParameter("selectedContexts");

			// if (aContexts != undefined) {
			var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
			var oModel = currentContext.getView().getModel("inventoryRequestModel");

			inputId = inputId.substring(inputId.lastIndexOf('-') + 1);

			if (inputId == "txtFromWarehouseBinCode") {
				oModel.oData.fromwarehousebincode = selRow[0].bincode;
				oModel.oData.fromwarehousebinid = selRow[0].id;
				oModel.oData.fromwarehousebinname = selRow[0].binname;
				this.getView().byId("txtFromWarehouseBinCode").setValueState(sap.ui.core.ValueState.None);
			}
			// else
			if (inputId == "txtToWarehouseBinCode") {
				oModel.oData.towarehousebinid = selRow[0].id;
				oModel.oData.towarehousebincode = selRow[0].bincode;
				oModel.oData.towarehousebinname = selRow[0].binname;
				this.getView().byId("txtToWarehouseBinCode").setValueState(sap.ui.core.ValueState.None);
			}

			oModel.refresh();
		},

		OnSelect: function (oEvent) {

			var input = oEvent.getParameter("selectedItem").getKey();
			var currentContext = this;
			commonService.getBatchesByRequesTtarget({ requesttarget: input }, function (data) {
				var model = new sap.ui.model.json.JSONModel();
				model.setData({ modelData: data[0] });
				if (input == 502) {
					currentContext.getView().setModel(model, "setterBatchList");
					currentContext.getView().byId("setterToBatch").setVisible(true);
					currentContext.getView().byId("breederToBatch").setVisible(false);
					currentContext.getView().byId("shedEle").setVisible(false);
					currentContext.getView().byId("locationEle").setVisible(false);
					currentContext.getView().byId("layerToBatch").setVisible(false);
					currentContext.getView().byId("layershedEle").setVisible(false);

				}

				else if (input == 501) {
					currentContext.getView().setModel(model, "breederBatchList");
					currentContext.getView().byId("setterToBatch").setVisible(false);
					currentContext.getView().byId("breederToBatch").setVisible(true);
					currentContext.getView().byId("shedEle").setVisible(true);
					currentContext.getView().byId("locationEle").setVisible(true);
					currentContext.getView().byId("layerToBatch").setVisible(false);
					currentContext.getView().byId("layershedEle").setVisible(false);


				}
				else if (input == 505) {
					currentContext.getView().setModel(model, "layerBatchList");
					currentContext.getView().byId("setterToBatch").setVisible(false);
					currentContext.getView().byId("breederToBatch").setVisible(false);
					currentContext.getView().byId("shedEle").setVisible(false);
					currentContext.getView().byId("layerToBatch").setVisible(true);
					currentContext.getView().byId("layershedEle").setVisible(true);
					currentContext.getView().byId("locationEle").setVisible(true);


				}

			});
		},

		// setter batch value help
		handleSetterValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();

			// create value help dialog
			this._valueHelpDialog = sap.ui.xmlfragment(
				"sap.ui.elev8rerp.componentcontainer.fragmentview.Hatchery.Transaction.ForSetter.SetterBatchDialog",
				this
			);
			this.getView().addDependent(this._valueHelpDialog);

			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);
		},

		handleSetterBatchSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['locationname', 'settername', 'settingdate'];
			var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
			}),
				false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleSetterBatchClose: function (oEvent) {
			var inputId = this.byId(this.inputId).sId;
			var currentContext = this;
			var aContexts = oEvent.getParameter("selectedContexts");

			inputId = inputId.substring(inputId.lastIndexOf('-') + 1);


			// if(aContexts != undefined){
			var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
			var oModel = currentContext.getView().getModel("inventoryRequestModel");

			oModel.oData.tobatchid = selRow[0].settingno;
			oModel.oData.locationid = selRow[0].locationid;
			oModel.oData.locationname = selRow[0].locationname;
			oModel.oData.fromwarehouseid = selRow[0].warehouseid;
			oModel.oData.fromwarehousename = selRow[0].warehousename;
			oModel.oData.fromwarehousebinid = selRow[0].warehousebinid;
			oModel.oData.fromwarehousebinname = selRow[0].binname;
			oModel.refresh();

			//Location value help box
			// commonFunction.getLocationList(currentContext);
			commonFunction.getLocationWiseWarehouse(selRow[0].locationid, currentContext);
			currentContext.getView().byId("locationEle").setVisible(true);
			currentContext.getView().byId("cmbLocation").setEnabled(false);
			currentContext.getView().byId("txtLocationName").setEnabled(false);

			// currentContext.getView().byId("txtFromWarehouseCode").setEnabled(false);
			// currentContext.getView().byId("txtFromWarehouseBinCode").setEnabled(false);

			currentContext.getView().byId("txtToWarehouseCode").setEnabled(true);
			currentContext.getView().byId("txtToWarehouseBinCode").setEnabled(true);
			// }
		},

		// Breeder batch value help
		handleBreederValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();

			// create value help dialog
			this._valueHelpDialog = sap.ui.xmlfragment(
				"sap.ui.elev8rerp.componentcontainer.fragmentview.Common.BreederBatchDialog",
				this
			);
			this.getView().addDependent(this._valueHelpDialog);

			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);
		},

		handleBreederBatchSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['breederbatchname', 'locationname', 'warehousename'];
			var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
			}),
				false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		onBreederBatchDialogClose: function (oEvent) {
			var inputId = this.byId(this.inputId).sId;
			var currentContext = this;
			var aContexts = oEvent.getParameter("selectedContexts");

			inputId = inputId.substring(inputId.lastIndexOf('-') + 1);


			// if(aContexts != undefined){
			var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
			var oModel = currentContext.getView().getModel("inventoryRequestModel");

			oModel.oData.tobatchid = selRow[0].id;

			oModel.refresh();


			currentContext.getBreederBatchWiseBreederShed(selRow[0].id);
			// }
		},

		//get sheds in which breeder batch is present
		getBreederBatchWiseBreederShed: function (breederbatchid) {
			var currentContext = this;
			breederBatchTransferService.getBreederBatchWiseBreederShed({ breederbatchid: breederbatchid }, function (data) {
				var shedData = [];
				if (data.length > 0) {
					currentContext.getView().byId("txtFromShed").setEnabled(true);
					for (var i = 0; i < data[0].length; i++) {
						shedData.push({ id: data[0][i].breedershedid, locationname: data[0][i].fromlocationname, shedname: data[0][i].shedname });
					}
					var shedModel = new sap.ui.model.json.JSONModel();
					shedModel.setData({ modelData: shedData });
					currentContext.getView().setModel(shedModel, "shedModel");
				} else {
					MessageBox.warning("Breeder Shed id not available for this location.");
					currentContext.getView().byId("txtFromShed").setEnabled(false);
					currentContext.getView().byId("txtLocationName").setEnabled(false);
				}
			});
		},

		// Breeder shed value help
		handleShedValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();

			// create value help dialog
			this._valueHelpDialog = sap.ui.xmlfragment(
				"sap.ui.elev8rerp.componentcontainer.fragmentview.Breeder.Master.ShedDialog",
				this
			);
			this.getView().addDependent(this._valueHelpDialog);

			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);
		},

		handleSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['locationname', 'shedname'];
			var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
			}),
				false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleClose: function (oEvent) {
			//var inputId = this.byId(this.inputId).sId;
			var currentContext = this;
			var aContexts = oEvent.getParameter("selectedContexts");

			//inputId = inputId.substring(inputId.lastIndexOf('-') + 1);	

			// if(aContexts != undefined){
			var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
			var oModel = currentContext.getView().getModel("inventoryRequestModel");

			breederShedService.getBreederShed({ id: selRow[0].id }, function (data) {
				if (data) {
					oModel.oData.fromshedid = data[0][0].id;
					oModel.oData.fromshedname = data[0][0].shedname;
					oModel.oData.locationname = data[0][0].locationname;
					oModel.oData.fromwarehouseid = data[0][0].warhouseid;
					oModel.oData.fromwarehousebinid = data[0][0].warehousebinid;
					oModel.oData.fromwarehousename = data[0][0].warehousename;
					oModel.oData.fromwarehousebinname = data[0][0].binname;
					oModel.oData.fromwarehousecode = data[0][0].warhousecode;
					oModel.oData.fromwarehousebincode = data[0][0].bincode;
					oModel.refresh();

					commonFunction.getLocationWiseWarehouse(data[0][0].locationid, currentContext);
					currentContext.getView().byId("txtToWarehouseCode").setEnabled(true);
				} else {

				}
			})
		},

		// get resource Model
		resourceBundle: function () {
			var currentContext = this;
			var oBundle = this.getModel("i18n").getResourceBundle()
			return oBundle
		},

		onMaterialRequestAdd: function (sChannel, sEvent, oData) {
			var jsonStr = oData.data;
			var oModel = this.getView().getModel("detailModel");

			this.getView().byId("btnSave").setEnabled(true);

			var pModel = this.getView().getModel("inventoryRequestModel");
			pModel.oData.navigation = "Navigation";
			pModel.refresh();
			//new code
			var tableData = oModel.getData();

			//check if slot with same name already exist
			var index = tableData.modelData
				.map(function (slot) { return slot.itemname; })
				.indexOf(jsonStr["itemname"]);
			var slotNameMsg = this.resourceBundle().getText("materialRequestMsgErrorItemName");

			if (index > -1 && jsonStr["requestdetailid"] == null && jsonStr["status"] == "Edited")
				MessageBox.error(slotNameMsg);
			else {
				if (jsonStr["requestdetailid"] == null && jsonStr["status"] == "Edited") { //add new slot	  

					// push new record in object
					oModel.oData.modelData.push(jsonStr);

				}
				else if (jsonStr["requestdetailid"] == null && jsonStr["status"] == "New") { //updated newly added slot	  

					// Find the index of the object via status
					var index = tableData.modelData
						.map(function (slot) { return slot.itemname; })
						.indexOf(jsonStr["itemname"]);

					// Replace the record in the array
					tableData.modelData.splice(index, 1, jsonStr);
				}
				else {  //update existing slot

					// Find the index of the object via id
					var index = tableData.modelData
						.map(function (slot) { return slot.itemid; })
						.indexOf(jsonStr["itemid"]);

					// Replace the record in the array
					tableData.modelData.splice(index, 1, jsonStr);
				}
				oModel.refresh();
			}
		},

		onSlotDelete: function (sChannel, sEvent, oData) {
			var oModel = this.getView().getModel("detailModel");
			var tableData = oModel.getData();

			// Find the index of the object via id
			var index = tableData.modelData
				.map(function (record) { return record.id; })
				.indexOf(oData.data.id);

			if (index == 0) {
				index = tableData.modelData
					.map(function (record) { return record.itemname; })
					.indexOf(oData.data.itemname);
			}

			// delete record in the array
			tableData.modelData.splice(index, 1);
			oModel.refresh();
		},

		onSave: function () {
			var currentContext = this;

			if (this.validateForm()) {

				var model = this.getView().getModel("inventoryRequestModel").oData;
				var modeltoSave = this.getView().getModel("detailModel").oData.modelData;
				var tempId = model.id;

				model.requestdate = commonFunction.getDate(model.requestdate);
				model.duedate = commonFunction.getDate(model.duedate);
				model.companyid = commonFunction.session("companyId");
				model.userid = commonFunction.session("userId");
				if (modeltoSave.length > 0) {

					materialRequestService.saveMaterialRequest(model, function (data) {

						if (data.id > 0) {

							var materialrequestid = data.id;

							// insert/edit record in child table 
							for (var i = 0; i < modeltoSave.length; i++) {

								if (modeltoSave[i]["status"] == "Edited" || modeltoSave[i]["status"] == "New") {
									if (modeltoSave[i]["materialrequestid"] == null)
										modeltoSave[i]["materialrequestid"] = materialrequestid;

									if (modeltoSave[i]["materialrequestid"] != null) {
										if (modeltoSave[i].requestdetailid == null)
											modeltoSave[i].id = null;
										else
											modeltoSave[i].id = modeltoSave[i].requestdetailid;
									}




									modeltoSave[i]["quantity"] = modeltoSave[i]["requestedquantity"];
									modeltoSave[i]["companyid"] = model.companyid;
									modeltoSave[i]["userid"] = model.userid
									materialRequestService.saveMaterialRequestDetail(modeltoSave[i], function (data) {

									});
								}
								currentContext.resetModel();
								currentContext.loadData();
							}

							var message = tempId == null ? "Material request saved successfully!" : "Material request edited successfully!"
							MessageToast.show(message);

						}
						else {
							MessageBox.error("Error while saving record.");
						}
					});
				}
				else {
					MessageBox.error("Please add item details.");
				}
			}
		},

		resetModel: function () {
			var emptyModel = this.getModelDefault();
			var setterModel = this.getView().getModel("inventoryRequestModel");
			setterModel.setData(emptyModel);

			var tbleModel = this.getView().getModel("detailModel");
			tbleModel.setData({ modelData: [] });
			this.getView().byId("addBtn").setVisible(true);
		},

		validateForm: function () {
			var isValid = true;

			if (!commonFunction.isRequired(this, "txtFromWarehouseCode", "Please select warehouse."))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtToWarehouseCode", "Please select warehouse."))
				isValid = false;

			return isValid;
		},

		loadData: function () {
			var currentContext = this;
			materialRequestService.getMaterialRequestByCompanyid(function (data) {
				var model = new sap.ui.model.json.JSONModel();
				model.setData({ modelData: data[0] });
				currentContext.getView().setModel(model, "materialRequestList");
			});
		},

		onListIconPress: function (oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("sap.ui.elev8rerp.componentcontainer.fragmentview.Common.MaterialRequestDialog", this);
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

		handleMaterialRequestSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['requestdate'];
			var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
			}),
				false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		onMaterialRequestDialogClose: function (oEvent) {
			var currentContext = this;
			var aContexts = oEvent.getParameter("selectedContexts");

			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---materialrequestandtransfer--fclMaterialRequestTransfer");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);

			// if(aContexts != undefined){
			var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
			var oModel = currentContext.getView().getModel("inventoryRequestModel");

			oModel.setData(selRow[0]);
			oModel.refresh();
			oModel.oData.navigation = "";

			if (selRow[0].statusid == 441) {
				currentContext.getView().byId("addBtn").setVisible(true);
				currentContext.getView().byId("btnSave").setEnabled(true);
				oModel.oData.navigation = "Navigation";
				oModel.refresh();
			} else {
				currentContext.getView().byId("addBtn").setVisible(false);
				currentContext.getView().byId("btnSave").setEnabled(false);
				oModel.oData.navigation = "Inactive";
				oModel.refresh();
			}
			oModel.refresh();

			// get selected transfer item details
			materialRequestService.getMaterialRequestDetailsFromRequest({ materialrequestid: selRow[0].id }, function (data) {
				var dModel = currentContext.getView().getModel("detailModel");
				dModel.setData({ modelData: data[0] });
				dModel.refresh();
			});
			// }
		},

		// layer batch value help
		handleLayerValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();

			// create value help dialog
			this._valueHelpDialog = sap.ui.xmlfragment(
				"sap.ui.elev8rerp.componentcontainer.fragmentview.Common.LayerBatchDialog",
				this
			);
			this.getView().addDependent(this._valueHelpDialog);

			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);
		},

		handleLayerBatchSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['batchname', 'locationname', 'warehousename'];
			var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
			}),
				false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		onLayerBatchDialogClose: function (oEvent) {
			var inputId = this.byId(this.inputId).sId;
			var currentContext = this;
			var aContexts = oEvent.getParameter("selectedContexts");

			inputId = inputId.substring(inputId.lastIndexOf('-') + 1);
			var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
			var oModel = currentContext.getView().getModel("inventoryRequestModel");

			oModel.oData.tobatchid = selRow[0].id;
			currentContext.getView().byId("txtlayerFromShed").setEnabled(true);

			oModel.refresh();
			currentContext.getLayerBatchWiseLayerShed(selRow[0].id);
			// }
		},
		//get sheds in which breeder batch is present
		getLayerBatchWiseLayerShed: function (layerbatchid) {
			var currentContext = this;
			layerBatchTrnasferService.getLayerBatchWiseLayerShed({ layerbatchid: layerbatchid }, function (data) {
				var shedData = [];
				if (data[0].length > 0) {
					for (var i = 0; i < data[0].length; i++) {
						shedData.push({ id: data[0][i].layershedid, locationname: data[0][i].fromlocationname, shedname: data[0][i].shedname });
					}
					var shedModel = new sap.ui.model.json.JSONModel();
					shedModel.setData({ modelData: shedData });
					currentContext.getView().setModel(shedModel, "shedModel");
				} else {
					MessageBox.warning("Layer Shed id not available for this location.")
				}
			});
		},

		handlelayerShedValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();

			// create value help dialog
			this._valueHelpDialog = sap.ui.xmlfragment(
				"sap.ui.elev8rerp.componentcontainer.fragmentview.CommercialLayer.Master.LayerShedDialog",
				this
			);
			this.getView().addDependent(this._valueHelpDialog);

			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);
		},

		handleShedSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['locationname', 'shedname'];
			var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
			}),
				false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleShedClose: function (oEvent) {
			var currentContext = this;
			var aContexts = oEvent.getParameter("selectedContexts");
			var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
			var oModel = currentContext.getView().getModel("inventoryRequestModel");
			layerShedService.getLayerShed({ id: selRow[0].id }, function (data) {
				oModel.oData.fromshedid = data[0][0].id;
				oModel.oData.fromshedname = data[0][0].shedname;
				oModel.oData.locationname = data[0][0].locationname;
				oModel.oData.fromwarehouseid = data[0][0].warehouseid;
				oModel.oData.fromwarehousebinid = data[0][0].warehousebinid;
				oModel.oData.fromwarehousename = data[0][0].warehousename;
				oModel.oData.fromwarehousebinname = data[0][0].binname;
				oModel.oData.fromwarehousecode = data[0][0].warhousecode;
				oModel.oData.fromwarehousebincode = data[0][0].bincode;
				oModel.refresh();

				commonFunction.getLocationWiseWarehouse(data[0][0].locationid, currentContext);
				currentContext.getView().byId("txtToWarehouseCode").setEnabled(true);
			})
		},

		onExit: function () {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
		}

	});
}, true);
