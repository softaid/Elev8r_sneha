
sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageBox',
	'sap/m/MessageToast',
	'sap/ui/model/Filter',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/ui/elev8rerp/componentcontainer/services/Sales/BreederLiftingSchedule.service',
	'sap/ui/elev8rerp/componentcontainer/services/Sales/BreederSalesOrder.service',
	'sap/ui/elev8rerp/componentcontainer/services/Sales/BreederLiftingWeight.service'

], function (JSONModel, BaseController, MessageBox, MessageToast, Filter, commonFunction, commonService, BrdliftingscheduleService, breederbirdSalesOrderService, breederLiftingWeight) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.BreederSales.BreederLiftingWeight", {

		onInit: function () {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("breederliftingweight", "setDetailPage", this.setDetailPage, this);
			this.bus.subscribe("onLiftingWeightSave", "onLiftingWeightSave", this.onLiftingWeightSave, this);
			this.oFlexibleColumnLayout = this.byId("fclbreederliftingweight");



			// set empty model to view for parent model
			var emptyModel = this.getModelDefault();
			var model = new JSONModel();
			model.setData(emptyModel);
			this.getView().setModel(model, "breederLiftingWeightModel");

			// set empty model for child table 			
			var model = new JSONModel();
			model.setData({ modelData: [] });
			this.getView().setModel(model, "tblbreederLiftingWeightModel");
			this.handleRouteMatched(null);

			var currRouteName = this.getOwnerComponent().getModel("applicationModel").getProperty("/routeName");
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.getRoute(currRouteName).attachMatched(this.handleRouteMatched, this);
		},

		handleRouteMatched: function () {

			this.loadDialogList();
			// get all lifting schedules

			this.getAllLiftingSchedule();

		},

		getModelDefault: function () {

			return {
				id: null,
				liftingdate: commonFunction.setTodaysDate(new Date()),
				totaldeliveredqty: 0,
				totaldeliveredwt: 0,
				totaldeliverycost: 0,
				islastdelivery: false,
				birdshortage: 0,
				excessbirds: 0
			}
		},

		loadDialogList: function () {
			var currentContext = this;
			breederLiftingWeight.getAllBreederLfWeight(function (data) {
				var sModel = new JSONModel();
				sModel.setData({ modelData: data[0] })
				currentContext.getView().setModel(sModel, "BreederLWLList");
			})
		},



		getAllLiftingSchedule: function () {
			var currentContext = this;
			BrdliftingscheduleService.getAllBreederLfSchedule(function (data) {
				if (data[0].length) {
					var arr = [];
					for (var i = 0; i < data[0].length; i++) {
						if (data[0][i].statusid == 4142) {
							arr.push(data[0][i]);
						}
					}

					var model = new JSONModel();
					model.setData({ modelData: arr });
					currentContext.getView().setModel(model, "brLiftingModel");

				} else {
					MessageBox.error("No lifting schedule is available!");
				}

			})
		},

		changeLfSchedule: function () {
			var currentContext = this;
			var lfScheduleid = this.getView().byId("txtLfSchedule").getSelectedKey();
			BrdliftingscheduleService.getBirdSalesOrderByLfSchedule({ liftingscheduleid: lfScheduleid }, function (data) {
				if (data[0].length) {
					var model = new JSONModel();
					model.setData({ modelData: data[0] });
					currentContext.getView().setModel(model, "orderModel");
				} else {
					MessageBox.error("No sales order available!");
				}

			})
		},


		getSalesOrderDetail: function () {
			var currentContext = this;
			var oModel = currentContext.getView().getModel("breederLiftingWeightModel");
			var breederbirdsalesorderid = this.getView().byId("txtSalesOrder").getSelectedKey();
			breederbirdSalesOrderService.getBirdSalesOrder({ id: breederbirdsalesorderid }, function (data) {
				oModel.oData.partyid = data[0][0].partyid;
				oModel.oData.partyname = data[0][0].partyname;
				oModel.oData.breederbirdsalesorderid = data[0][0].id;
				oModel.oData.stdsalesorderid = data[0][0].stdsalesorderid;
				oModel.refresh();
			})
			this.getWarehouseBySalesOrder(breederbirdsalesorderid);
		},

		getWarehouseBySalesOrder: function (breederbirdsalesorderid) {
			var currentContext = this;
			breederLiftingWeight.getWarehouseBySalesOrder({ salesorderid: breederbirdsalesorderid }, function (data) {
				var model = new JSONModel();
				model.setData({ modelData: data[0] });
				currentContext.getView().setModel(model, "warehouseList");
			})


		},
		changeWarehouse: function () {
			var currentContext = this;
			var oModel = currentContext.getView().getModel("breederLiftingWeightModel");
			var breederbirdsalesorderid = oModel.oData.breederbirdsalesorderid
			var warehouseid = this.getView().byId("txtwarehouse").getSelectedKey();
			currentContext.getView().byId("addBtn").setEnabled(true);
			breederbirdSalesOrderService.getAllBirdSalesOrderbatch({ breederbirdsalesorderid: breederbirdsalesorderid, warehouseid: warehouseid }, function (data) {
				var model = new JSONModel();
				model.setData({ modelData: data[0] });
				currentContext.getView().setModel(model, "batchList");
			})
		},


		onExit: function () {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
		},

		checkdone: function (oEvent) {
			var oModel = this.getView().getModel("breederLiftingWeightModel");
			var deliverycheck = this.getView().byId("deliverycheck").getState();
			oModel.oData.islastdelivery = deliverycheck;
			oModel.refresh();
		},

		onAddNewDetail: function () {
			var oModel = this.getView().getModel("breederLiftingWeightModel");
			this.bus = sap.ui.getCore().getEventBus();
			// if (oModel.oData.openqty > 0) {
			var model = {
				breederbirdsalesorderid: oModel.oData.breederbirdsalesorderid,
				islastdelivery: oModel.oData.islastdelivery,
				warehouseid: parseInt(oModel.oData.warehouseid),
				batchid: parseInt(this.getView().byId("txtbatch").getSelectedKey())
			}
			this.bus.publish("breederliftingweight", "setDetailPage",
				{ viewName: "BreederLiftingWeightDetail", viewModel: model });
			// } else {
			// 	MessageBox.error('No CBF batch is available under this delivery!')
			// }

		},

		setDetailPage: function (channel, event, data) {
			this.detailView = sap.ui.view({
				viewName: "sap.ui.elev8rerp.componentcontainer.view.Sales.BreederSales." + data.viewName,
				type: "XML"
			});

			this.detailView.setModel(data.viewModel, "viewModel");
			this.oFlexibleColumnLayout.removeAllMidColumnPages();
			this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
		},

		onLiftingWeightSave: function (sChannel, sEvent, oData) {
			var jsonStr = oData.data;
			var oModel = this.getView().getModel("tblbreederLiftingWeightModel");

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
			this.getSalesOrderTotal();
		},

		getSalesOrderTotal: function () {
			var oModel = this.getView().getModel("tblbreederLiftingWeightModel").oData.modelData;
			var totaldeliveredqty = 0;
			var totaldeliveredwt = 0;
			var totaldeliverycost = 0;
			for (var i = 0; i < oModel.length; i++) {
				totaldeliveredqty += parseFloat(oModel[i].deliveredqty);
				totaldeliveredwt += parseFloat(oModel[i].deliveredwt);
				totaldeliverycost += parseFloat(oModel[i].totalcost);
			}
			var pModel = this.getView().getModel("breederLiftingWeightModel");
			pModel.oData.totaldeliveredqty = totaldeliveredqty;
			pModel.oData.totaldeliveredwt = totaldeliveredwt;
			pModel.oData.totaldeliverycost = totaldeliverycost;
			pModel.refresh();
		},


		onListIconPress: function (oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("sap.ui.elev8rerp.componentcontainer.fragmentview.Sales.BreederSales.BreederLiftingWeightDialog", this);
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

		handlelLWSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['name', 'breederName', 'fromDate', 'toDate'];
			var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
			}),
				false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handlelLWsClose: function (oEvent) {
			this.getView().byId("btnSave").setEnabled(false);
			var aContexts = oEvent.getParameter("selectedContexts");
			var selRow = aContexts.map(function (oContext) { return oContext.getObject(); 
				
			});
			// get all lifting schedules
			var sModel = this.getView().getModel("breederLiftingWeightModel");
			sModel.setData(selRow[0]);
			sModel.refresh();
			this.changeLfSchedule();
			this.bindDetailTable(selRow[0].id);
			this.getWarehouseBySalesOrder(selRow[0].breederbirdsalesorderid);
			this.changeWarehouse();
		},

		bindDetailTable: function (breederliftingweightid) {
			var oModel = this.getView().getModel("tblbreederLiftingWeightModel");
			breederLiftingWeight.getAllBreederLfWeightDetail({ breederliftingweightid: breederliftingweightid }, function (data) {
				if (data[0].length > 0) {
					oModel.setData({ modelData: data[0]});
					oModel.refresh();
				}
			}
			)


		},
		// getWarehouseBySalesOrder
		onListItemPress: function (oEvent) {
			var viewModel = oEvent.getSource().getBindingContext("tblbreederLiftingWeightModel");
			var sModel = this.getView().getModel("breederLiftingWeightModel");
			var spath = viewModel.sPath.split("/");
			var rowIndex = spath[spath.length - 1];


			var model = {
				id: viewModel.getProperty("id") ? viewModel.getProperty("id") : null,
				itemid: viewModel.getProperty("itemid"),
				itemname: viewModel.getProperty("itemname"),
				batchname: viewModel.getProperty("batchname"),
				breederliftingweightid: viewModel.getProperty("breederliftingweightid"),
				itemName: viewModel.getProperty("itemName"),
				plannedqty: viewModel.getProperty("plannedqty"),
				deliveredqty: viewModel.getProperty("deliveredqty"),
				plannedwt: viewModel.getProperty("plannedwt"),
				deliveredwt: viewModel.getProperty("deliveredwt"),
				liftingtime: viewModel.getProperty("liftingtime"),
				rateperkg: viewModel.getProperty("rateperkg"),
				totalcost: viewModel.getProperty("totalcost"),
				excessbirds: viewModel.getProperty("excessbirds"),
				birdshortage: viewModel.getProperty("birdshortage"),
				openqty: viewModel.getProperty("openqty"),
				avgweight: viewModel.getProperty("avgweight"),
				shedid: viewModel.getProperty("shedid"),
				warehousebinid: viewModel.getProperty("warehousebinid"),
				batchid: this.getView().byId("txtbatch").getSelectedKey(),
				breederbirdsalesorderid: sModel.oData.breederbirdsalesorderid,
				warehouseid: sModel.oData.warehouseid,
				index: rowIndex,

			};

			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("breederliftingweight", "setDetailPage",
				{ viewName: "BreederLiftingWeightDetail", viewModel: model });
		},

		onSave: function () {
			// var isValid = this.validateForm();

			// if(isValid){
			var currentContext = this;
			var companyId = commonService.session("companyId");
			var userId = commonService.session("userId");
			var parentModel = this.getView().getModel("breederLiftingWeightModel").oData;
			parentModel["companyid"] = companyId;
			parentModel["userid"] = userId;
			parentModel["liftingdate"] = commonFunction.getDate(parentModel.liftingdate);
			var childModel = this.getView().getModel("tblbreederLiftingWeightModel").oData.modelData;

			breederLiftingWeight.saveBreederLfWeight(parentModel, function (data) {
				if (data.id > 0) {

					var breederliftingweightid = data.id;

					// insert/edit record in child table 
					for (var i = 0; i < childModel.length; i++) {

						if (childModel[i]["breederliftingweightid"] == null)
							childModel[i]["breederliftingweightid"] = breederliftingweightid;
						childModel[i]["companyid"] = companyId;
						childModel[i]["userid"] = userId;

						breederLiftingWeight.saveBreederLfWeightDetail(childModel[i], function (data) {

							currentContext.loadDialogList();
							MessageToast.show("data saved successfully");
						});
					}



				}
			});
			// }	
		},

	});
}, true);
