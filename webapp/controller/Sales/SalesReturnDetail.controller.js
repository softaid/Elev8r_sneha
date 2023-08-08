sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageBox',
	'sap/m/MessageToast',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
    'sap/ui/elev8rerp/componentcontainer/services/Sales/SalesReturn.service',
    'sap/ui/elev8rerp/componentcontainer/services/Sales/SalesDelivery.service',
], function (JSONModel, BaseController, MessageBox, MessageToast, commonFunction, commonService, salesReturnService, salesDeliveryService) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.BreederSales.SalesReturnDetail", {
		onInit: function () {
			this.bus = sap.ui.getCore().getEventBus();
		},

		onBeforeRendering : function(){
            this.model = this.getView().getModel("viewModel");
			var oModel = new JSONModel();
			
		    if(this.model.id != null){				  
			  
				var currentContext = this;
			  	salesReturnService.getSalesReturn({id : this.model.id},function(data){
					if(data[0].length){
						oModel.setData(data[0][0]);

						currentContext.getAllSalesDeliveryDetail(data[0][0].transactionid);
					}
				});

			}else{
				// hide delete button
				// this.getView().byId("btnDelete").setVisible(false);
			}

			this.getView().setModel(oModel,"editSalesReturnModel");
			
			commonFunction.getItemGroups(this, "itemGroupModel");

			commonFunction.getWarehouseList(this);
			
			//bind machine type dropdown		
			commonFunction.getReference("retusts", "statusList", this);
			
			this.getView().byId("rate").setEnabled(false);

			var currentContext = this;
            var arr=[];
            var transactionModel = new sap.ui.model.json.JSONModel();
            
			salesDeliveryService.getAllSalesDelivery(function(data){
				for(var i = 0; i < data[0].length; i++){
					data[0][i].transactionno = data[0][i].salesdeliveryno;
					if(data[0][i].isinvoicedone == 0){
						arr.push(data[0][i]);
					}
				}
				transactionModel.setData({ modelData: arr });
				transactionModel.setSizeLimit(500);
				currentContext.getView().setModel(transactionModel, "transactionModel");
			})
		},
        
        onTransactionSelect : function(){
            var transactionid = this.getView().byId("transaction").getSelectedKey();
			this.getView().byId("item").setSelectedKey("");
			this.getView().byId("warehouse").setValue("");
			this.getView().byId("warehousebin").setValue("");
			this.getView().byId("instock").setValue("");
			this.getView().byId("quantity").setValue("");
			this.getView().byId("rate").setValue("");
			this.getView().byId("amount").setValue("");
			this.getView().byId("status").setSelectedKey("");

			this.getAllSalesDeliveryDetail(transactionid);

        },

		getAllSalesDeliveryDetail : function(transactionid){
			var itemList = new sap.ui.model.json.JSONModel();

            var currentContext = this;
			salesDeliveryService.getAllSalesDeliveryDetail({salesdeliveryid : transactionid}, function(data){
				itemList.setData({ modelData: data[0] });
				currentContext.getView().setModel(itemList, "itemList");
			})
		},

		onitemSelect : function(oEvent){

            var itemid = this.getView().byId("item").getSelectedKey();
            var iModel = this.getView().getModel("itemList").oData.modelData;
            
            var oModel = this.getView().getModel("editSalesReturnModel");
            for(var i = 0; i < iModel.length; i++){
                if(iModel[i].itemid == itemid){
                    oModel.oData.itemid = iModel[i].itemid;
                    oModel.oData.warehouseid = iModel[i].towarehouseid;
                    oModel.oData.warehousename = iModel[i].towarehousename;
                    oModel.oData.warehousebinid = iModel[i].warehousebinid;
                    oModel.oData.binname = iModel[i].towarehousebinname;
                    oModel.oData.unitcost = iModel[i].rate;
                    oModel.oData.instock = iModel[i].deliveryquantity;
                    oModel.oData.quantity = iModel[i].deliveryquantity;
                    oModel.oData.amount = (parseFloat(iModel[i].quantity) * parseFloat(iModel[0].rate));
                }
            }
            			
		},

		onQtyChange : function(oEvent){
			var quantity = this.getView().byId("quantity").getValue();
			this.getView().byId("rate").setEnabled(true);
			var oModel = this.getView().getModel("editSalesReturnModel");
			if(quantity > oModel.oData.instock){
				MessageBox.error("Return quantity should be less than or qual to instock quantity.");

				oModel.oData.quantity = 0;
				oModel.refresh();
			}
			this.calculateAmt();
		},

		calculateAmt : function(){
			var quantity = this.getView().byId("quantity").getValue();
			var rate = this.getView().byId("rate").getValue();
			var oModel = this.getView().getModel("editSalesReturnModel");
			oModel.oData.amount = (parseFloat(quantity) * parseFloat(rate));
			oModel.refresh();
		},

		validateForm: function () {
			var isValid = true;
			var oModel = this.getView().getModel("editSalesReturnModel");
            if (!commonFunction.isRequired(this, "date", "Return date is required!"))
                isValid = false;

            if (!commonFunction.isRequiredDdl(this, "transaction", "Please select transaction."))
                isValid = false;

            if (!commonFunction.isRequiredDdl(this, "item", "Please select item."))
				isValid = false;
			
			if (!commonFunction.isRequiredDdl(this, "status", "Please select status."))
				isValid = false;
			

            return isValid;
        },

		onSave : function(){
		
			var currentContext = this;
			if (this.validateForm()) {
				var model = this.getView().getModel("editSalesReturnModel").oData;
				model["date"] = commonFunction.getDate(model.date);
				model["companyid"] = commonFunction.session("companyId"); 
				model["userid"] = commonFunction.session("userId"); 
				salesReturnService.saveSalesReturn(model, function(data){	
					console.log(data);
					if(data.id > 0){
						var createMsg = "Sales return done successfully!";
						var editedMsg = "Sales return updated successfully!";
						
						var message = model.id == null ? createMsg : editedMsg;
						currentContext.onCancel();
						MessageToast.show(message);
						currentContext.bus = sap.ui.getCore().getEventBus();
						currentContext.bus.publish("loaddata", "loadData");
					}
				});
			}
		},

 		onCancel : function()
		{
			this.bus.unsubscribe("salesreturn", "salesreturn", this.setDetailPage, this);
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---salesreturn--fclSalesReturn");
			//this.oFlexibleColumnLayout.removeAllMidColumnPages();
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}
	});
}, true);

