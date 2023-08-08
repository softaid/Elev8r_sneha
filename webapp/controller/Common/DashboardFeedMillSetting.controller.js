sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',

], function (JSONModel, BaseController, MessageToast, CommonService, commonFunction) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Common.DashboardFeedMillSetting", {
       
        onInit: function () {
            this.oFlexibleColumnLayout = this.byId("fcldashboardfeedmillsetting");
            this.getFeedMillSettiongData();
        },

        getFeedMillSettiongData: function () {
			var currentContext = this;
            var modulearray =[];
            	//Feed Mill setting data
                CommonService.getFeedMillSettingForDashBoard(function (data) {
                  // If setting is partially fill up then execute if condition and if setting is totally blanck then excute else part (Disply green and red color for values) 
                if(data[0].length != 0)
                {
                for(var i=0;i<data[0].length>0;i++)
				{
                    let finalData = data[0].slice()[0];
					modulearray.push({ 
                        tolerencepercentage: finalData.tolerencepercentage== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        tolerencepercentagetype: finalData.tolerencepercentage== 'yes' ? "Accept" : "Reject",
                        additionalcost: finalData.additionalcost== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        additionalcosttype: finalData.additionalcost== 'yes' ? "Accept" : "Reject",
                        inventoryindrledgerid: finalData.inventoryindrledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        inventoryindrledgeridtype: finalData.inventoryindrledgerid== 'yes' ? "Accept" : "Reject",
                        grpowithoutinvoiceledgerid: finalData.grpowithoutinvoiceledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        grpowithoutinvoiceledgeridtype: finalData.grpowithoutinvoiceledgerid== 'yes' ? "Accept" : "Reject",
                        discountledgerid: finalData.discountledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        discountledgeridtype: finalData.discountledgerid== 'yes' ? "Accept" : "Reject",
                        overheadledgerid: finalData.overheadledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        overheadledgeridtype: finalData.overheadledgerid== 'yes' ? "Accept" : "Reject",
                        applyreciptloss: finalData.applyreciptloss== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        applyreciptlosstype: finalData.applyreciptloss== 'yes' ? "Accept" : "Reject",
                        lossledgerid: finalData.lossledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",  
                        lossledgeridtype: finalData.lossledgerid== 'yes' ? "Accept" : "Reject",
                        warehouseid: finalData.warehouseid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        warehouseidtype: finalData.warehouseid== 'yes' ? "Accept" : "Reject",
                        isfifo: finalData.isfifo== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        isfifotype: finalData.isfifo== 'yes' ? "Accept" : "Reject"
					 });
				}
            }
            else
            {
                modulearray.push({ 
                    tolerencepercentage:  "sap-icon://decline",
                    tolerencepercentagetype: "Reject",
                    additionalcost:  "sap-icon://decline",
                    additionalcosttype:  "Reject",
                    inventoryindrledgerid:  "sap-icon://decline",
                    inventoryindrledgeridtype:  "Reject",
                    grpowithoutinvoiceledgerid:  "sap-icon://decline",
                    grpowithoutinvoiceledgeridtype: "Reject",
                    discountledgerid: "sap-icon://decline",
                    discountledgeridtype: "Reject",
                    overheadledgerid:  "sap-icon://decline",
                    overheadledgeridtype: "Reject",
                    applyreciptloss:  "sap-icon://decline",
                    applyreciptlosstype: "Reject",
                    lossledgerid:  "sap-icon://decline",  
                    lossledgeridtype: "Reject",
                    warehouseid:  "sap-icon://decline",
                    warehouseidtype:  "Reject",
                    isfifo:  "sap-icon://decline",
                    isfifotype:  "Reject"
                 });
            }
				var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData(modulearray[0]);
                currentContext.getView().setModel(oModel, "feedmillModel");
			})
        },

        onExit: function () {
            if (this._oDialog) {
                this._oDialog.destroy();
            }
        },
    });
}, true);
