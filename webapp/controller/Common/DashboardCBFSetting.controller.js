sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',

], function (JSONModel, BaseController, MessageToast, CommonService, commonFunction) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Common.DashboardCBFSetting", {
        onInit: function () {
            this.oFlexibleColumnLayout = this.byId("cbfsettingdashboard");
            this.getCBFSettiongData();
        },

        getCBFSettiongData: function () {
			var currentContext = this;
            var modulearray =[];
            	//cbf setting data
                CommonService.getCBFSettingForDashBoard(function (data) {

                // If setting is partially fill up then execute if condition and if setting is totally blanck then excute else part (Disply green and red color for values) 
                if(data[0].length != 0)
                {
                for(var i=0;i<data[0].length>0;i++)
				{
                    let finalData = data[0].slice()[0];
					modulearray.push({ 
                        id: finalData.id== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        idtype: finalData.id== 'yes' ? "Accept" : "Reject",
                        defaultchickitemid: finalData.defaultchickitemid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        defaultchickitemidtype: finalData.defaultchickitemid== 'yes' ? "Accept" : "Reject",
                        labourcharge: finalData.labourcharge== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        labourchargetype: finalData.labourcharge== 'yes' ? "Accept" : "Reject",
                        standardweight: finalData.standardweight== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        standardweighttype: finalData.standardweight== 'yes' ? "Accept" : "Reject",
                        shedrestperiod: finalData.shedrestperiod== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        shedrestperiodtype: finalData.shedrestperiod== 'yes' ? "Accept" : "Reject",
                        defaultchickcost: finalData.defaultchickcost== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        defaultchickcosttype: finalData.defaultchickcost== 'yes' ? "Accept" : "Reject",
                        overheadcost: finalData.overheadcost== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        overheadcosttype: finalData.overheadcost== 'yes' ? "Accept" : "Reject",
                        defaultcbfwarehouseid: finalData.defaultcbfwarehouseid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        defaultcbfwarehouseidtype: finalData.defaultcbfwarehouseid== 'yes' ? "Accept" : "Reject",
                        feeditemgroupids: finalData.feeditemgroupids== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        feeditemgroupidstype: finalData.feeditemgroupids== 'yes' ? "Accept" : "Reject",
                        medicineitemgroupids: finalData.medicineitemgroupids== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        medicineitemgroupidstype: finalData.medicineitemgroupids== 'yes' ? "Accept" : "Reject",
                        vaccineitemgroupids: finalData.vaccineitemgroupids== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        vaccineitemgroupidstype: finalData.vaccineitemgroupids== 'yes' ? "Accept" : "Reject",
                        vitaminitemgroupids: finalData.vitaminitemgroupids== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        vitaminitemgroupidstype: finalData.vitaminitemgroupids== 'yes' ? "Accept" : "Reject",
                        breeditemgroupids: finalData.breeditemgroupids== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        breeditemgroupidstype: finalData.breeditemgroupids== 'yes' ? "Accept" : "Reject",
                        chicksitemgroupids: finalData.chicksitemgroupids== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        chicksitemgroupidstype: finalData.chicksitemgroupids== 'yes' ? "Accept" : "Reject",
                        supplierledgerid: finalData.supplierledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        supplierledgeridtype: finalData.supplierledgerid== 'yes' ? "Accept" : "Reject",
                        supervisorkmledgerid: finalData.supervisorkmledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        supervisorkmledgeridtype: finalData.supervisorkmledgerid== 'yes' ? "Accept" : "Reject",
                        taxid: finalData.taxid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        taxidtype: finalData.taxid== 'yes' ? "Accept" : "Reject",
                        tdsid: finalData.tdsid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        tdsidtype: finalData.tdsid== 'yes' ? "Accept" : "Reject",
                        costofgoodsoldledgerid: finalData.costofgoodsoldledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        costofgoodsoldledgeridtype: finalData.costofgoodsoldledgerid== 'yes' ? "Accept" : "Reject",
                        WIPledgerid: finalData.WIPledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        WIPledgeridtype: finalData.WIPledgerid== 'yes' ? "Accept" : "Reject",
                        grpowithoutinvoiceledgerid: finalData.grpowithoutinvoiceledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        grpowithoutinvoiceledgeridtype: finalData.grpowithoutinvoiceledgerid== 'yes' ? "Accept" : "Reject",
                        ctrlaccledgerid: finalData.ctrlaccledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        ctrlaccledgeridtype: finalData.ctrlaccledgerid== 'yes' ? "Accept" : "Reject",
                        freightledgerid: finalData.freightledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        freightledgeridtype: finalData.freightledgerid== 'yes' ? "Accept" : "Reject",
                        discountledgerid: finalData.discountledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        discountledgeridtype: finalData.discountledgerid== 'yes' ? "Accept" : "Reject",
                        cashledgerid: finalData.cashledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        cashledgeridtype: finalData.cashledgerid== 'yes' ? "Accept" : "Reject",
                        DOCitemid: finalData.DOCitemid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        DOCitemidtype: finalData.DOCitemid== 'yes' ? "Accept" : "Reject",
                        finishgooditemid: finalData.finishgooditemid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        finishgooditemidtype: finalData.finishgooditemid== 'yes' ? "Accept" : "Reject",
                        partygroupid: finalData.partygroupid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        partygroupidtype: finalData.partygroupid== 'yes' ? "Accept" : "Reject",
                    
					 });
				}
            }
            else
            {
                modulearray.push({ 
                    id: "sap-icon://decline",
                    idtype:  "Reject",
                    defaultchickitemid:  "sap-icon://decline",
                    defaultchickitemidtype:  "Reject",
                    labourcharge: "sap-icon://decline",
                    labourchargetype:  "Reject",
                    standardweight:  "sap-icon://decline",
                    standardweighttype:  "Reject",
                    shedrestperiod:  "sap-icon://decline",
                    shedrestperiodtype:  "Reject",
                    defaultchickcost:  "sap-icon://decline",
                    defaultchickcosttype:  "Reject",
                    overheadcost: "sap-icon://decline",
                    overheadcosttype:  "Reject",
                    defaultcbfwarehouseid:  "sap-icon://decline",
                    defaultcbfwarehouseidtype:  "Reject",
                    feeditemgroupids: "sap-icon://decline",
                    feeditemgroupidstype:  "Reject",
                    medicineitemgroupids: "sap-icon://decline",
                    medicineitemgroupidstype:  "Reject",
                    vaccineitemgroupids:  "sap-icon://decline",
                    vaccineitemgroupidstype:  "Reject",
                    vitaminitemgroupids:  "sap-icon://decline",
                    vitaminitemgroupidstype:  "Reject",
                    breeditemgroupids:  "sap-icon://decline",
                    breeditemgroupidstype:  "Reject",
                    chicksitemgroupids: "sap-icon://decline",
                    chicksitemgroupidstype:  "Reject",
                    supplierledgerid:  "sap-icon://decline",
                    supplierledgeridtype:  "Reject",
                    supervisorkmledgerid:  "sap-icon://decline",
                    supervisorkmledgeridtype:  "Reject",
                    taxid:  "sap-icon://decline",
                    taxidtype: "Reject",
                    tdsid:  "sap-icon://decline",
                    tdsidtype:  "Reject",
                    costofgoodsoldledgerid:  "sap-icon://decline",
                    costofgoodsoldledgeridtype:  "Reject",
                    WIPledgerid:  "sap-icon://decline",
                    WIPledgeridtype:  "Reject",
                    grpowithoutinvoiceledgerid:  "sap-icon://decline",
                    grpowithoutinvoiceledgeridtype:  "Reject",
                    ctrlaccledgerid: "sap-icon://decline",
                    ctrlaccledgeridtype:  "Reject",
                    freightledgerid: "sap-icon://decline",
                    freightledgeridtype: "Reject",
                    discountledgerid:  "sap-icon://decline",
                    discountledgeridtype:  "Reject",
                    cashledgerid:  "sap-icon://decline",
                    cashledgeridtype:  "Reject",
                    DOCitemid: "sap-icon://decline",
                    DOCitemidtype:  "Reject",
                    finishgooditemid:"sap-icon://decline",
                    finishgooditemidtype:  "Reject",
                    partygroupid:  "sap-icon://decline",
                    partygroupidtype:  "Reject",
                
                 });
            }
				var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData(modulearray[0]);
                currentContext.getView().setModel(oModel, "cbfModel");
			})
        },

        onExit: function () {
            if (this._oDialog) {
                this._oDialog.destroy();
            }
        },
     
    });
}, true);
