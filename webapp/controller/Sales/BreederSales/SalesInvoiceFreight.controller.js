sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
], function (JSONModel, BaseController, MessageToast, MessageBox, commonFunction, commonService) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.BreederSales.SalesInvoiceFreight", {
		onInit: function () {

		},

		onBeforeRendering: function () {
			var currentContext = this;
			this.model = this.getView().getModel("viewModel");
			
			commonFunction.getTaxList(this);
			commonFunction.getFreightList(this);

			var oModel = new JSONModel();
			if (this.model != undefined) {
			
				oModel.setData(this.model);
				this.getView().byId("btnDelete").setVisible(false);
			}
			this.getView().setModel(oModel, "editSalesInvoiceFreight");
			//this.itemTotal();
		},

		amountChange : function(oEvent){
			//var sInputValue = oEvent.getSource().getValue();
			this.getView().byId("txtTaxPercent").setValue('');			
		},

		freightTypeChange: function (oEvent) {

			var oModel = this.getView().getModel("editSalesInvoiceFreight");
			oModel.oData.freightname = oEvent.getSource().getSelectedItem().getText();
			oModel.refresh();
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
			var oModel = currentContext.getView().getModel("editSalesInvoiceFreight");

			var isValid = true;
			// Inter state GST Calculation

			
			if (oModel.oData.amount == null || isNaN(oModel.oData.amount)) {
				MessageBox.error("Please enter Freight amount!");
				isValid = false;
			}

			else if (oModel.oData.deliverytostatecode != oModel.oData.statecode) {

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


				this.calcCombinedTaxes(oModel.oData.amount);

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

		itemTotal: function () {

			var model = this.getView().getModel("editSalesInvoiceFreight");
			var taxpercent = this.getView().byId("txtTaxPercent").getValue();
			var amount = this.getView().byId("txtAmount").getValue();
			if (amount == "") {
				amount = 0;
			}
			if (taxpercent == "") {
				taxpercent = 0;
			}
			
			model.oData.amount = amount;

			var taxCalculation = (amount * taxpercent) / 100;
			var lineTotalWithTax = parseFloat(amount) + parseFloat(taxCalculation);
			
			model.oData.taxcalculation = taxCalculation;
			model.oData.lineTotalWithTax = lineTotalWithTax;
			model.oData.linetotal = parseFloat(lineTotalWithTax).toFixed(2);;
			//model.oData.linetotal = parseFloat(lineTotalWithDiscount).toFixed(2);;
			model.refresh();

			this.calcCombinedTaxes(amount);
		},

		calcCombinedTaxes: function (discountedAmt) {
			var model = this.getView().getModel("editSalesInvoiceFreight");
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
			
			this.itemTotal();

			var isValid = true;

			if (!commonFunction.isSelectRequired(this, "selFreightType", "Freight type is required!"))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtAmount", "Amount is required!"))
				isValid = false;

			if (!commonFunction.isPercentage(this, "txtTaxPercent", "Tax Percent is required!"))
				isValid = false;

			if (isValid) {
				if (!commonFunction.isNumber(this, "txtAmount"))
					isValid = false;

			}

			return isValid;
		},

		onAddSalesFreightList: function () {
			if (this.validateForm()) {

				var model = this.getView().getModel("editSalesInvoiceFreight").oData;
				model["companyid"] = commonService.session("companyId");
				model["userid"] = commonService.session("userId");

				this.bus = sap.ui.getCore().getEventBus();
				this.bus.publish("salesinvoice", "onAddSalesInvoiceFreight", { data: model });
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
