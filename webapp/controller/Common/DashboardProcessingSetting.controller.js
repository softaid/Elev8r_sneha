
sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',

], function (JSONModel, BaseController, MessageToast, CommonService, commonFunction) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Common.DashboardProcessingSetting", {
       
        onInit: function () {
            this.oFlexibleColumnLayout = this.byId("processingdshboardsetting");
            $("#processingdshboardsetting").height(1000);
            this.getProcessingSettiongData();
        },

        getProcessingSettiongData: function () {
			var currentContext = this;
            var modulearray =[];
            	//Processing setting data
                CommonService.getProcessingSettingForDashBoard(function (data) {
                 // If setting is partially fill up then execute if condition and if setting is totally blanck then excute else part (Disply green and red color for values) 
                if(data[0].length != 0)
                {
                for(var i=0;i<data[0].length>0;i++)
				{
                    let finalData = data[0].slice()[0];
					modulearray.push({ 
                        id: finalData.id== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        idtype: finalData.id== 'yes' ? "Accept" : "Reject",
                        inputtypeitemgroupids: finalData.inputtypeitemgroupids== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        inputtypeitemgroupidstype: finalData.inputtypeitemgroupids== 'yes' ? "Accept" : "Reject",
                        livebirdwarehouseids: finalData.livebirdwarehouseids== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        livebirdwarehouseidstype: finalData.livebirdwarehouseids== 'yes' ? "Accept" : "Reject",
                        processingwarehouseids: finalData.processingwarehouseids== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        processingwarehouseidstype: finalData.processingwarehouseids== 'yes' ? "Accept" : "Reject",
                        finishgoodwarehouseids: finalData.finishgoodwarehouseids== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        finishgoodwarehouseidstype: finalData.finishgoodwarehouseids== 'yes' ? "Accept" : "Reject",
                        inventorygainandlossledgerid: finalData.inventorygainandlossledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        inventorygainandlossledgeridtype: finalData.inventorygainandlossledgerid== 'yes' ? "Accept" : "Reject",
                        overheadexpenseledgerid: finalData.overheadexpenseledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        overheadexpenseledgeridtype: finalData.overheadexpenseledgerid== 'yes' ? "Accept" : "Reject",
                        processinggainlossledgerid: finalData.processinggainlossledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        processinggainlossledgeridtype: finalData.processinggainlossledgerid== 'yes' ? "Accept" : "Reject",
                        packagingmaterialgroupids: finalData.packagingmaterialgroupids== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        packagingmaterialgroupidstype: finalData.packagingmaterialgroupids== 'yes' ? "Accept" : "Reject",
                        packgingfinishgooditemgroupids: finalData.packgingfinishgooditemgroupids== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        packgingfinishgooditemgroupidstype: finalData.packgingfinishgooditemgroupids== 'yes' ? "Accept" : "Reject",
                        wastageitemgroupid: finalData.wastageitemgroupid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        wastageitemgroupidtype: finalData.wastageitemgroupid== 'yes' ? "Accept" : "Reject",
					 });
				}
            }
            else
            {
                modulearray.push({ 
                    id:  "sap-icon://decline",
                    idtype:  "Reject",
                    inputtypeitemgroupids:  "sap-icon://decline",
                    inputtypeitemgroupidstype: "Reject",
                    livebirdwarehouseids: "sap-icon://decline",
                    livebirdwarehouseidstype:  "Reject",
                    processingwarehouseids:  "sap-icon://decline",
                    processingwarehouseidstype:  "Reject",
                    finishgoodwarehouseids:  "sap-icon://decline",
                    finishgoodwarehouseidstype:  "Reject",
                    inventorygainandlossledgerid:  "sap-icon://decline",
                    inventorygainandlossledgeridtype:  "Reject",
                    overheadexpenseledgerid:  "sap-icon://decline",
                    overheadexpenseledgeridtype: "Reject",
                    processinggainlossledgerid: "sap-icon://decline",
                    processinggainlossledgeridtype:  "Reject",
                    packagingmaterialgroupids: "sap-icon://decline",
                    packagingmaterialgroupidstype:  "Reject",
                    packgingfinishgooditemgroupids:  "sap-icon://decline",
                    packgingfinishgooditemgroupidstype: "Reject",
                    wastageitemgroupid:  "sap-icon://decline",
                    wastageitemgroupidtype: "Reject",
                
                 });
            }
				var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData(modulearray[0]);
                currentContext.getView().setModel(oModel, "processingModel");
                window.scrollTo(0, document.body.scrollHeight);
			})
        },

        onExit: function () {
            if (this._oDialog) {
                this._oDialog.destroy();
            }
        },
    });
}, true);
