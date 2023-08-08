sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageBox',
	'sap/ui/elev8rerp/componentcontainer/formatter/fragment.formatter',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
], function (JSONModel, BaseController, MessageBox, formatter, commonFunction, commonService) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.BreederSales.SalesInvoiceDetail", {

		formatter : formatter,

		onInit: function () {
			commonFunction.getItemGroups(this, "itemGroupModel");
		},

		onBeforeRendering: function () {
			var currentContext = this;
			this.model = this.getView().getModel("viewModel");
			commonFunction.getTaxList(this);
			var oModel = new JSONModel();

			this.getView().byId("batchEle").setVisible(false);

			if (this.model != undefined) {
			
				oModel.setData(this.model);
				this.getView().byId("btnDelete").setVisible(false);

				commonFunction.getItemsByInvoiceType(this.model.itemgroupid, this.model.isgstinvoice, this, "itemList");

				if (this.model.isgstinvoice == 1562){ // Bill of Supply - Hide tax fields
					// this.getView().byId("eleTaxPercent").setVisible(false);
				}
				else{
					this.getView().byId("eleTaxPercent").setVisible(true);
				}

				setTimeout(function () {
					currentContext.checkItemBird(currentContext.model.isbird);
				}, 800);

				if(this.model.salesinvoicewithoutso && this.model.salesinvoicewithoutdelivery){
					this.getView().byId("itemGroupEle").setVisible(true);
					this.getView().byId("txtWarehouseBin").setVisible(true);
					this.getView().byId("txtStkQty").setVisible(true);
					commonFunction.getWarehousewiseWarehouseBin(this.model.warehouseid, this);
					commonFunction.getItemGroups(this, "itemGroupModel");

					if(this.model.salestypeid == 721 || this.model.salestypeid == 723 || this.model.salestypeid == 725){
						// commonFunction.getModuleWiseStartedBatches(this.model.salestypeid, this);		
					}
				}
			}
			
			this.getView().setModel(oModel, "editSalesinvoiceModel");

			if(this.model.iscalcweight == 1){
				this.getView().byId("frmCalcOnUnit").setVisible(true);
				setTimeout(function () {
					currentContext.getView().byId("chkCalcOnUnit").setState(true);
					currentContext.itemTotal();
				}, 800);
			}
			else
				this.itemTotal();
			
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
					id : itemIdArr[i],
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

			var oModel = this.getView().getModel("editSalesinvoiceModel");
			console.log(oModel.oData.warehousebinid);
			commonFunction.getItemsLiveStockByWHid(itemgroupid, this.model.warehouseid, oModel.oData.warehousebinid, this, "itemList");
			this.getView().byId("txtItemName").setEnabled(true);
		},

		//Dialog for item
		handleItemValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			// if (!this._valueHelpDialog) {
			this._valueHelpDialog = sap.ui.xmlfragment(
				"sap.ui.elev8rerp.componentcontainer.fragmentview.Common.ItemDialog",
				this
			);
			this.getView().addDependent(this._valueHelpDialog);
			// }
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

			// if(aContexts != undefined){
			var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });

			console.log(selRow[0]);
			var oModel = currentContext.getView().getModel("editSalesinvoiceModel");
			//update existing model to set locationid
			oModel.oData.itemid = selRow[0].id;
			oModel.oData.itemcode = selRow[0].itemcode;
			oModel.oData.itemname = selRow[0].itemname;
			oModel.oData.unitprice = selRow[0].unitcost;
			oModel.oData.itemunitname = selRow[0].itemunitname;
			oModel.oData.itemunitid = selRow[0].itemunitid;
			oModel.oData.taxcategoryid = selRow[0].taxcategoryid;
			oModel.oData.taxcategoryname = selRow[0].taxcategoryname;
			// if tax percent is shown
			if (this.getView().byId("eleTaxPercent").getVisible()) {
				if (this.model.taxcategoryid == 1523){ // Exempt - Tax Category
				//	this.getView().byId("eleTaxPercent").setVisible(false);
				}
				else{
					this.getView().byId("eleTaxPercent").setVisible(true);
				}
			}
			oModel.refresh();

			this.itemTotal();

			this.getView().byId("txtItemName").setValueState(sap.ui.core.ValueState.None);
			this.getView().byId("txtQuantity").setValueState(sap.ui.core.ValueState.None);

			commonService.getItemAvgWeight({ itemid: selRow[0].id }, function (data) {
				if (data != null && data[0][0] != null) {
					currentContext.getView().byId("txtAvgWeight").setValue(data[0][0].avgweight);
				}
			})

			var params = {
				itemid: selRow[0].id,
				warehousebinid: oModel.oData.warehousebinid
			};
			this.getItemLiveStock(params);
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
			var oModel = currentContext.getView().getModel("editSalesinvoiceModel");

			inputId = inputId.substring(inputId.lastIndexOf('-') + 1);

			oModel.oData.warehousebinid = selRow[0].id;
			oModel.oData.warehousebincode = selRow[0].bincode;
			oModel.oData.warehousebinname = selRow[0].binname;
			oModel.refresh();

			this.getView().byId("txtWarehouseBin").setValueState(sap.ui.core.ValueState.None);
		},

		getItemLiveStock : function(params){
			var currentContext = this;
			commonService.getItemLiveStock(params, function (data) {
				var oModel = currentContext.getView().getModel("editSalesinvoiceModel");
				oModel.oData.stockquantity = data[0][0].instock;
				oModel.refresh();
			});
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

		checkCalcOnUnit: function (oEvent) {
			this.itemTotal();
		},

		checkItemBird: function (input) {
			if (input === true) {
				this.getView().byId("eleAvgWeight").setVisible(true);
				this.getView().byId("eleWeight").setVisible(true);
				this.getView().byId("frmCalcOnUnit").setVisible(true);
				this.getView().byId("batchEle").setVisible(true);
			} else {
				this.getView().byId("eleAvgWeight").setVisible(false);
				this.getView().byId("eleWeight").setVisible(false);
				this.getView().byId("frmCalcOnUnit").setVisible(false);
				this.getView().byId("batchEle").setVisible(false);
			}
		},

		calcQtyonWeight: function () {
			var oModel = this.getView().getModel("editSalesinvoiceModel");
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
			var oModel = currentContext.getView().getModel("editSalesinvoiceModel");

			var isValid = true;
			// Inter state GST Calculation
			if (oModel.oData.deliverytostatecode != oModel.oData.warehousestatecode) {

				if (oModel.oData.deliverytoisunionterritory == 1 || oModel.oData.isunionterritory == 1) {
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

		onQuantityChange: function (oEvent) {
			var itemQty = oEvent.getParameter("value");
			var oModel = this.getView().getModel("editSalesinvoiceModel");
			if(itemQty > oModel.oData.stockquantity){
				MessageBox.error("Sale quantity should be equal or less that instock quantity.");
				oModel.oData.quantity = 0;
				oModel.refresh();
			}else{
				this.itemTotal();
			}
			commonFunction.isRequired(this, "txtQuantity", "Quntity is requierd.");
			commonFunction.isNumber(this, "txtQuantity");
		},

		onDiscountchange: function () {
			this.itemTotal();
			commonFunction.isRequired(this, "txtUnitPrice", "Unit cost is requried.");
			commonFunction.isDecimal(this, "txtUnitPrice");
			var ItemDisMsg = this.resourceBundle().getText("purchaseoOrderDetailValidationDis");
			commonFunction.isRequired(this, "txtDiscount", ItemDisMsg);
			commonFunction.isPercentage(this, "txtDiscount");
		},

		itemTotal: function () {
			var model = this.getView().getModel("editSalesinvoiceModel");
			var itemdiscount = this.getView().byId("txtDiscount").getValue();
			var weight = this.getView().byId("txtWeight").getValue();
			var taxpercent = this.getView().byId("txtTaxPercent").getValue();
			var unitprice = this.getView().byId("txtUnitPrice").getValue();
			//var qty = this.getView().byId("txtQuantity").getValue();
			var qty = this.getView().byId("txtWeight").getValue() > 0 ? this.getView().byId("txtWeight").getValue() : this.getView().byId("txtQuantity").getValue();
			var calconunit = this.getView().byId("chkCalcOnUnit").getState();

			if (qty == "") {
				qty = 0;
			}
			if (weight == "") {
				weight = 0;
			}
			if (unitprice == "") {
				unitprice = 0;
			}
			if (itemdiscount == "") {
				itemdiscount = 0;
			}
			if (taxpercent == "") {
				taxpercent = 0;
			}

			var value = parseFloat(unitprice) * parseFloat(qty);
			var basicCost = parseFloat(value).toFixed(3)
			if(calconunit == 1){
				var value = parseFloat(unitprice) * parseFloat(weight);	
				var basicCost = parseFloat(value).toFixed(3)
				model.oData.iscalcweight = 1;
			}
			else
				model.oData.iscalcweight = 0;
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
			model.oData.linetotal = parseFloat(lineTotalWithTax).toFixed(2);;
			//model.oData.linetotal = parseFloat(lineTotalWithDiscount).toFixed(2);;
			model.refresh();


			this.calcCombinedTaxes(lineTotalWithDiscount);

			var curr = this;
			setTimeout(function () {
			}, 1000);
		},

		calcCombinedTaxes: function (discountedAmt) {
			var model = this.getView().getModel("editSalesinvoiceModel");

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
						//var taxnames = model.oData.taxesname.split(',');
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
							// Tax type added for other countries
							else if (model.oData.taxtype == "VAT") {
								model.oData.vatid = model.oData.taxid;
								model.oData.vatpercent = model.oData.taxpercent;
								model.oData.vatamount = parseFloat(discountedAmt * model.oData.taxpercent / 100).toFixed(2);
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
			var ItemNameMsg = this.resourceBundle().getText("purchaseoOrderDetailValidationItemName");
			var ItemQtyMsg = this.resourceBundle().getText("purchaseoOrderDetailValidationQty");
			var ItemDisMsg = this.resourceBundle().getText("purchaseoOrderDetailValidationDis");
			var ItemTaxMsg = this.resourceBundle().getText("purchaseoOrderDetailValidationTax");


			if (!commonFunction.isRequired(this, "txtItemName", ItemNameMsg))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtQuantity", ItemQtyMsg))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtDiscount", ItemDisMsg))
				isValid = false;

			if (!commonFunction.isPercentage(this, "txtTaxPercent", ItemTaxMsg))
				isValid = false;

			if (isValid) {
				if (!commonFunction.isNumber(this, "txtQuantity"))
					isValid = false;

				if (!commonFunction.isPercentage(this, "txtDiscount"))
					isValid = false;
			}

			if((this.getView().byId("txtQuantity").getValue()) <= 0){
				MessageBox.error("Quantity should be greater than 0!");
				isValid = false;
			}

			return isValid;
		},

		onAddSalesInvoiceList: function () {
			if (this.validateForm()) {
				var model = this.getView().getModel("editSalesinvoiceModel").oData;
				model["companyid"] = commonService.session("companyId");
				
				model["batchid"] = this.getView().byId("txtBatch").getSelectedKey() == "" ? null : this.getView().byId("txtBatch").getSelectedKey();
				model["userid"] = commonService.session("userId");
				this.bus = sap.ui.getCore().getEventBus();
				this.bus.publish("salesinvoice", "onAddSalesInvoice", { data: model });
				this.onCancel();
			}
		},

		onSave: function () {

		},

		onDelete: function () {

		},

		onCancel: function () {
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---invoicegenerations--fclBreederSalesInvoice");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}
	});
}, true);
