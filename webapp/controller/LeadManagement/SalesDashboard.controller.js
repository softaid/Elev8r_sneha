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


                        // pichart for lead to order conversion ratio
                        
                        var pieData = google.visualization.arrayToDataTable([
                            ['Type','No.s'],
                            ['Converted to Order',dashboardData[4][0].convertedorders],
                            ['Not Converted to Order',(parseInt(dashboardData[0][0].totalleads) - parseInt(dashboardData[4][0].convertedorders))]
                          ]);
                  
                        var pieOptions = {
                            title: 'Lead to Order Conversion Ratio'
                        };
                  
                        var pieChart = new google.visualization.PieChart(document.getElementById('orderpiechart'));
                  
                        pieChart.draw(pieData, pieOptions);

                        //donut chart for typewise leads

                        let donutArr = [];
                        donutArr[0] = ['Type','No. of Leads']
                        for(let i = 1; i <= dashboardData[6].length; i++){
                            donutArr[i] = [dashboardData[6][i-1].model, dashboardData[6][i-1].leads]
                        }

                        var donutData = google.visualization.arrayToDataTable(donutArr);
                  
                        var donutOptions = {
                            title: 'Modelwise No. of Leads',
                            pieHole: 0.4,
                        };
                  
                        var donutChart = new google.visualization.PieChart(document.getElementById('modeldonutchart'));
                  
                        donutChart.draw(donutData, donutOptions);
                    }
                })
            },
        });
      },true);