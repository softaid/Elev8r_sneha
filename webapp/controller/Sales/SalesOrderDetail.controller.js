sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageBox',
	'sap/ui/elev8rerp/componentcontainer/formatter/fragment.formatter',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
], function (JSONModel, BaseController, MessageBox, formatter, commonFunction, commonService) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.SalesOrderDetail", {

		formatter: formatter,

		onInit: function () {

		},

		itemgroupSelect: function () {
			var itemgroupid = this.getView().byId("txtItemGroup").getSelectedKey();
			var oModel = this.getView().getModel("editSalesorderModel");
			commonFunction.getItemsByInvoiceType(oModel.oData.itemgroupid, oModel.oData.isgstinvoice, this, "itemList");
			var itModel = this.getView().getModel("itemList");
			itModel.refresh();
		},

		onBeforeRendering: function () {

			var currentContext = this;
			this.model = this.getView().getModel("viewModel");
			commonFunction.getTaxList(this);
			var oModel = new JSONModel();

			if (this.model != undefined) {

				oModel.setData(this.model);
				this.getView().byId("btnDelete").setVisible(false);
				commonFunction.getItemsByInvoiceType(this.model.itemgroupid, this.model.isgstinvoice, this, "itemList");

				setTimeout(function () {
					currentContext.checkItemBird(currentContext.model.isbird);
				}, 800);
				commonFunction.getItemGroupModuleWise(this.model.salestypeid, this, "itemGroupModel");
			}

			this.getView().setModel(oModel, "editSalesorderModel");

			if (this.model.iscalcweight == 1) {
				this.getView().byId("frmCalcOnUnit").setVisible(true);
				setTimeout(function () {
					currentContext.getView().byId("chkCalcOnUnit").setState(true);
					currentContext.itemTotal();
				}, 800);
			}
			else
				this.itemTotal();
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
			var oModel = currentContext.getView().getModel("editSalesorderModel");
			//update existing model to set locationid
			oModel.oData.itemid = selRow[0].id;
			oModel.oData.itemcode = selRow[0].itemcode;
			oModel.oData.itemname = selRow[0].itemname;
			oModel.oData.unitcost = selRow[0].unitcost;
			oModel.oData.itemunitname = selRow[0].itemunitname;
			oModel.oData.itemunitid = selRow[0].itemunitid;
			oModel.oData.taxcategoryid = selRow[0].taxcategoryid;
			oModel.oData.taxcategoryname = selRow[0].taxcategoryname;

			// if tax percent is shown
			if (this.getView().byId("eleTaxPercent").getVisible()) {
				if (this.model.taxcategoryid == 1523) // Exempt - Tax Category
					this.getView().byId("eleTaxPercent").setVisible(false);
				else
					this.getView().byId("eleTaxPercent").setVisible(true);
			}
			oModel.refresh();

			this.itemTotal();

			this.getView().byId("txtitemname").setValueState(sap.ui.core.ValueState.None);
			this.getView().byId("txtQuantity").setValueState(sap.ui.core.ValueState.None)

			commonService.getItemAvgWeight({ itemid: selRow[0].id }, function (data) {
				if (data != null && data[0][0] != null) {
					currentContext.getView().byId("txtAvgWeight").setValue(data[0][0].avgweight);
				}
			})
		},

		checkDone: function (oEvent) {
			this.checkItemBird(oEvent.mParameters.state);
			this.itemTotal();
		},

		checkCalcOnUnit: function (oEvent) {
			this.itemTotal();
		},

		checkItemBird: function (input) {

			if (input == 1 || input === true) {
				this.getView().byId("chkIsBird").setState(true);
				this.getView().byId("eleAvgWeight").setVisible(false);
				this.getView().byId("eleWeight").setVisible(true);
				this.getView().byId("frmCalcOnUnit").setVisible(true);


			} else {
				this.getView().byId("chkIsBird").setState(false);
				this.getView().byId("eleAvgWeight").setVisible(false);
				this.getView().byId("eleWeight").setVisible(false);
				this.getView().byId("frmCalcOnUnit").setVisible(false);
			}
		},

		calcQtyonWeight: function () {
			var oModel = this.getView().getModel("editSalesorderModel");
			var avgweight = oModel.oData.avgweight ? oModel.oData.avgweight :0;
			var weight = oModel.oData.weight ? oModel.oData.weight : 0;
			if(avgweight == 0){
				oModel.oData.weight = Math.round(weight);
			}else{
				oModel.oData.quantity = Math.round(weight/avgweight);
			}
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
			var oModel = currentContext.getView().getModel("editSalesorderModel");

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
			commonFunction.isRequired(this, "txtUnitPrice", "Unit cost is requried.");
			commonFunction.isDecimal(this, "txtUnitPrice");
			var ItemDisMsg = this.resourceBundle().getText("purchaseoOrderDetailValidationDis");
			commonFunction.isRequired(this, "txtDiscount", ItemDisMsg);
			//commonFunction.isPercentage(this, "txtDiscount");
		},

		itemTotal: function () {
			var model = this.getView().getModel("editSalesorderModel");
			var itemdiscount = this.getView().byId("txtDiscount").getValue();;
			var taxpercent = this.getView().byId("txtTaxPercent").getValue();
			var unitprice = this.getView().byId("txtUnitPrice").getValue();
			var qty = this.getView().byId("txtQuantity").getValue();
			var weight = this.getView().byId("txtWeight").getValue();
			var isbird = this.getView().byId("chkIsBird").getState();
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


			var basicCost = weight > 0 ? (parseFloat(unitprice) * parseFloat(weight)) : (parseFloat(unitprice) * parseFloat(qty));

			if (calconunit == 1) {
				var basicCost = parseFloat(unitprice) * parseFloat(weight);
				model.oData.iscalcweight = 1;
			}
			else
				model.oData.iscalcweight = 0;

			//var basicCost = parseInt(unitprice) * parseInt(qty);
			var DiscountCal = (parseFloat(basicCost) * parseFloat(itemdiscount)) / 100;
			var lineTotalWithDiscount = parseFloat(basicCost) - parseFloat(DiscountCal);

			var taxCalculation = (parseFloat(lineTotalWithDiscount) * parseFloat(taxpercent)) / 100;
			var lineTotalWithTax = parseFloat(lineTotalWithDiscount) + parseFloat(taxCalculation);


			model.oData.itemdiscount = parseFloat(itemdiscount);
			model.oData.basicCost = parseFloat(basicCost);
			model.oData.DiscountCal = parseFloat(DiscountCal);
			model.oData.lineTotalWithDiscount = parseFloat(lineTotalWithDiscount);
			model.oData.taxcalculation = parseFloat(taxCalculation);
			model.oData.lineTotalWithTax = parseFloat(lineTotalWithTax);
			model.oData.linetotal = parseFloat(lineTotalWithTax).toFixed(2);
			//model.oData.linetotal = parseFloat(lineTotalWithDiscount).toFixed(2);;
			model.refresh();


			this.calcCombinedTaxes(lineTotalWithDiscount);

			var curr = this;
			setTimeout(function () {
			}, 1000);
		},

		calcCombinedTaxes: function (discountedAmt) {
			var model = this.getView().getModel("editSalesorderModel");

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
			var ItemNameMsg = this.resourceBundle().getText("purchaseoOrderDetailValidationItemName");
			var ItemQtyMsg = this.resourceBundle().getText("purchaseoOrderDetailValidationQty");
			var ItemUnitePriceMsg = this.resourceBundle().getText("purchaseoOrderDetailValidationUnit");
			var ItemDisMsg = this.resourceBundle().getText("purchaseoOrderDetailValidationDis");
			var ItemTaxMsg = this.resourceBundle().getText("purchaseoOrderDetailValidationTax");
			var ItemDiscountrangeMsg = this.resourceBundle().getText("purchaseoOrderDetailValidationDisRange");


			if (!commonFunction.isRequired(this, "txtitemname", ItemNameMsg))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtQuantity", ItemQtyMsg))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtUnitPrice", ItemUnitePriceMsg))
				isValid = false;	

			if (!commonFunction.isRequired(this, "txtDiscount", ItemDisMsg))
				isValid = false;

			// if (!commonFunction.isPercentage(this, "txtTaxPercent", ItemTaxMsg))
			// 	isValid = false;

			if (!commonFunction.isPercentage(this, "txtDiscount", ItemDiscountrangeMsg))
				isValid = false;
	

			return isValid;
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

		onSave: function () {

		},

		onDelete: function () {

		},

		onCancel: function () {
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---salesorder--fclSalesOrder");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}
	});
}, true);
