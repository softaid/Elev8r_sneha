sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',

], function (JSONModel, BaseController, MessageToast, CommonService, commonFunction) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Common.DashboardCommonSetting", {
        onInit: function () {
            this.oFlexibleColumnLayout = this.byId("fcldashboardcommonsetting");
            // set model for parent table
            var model = new JSONModel();
            this.getView().setModel(model, "commonSettingModel");
            this.getCommonSettiongData();
        },

        getCommonSettiongData: function () {
			var currentContext = this;
            var modulearray =[];
            	//common setting data
                CommonService.getCommonSettingForDashBoard(function (data) {
                 // If setting is partially fill up then execute if condition and if setting is totally blanck then excute else part (Disply green and red color for values) 
                if(data[0].length != 0)
                {
                for(var i=0;i<data[0].length>0;i++)
				{
                    let finalData = data[0].slice()[0];
					modulearray.push({ 
                        cashledgerid: finalData.cashledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        cashledgeridtype: finalData.cashledgerid== 'yes' ? "Accept" : "Reject",
                        inventorygainandlossledgerid: finalData.inventorygainandlossledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        inventorygainandlossledgeridtype: finalData.inventorygainandlossledgerid== 'yes' ? "Accept" : "Reject",
                        grpowithoutinvoiceledgerid: finalData.grpowithoutinvoiceledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        grpowithoutinvoiceledgeridtype: finalData.grpowithoutinvoiceledgerid== 'yes' ? "Accept" : "Reject",
                        discountledgerid: finalData.discountledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        discountledgeridtype: finalData.discountledgerid== 'yes' ? "Accept" : "Reject",
                        cogsledgerid: finalData.cogsledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        cogsledgeridtype: finalData.cogsledgerid== 'yes' ? "Accept" : "Reject",
                        opening_balance_ledger_id: finalData.opening_balance_ledger_id== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        opening_balance_ledger_idtype: finalData.opening_balance_ledger_id== 'yes' ? "Accept" : "Reject",
                        profitandlossledgerid: finalData.profitandlossledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        profitandlossledgeridtype: finalData.profitandlossledgerid== 'yes' ? "Accept" : "Reject",
                        supplier_ledger_group_id: finalData.supplier_ledger_group_id== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        supplier_ledger_group_idtype: finalData.supplier_ledger_group_id== 'yes' ? "Accept" : "Reject",
                        customer_ledger_group_id: finalData.customer_ledger_group_id== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        customer_ledger_group_idtype: finalData.customer_ledger_group_id== 'yes' ? "Accept" : "Reject",
                        controlaccountledgerid: finalData.controlaccountledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        controlaccountledgeridtype: finalData.controlaccountledgerid== 'yes' ? "Accept" : "Reject",
                    
					 });
				}
            }
            else
            {
                modulearray.push({ 
                    cashledgerid:  "sap-icon://decline",
                    cashledgeridtype: "Reject",
                    inventorygainandlossledgerid:  "sap-icon://decline",
                    inventorygainandlossledgeridtype: "Reject",
                    grpowithoutinvoiceledgerid:  "sap-icon://decline",
                    grpowithoutinvoiceledgeridtype: "Reject",
                    discountledgerid:  "sap-icon://decline",
                    discountledgeridtype: "Reject",
                    cogsledgerid:  "sap-icon://decline",
                    cogsledgeridtype: "Reject",
                    opening_balance_ledger_id: "sap-icon://decline",
                    opening_balance_ledger_idtype: "Reject",
                    profitandlossledgerid:  "sap-icon://decline",
                    profitandlossledgeridtype: "Reject",
                    supplier_ledger_group_id:  "sap-icon://decline",
                    supplier_ledger_group_idtype: "Reject",
                    customer_ledger_group_id:  "sap-icon://decline",
                    customer_ledger_group_idtype: "Reject",
                    controlaccountledgerid:  "sap-icon://decline",
                    controlaccountledgeridtype: "Reject",
                
                 });
            }
				var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData(modulearray[0]);
                currentContext.getView().setModel(oModel, "commonmoduleModel");
			})

        },

        onExit: function () {
            if (this._oDialog) {
                this._oDialog.destroy();
            }
        },
     
    });
}, true);
