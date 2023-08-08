sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/elev8rerp/componentcontainer/formatter/fragment.formatter',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
], function (JSONModel, BaseController, MessageToast, MessageBox, formatter, commonFunction, commonService) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.BreederSales.SalesDeliveryDetail", {

		formatter: formatter,

		onInit: function () {

			
			//commonFunction.getLocationList(this);
		},

		onBeforeRendering: function () {
			var currentContext = this;
			this.model = this.getView().getModel("viewModel");
			console.log(this.model);
			commonFunction.getTaxList(this);
			var oModel = new JSONModel();
			currentContext.checkItemBird(false);
			if (this.model != undefined) {

				oModel.setData(this.model);
				this.getView().byId("btnDelete").setVisible(false);
				this.getView().byId("itemGroupEle").setVisible(false);
				if(this.model.itemid != undefined)
				this.getView().byId("txtItemName").setVisible(false);

				setTimeout(function () {
					currentContext.checkItemBird(currentContext.model.isbird);
				}, 800);
				commonFunction.getWarehousewiseWarehouseBin(this.model.warehouseid, currentContext);
				if (this.model.warehousebinid != null) {
					var params = {
						itemid: this.model.itemid,
						warehousebinid: this.model.warehousebinid
					};
					currentContext.getItemLiveStock(params);
					
				}

				if(this.model.deliverywithoutso){
					this.getView().byId("itemGroupEle").setVisible(true);
					this.getView().byId("itemname").setVisible(false);
					commonFunction.getWarehousewiseWarehouseBin(this.model.warehouseid, this);
					commonFunction.getItemGroups(this, "itemGroupModel");
				}else{
					// this.getView().byId("txtItemName").setVisible(false);
					this.getView().byId("itemname").setVisible(true);
				}
				if(this.model.salestypeid == 721 || this.model.salestypeid == 723 || this.model.salestypeid == 725){
					// commonFunction.getModuleWiseStartedBatches(this.model.salestypeid, this);		
				}
			}
			this.getView().setModel(oModel, "editSalesdeliveryModel");
			//this.itemTotal();

			var oModel = this.getView().getModel("editSalesdeliveryModel");

			// if tax percent is shown
			if (this.getView().byId("eleTaxPercent").getVisible()) {
				if (this.model.taxcategoryid == 1523) // Exempt - Tax Category
					{
						this.getView().byId("eleTaxPercent").setVisible(false);
						oModel.oData.taxpercent = 0;
						oModel.refresh();
					}		
				else
					this.getView().byId("eleTaxPercent").setVisible(true);
			}

			if(this.model.deliveryquantity){
				var params = {
					itemid: this.model.itemid,
					warehousebinid: this.model.warehousebinid
				};
				this.getItemLiveStock(params);


			}
		},

		batchSelect : function(){
			this.getView().byId("itemGroupEle").setVisible(false);
			var batchid = this.getView().byId("txtBatch").getSelectedKey();

			let batchModel = this.getView().getModel("batchModel").oData.modelData;

			let binArr = [];
			let warehouseBinIdArr = [];
			let warehouseBinCodeArr = [];
			let warehouseBinNameArr = [];

			let itemArr = [];
			let itemNameArr = [];
			let itemIdArr = [];
			let itemCodeArr = [];

			for(let i = 0; i < batchModel.length; i++){
				if(batchModel[i].batchid == batchid){
					warehouseBinIdArr = JSON.parse("[" + batchModel[i].warehousebinids + "]");
					warehouseBinCodeArr = batchModel[i].bincode.split(",");
					warehouseBinNameArr =  batchModel[i].binname.split(",");
					itemNameArr =  batchModel[i].itemname.split(",");
					itemIdArr =  batchModel[i].itemid.split(",");
					itemCodeArr =  batchModel[i].itemcode.split(",");
				}
			}
			
			for(let i = 0; i < warehouseBinIdArr.length; i++){
				binArr.push({
					id : warehouseBinIdArr[i],
					bincode : warehouseBinCodeArr[i],
					binname : warehouseBinNameArr[i]
				})
			}

			for(let i = 0; i < itemIdArr.length; i++){
				itemArr.push({
					itemid : itemIdArr[i],
					itemcode : itemCodeArr[i],
					itemname : itemNameArr[i]
				})
			}
			
			let warehouseBinList = new sap.ui.model.json.JSONModel();
			warehouseBinList.setData({ modelData: binArr });
            this.getView().setModel(warehouseBinList, "warehouseBinList");
		
			let itemList = new sap.ui.model.json.JSONModel();
			itemList.setData({ modelData: itemArr });
            this.getView().setModel(itemList, "itemList");
		},


		itemgroupSelect: function () {
			var itemgroupid = this.getView().byId("txtItemGroup").getSelectedKey();

			var oModel = this.getView().getModel("editSalesdeliveryModel");
			console.log(oModel.oData.warehousebinid);
			commonFunction.getItemsLiveStockByWHid(itemgroupid, this.model.warehouseid, oModel.oData.warehousebinid, this, "itemList");
			this.getView().byId("txtItemName").setEnabled(true);
		},


		itemSelect: function () {
			var itemid = this.getView().byId("txtItemName").getSelectedKey();
			var oModel = this.getView().getModel("editSalesdeliveryModel");
			oModel.oData.itemid = itemid;
			oModel.oData.itemname = this.getView().byId("txtItemName").getSelectedItem().mProperties.text;
			oModel.oData.itemcode = this.getView().byId("txtItemName").getSelectedItem().mProperties.additionaltext;
			oModel.refresh();
			
			var iModel = this.getView().getModel("itemList");
			console.log(iModel);
			for(var i = 0; i < iModel.oData.modelData.length; i++){
				if(itemid == iModel.oData.modelData[0].itemid){
					oModel.oData.rate = iModel.oData.modelData[0].unitcost.toFixed(3);
					oModel.oData.taxcategoryid = iModel.oData.modelData[0].taxcategoryid;
					oModel.oData.itemcode = iModel.oData.modelData[0].itemcode;
					oModel.refresh();
				}
			}

			// if tax percent is shown
			if (this.getView().byId("eleTaxPercent").getVisible()) {
				if (oModel.oData.taxcategoryid == 1523) // Exempt - Tax Category
					{
						this.getView().byId("eleTaxPercent").setVisible(false);
						oModel.oData.taxpercent = 0;
						oModel.refresh();
					}		
				else
					this.getView().byId("eleTaxPercent").setVisible(true);
			}
			
			var params = {
				itemid: itemid,
				warehousebinid: oModel.oData.warehousebinid
			};
			this.getItemLiveStock(params);

		},

		getItemLiveStock : function(params){
			var currentContext = this;
			commonService.getItemLiveStock(params, function (data) {
				var oModel = currentContext.getView().getModel("editSalesdeliveryModel");
				oModel.oData.stockquantity = data[0][0].instock;
				oModel.refresh();

				currentContext.getView().byId("txtDelQuantity").setEnabled(false);
				//currentContext.getView().byId("txtDelQuantity").setValue('0');
				if (!isNaN(data[0][0].instock)) {
					if (data[0][0].instock > 0)
						currentContext.getView().byId("txtDelQuantity").setEnabled(true);
					else
						currentContext.getView().byId("txtDelQuantity").setEnabled(false);
				}
			});
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
			var oModel = currentContext.getView().getModel("editSalesdeliveryModel");

			inputId = inputId.substring(inputId.lastIndexOf('-') + 1);

			oModel.oData.warehousebinid = selRow[0].id;
			oModel.oData.towarehousebincode = selRow[0].bincode;
			oModel.oData.towarehousebinname = selRow[0].binname;
			oModel.refresh();

			this.getView().byId("txtToWarehouseBinCode").setValueState(sap.ui.core.ValueState.None);

			if(!this.model.deliverywithoutso){
				var params = {
					itemid: oModel.oData.itemid,
					warehousebinid: oModel.oData.warehousebinid
				};

				this.getItemLiveStock(params);
			}
		},

		checkDone: function (oEvent) {
			let batchArr = [];
			let currentContext = this;

			if(this.model.salestypeid == 721 || this.model.salestypeid == 723 || this.model.salestypeid == 725){

				commonService.getModuleWiseStartedBatches({ moduleid: currentContext.model.salestypeid }, function (data) {
					if(data.length){
						if(data[0].length){
							for(let i = 0; i < data[0].length; i++){
								if(data[0][i].warehouseid != currentContext.model.warehouseid){
									batchArr.push(data[0][i]);
								}
							}
						}
					}
					var batchModel = new sap.ui.model.json.JSONModel();
					batchModel.setData({ modelData: batchArr });
					currentContext.getView().setModel(batchModel, "batchModel");
				});
			}
			
			this.checkItemBird(oEvent.mParameters.state);
		},

		checkItemBird: function (input) {

			if (input === true) {
				this.getView().byId("eleWeight").setVisible(true);
				this.getView().byId("eleDelWeight").setVisible(true);
				this.getView().byId("batchEle").setVisible(true);
			} else {
				this.getView().byId("eleWeight").setVisible(false);
				this.getView().byId("eleDelWeight").setVisible(false);
				this.getView().byId("batchEle").setVisible(false);
			}
		},

		onDelQtyChange: function () {
			var delqty = this.getView().byId("txtDelQuantity").getValue();
			var stkqty = this.getView().byId("txtItemStock").getValue();
			var ordqty = this.getView().byId("txtQuantity").getValue();

			var oModel = this.getView().getModel("editSalesdeliveryModel");
			var delqty = oModel.oData.deliveryquantity;
			var stkqty = oModel.oData.stockquantity;
			var ordqty = oModel.oData.quantity;


			if (!isNaN(delqty) && !isNaN(stkqty) && !isNaN(ordqty)) {
				if(!this.model.deliverywithoutso){
					if (stkqty > ordqty) {
						if (delqty > ordqty) {
							MessageBox.error("Delivery quantity must be less than or equal to order quantity!");
							this.getView().byId("txtDelQuantity").getValue('');
						}
						else {
							oModel.oData.statusid = (delqty < ordqty) ? 1582 : 1581;
						}
					}
					else if (stkqty < ordqty) {
						if (delqty > stkqty) {
							MessageBox.error("Delivery quantity must be less than or equal to stock quantity!");
							this.getView().byId("txtDelQuantity").getValue('');
						}
						else {
							oModel.oData.statusid = 1582;
						}
					}
					else if (stkqty == ordqty) {
						if (delqty > ordqty) {
							MessageBox.error("Delivery quantity must be less than or equal to order quantity!");
							this.getView().byId("txtDelQuantity").getValue('');
						}
						else {
							oModel.oData.statusid = (delqty < ordqty) ? 1582 : 1581;
						}
					}
				}else{
					if (delqty > stkqty) {
						MessageBox.error("Delivery quantity must be less than or equal to stock quantity!");
						this.getView().byId("txtDelQuantity").getValue('');
					}
				}
				oModel.refresh();

			} else {
				MessageBox.error("Please enter valid delivery quantity!");
				this.getView().byId("txtDelQuantity").getValue('');
			}

			this.itemTotal();
		},

		onAddSalesOrderList: function () {

			var oModel = this.getView().getModel("editSalesdeliveryModel");
		},


		onAddSalesOrderList: function () {
			if (this.validateForm()) {

				var model = this.getView().getModel("editSalesorderModel").oData;

				model["companyid"] = commonService.session("companyId");
				model["userid"] = commonService.session("userId");

				this.bus = sap.ui.getCore().getEventBus();
				this.bus.publish("salesorder", "onAddSalesOrder", { data: model });
				this.onCancel();
			}
		},

		calcQtyonWeight: function () {
			var oModel = this.getView().getModel("editSalesdeliveryModel");
			var avgweight = oModel.oData.avgweight ? oModel.oData.avgweight : 0;
			var weight = oModel.oData.weight ? oModel.oData.weight : 0;
			oModel.oData.quantity = Math.round(weight / avgweight);
			oModel.refresh();

			this.getView().byId("txtUnitPrice").focus();
		},

		//Dialog for tax
		handleTaxValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			// if (!this._valueHelpDialog) {
			this._valueHelpDialog = sap.ui.xmlfragment(
				"sap.ui.elev8rerp.componentcontainer.fragmentview.Common.TaxDialog",
				this
			);
			this.getView().addDependent(this._valueHelpDialog);
			// }
			this._valueHelpDialog.open(sInputValue);
		},

		handleTaxSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['taxcode', 'taxname', 'taxpercent'];
			var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
			}),
				false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		onTaxDialogClose: function (oEvent) {
			var currentContext = this;
			var aContexts = oEvent.getParameter("selectedContexts");

			// if(aContexts != undefined){
			var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
			var oModel = currentContext.getView().getModel("editSalesdeliveryModel");

			var isValid = true;
			// Inter state GST Calculation
			if (oModel.oData.deliverytostatecode != oModel.oData.warehousestatecode) {

				if (oModel.oData.deliverytoisunionterritory == 1 || oModel.oData.billtoisunionterritory == 1) {
					if (selRow[0].taxtype != "UTGST") {
						MessageBox.error("Please select Tax Type UTGST.");
						isValid = false;
					}
				}
				else {
					if (selRow[0].taxtype != "IGST") {
						MessageBox.error("Please select Tax Type IGST.");
						isValid = false;
					}
				}
			}
			// Intra state GST Calculation
			else {
				if (selRow[0].taxtype != "Combined") {
					MessageBox.error("Please select Combined Tax");
					isValid = false;
				}
			}

			if (isValid) {
				//update existing model to set locationid
				oModel.oData.taxid = selRow[0].id;
				oModel.oData.taxcode = selRow[0].taxcode;
				oModel.oData.taxtype = selRow[0].taxtype;
				oModel.oData.taxname = selRow[0].taxname;
				oModel.oData.taxpercent = selRow[0].taxpercent;

				oModel.oData.combinedtaxes = selRow[0].combinedtaxes;
				oModel.oData.taxesname = selRow[0].taxesname;
				oModel.oData.taxpercents = selRow[0].taxpercents;
				oModel.oData.taxtypes = selRow[0].taxtypes;

				oModel.refresh();
				this.itemTotal();
				this.getView().byId("txtTaxPercent").setValueState(sap.ui.core.ValueState.None)
			}
			else {
				this.getView().byId("txtTaxPercent").setValue('');
				this.getView().byId("txtTaxPercent").setValueState(sap.ui.core.ValueState.Error)
			}
		},

		resourceBundle: function () {
			var currentContext = this;
			var oBundle = this.getModel("i18n").getResourceBundle()
			return oBundle
		},

		onQuantityChange: function () {
			this.itemTotal();
			commonFunction.isRequired(this, "txtQuantity", "Quntity is requierd.");
			commonFunction.isNumber(this, "txtQuantity");
		},

		onDiscountchange: function () {
			this.itemTotal();
			commonFunction.isRequired(this, "txtrate", "Rate is requried.");
			commonFunction.isNumber(this, "txtrate");
			var ItemDisMsg = this.resourceBundle().getText("purchaseoOrderDetailValidationDis");
			commonFunction.isRequired(this, "txtDiscount", ItemDisMsg);
			commonFunction.isPercentage(this, "txtDiscount");
		},

		checkCalcOnUnit: function (oEvent) {
			this.itemTotal();
		},

		itemTotal: function () {
			var model = this.getView().getModel("editSalesdeliveryModel");
			var itemdiscount = model.oData.discount;
			var taxpercent = model.oData.taxpercent;
			var rate = model.oData.rate;

			var calconunit = this.getView().byId("chkCalcOnUnit").getState();
			var qty = 0;

			if(calconunit == 1)
				qty = this.getView().byId("txtDelWeight").getValue() > 0 ? this.getView().byId("txtDelWeight").getValue() : this.getView().byId("txtDelQuantity").getValue();
			else
				qty = this.getView().byId("txtDelQuantity").getValue();
			
			if (qty == "") {
				qty = 0;
			}
			if (rate == "") {
				rate = 0;
			}
			if (itemdiscount == "") {
				itemdiscount = 0;
			}
			if (taxpercent == "") {
				taxpercent = 0;
			}

			var basicCost = parseFloat(rate) * parseInt(qty);
			var DiscountCal = (basicCost * itemdiscount) / 100;
			var lineTotalWithDiscount = basicCost - DiscountCal;

			var taxCalculation = (lineTotalWithDiscount * taxpercent) / 100;
			var lineTotalWithTax = lineTotalWithDiscount + taxCalculation;

			model.oData.itemdiscount = itemdiscount;
			model.oData.basicCost = basicCost;
			model.oData.DiscountCal = DiscountCal;
			model.oData.lineTotalWithDiscount = lineTotalWithDiscount;
			model.oData.taxcalculation = taxCalculation;
			model.oData.lineTotalWithTax = lineTotalWithTax;
			//model.oData.linetotal = parseFloat(lineTotalWithTax).toFixed(2);;
			model.oData.linetotal = parseFloat(lineTotalWithDiscount).toFixed(2);;
			model.refresh();


			this.calcCombinedTaxes(lineTotalWithDiscount);
		},

		calcCombinedTaxes: function (discountedAmt) {
			var model = this.getView().getModel("editSalesdeliveryModel");


			if (model.oData.taxtype != undefined) {
				if (model.oData.taxtype.toUpperCase() == "COMBINED") {


					model.oData.cgstid = null;
					model.oData.cgstpercent = null;
					model.oData.cgstamount = null;

					model.oData.sgstid = null;
					model.oData.sgstpercent = null;
					model.oData.sgstamount = null;

					model.oData.igstid = null;
					model.oData.igstpercent = null;
					model.oData.igstamount = null;

					model.oData.utgstid = null;
					model.oData.utgstpercent = null;
					model.oData.utgstamount = null;

					// Tax types added for other countries
					model.oData.vatid = null;
					model.oData.vatpercent = null;
					model.oData.vatamount = null;


					if (model.oData.combinedtaxes != undefined) {
						var taxids = model.oData.combinedtaxes.split(',');
						var taxnames = model.oData.taxesname.split(',');
						var taxpercents = model.oData.taxpercents.split(',');
						var taxtypes = model.oData.taxtypes.split(',');

						for (var i = 0; i < taxids.length; i++) {
							if (taxtypes[i] == "UTGST") {
								model.oData.utgstid = taxids[i];
								model.oData.utgstpercent = taxpercents[i];
								model.oData.utgstamount = parseFloat(discountedAmt * taxpercents[i] / 100).toFixed(2);
							}
							else if (taxtypes[i] == "CGST") {
								model.oData.cgstid = taxids[i];
								model.oData.cgstpercent = taxpercents[i];
								model.oData.cgstamount = parseFloat(discountedAmt * taxpercents[i] / 100).toFixed(2);
							}
							else if (taxtypes[i] == "SGST") {
								model.oData.sgstid = taxids[i];
								model.oData.sgstpercent = taxpercents[i];
								model.oData.sgstamount = parseFloat(discountedAmt * taxpercents[i] / 100).toFixed(2);
							}
							else if (taxtypes[i] == "IGST") {
								model.oData.igstid = taxids[i];
								model.oData.igstpercent = taxpercents[i];
								model.oData.igstamount = parseFloat(discountedAmt * taxpercents[i] / 100).toFixed(2);
							}
						}
					}
				}
				else {

					if (model.oData.taxtype == "UTGST") {
						model.oData.utgstid = model.oData.taxid;
						model.oData.utgstpercent = model.oData.taxpercent;
						model.oData.utgstamount = parseFloat(discountedAmt * model.oData.taxpercent / 100).toFixed(2);
					}
					else if (model.oData.taxtype == "CGST") {
						model.oData.cgstid = model.oData.taxid;
						model.oData.cgstpercent = model.oData.taxpercent;
						model.oData.cgstamount = parseFloat(discountedAmt * model.oData.taxpercent / 100).toFixed(2);
					}
					else if (model.oData.taxtype == "SGST") {
						model.oData.sgstid = model.oData.taxid;
						model.oData.sgstpercent = model.oData.taxpercent;
						model.oData.sgstamount = parseFloat(discountedAmt * model.oData.taxpercent / 100).toFixed(2);
					}
					else if (model.oData.taxtype == "IGST") {
						model.oData.igstid = model.oData.taxid;
						model.oData.igstpercent = model.oData.taxpercent;
						model.oData.igstamount = parseFloat(discountedAmt * model.oData.taxpercent / 100).toFixed(2);
					}
				}
			}

			model.refresh();
		},

		validateForm: function () {
			var isValid = true;

			if (!commonFunction.isRequiredDdl(this, "txtItemName", "Item name selection is required!"))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtItemStock", "Item stock is required!"))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtQuantity", "Item Order quantity is required!"))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtDelQuantity", "Item delivery quantity is required!"))
				isValid = false;

			if (isValid) {
				if (!commonFunction.isNumberGreaterThanZero(this, "txtDelQuantity", "Item delivery quantity is required!")) {
					MessageBox.error("Item delivery quantity must be greater than zero!");
					isValid = false;
				}
			}
			return isValid;
		},

		onAddSalesDeliveryList: function () {
			if (this.validateForm()) {

				var model = this.getView().getModel("editSalesdeliveryModel").oData;

				model["companyid"] = commonService.session("companyId");
				model["batchid"] = this.getView().byId("txtBatch").getSelectedKey() == "" ? null : this.getView().byId("txtBatch").getSelectedKey();
				model["userid"] = commonService.session("userId");
				model["index"] = this.model.index;

				this.bus = sap.ui.getCore().getEventBus();
				this.bus.publish("salesdelivery", "onAddSalesDelivery", { data: model });
				this.onCancel();
			}
		},

		onSave: function () {

		},

		onDelete: function () {

		},

		onCancel: function () {
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---salesdelivery--fclBreederSalesDelivery");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}
	});
}, true);
