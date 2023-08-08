sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/elev8rerp/componentcontainer/services/CBF/CbfDeliveryWeights.service',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/ui/elev8rerp/componentcontainer/services/Sales/BreederSalesOrder.service',

], function (JSONModel, BaseController, MessageToast, MessageBox, cbfDeliveryWeightsServive, commonFunction, commonService, breederbirdSalesOrderService) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.BreederSales.BreederLiftingWeightDetail", {
		onInit: function () {

		},

		onBeforeRendering: function () {
			this.model = this.getView().getModel("viewModel");
			var oModel = new JSONModel();
			if (this.model != undefined) {
				oModel.setData(this.model);
				var currentContext = this;
				if (this.model.batchid != undefined) {
					this.getBatchDetails();
				}
			}
			else {
				oModel.setData({
					id: null, lineId: null, orderNumber: null, orderEntry: null, orderDate: null,
					customerName: "", itemName: "", totalWeight: null, openQuantity: null, toRelease: null, ratePerKg: null, farmName: "", farmerName: ""
				});
			}

			this.getView().setModel(oModel, "breederLfWeightDetailModel");

			var pModel = currentContext.getView().getModel("breederLfWeightDetailModel");
			if (this.model.islastdelivery == true) {
				this.getView().byId("excessbirdsEle").setVisible(true);
				this.getView().byId("birdshortageEle").setVisible(true);

				pModel.oData.excessbirds = 0;
				pModel.oData.birdshortage = 0;

				pModel.refresh();
			} else {
				this.getView().byId("excessbirdsEle").setVisible(false);
				this.getView().byId("birdshortageEle").setVisible(false);

				pModel.oData.excessbirds = 0;
				pModel.oData.birdshortage = 0;

				pModel.refresh();
			}


		},

		getBatchDetails: function () {
			var currentContext = this;
			var sModel = {
				breederbirdsalesorderid: parseInt(this.model.breederbirdsalesorderid),
				batchid: parseInt(this.model.batchid),
				warehouseid: parseInt(this.model.warehouseid),
			}

			breederbirdSalesOrderService.getAllBirdSalesOrderItem(sModel, function (data) {
				if (data[0].length) {
					var model = new JSONModel();
					model.setData({ modelData: data[0] });
					currentContext.getView().setModel(model, "birdItemModel");
				}
			})
		},

		handleItemvaluehelpValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			// if (!this._valueHelpDialog) {
			this._valueHelpDialog = sap.ui.xmlfragment(
				"sap.ui.elev8rerp.componentcontainer.fragmentview.Sales.BreederSales.BirdSalesOrderItemDialog",
				this
			);
			this.getView().addDependent(this._valueHelpDialog);
			// }
			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);
		},




		handleBirdSalesOrderItemSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['itemname'];
			var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
			}),
				false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleBirdSalesOrderItemClose: function (oEvent) {
			var currentContext = this;
			var aContexts = oEvent.getParameter("selectedContexts");

			if (aContexts != undefined) {
				var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
				var childModel = currentContext.getView().getModel("breederLfWeightDetailModel");
				//update existing model to set supplier
				childModel.oData.itemid = parseInt(selRow[0].itemid);
				childModel.oData.plannedqty = parseInt(selRow[0].batchsaleqty);
				childModel.oData.itemname = selRow[0].itemname;
				childModel.oData.plannedwt = parseFloat(selRow[0].batchsaleweight);
				childModel.oData.avgweight = parseFloat(selRow[0].avgweight);
				childModel.oData.rateperkg = parseFloat(selRow[0].rateperkg);
				childModel.oData.openqty = parseFloat(selRow[0].pendingqty);
				childModel.oData.batchname = selRow[0].batchname;
				childModel.oData.shedid = selRow[0].shedid;
				childModel.oData.warehousebinid = selRow[0].warehousebinid;
				childModel.refresh();


			} else {

			}


		},


		handleTimeChange: function (oEvent) {

			var sValue = oEvent.getParameter("value");
			var bValid = oEvent.getParameter("valid");

			this.getView().byId("liftingtime").setValue(sValue);

			if (bValid && sValue != "") {
				var model = this.getView().getModel("breederLfWeightDetailModel").oData;
				model.liftingtime = sValue;

				this.getView().byId("liftingtime").setValueState(sap.ui.core.ValueState.None);
			}
			else {
				this.getView().byId("liftingtime").setValueState(sap.ui.core.ValueState.Error);
				this.getView().byId("liftingtime").setValueStateText("Enter valid time");
			}
		},

		calculateWt: function (oEvent) {
			var val = oEvent.getParameter("value");
			var oModel = this.getView().getModel("breederLfWeightDetailModel");
			oModel.oData.deliveredwt = parseFloat(val) * parseFloat(oModel.oData.avgweight)
			oModel.refresh();
			oModel.oData.totalcost = parseFloat(oModel.oData.rateperkg) * oModel.oData.deliveredwt;

			oModel.refresh();
		},

		onSave: function () {

			var model = this.getView().getModel("breederLfWeightDetailModel").oData;

			model["status"] = "Edited";
			model["userid"] = commonFunction.session("userId");
			model["companyid"] = commonFunction.session("companyId");
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("onLiftingWeightSave", "onLiftingWeightSave", { data: model });
			this.onCancel();
		},

		onDelete: function () {

		},

		onCancel: function () {
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---breederliftingweight--fclbreederliftingweight");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}
	});
}, true);
