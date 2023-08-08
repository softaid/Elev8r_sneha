sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageBox',
	'sap/m/MessageToast',
	'sap/ui/model/Filter',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/Sales/BreederSalesOrder.service',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
], function (JSONModel, BaseController, MessageBox, MessageToast, Filter, commonFunction, breederbirdSalesOrderService, commonService) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.BreederSales.BreederBirdSalesOrder", {

		onInit: function () {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("breederbirdsalesorder", "setDetailPage", this.setDetailPage, this);
			this.oFlexibleColumnLayout = this.byId("fclBreederBirdSalesOrder");

			// set empty model to view for parent model
			var emptyModel = this.getModelDefault();
			var model = new JSONModel();
			model.setData(emptyModel);
			this.getView().setModel(model, "breederSalesModel");

			// set empty model to view for batches			
			var model = new JSONModel();
			model.setData({ modelData: [] });
			this.getView().setModel(model, "breederBatchSalesModel");

			this.handleRouteMatched(null);

			var currRouteName = this.getOwnerComponent().getModel("applicationModel").getProperty("/routeName");
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.getRoute(currRouteName).attachMatched(this.handleRouteMatched, this);
		},

		handleRouteMatched: function () {

			this.loadDialogList();
			//get status for breeder bird sales
			commonFunction.getReference("BrdBirdSoSts", "statusModel", this);

			//get module name
			commonFunction.getReference("ModName", "moduleList", this);

		},
		moduleChange: function () {
			var moduleid = this.getView().byId("txtModuleid").getSelectedKey();
			var partdata = ({
				roleid: 32,
				moduleid: parseInt(moduleid)
			})
			//get module wise party
			commonFunction.getPartyModulewise(partdata, this, "vendorModel");

			// location help box	
			var moduleids = parseInt(moduleid);
			//get module wise location
			commonFunction.getLocations(this, moduleids);
			// this.getModuleWiseStartedBatches(parseInt(moduleid))


		},

		getModelDefault: function () {

			return {
				id: null,
				orderdate: commonFunction.setTodaysDate(new Date()),
				fromweight: 0,
				toweight: 0,
				rateperkg: 0,
				statusid: 4101,
				totalsaleweight: 0
			}
		},

		getBatches: function () {
			var parentModel = this.getView().getModel("breederSalesModel").oData;
			var childModel = this.getView().getModel("breederBatchSalesModel");

			var model =
			{
				moduleid: parentModel.moduleid,
				locationid: parentModel.locationid,
				companyid: commonService.session("companyId"),
				fromweight: parentModel.fromweight,
				toweight: parentModel.toweight,
			}
			breederbirdSalesOrderService.getModuleWiseBatches(model, function (data) {
				if (data[0].length) {
					childModel.setData({ modelData: data[0] });
				} else {
					childModel.setData({ modelData: [] });
					MessageBox.error("No batches are available for this Location !")
				}
			})
		},



		saleQtyChange: function (oEvent) {
			var tModel = this.getView().getModel("breederBatchSalesModel");
			var pModel = this.getView().getModel("breederSalesModel");
			var totalsaleweight = 0;
			var invalidFlag = false;
			var errBatch = null;
			// for (var i = 0; i < tModel.oData.modelData.length; i++) {
			// 	tModel.oData.modelData[i].batchcost = (parseFloat(tModel.oData.modelData[i].batchsaleweight) * parseFloat(pModel.oData.rateperkg));

			// 	if (isNaN(tModel.oData.modelData[i].batchsaleweight)) {
			// 		invalidFlag = true;
			// 		errBatch = "";

			// 		tModel.oData.modelData[i].batchsaleweight = 0;
			// 		tModel.refresh();
			// 		// if(pModel.oData.totalsaleqty > totalsaleqty){
			// 			totalsaleweight += parseInt(tModel.oData.modelData[i].batchsaleweight);
			// 	}else{
			// 		totalsaleweight += parseInt(tModel.oData.modelData[i].batchsaleweight);

			// 		if(tModel.oData.modelData[i].batchsaleweight > tModel.oData.modelData[i].totalsalesweight){
			// 			tModel.oData.modelData[i].batchsaleweight = 0;
			// 			MessageBox.error("Batch sale weight should be less or equal to the live batch weight!");
			// 		}else if(totalsaleweight > pModel.oData.totalsaleweight){
			// 			tModel.oData.modelData[i].batchsaleweight = 0;
			// 			MessageBox.error("Addition of batch sale weight should be less or equal to the total sale weight!");

			// 		}
			// 	}
			// }

			// if (invalidFlag) {

			// 	MessageBox.error("Transfer quantity must be valid and should be between 0 and less than or equal to received quantity.");
			// }

		},

		onExit: function () {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
		},

		onAddNewContent: function () {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("breederbirdsalesorder", "setDetailPage", { viewName: "BirdSalesOrderContentDetail" });
		},

		setDetailPage: function (channel, event, data) {
			this.detailView = sap.ui.view({
				viewName: "sap.ui.elev8rerp.componentcontainer.view.Sales.CBFSales." + data.viewName,
				type: "XML"
			});

			this.detailView.setModel(data.viewModel, "viewModel");
			this.oFlexibleColumnLayout.removeAllMidColumnPages();
			this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
		},

		onListIconPress: function (oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("sap.ui.elev8rerp.componentcontainer.fragmentview.Sales.BreederSales.BirdSalesOrderDialog", this);
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

		handleBirdSalesOrderSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['partyname'];
			var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
			}),
				false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleBirdSalesOrderClose: function (oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
			var sModel = this.getView().getModel("breederSalesModel");
			sModel.setData(selRow[0]);
			sModel.refresh();
			this.moduleChange();
			this.bindDetailTable(selRow[0].id,selRow[0].moduleid);
		},

		bindDetailTable: function (breederbirdsalesorderid,moduleid) {
			var oModel = this.getView().getModel("breederBatchSalesModel");
			var currentContext = this;
			breederbirdSalesOrderService.getBirdAllSalesOrderDetail({ breederbirdsalesorderid: breederbirdsalesorderid,moduleid:moduleid }, function (data) {
				oModel.setData({ modelData: data[0] });
				oModel.refresh();
			})
		},

		onSave: function () {
			var currentContext = this;
			var childModel = this.getView().getModel("breederBatchSalesModel").oData.modelData;
			var parentModel = this.getView().getModel("breederSalesModel").oData;

			var companyId = commonService.session("companyId");
			var userId = commonService.session("userId");

			parentModel["orderdate"] = commonFunction.getDate(parentModel["orderdate"]);
			parentModel["companyid"] = companyId;
			parentModel["userid"] = userId;

			// insert record in cbf_salesorder  table 
			breederbirdSalesOrderService.saveBirdSalesOrder(parentModel, function (data) {

				if (data.id > 0) {
					var breederbirdsalesorderid = data.id;

					for (var i = 0; i < childModel.length; i++) {

						childModel[i]["breederbirdsalesorderid"] = breederbirdsalesorderid;
						childModel[i]["companyid"] = companyId;
						childModel[i]["userid"] = userId;

						var tempid = childModel[i]["id"]
						if (childModel[i]["batchsaleweight"] > 0) {
							breederbirdSalesOrderService.saveBirdSalesorderDetail(childModel[i], function (data) {

								var saveMsg = "Bird sales order saved successfully!";
								var editMsg = "Bird sales order updated successfully!";

								var message = tempid == null ? saveMsg : editMsg
								MessageToast.show(message);
								// currentContext.resetModel();
								currentContext.loadDialogList();

							});
						}
					}

				}
			});
		},

		resetModel: function () {
			var emptyModel = this.getModelDefault();
			var model = this.getView().getModel("breederBatchSalesModel");
			model.setData(emptyModel);

			var tbleModel = this.getView().getModel("breederSalesModel");
			tbleModel.setData({ modelData: [] });
		},

		loadDialogList: function () {
			var todayDate = commonFunction.setTodaysDate(new Date());

			todayDate = commonFunction.getDate(todayDate);
			var currentContext = this;
			breederbirdSalesOrderService.getAllBirdSalesOrder(todayDate, function (data) {
				var sModel = new JSONModel();
				sModel.setData({ modelData: data[0] });
				currentContext.getView().setModel(sModel, "birdsalesorderModel");
			})
		},
	});
}, true);
