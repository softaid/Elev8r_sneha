sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageBox',
    'sap/m/MessageToast',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',	
	'sap/ui/elev8rerp/componentcontainer/services/ApplicationSettings.service',		
		
], function (JSONModel, BaseController, MessageBox, MessageToast, commonFunction, commonService, applicationSettingsService) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.ApplicationSettings.ApplicationSettings", {
        
        onInit: function () {
			
			var currentContext = this;	
			this.startDay = null;
			this.startMonth = null;

			this.handleRouteMatched(null);
			
			var currRouteName = this.getOwnerComponent().getModel("applicationModel").getProperty("/routeName");
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.getRoute(currRouteName).attachMatched(this.handleRouteMatched, this);
        },

		handleRouteMatched : function (evt) {	
			
           // get application settings
		   this.loadData();
		},

		loadData: function () {

			var currentContext = this;

			applicationSettingsService.getApplicationSettings(function (data) {

				var model = new sap.ui.model.json.JSONModel();

				if (data[0] != undefined && data[0].length > 0) {
					
					currentContext.startDay = data[0][0].financialyearstartday;
					currentContext.startMonth =  data[0][0].financialyearstartmonth;
					data[0][0].financialyear = currentContext.startDay == null? "": currentContext.startDay + "/" + currentContext.startMonth ;
				
					model.setData(data[0][0]);
				}
				else {
					model.setData(
						{
							id: null,
							partywithmultipleroles: false,
							showdisplayprefix: false,
							recordsperpage: 10,
							pdcreminder: null,
							creditperiodreminder: null,
							financialyearstartday: null,
							financialyearstartmonth: null,
							datedisplayformat: "dd/MM/yyyy",
							stocknamefields: null,
							requisitionapproval : false,
							poapproval:false,
							showmrpandassessment:false,
							purchaseenquiryprefix : null,
							purchaseorderprefix : null,
							purchasereturnprefix : null,
							quotationapproval : false,
							billapproval : false,
							proformainvoiceapproval :false,
							saleschallanapproval : false,
							salesquotationprefix : null,
							saleschallanprefix : null,
							salesbillprefix : null,
							servicebillprefix : null,
							proformainvoiceprefix : null,
							batchoutorder : "MANUAL",
							calculatetaxbeforediscount : false,
							receiptvoucherapproval : false,
							paymentvoucherapproval : false,
							contravoucherapproval : false,
							journalvoucherapproval : false,
							receiptvoucherprefix : null,
							smtpserver : null,
							portno : null,
							host : null,
							emailid : null,
							password : null,
							emailretrycount : null,
							requiredssl : false,
							companyid : commonFunction.session("companyId")							
						}
					);
				}

				currentContext.getView().setModel(model, "appSettingsModel");
			});
		},

		onSave: function () {

			var currentContext = this;

			if (this.validateForm()) {

				var model = this.getView().getModel("appSettingsModel").oData;
                var message = model.id == null ? "Application settings saved successfully!" : "Application settings updated successfully!";
				
				model.financialyearstartday = this.startDay;
				model.financialyearstartmonth = this.startMonth;
				model["userid"] = commonFunction.session("userId");
				
				var partyWithMultipleRoles = currentContext.getView().byId("rbgPartyWithMultipleRoles").getSelectedIndex();										
				var showDisplayPrefix = currentContext.getView().byId("rbgShowDisplayPrefix").getSelectedIndex();										
				var requisitionApproval = currentContext.getView().byId("rbgRequisionApproval").getSelectedIndex();										
				var poApproval = currentContext.getView().byId("rbgPOApproval").getSelectedIndex();										
				var showMRPAndAssessment = currentContext.getView().byId("rbgShowMRPAndAssessment").getSelectedIndex();										
				var quotationApproval = currentContext.getView().byId("rbgQuotationApproval").getSelectedIndex();										
				var billApproval = currentContext.getView().byId("rbgBillApproval").getSelectedIndex();										
				var proformaInvoiceApproval = currentContext.getView().byId("rbgProformaInvoiceApproval").getSelectedIndex();										
				var salesChallanApproval = currentContext.getView().byId("rbgSalesChallanApproval").getSelectedIndex();										
				var taxCalculationFormula = currentContext.getView().byId("rbgTaxCalculationFormula").getSelectedIndex();										
				var receiptVoucherApproval = currentContext.getView().byId("rbgReceiptVoucherApproval").getSelectedIndex();										
				var paymentvoucherApproval = currentContext.getView().byId("rbgPaymentVoucherApproval").getSelectedIndex();										
				var contraVoucherApproval = currentContext.getView().byId("rbgContraVoucherApproval").getSelectedIndex();										
				var journalVoucherApproval = currentContext.getView().byId("rbgJournalVoucherApproval").getSelectedIndex();										
				var requiredSSL = currentContext.getView().byId("rbgRequiredSSL").getSelectedIndex();										
				

				model.partywithmultipleroles = partyWithMultipleRoles == 0 ? true : false;
				model.showdisplayprefix = showDisplayPrefix == 0 ? true : false;
				model.requisitionapproval = requisitionApproval == 0 ? true : false;
				model.poapproval = poApproval == 0 ? true : false;
				model.showmrpandassessment = showMRPAndAssessment == 0 ? true : false;
				model.quotationapproval = quotationApproval == 0 ? true : false;
				model.billapproval = billApproval == 0 ? true : false;
				model.proformainvoiceapproval = proformaInvoiceApproval == 0 ? true : false;
				model.saleschallanapproval = salesChallanApproval == 0 ? true : false;
				model.calculatetaxbeforediscount = taxCalculationFormula == 0 ? true : false;
				model.receiptvoucherapproval = receiptVoucherApproval == 0 ? true : false;
				model.paymentvoucherapproval = paymentvoucherApproval == 0 ? true : false;
				model.contravoucherapproval = contraVoucherApproval == 0 ? true : false;
				model.journalvoucherapproval = journalVoucherApproval == 0 ? true : false;
				model.requiredssl = requiredSSL == 0 ? true : false;
				
				applicationSettingsService.saveApplicationSettings(model, function (data) {

					if (data.id > 0) {

						MessageToast.show(message);
                        currentContext.loadData();			
					}	 
				
			 	});	
			}
		},

		// validation related functions
		validateForm : function(){
			
			var isValid = true;
			
			if(!commonFunction.isNumber(this,"txtPDCReminder")){
				isValid = false;
			}

			if(!commonFunction.isNumber(this,"txtCreditPeriodReminder")){
				isValid = false;
			}

			if(!commonFunction.isNumber(this,"txtEmailRetryCount")){
				isValid = false;
			}

			if(!commonFunction.isNumber(this,"txtPortNo")){
				isValid = false;
			}
			
			return isValid;
		},


		onDateChange: function () {

			if (commonFunction.isDate(this, "txtFinancialYear")) {

				var date = this.getView().byId("txtFinancialYear").getValue();
				var arr = date.split('/');
				this.startDay = arr[0];
				this.startMonth = arr[1];
			}
		},

		onNumberInputChange : function(oEvent){
			
			var inputId = oEvent.mParameters.id;
			var inputValue = oEvent.mParameters.value;
			
			inputId = inputId.substring(inputId.lastIndexOf('-') + 1);

			if(inputId == "txtPDCReminder"){

				if(inputValue != "")
					commonFunction.isNumber(this,"txtPDCReminder")		
				else
					this.getView().byId("txtPDCReminder").setValueState(sap.ui.core.ValueState.None);								
				
			}
			else if(inputId == "txtCreditPeriodReminder"){
				
				if(inputValue != "")
					commonFunction.isNumber(this,"txtCreditPeriodReminder")		
				else
					this.getView().byId("txtCreditPeriodReminder").setValueState(sap.ui.core.ValueState.None);																
			}
			else if(inputId == "txtEmailRetryCount"){
				
				if(inputValue != "")
					commonFunction.isNumber(this,"txtEmailRetryCount")		
				else
					this.getView().byId("txtEmailRetryCount").setValueState(sap.ui.core.ValueState.None);															
			}
			else if(inputId == "txtPortNo"){
				
				if(inputValue != "")
					commonFunction.isNumber(this,"txtPortNo")		
				else
					this.getView().byId("txtPortNo").setValueState(sap.ui.core.ValueState.None);															
			}
		},

		resourceBundle: function () {
			var oBundle = this.getModel("i18n").getResourceBundle();
			return oBundle
		},

		resetModel: function () {

			var statusid = this.getView().byId("ddlStatus").getSelectedItem().mProperties.key;
			var emptyModel = this.getModelDefault();
			emptyModel.statusid = statusid;
			var model = this.getView().getModel("dailyTransactionModel");
			model.setData(emptyModel);
			

			this.getView().byId("txtLightOn").setValue("");
			this.getView().byId("txtLightOff").setValue("");
			this.getView().byId("txtTransactionDate").setEnabled(true);
			this.getView().byId("txtLocationCode").setEnabled(true);
			this.getView().byId("btnSave").setEnabled(true);
			this.getView().byId("ddlStatus").setEnabled(true);						
			
		},
		
		onExit: function () {
        },
	});
}, true);
