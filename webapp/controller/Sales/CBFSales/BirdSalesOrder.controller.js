sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageBox',
	'sap/m/MessageToast',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/CBF/BirdSalesOrder.service',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
], function (JSONModel, BaseController, MessageBox, MessageToast, commonFunction, birdSalesOrderService, commonService) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.CBFSales.BirdSalesOrder", {
		
		onInit: function () {
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.subscribe("cbfbirdsalesorder", "setDetailPage", this.setDetailPage, this);     
            this.oFlexibleColumnLayout = this.byId("fclCBFBirdSalesOrder");
			
			
			// set empty model to view for parent model
			var emptyModel = this.getModelDefault();
			var model = new JSONModel();
			model.setData(emptyModel);
			this.getView().setModel(model, "cbfSalesModel");

			// set empty model to view for batches			
			var model = new JSONModel();
			model.setData({ modelData: [] });
			this.getView().setModel(model, "cbfBatchSalesModel");

			this.fnShortCut();

			jQuery.sap.delayedCall(1000, this, function () {
				this.getView().byId("party").focus();
            });

			this.handleRouteMatched(null);

			var currRouteName = this.getOwnerComponent().getModel("applicationModel").getProperty("/routeName");
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.getRoute(currRouteName).attachMatched(this.handleRouteMatched, this);
		},

		fnShortCut: function () {
			var currentContext = this;
			$(document).keydown(function (evt) {
				if (evt.keyCode == 83 && evt.ctrlKey) {
					jQuery(document).ready(function ($) {
						evt.preventDefault();
						currentContext.onSave()
					})
				}
				if (evt.keyCode == 67 && evt.ctrlKey) {
					jQuery(document).ready(function ($)
 					{
						evt.preventDefault();
						currentContext.resetModel();
					})
				}
			});
		},


		handleRouteMatched: function () {

			
			// party value help box
			commonFunction.getRolewiseParties(32,this);
			
			// branch value help box
            commonFunction.getAllCommonBranch(this);
			
            // status model
			commonFunction.getReference("CbfSoStatus", "statusModel", this);
			this.loadDialogList();
		},

		getModelDefault: function () {

			return {
				id: null,
				orderdate: commonFunction.setTodaysDate(new Date()),
				fromweight : 0,
				toweight : 0,
				rateperkg : 0,
				statusid : 3081,
				totalsaleweight : 0
			}
		},
		
		onBranchSelect : function(oEvent){
			var branchid = oEvent.getParameter("selectedItem").getKey();
			var currentContext = this;

			var childModel = currentContext.getView().getModel("cbfBatchSalesModel");
			childModel.setData({ modelData : [] })

			var oModel = currentContext.getView().getModel("cbfSalesModel");
			oModel.oData.branchid = branchid;
			oModel.refresh();
		},

		getBatches : function(){
			var oModel = this.getView().getModel("cbfSalesModel");
			var childModel = this.getView().getModel("cbfBatchSalesModel");
			if(oModel.oData.totalsaleweight <= 0 || oModel.oData.rateperkg <= 0){
				MessageBox.error("Total sale weight and rate per Kg should be greater than 0!")
			}
			else{
				if(oModel.oData.fromweight > oModel.oData.toweight){
					MessageBox.error("Fromweight should be less than toweight!")
				}else{
					var model = {
						branchid : oModel.oData.branchid,
						fromweight : (parseFloat(oModel.oData.fromweight)),
						toweight : (parseFloat(oModel.oData.toweight))
					}
					birdSalesOrderService.getBranchwiseReadyForSalesBatches(model,function(data){
						if(data[0].length){
							childModel.setData({ modelData: data[0] });
						}else{
							childModel.setData({ modelData: [] });
							MessageBox.error("No ready for sale batches are available for this branch!")
						}

					})
				}
			}
		},

		saleQtyChange: function (oEvent) {
			var tModel = this.getView().getModel("cbfBatchSalesModel");
			var pModel = this.getView().getModel("cbfSalesModel");
			var totalsaleweight = 0;
			var invalidFlag = false;
			var errBatch = null;

			for (var i = 0; i < tModel.oData.modelData.length; i++) {
				tModel.oData.modelData[i].batchsaleweight = (parseFloat(tModel.oData.modelData[i].birdqty) * parseFloat(tModel.oData.modelData[i].avgweight));
				tModel.oData.modelData[i].batchcost = (parseFloat(tModel.oData.modelData[i].batchsaleweight) * parseFloat(pModel.oData.rateperkg));

				if (isNaN(tModel.oData.modelData[i].batchsaleweight)) {
					invalidFlag = true;
					errBatch = "";

					tModel.oData.modelData[i].batchsaleweight = 0;
					tModel.refresh();
					// if(pModel.oData.totalsaleqty > totalsaleqty){
						totalsaleweight += parseInt(tModel.oData.modelData[i].batchsaleweight);
				}else{
					totalsaleweight += parseInt(tModel.oData.modelData[i].batchsaleweight);

					if(tModel.oData.modelData[i].batchsaleweight > tModel.oData.modelData[i].totalbatchsaleweight){
						tModel.oData.modelData[i].batchsaleweight = 0;
						MessageBox.error("Batch sale weight should be less or equal to the live batch weight!");
					}else if(totalsaleweight > pModel.oData.totalsaleweight){
						tModel.oData.modelData[i].batchsaleweight = 0;
						MessageBox.error("Addition of batch sale weight should be less or equal to the total sale weight!");

					}
				}
			}

			// if (invalidFlag) {

			// 	MessageBox.error("Transfer quantity must be valid and should be between 0 and less than or equal to received quantity.");
			// }

		},

		onExit: function () {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
		},

		onAddNewContent : function()
		{
			this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("cbfbirdsalesorder", "setDetailPage", {viewName:"BirdSalesOrderContentDetail"});
		},

        setDetailPage: function (channel, event, data) {
            this.detailView = sap.ui.view({
                viewName: "sap.ui.elev8rerp.componentcontainer.view.Sales.CBFSales." + data.viewName,
                type: "XML"
            });

            this.detailView.setModel(data.viewModel,"viewModel"); 
            this.oFlexibleColumnLayout.removeAllMidColumnPages();          
            this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
        },

        onListIconPress: function(oEvent) {
		   if (!this._oDialog) {
			  this._oDialog = sap.ui.xmlfragment("sap.ui.elev8rerp.componentcontainer.fragmentview.Sales.CBFSales.BirdSalesOrderDialog", this);
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

	    handleCbfSalesOrderSearch: function(oEvent) {
		   var sValue = oEvent.getParameter("value");
		   var columns = ['partyname'];			
		   var oFilter = new sap.ui.model.Filter(columns.map(function(colName) {
						    return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue); }),
					     false);  // false for OR condition
		   var oBinding = oEvent.getSource().getBinding("items");
		   oBinding.filter([oFilter]);
	    },

	    handleCbfSalesOrderClose: function(oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
			if(selRow[0].statusid == 3082){
				this.getView().byId("btnSave").setEnabled(false)
			}else{
				this.getView().byId("btnSave").setEnabled(true)
			}
            var sModel = this.getView().getModel("cbfSalesModel");
            sModel.setData(selRow[0]);
            sModel.refresh();

           
		   this.bindDetailTable(selRow[0].id);
	    },

	    bindDetailTable : function(salesorderid)
	   	{	var currentContext = this;
			var oModel = this.getView().getModel("cbfBatchSalesModel");
            birdSalesOrderService.getAllBirdSalesOrderDetail({cbfbirdsalesorderid : salesorderid},function(data){
                oModel.setData({modelData : data[0]});
                oModel.refresh();
            })
		},
		
		onSave : function(){
			var currentContext = this;
			var childModel = this.getView().getModel("cbfBatchSalesModel").oData.modelData;
			var parentModel = this.getView().getModel("cbfSalesModel").oData;

			var companyId = commonService.session("companyId");
			var userId = commonService.session("userId");

			parentModel["orderdate"] = commonFunction.getDate(parentModel["orderdate"]);
			parentModel["companyid"] = companyId;
			parentModel["userid"] = userId;
			// insert record in cbf_salesorder  table 
			birdSalesOrderService.saveBirdSalesOrder(parentModel, function (data) {

				if (data.id > 0) {
					var cbfbirdsalesorderid = data.id;

					for (var i = 0; i < childModel.length; i++) {

						if(childModel[i]["birdqty"] > 0){
						childModel[i]["cbfbirdsalesorderid"] = cbfbirdsalesorderid;
						childModel[i]["companyid"] = companyId;
						childModel[i]["userid"] = userId;

						var tempid = childModel[i]["id"]
						var batchsaleweight = parseFloat(childModel[i]["batchsaleweight"]);

						birdSalesOrderService.saveBirdSalesOrderDetail(childModel[i], function (data) {
							if(batchsaleweight > 0){
								var saveMsg = "Bird sales order saved successfully!";
								var editMsg = "Bird sales order updated successfully!";

								var message = tempid == null ? saveMsg : editMsg
								MessageToast.show(message);
								currentContext.resetModel();
								currentContext.loadDialogList();
							}else{
								MessageBox.error("Batch sale weight should be greater than 0!")
							}

						});
					}					}

				}
			});
		},

		loadDialogList : function(){
		
			var todayDate = commonFunction.setTodaysDate(new Date()),
			todayDate = commonFunction.getDate(todayDate);
			var currentContext = this;
			birdSalesOrderService.getAllBirdSalesOrder(todayDate,function(data){
				var sModel = new JSONModel();
				sModel.setData({ modelData: data[0] });
				currentContext.getView().setModel(sModel, "birdsalesorderModel");
			})
		},

		resetModel: function () {
			var emptyModel = this.getModelDefault();
			var model = new JSONModel();
			model.setData(emptyModel);
			this.getView().setModel(model, "cbfSalesModel");

            // set empty model for child table 			
			var model = new JSONModel();
			model.setData({modelData : []});
		    this.getView().setModel(model, "cbfBatchSalesModel");
		},
    });
}, true);
