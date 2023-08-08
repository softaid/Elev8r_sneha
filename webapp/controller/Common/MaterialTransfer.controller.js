sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/Common/MaterialTransfer.service',
	'sap/ui/elev8rerp/componentcontainer/formatter/fragment.formatter',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',

], function (JSONModel, BaseController, MessageToast, MessageBox, commonFunction, materialTransferService, formatter, commonService) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Common.MaterialTransfer", {
		formatter: formatter,
		onInit: function () {

			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("materialtransfer", "onItemDetailAdd", this.onItemDetailAdd, this);
			this.bus.subscribe("materialtransfer", "onItemDetailDelete", this.onItemDetailDelete, this);

			this.bus.subscribe("materialtransfer", "onTabChangeToTransfer", this.onTabChangeToTransfer, this);
			// bind request source dropdown
			// commonFunction.getReference("MtrReqTransferSrcTrgt", "sourceModel", this);

			// bind request target dropdown
			// commonFunction.getReference("MtrReqTransferSrcTrgt", "targetModel", this);

			// bind status dropdown
			commonFunction.getReference("MtrReqAndTrsfr", "statusModel", this);

			// bind usage type dropdown
			// commonFunction.getReference("MtrTransferUsgTyp", "usageTypeModel", this);

			// warehouse help box	
			// commonFunction.getWarehouseList(this);

			// material request help box	
			commonFunction.getMaterialRequestList(this);

			// load material transfer dialog data
			this.loadData();

			// set empty model to view for parent table 
			var emptyModel = this.getModelDefault();

			var model = new JSONModel();
			model.setData(emptyModel);
			this.getView().setModel(model, "materialTransferModel");

			//get default warehouse from hatchery settings
			this.getDefaultWarehouse();

			// set empty model for child table 			
			var itemmodel = new JSONModel();
			itemmodel.setData({ modelData: [] });
			this.getView().setModel(itemmodel, "itemDetailModel");

		},

		getDefaultWarehouse: function () {
			var currentContext = this;
			// hatcherySettingsService.getHatcherySetting(function(data){
			// 	var oModel = currentContext.getView().getModel("materialTransferModel");
			// 	oModel.oData.towarehouseid = data[0][0].defaulthatcherywhforeggs;
			// 	oModel.oData.towarehousename = data[0][0].defaulthatcherywhforeggsname;
			// 	oModel.oData.towarehousecode = data[0][0].defaulthatcherywhforeggscode;
			// 	oModel.refresh();
			// 	//defaulthatcherywhforeggs
			// });	 
		},

		onTabChangeToTransfer: function () {
			// warehouse help box	
			commonFunction.getWarehouseList(this);

			// material request help box	
			commonFunction.getMaterialRequestList(this);

			// load material transfer dialog data
			this.loadData();
		},

		getModelDefault: function () {
			return {
				id: null,
				duedate: null,
				transferdate: commonFunction.setTodaysDate(new Date()),
				fromwarehouseid: null,
				fromwarehousecode: null,
				fromwarehousename: null,
				towarehouseid: null,
				towarehousecode: null,
				towarehousename: null,
				towarehousebinid: null,
				transfersourceid: 501,
				transfertargetid: 501,
				statusid: 581,
				usagetypeid: 621,
				frombatchid: null,
				tobatchid: null,
				requestid: null,
				companyid: commonFunction.session("companyId"),
				userid: commonFunction.session("userId")
			}

		},

		loadData: function () {
			var currentContext = this;
			materialTransferService.getAllMaterialTransfer(function (data) {
				var model = new sap.ui.model.json.JSONModel();
				model.setData({ modelData: data[0] });
				currentContext.getView().setModel(model, "materialTransferListModel");
			});
		},

		OnSelect: function (oEvent) {

			var input = oEvent.getParameter("selectedItem").getKey();

			var pModel = this.getView().getModel("materialTransferModel");

			var currentContext = this;
			commonService.getBatchesByRequesTtarget({ requesttarget: input }, function (data) {

				var model = new sap.ui.model.json.JSONModel();

				model.setData({ modelData: data[0] });
				
			});
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
				var oModel = currentContext.getView().getModel("materialTransferModel");

				if (inputId == "txtFromWarehouseCode") {
					oModel.oData.fromwarehouseid = selRow[0].id;
					oModel.oData.fromwarehousecode = selRow[0].warehousecode;
					oModel.oData.fromwarehousename = selRow[0].warehousename;
					this.getView().byId("txtFromWarehouseBinCode").setEnabled(true);
					// this.getView().byId("txtFromWarehouseCode").setValueState(sap.ui.core.ValueState.None);			    
					commonFunction.getWarehousewiseWarehouseBin(selRow[0].id, this);
					this.getDefaultBin(selRow[0].id);

				}
				else if (inputId == "txtToWarehouseCode") {
					oModel.oData.towarehouseid = selRow[0].id;
					oModel.oData.towarehousecode = selRow[0].warehousecode;
					oModel.oData.towarehousename = selRow[0].warehousename;
					this.getView().byId("txtToWarehouseBinCode").setEnabled(true);
					this.getView().byId("txtToWarehouseCode").setValueState(sap.ui.core.ValueState.None);
					commonFunction.getWarehousewiseWarehouseBin(selRow[0].id, this);
				}

				oModel.refresh();

			}
		},

		getDefaultBin: function (warehouseid) {
			var currentContext = this;
			commonService.getDefaultBin({ warehouseid: warehouseid }, function (data) {
				var oModel = currentContext.getView().getModel("materialTransferModel");
				oModel.oData.fromwarehousebincode = data[0][0].bincode;
				oModel.oData.fromwarehousebinid = data[0][0].id;
				oModel.oData.fromwarehousebinname = data[0][0].binname;
				oModel.refresh();
				// currentContext.getView().byId("txtFromWarehouseBinCode").setEnabled(false);
			});
			currentContext.getView().byId("btnAdd").setEnabled(true);
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
			var oModel = currentContext.getView().getModel("materialTransferModel");

			inputId = inputId.substring(inputId.lastIndexOf('-') + 1);

			if (inputId == "txtFromWarehouseBinCode") {
				oModel.oData.fromwarehousebinid = selRow[0].id;
				oModel.oData.fromwarehousebincode = selRow[0].bincode;
				oModel.oData.fromwarehousebinname = selRow[0].binname;
				this.getView().byId("txtFromWarehouseBinCode").setValueState(sap.ui.core.ValueState.None);
			}
			else if (inputId == "txtToWarehouseBinCode") {
				oModel.oData.towarehousebinid = selRow[0].id;
				oModel.oData.towarehousebincode = selRow[0].bincode;
				oModel.oData.towarehousebinname = selRow[0].binname;
				this.getView().byId("txtToWarehouseBinCode").setValueState(sap.ui.core.ValueState.None);
			}

			oModel.refresh();
		},

		handleFarmerValueHelp : function(oEvent){
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			this._valueHelpDialog = sap.ui.xmlfragment(
				"sap.ui.elev8rerp.componentcontainer.fragmentview.CBF.Transaction.FarmerAgreement.FarmerEnquiryDialog",
				this
			);
			this.getView().addDependent(this._valueHelpDialog);
			this._valueHelpDialog.open(sInputValue);
		},

		handleFarmerEnquirySearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['farm_name', 'farmer_name'];
			var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
			}),
				false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);

		},

		handleFarmerEnquiryClose: function (oEvent) {
			var inputId = this.byId(this.inputId).sId;
			var currentContext = this;
			var aContexts = oEvent.getParameter("selectedContexts");

			// if (aContexts != undefined) {
			var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
			var oModel = currentContext.getView().getModel("materialTransferModel");

			inputId = inputId.substring(inputId.lastIndexOf('-') + 1);

			if (inputId == "txtFromFarmer") {
				oModel.oData.fromfarm = selRow[0].farm_name;
				oModel.oData.fromfarmer = selRow[0].farmer_name;
				oModel.oData.fromfarmerenquiryid = selRow[0].id;
			}
			else if (inputId == "txtToFarmer") {
				oModel.oData.tofarm = selRow[0].farm_name;
				oModel.oData.tofarmer = selRow[0].farmer_name;
				oModel.oData.tofarmerenquiryid = selRow[0].id;
				var batstatus = "3021,3022,3023";
				console.log(batstatus);
				//commonFunction.getCbfBatchesByStatus(batstatus, this);
				commonService.getCbfBatchesByStatus({ statusid: batstatus }, function (data) {
					var bModel = new sap.ui.model.json.JSONModel();
					var arr = [];
					for(var i = 0; i < data[0].length; i++){
						if(data[0][i].farmer_enquiry_id == selRow[0].id){
							arr.push(data[0][i])
						}
					}
					bModel.setData({ modelData: arr });
					currentContext.getView().setModel(bModel, "cbfBatchList");
				})
			//	this.getFarmerWiseBatches(selRow[0].id);
			}
			
			commonFunction.getModuleWiseWarehouses(723,currentContext);
			oModel.refresh();
		},

		// getFarmerWiseBatches: function (farmerenquiryid) {
		// 	var currentContext = this;
		// 	cbfDailyTransactionService.getEnquiryhWiseCbfBatches({ farmerenquiryid: farmerenquiryid }, function (data) {
		// 		if (data[0].length) {
		// 			var bModel = new sap.ui.model.json.JSONModel();
		// 			bModel.setData({ modelData: data[0] });
		// 			currentContext.getView().setModel(bModel, "cbfBatchList");
		// 		} else {
		// 			MessageBox.error("No batch available for this farmer!")
		// 		}
		// 	})
		// },

		// material request value help
		handleMaterialRequestValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();

			// create value help dialog
			this._valueHelpDialog = sap.ui.xmlfragment(
				"sap.ui.elev8rerp.componentcontainer.fragmentview.Common.MaterialRequestDialog",
				this
			);
			this.getView().addDependent(this._valueHelpDialog);

			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);
		},

		handleMaterialRequestSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['requestfrom', 'requestto', 'requestdate', 'remark'];
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

			if (aContexts != undefined) {
				var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
				var oModel = currentContext.getView().getModel("materialTransferModel");
				oModel.oData.requestid = selRow[0].id;
				oModel.oData.fromwarehouseid = selRow[0].towarehouseid;
				oModel.oData.fromwarehousecode = selRow[0].towarehousecode;
				oModel.oData.fromwarehousename = selRow[0].towarehousename;
				oModel.oData.fromwarehousebinid = selRow[0].towarehousebinid;
				oModel.oData.fromwarehousebinname = selRow[0].towarehousebinname;
				oModel.oData.fromwarehousebincode = selRow[0].towarehousebincode;

				oModel.oData.towarehouseid = selRow[0].fromwarehouseid;
				oModel.oData.towarehousecode = selRow[0].fromwarehousecode;
				oModel.oData.towarehousename = selRow[0].fromwarehousename;
				oModel.oData.towarehousebinid = selRow[0].fromwarehousebinid;
				oModel.oData.towarehousebinname = selRow[0].fromwarehousebinname;
				oModel.oData.towarehousebincode = selRow[0].fromwarehousebincode;

				oModel.oData.duedate = selRow[0].duedate;
				oModel.oData.transfersourceid = selRow[0].requesttarget;
				oModel.oData.transfertargetid = selRow[0].requestsource;
				oModel.oData.tobatchid = selRow[0].tobatchid
				oModel.oData.navigation = "Navigation";
				oModel.refresh();

				commonFunction.getLocationWiseWarehouse(selRow[0].locationid, currentContext);
				currentContext.getView().byId("txtFromWarehouseCode").setEnabled(true);
				currentContext.getView().byId("setterToBatch").setVisible(false);
				currentContext.getView().byId("CbfToBatch").setVisible(false);
				currentContext.getView().byId("breederToBatch").setVisible(true);

				materialTransferService.getMaterialRequestDetailsFromRequest({ materialrequestid: selRow[0].id }, function (data) {

					var model = currentContext.getView().getModel("itemDetailModel");
					model.setData({ modelData: data[0] });
					if (oModel.oData.transfersourceid == 501 && oModel.oData.transfertargetid == 502) {
						currentContext.getView().byId("txtToWarehouseCode").setEnabled(false);
						// currentContext.getView().byId("txtToWarehouseName").setEnabled(false);
						currentContext.getDefaultWarehouse();

					}
					model.refresh();
				});

				//this.getView().byId("txtRequestNo").setValueState(sap.ui.core.ValueState.None)			    			
			}
		},

		onAddNew: function () {
			this.bus = sap.ui.getCore().getEventBus();
			var parentmodel = this.getView().getModel("materialTransferModel");
			var state = this.getView().byId("chkWithRequest").getState();
			var model = {
				fromwarehoussebinid: parentmodel.oData.fromwarehousebinid,
				fromwarehouseid: parentmodel.oData.fromwarehouseid,
				status: "New",
				chkWithRequest: state,
				index: null,
				transferdate: parentmodel.oData.transferdate
			}
			this.bus.publish("materialrequestandtransfer", "setDetailPage", { viewName: "MaterialTransferDetail", viewModel: model });
		},

		onListItemPress: function (oEvent) {
			var viewModel = oEvent.getSource().getBindingContext("itemDetailModel");
			var parentmodel = this.getView().getModel("materialTransferModel");
			var requestid = parentmodel.oData.requestid;
			var state = this.getView().byId("chkWithRequest").getState();
			var spath = viewModel.sPath.split("/");
			var rowIndex = spath[spath.length - 1];

			var model = {
				id: viewModel.getProperty("id") ? viewModel.getProperty("id") : null,
				requestdetailid: viewModel.getProperty("requestdetailid") ? viewModel.getProperty("requestdetailid") : null,
				transferdetailid: viewModel.getProperty("transferdetailid") ? viewModel.getProperty("transferdetailid") : null,
				itemid: viewModel.getProperty("itemid"),
				itemname: viewModel.getProperty("itemname"),
				unitid: viewModel.getProperty("unitid"),
				unit: viewModel.getProperty("unit"),
				requestedquantity: viewModel.getProperty("requestedquantity"),
				transferedquantity: viewModel.getProperty("transferedquantity"),
				transferedweight: viewModel.getProperty("transferedweight"),
				avgweight : viewModel.getProperty("transferedweight") ? (parseFloat(viewModel.getProperty("transferedweight"))/parseFloat(viewModel.getProperty("transferedquantity"))) : 0,
				itemgroupid: viewModel.getProperty("itemgroupid"),
				instock: viewModel.getProperty("instock"),
				fromwarehousebinid: parentmodel.oData.fromwarehousebinid,
				fromwarehouseid: parentmodel.oData.fromwarehouseid,
				status: "Edited",
				chkWithRequest: state,
				index: rowIndex,
				transferdate: parentmodel.oData.transferdate,

			}
			// if(model.id == null){
			// 	viewModel.oData.navigation = "Navigation";
			// }else{
			// 	viewModel.oData.navigation = "Inactive";
			// }

			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("materialrequestandtransfer", "setDetailPage", { viewName: "MaterialTransferDetail", viewModel: model });
		},

		onListIconPress: function (oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("sap.ui.elev8rerp.componentcontainer.fragmentview.Common.MaterialTransferDialog", this);
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

		handleMaterialTransferSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['transfersource', 'transfertarget', 'transferdate', 'usagetype', 'status'];
			var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
			}),
				false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		onMaterialTransferDialogClose: function (oEvent) {

			var currentContext = this;
			var aContexts = oEvent.getParameter("selectedContexts");
			currentContext.getView().byId("btnAdd").setEnabled(false);

			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---materialrequestandtransfer--fclMaterialRequestTransfer");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);

			if (aContexts != undefined) {
				var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
				var oModel = currentContext.getView().getModel("materialTransferModel");
				oModel.setData(selRow[0]);
				// oModel.oData.id = selRow[0].id; 				
				oModel.oData.requestid = selRow[0]["requestid"] != null ? selRow[0]["requestid"] : null;

				if (selRow[0].statusid == 581) {
					oModel.oData.navigation = "Navigation";
					currentContext.getView().byId("btnSave").setEnabled(true);
				} else {
					oModel.oData.navigation = "Inactive";
				}
				if (selRow[0]["requestid"] != null) {
					this.getView().byId("chkWithRequest").setState(true);
					this.getView().byId("txtRequestNo").setEnabled(false);
				} else {
					this.getView().byId("chkWithRequest").setState(false);
					this.getView().byId("txtRequestNo").setEnabled(false);
				}


				oModel.refresh();

				// get selected transfer item details
				materialTransferService.getTransferDetailsByTransferID({ transferid: selRow[0].id }, function (data) {

					var oModel = currentContext.getView().getModel("itemDetailModel");
					if (data[0].length > 0) {
						oModel.setData({ modelData: data[0] });
						oModel.refresh();

						var pModel = currentContext.getView().getModel("materialTransferModel");
						pModel.oData.towarehouseid = data[0][0].towarehouseid;
						pModel.oData.towarehousename = data[0][0].towarehousename;
						pModel.oData.towarehousebinid = data[0][0].towarehousebinid;
						pModel.oData.towarehousebinname = data[0][0].towarehousebinname;
						pModel.oData.fromfarmer = data[0][0].fromfarmer;
						pModel.oData.tofarmer = data[0][0].tofarmer;
						pModel.refresh();
					} else {
						MessageBox.warning("No details found.");
					}


				});
			}
		},

		// get resource Model
		resourceBundle: function () {
			var currentContext = this;
			var oBundle = this.getModel("i18n").getResourceBundle()
			return oBundle
		},

		onItemDetailAdd: function (sChannel, sEvent, oData) {
			var jsonStr = oData.data;
			console.log(jsonStr)
			var oModel = this.getView().getModel("itemDetailModel");

			var pModel = this.getView().getModel("materialTransferModel");
			pModel.oData.navigation = "Navigation";
			pModel.refresh();
			console.log("pModel : ",pModel);

			this.getView().byId("btnSave").setEnabled(true);
			var tableData = oModel.getData();


			if (jsonStr["index"] == null) { //add new shed pen
				// push new record in object
				jsonStr["rowstatus"] = "New";
				oModel.oData.modelData.push(jsonStr);

			}
			if (jsonStr["index"] != null) { //update existing shed pen
				var tableData = oModel.getData();

				// Replace the record in the array
				jsonStr["rowstatus"] = "Edited";
				tableData.modelData.splice(jsonStr["index"], 1, jsonStr);

			}
			oModel.refresh();
		},



		onSlotDelete: function (sChannel, sEvent, oData) {
			var oModel = this.getView().getModel("itemDetailModel");
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
				var parentModel = this.getView().getModel("materialTransferModel").oData;
				console.log(parentModel);
				var itemDetailModel = this.getView().getModel("itemDetailModel").oData.modelData;
				var tempId = parentModel.id;

				parentModel.duedate = commonFunction.getDate(parentModel.duedate);
				parentModel.transferdate = commonFunction.getDate(parentModel.transferdate);
				parentModel.companyid = commonFunction.session("companyId");
				parentModel.userid = commonFunction.session("userId");


				// if (itemDetailModel.length > 0) {

				materialTransferService.saveMaterialTransfer(parentModel, function (data) {

					// if (data.id > 0) {

					var materialtransferid = data.id;
					var cnt = 0;

					// insert/edit record in child table 
					for (var i = 0; i < itemDetailModel.length; i++) {

						// if (itemDetailModel[i]["status"] == "Edited" || itemDetailModel[i]["status"] == "New") {
						// if (itemDetailModel[i]["materialtransferid"] == null)
						// 	itemDetailModel[i]["materialtransferid"] = materialtransferid;

						// if (itemDetailModel[i]["materialtransferid"] != null) {
						// 	if (itemDetailModel[i].transferdetailid == null)
						// 		itemDetailModel[i].id = null;
						// 	else
						// 		itemDetailModel[i].id = itemDetailModel[i].transferdetailid;
						// }

						// if (itemDetailModel[i]["materialrequestid"] != null)
						// 	itemDetailModel[i].id = null;

						// itemDetailModel[i]["itembatchid"] = 1;
						itemDetailModel[i]["materialtransferid"] = materialtransferid;
						itemDetailModel[i]["towarehouseid"] = parentModel.towarehouseid;
						itemDetailModel[i]["towarehousebinid"] = parentModel.towarehousebinid;
						itemDetailModel[i]["companyid"] = commonFunction.session("companyId");
						itemDetailModel[i]["userid"] = commonFunction.session("userId");
						materialTransferService.saveMaterialTransferDetail(itemDetailModel[i], function (data) {



						});
					}
					if (materialtransferid > 0) {
								cnt++;
								//Save JE for WIP bird ledger and goods received but not received ledger
								materialTransferService.saveMaterialTransferJE({ materialtransferid : materialtransferid  }, function (data) {
								});
							}
					currentContext.resetModel();
					currentContext.loadData();
					// }
					var message = tempId == null ? "Material transfer saved successfully!" : "Material transfer edited successfully!"
					MessageToast.show(message);
					// }
					// else {
					// 	MessageBox.error("Error while saving record.");
					// }
				});

				// }
				// else {
				// 	MessageBox.error("Please add item details.");
				// }
			}
		},

		// validation functions
		validateForm: function () {
			var isValid = true;

			if (!commonFunction.isRequired(this, "txtDueDate", "Due date is required."))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtFromWarehouseCode", "From warehouse is required."))
				isValid = false;

			var requestDate = this.getView().byId("txtRequestDate").getValue();
			var dueDate = this.getView().byId("txtDueDate").getValue();
			if (dueDate < requestDate) {
				MessageBox.error("Due date should not be less than transfer date.");
				isValid = false;
			}

			if (!commonFunction.isDate(this, "txtDueDate"))
				isValid = false;


			return isValid;
		},

		OnCheckBoxSelect: function (oEvent) {

			var input = oEvent.mParameters.state;
			this.onCancel();
			this.resetModel();
			if (input === true) {
				this.getView().byId("txtRequestNo").setEnabled(true);
				this.getView().byId("btnAdd").setEnabled(false);
				this.getView().byId("txtFromWarehouseCode").setEnabled(false);
				this.getView().byId("ddlRequestSource").setEnabled(false);
				this.getView().byId("ddlRequestTarget").setEnabled(false);
				this.getView().byId("txtBreederToBatch").setEnabled(true);
				this.getView().byId("ddlRequestTarget").setEnabled(false);

				var tbleModel = this.getView().getModel("itemDetailModel");
				tbleModel.setData({ modelData: [] });
				this.getDefaultWarehouse();

			} else {

				this.getView().byId("txtRequestNo").setEnabled(false);
				this.getView().byId("ddlRequestTarget").setEnabled(false);
				this.getView().byId("txtFromWarehouseCode").setEnabled(true);
				this.getView().byId("ddlRequestSource").setEnabled(true);
				this.getView().byId("txtBreederToBatch").setEnabled(false);
				this.getView().byId("ddlRequestTarget").setEnabled(true);
				this.getView().byId("breederToBatch").setVisible(true);

				// var oModel = this.getView().getModel("materialTransferModel");
				// oModel.oData.requestid = null;
				// this.resetModel();
				var tbleModel = this.getView().getModel("itemDetailModel");
				tbleModel.setData({ modelData: [] });
				this.getDefaultWarehouse();
			}
			// this.closeDetailPage();
		},

		// Location fragment open
		handleLocationValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			//	if (!this._valueHelpDialog) {
			this._valueHelpDialog = sap.ui.xmlfragment(
				"sap.ui.elev8rerp.componentcontainer.fragmentview.Common.LocationDialog",
				this
			);
			this.getView().addDependent(this._valueHelpDialog);
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
			// if (aContexts != undefined) {
			var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
			var oModel = currentContext.getView().getModel("materialTransferModel");

			// update existing model to set locationid
			//oModel.oData.itemid = selRow[0].itemid;
			oModel.oData.locationcode = selRow[0].locationcode;
			oModel.oData.locationid = selRow[0].id;
			oModel.oData.locationname = selRow[0].locationname;

			oModel.refresh();

			currentContext.getView().byId("txtFromWarehouseCode").setEnabled(true);

			// commonFunction.getLocationWiseWarehouse(selRow[0].id,currentContext);
			commonFunction.getWarehouseList(currentContext);
			currentContext.getView().byId("txtToWarehouseCode").setEnabled(true);

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
			var oModel = currentContext.getView().getModel("materialTransferModel");
			console.log()
			oModel.oData.tobatchid = selRow[0].settingno;
			oModel.oData.locationid = selRow[0].locationid;
			oModel.oData.locationname = selRow[0].locationname;
			oModel.oData.towarehouseid = selRow[0].warehouseid;
			oModel.oData.towarehousename = selRow[0].warehousename;
			oModel.oData.towarehousebinid = selRow[0].warehousebinid;
			oModel.oData.towarehousebinname = selRow[0].binname;

			oModel.refresh();
			commonFunction.getWarehouseList(currentContext);
			currentContext.getView().byId("locationEle").setVisible(true);
			currentContext.getView().byId("cmbLocation").setEnabled(false);

			currentContext.getView().byId("txtToWarehouseCode").setEnabled(false);
			currentContext.getView().byId("txtToWarehouseBinCode").setEnabled(false);

			currentContext.getView().byId("txtFromWarehouseCode").setEnabled(true);
			currentContext.getView().byId("txtFromWarehouseBinCode").setEnabled(true);


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
			var oModel = currentContext.getView().getModel("materialTransferModel");

			oModel.oData.tobatchid = selRow[0].id;
			oModel.oData.towarehouseid = selRow[0].warehouseid;
			oModel.oData.towarehousename = selRow[0].warehousename;
			oModel.oData.towarehousebinid = selRow[0].warehousebinid;
			oModel.oData.towarehousebinname = selRow[0].binname;

			oModel.refresh();

			currentContext.getView().byId("txtFromShedEle").setVisible(true);
			currentContext.getView().byId("locationEle").setVisible(true);

			currentContext.getBreederBatchWiseBreederShed(selRow[0].id);
			// }
		},

		// Breeder batch value help
		handleCbfValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();

			// create value help dialog
			this._valueHelpDialog = sap.ui.xmlfragment(
				"sap.ui.elev8rerp.componentcontainer.fragmentview.Common.CbfBatchDialog",
				this
			);
			this.getView().addDependent(this._valueHelpDialog);

			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);
		},

		handleCbfBatchSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['branchname', 'batch_number'];
			var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
			}),
				false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		onCbfBatchDialogClose: function (oEvent) {
			var inputId = this.byId(this.inputId).sId;
			var currentContext = this;
			var aContexts = oEvent.getParameter("selectedContexts");

			inputId = inputId.substring(inputId.lastIndexOf('-') + 1);


			// if(aContexts != undefined){
			var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
			console.log(selRow[0]);
			var oModel = currentContext.getView().getModel("materialTransferModel");

			oModel.oData.tobatchid = selRow[0].id;
			oModel.oData.towarehouseid = selRow[0].warehouseid;
			oModel.oData.towarehousename = selRow[0].warehousename;
			oModel.oData.towarehousebinid = selRow[0].warehousebinid;
			oModel.oData.towarehousebinname = selRow[0].binname;


			oModel.refresh();
			// }
		},


		//get sheds in which breeder batch is present
		getBreederBatchWiseBreederShed: function (breederbatchid) {
			var currentContext = this;
			breederBatchTransferService.getBreederBatchWiseBreederShed({ breederbatchid: breederbatchid }, function (data) {
				var shedData = [];
				if (data[0].length > 0) {
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
					// currentContext.getView().byId("txtLocationName").setEnabled(false);	
					currentContext.getView().byId("txtToWarehouseCode").setEnabled(false);
					currentContext.getView().byId("txtToWarehouseBinCode").setEnabled(false);
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
			var oModel = currentContext.getView().getModel("materialTransferModel");
			breederShedService.getBreederShed({ id: selRow[0].id }, function (data) {

				oModel.oData.fromshedid = data[0][0].id;
				oModel.oData.fromshedname = data[0][0].shedname;
				oModel.oData.locationname = data[0][0].locationname;
				oModel.oData.towarehouseid = data[0][0].warhouseid;
				oModel.oData.towarehousebinid = data[0][0].warehousebinid;
				oModel.oData.towarehousename = data[0][0].warehousename;
				oModel.oData.towarehousebinname = data[0][0].binname;
				oModel.oData.towarehousecode = data[0][0].warhousecode;
				oModel.oData.towarehousebincode = data[0][0].bincode;
				oModel.refresh();

				// commonFunction.getLocationWiseWarehouse(data[0][0].locationid,currentContext);
				commonFunction.getWarehouseList(currentContext);
				currentContext.getView().byId("txtToWarehouseCode").setEnabled(true);
			})



			// }

			//this._valueHelpDialog.destroy();
		},

		onDueDateChange: function () {
			commonFunction.isDate(this, "txtDueDate");

		},

		resetModel: function () {
			var requestDate = this.getView().byId("txtRequestDate").getValue();
			var emptyModel = this.getModelDefault();
			var setterModel = this.getView().getModel("materialTransferModel");
			setterModel.setData(emptyModel);
			var tbleModel = this.getView().getModel("itemDetailModel");
			tbleModel.setData({ modelData: [] });
			this.getView().byId("btnDelete").setVisible(false);
			this.getView().byId("txtRequestDate").setValue(requestDate);
			// this.getView().byId("btnAdd").setEnabled(true);
			this.getView().byId("ddlRequestSource").setEnabled(true);
			this.getView().byId("ddlRequestTarget").setEnabled(true);
		},

		onExit: function () {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
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


			// if(aContexts != undefined){
			var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
			var oModel = currentContext.getView().getModel("materialTransferModel");

			oModel.oData.tobatchid = selRow[0].id;
			oModel.oData.towarehouseid = selRow[0].warehouseid;
			oModel.oData.towarehousename = selRow[0].warehousename;
			oModel.oData.towarehousebinid = selRow[0].warehousebinid;
			oModel.oData.towarehousebinname = selRow[0].binname;

			oModel.oData.tobatchid = selRow[0].id;
			currentContext.getView().byId("txtlayerFromShed").setEnabled(true);
			currentContext.getView().byId("layerlocationEle").setVisible(true);

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
			var oModel = currentContext.getView().getModel("materialTransferModel");
			layerShedService.getLayerShed({ id: selRow[0].id }, function (data) {

				oModel.oData.fromshedid = data[0][0].id;
				oModel.oData.fromshedname = data[0][0].shedname;
				oModel.oData.locationname = data[0][0].locationname;
				oModel.oData.towarehouseid = data[0][0].warehouseid;
				oModel.oData.towarehousebinid = data[0][0].warehousebinid;
				oModel.oData.towarehousename = data[0][0].warehousename;
				oModel.oData.towarehousebinname = data[0][0].binname;
				oModel.oData.towarehousecode = data[0][0].warehousecode;
				oModel.oData.towarehousebincode = data[0][0].bincode;
				oModel.refresh();


				// commonFunction.getLocationWiseWarehouse(data[0][0].locationid,currentContext);
				commonFunction.getWarehouseList(currentContext);
				currentContext.getView().byId("txtToWarehouseCode").setEnabled(true);
			})


		},


		onCancel: function () {
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---materialrequestandtransfer--fclMaterialRequestTransfer");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}

	});
}, true);
