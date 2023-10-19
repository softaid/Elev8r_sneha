sap.ui.define(
    [
      "sap/ui/model/json/JSONModel",
      "sap/ui/elev8rerp/componentcontainer/controller/BaseController",
      'sap/ui/elev8rerp/componentcontainer/services/LeadManagement/Lead.service',
      'sap/ui/elev8rerp/componentcontainer/services/Common.service'
    ],
    function (JSONModel,BaseController,leadService, commonService) {
      return BaseController.extend(
        "sap.ui.elev8rerp.componentcontainer.controller.LeadManagement.SalesDashboard",
        {
            onInit : function(){
                this.getSalesDashboardData();
            },

            getSalesDashboardData : function(){
                let oThis = this;
                let arr = [];

                leadService.getSalesDashboard(function(dashboardData){
                    if(dashboardData.length){
                        var oDashboardTileModel = new sap.ui.model.json.JSONModel();
                        arr.push({
                            totalleads : dashboardData[0][0].totalleads,
                            qualifiedleads : dashboardData[0][0].qualifiedleads,
                            totalquotations : dashboardData[1][0].totalquotations,
                            totalorders : dashboardData[2][0].totalorders,
                            confirmedorders : dashboardData[3][0].confirmedorders
                        })
    
                        oDashboardTileModel.setData(arr[0]);
                        oThis.getView().setModel(oDashboardTileModel, "oDashboardTileModel");
                    }
                })
            },
        });
      },true);