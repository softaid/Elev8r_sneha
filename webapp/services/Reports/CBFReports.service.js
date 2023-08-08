sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',
],
    function (commonService) {
        "use strict";

        return {
            /**
               * @public
               * @param {boolean} bIsPhone the value to be checked
               * @returns {string} path to image
            */

            // CBF Reports Service

           

            getAllBatchReport: function (params, callback) {
                 commonService.runJQueryX("GET", "cbfreports/search/branch_id/" + params.branch_id +  "/" +  params.line_id +"/companyid/"+ commonService.session("companyId"), null, callback, null);
             },
             getAllBatchsheduleReport: function (params, callback) {
                 commonService.runJQueryX("GET", "cbfreports/searchforbatchshedule/branchid/" + params.branchid +  "/" +  params.id +"/companyid/"+ commonService.session("companyId"), null, callback, null);
             },

             getAllLine: function (params, callback) {
                 commonService.runJQueryX("GET", "cbfreports/searchforline/branchid/" + params.branchid +"/companyid/"+ commonService.session("companyId"), null, callback, null);
             },

             getAllChickPlacementReport: function (params, callback) {
                 commonService.runJQueryX("GET", "cbfreports/search/fromdate/" +params.fromdate + "/todate/"+params.todate + "/branch_id/"+ params.branch_id +"/line_id/" +  params.line_id +"/companyid/"+ commonService.session("companyId"), null, callback, null);
             },
             getAllLineChickPlacement: function (params, callback) {
                 commonService.runJQueryX("GET", "cbfreports/search/branchid/" +params.branchid + "/companyid/" + commonService.session("companyId"), null, callback, null);
             },
             getDensityReport: function (params, callback) {
                 commonService.runJQueryX("GET", "cbfreports/search/fromdate/" +params.fromdate + "/todate/" + params.todate + "/fromage/" + params.fromage + "/toage/" + params.toage + "/branch_id/" + params.branch_id + "/line_id/" +  params.line_id + "/companyid/" + commonService.session("companyId"), null, callback, null);
             },
             getAllBatchFarmerListReport: function (params, callback) {
                 commonService.runJQueryX("GET", "cbfreports/search/branch_id/" +params.branch_id +  "/" +  params.line_id + "/status_id/"+ params.status_id +"/companyid/"+ commonService.session("companyId"), null, callback, null);
             },

             getAllLineWithStatus: function (params, callback) {
                 commonService.runJQueryX("GET", "cbfreports/search/branchid/" +params.branchid+"/companyid/"+ commonService.session("companyId"), null, callback, null);
             },

             getAllFarmerByBranchLine: function (params, callback) {
                 commonService.runJQueryX("GET", "cbfreports/farmersearch/branchlineid/" +params.branchlineid + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },
             
             getAllFarmer: function (params, callback) {
              
                 commonService.runJQueryX("GET", "cbfreports/farmersearchforreport/branchlineid/" + params.branchlineid + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },

             getAllFarmerByBranchname: function (params, callback) {
            
                 commonService.runJQueryX("GET", "cbfreports/farmersearchbybranchnameforreport/branch_id/" + params.branch_id + "/company_id/"+ commonService.session("companyId"), null, callback, null);
             },

             getAllFarm: function (params, callback) {
               
                 commonService.runJQueryX("GET", "cbfreports/farmsearch/framerid/" + params.framerid + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },
             getAllBatch: function (params, callback) {
                
                 commonService.runJQueryX("GET", "cbfreports/batchsearch/farmid/" +params.farmid + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },
             getAllShedByFarmer: function (params, callback) {
                
                commonService.runJQueryX("GET", "cbfreports/shedbyfarmsearch/farmid/" +params.farmid + "/companyid/"+ commonService.session("companyId"), null, callback, null);
            },
            getAllBatchByShed: function (params, callback) {
                
                commonService.runJQueryX("GET", "cbfreports/batchbyshedsearch/shedid/" +params.shedid + "/companyid/"+ commonService.session("companyId"), null, callback, null);
            },
              getAllBatchAgeMortalityReport: function (params, callback) {
                
                 commonService.runJQueryX("GET", "cbfreports/agewisesearch/batch_id/"+ params.batch_id + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },
             getDeviationReport :function (params, callback) {
                commonService.runJQueryX("POST", "cbfreports/cbfdeviationreport", params, callback, null);
            },
            getAllBatchOfMaterialTransfer: function (params, callback) {
              
                 commonService.runJQueryX("GET", "cbfreports/batchsearch/fromdate/"+ params.fromdate + "/todate/" + params.todate + "/batchid/" + params.batchid + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },

             getAllBatchOfLivestock: function (params, callback) {
              
                 commonService.runJQueryX("GET", "cbfreports/batchsearch/curdate/"+ params.curdate + "/branch_id/" + params.branch_id + "/line_id/" + params.line_id + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },
             getAllFarmerName: function (params, callback) {
               
                 commonService.runJQueryX("GET", "cbfreports/farmersearch/customerid/" +params.customerid + "/companyid/" + commonService.session("companyId"), null, callback, null);
             },

             getAllFarmerNameByParty: function (callback) {
                 commonService.runJQueryX("GET", "cbfreports/partywisefarmersearch/companyid/" + commonService.session("companyId"), null, callback, null);
             },

             getBirdSalesRegisterReport: function (params, callback) {
                 commonService.runJQueryX("GET", "cbfreports/partyfarmersearch/fromdate/" + params.fromdate + "/todate/" + params.todate + "/customerid/" + params.customerid + "/companyid/" + commonService.session("companyId"), null, callback, null);
             },
             
                // Used for week wise Body wight and FCR report
            getWeightFCRreport: function (params, callback) {
                console.log("params", params);
                commonService.runJQueryX("GET", "cbfreports/weekwisebodyweightandfcrbatchsearch/curdate/" + params.curdate + "/branchid/" + params.branchid + "/lineid/" + params.lineid + "/farmerid/" + params.farmerid + "/farmid/" + params.farmid + "/batch_id/" + params.batch_id + "/companyid/" + commonService.session("companyId"), null, callback, null);
            },
             getBirdForSaleReport: function (params, callback) {
              
                 commonService.runJQueryX("GET", "cbfreports/batchsearch/curdate/"+ params.curdate +  "/branch_id/" + params.branch_id + "/fromage/" + params.fromage +  "/toage/" + params.toage + "/fromweight/" + params.fromweight + "/toweight/" + params.toweight + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },
             getAllSupervisor: function (params, callback) {
               
                 commonService.runJQueryX("GET", "cbfreports/supervisorsearch/branchlineid/" +params.branchlineid + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },
             getDailySupervisiorReport: function (params, callback) {
               
                 commonService.runJQueryX("GET", "cbfreports/batchsearch/curdate/"+ params.curdate +  "/branch_id/" + params.branch_id + "/line_id/" + params.line_id + "/empid/" + params.empid  + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },
             getBatchDetailsReport: function (params, callback) {
             
                 commonService.runJQueryX("GET", "cbfreports/batchsearch/cbf_batchid/"+ params.cbf_batchid + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },
             getBatchWiseBirdCostReport: function (params, callback) {
               
                 commonService.runJQueryX("GET", "cbfreports/linesearch/placementdate/"+ params.placementdate +  "/cbf_batchid/" + params.cbf_batchid + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },
             getFarmperformanceReport: function (params, callback) {
               
                 commonService.runJQueryX("GET", "cbfreports/farmsearch/fromdate/"+ params.fromdate + "/todate/" + params.todate +  "/farm_id/" + params.farm_id + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },
             getBroilerBirdBalanceReport: function (params, callback) {
                console.log("params",params);
                commonService.runJQueryX("GET", "cbfreports/cbfbroilerbirdbalancesearch/farm_id/"+ params.farm_id + "/batchid/" + params.batchid + "/todate/" + params.todate + "/companyid/"+ commonService.session("companyId"), null, callback, null);
            },
	     getGrowingchargesReport: function (params, callback) {
                console.log("params",params);
                commonService.runJQueryX("GET", "cbfreports/cbfgrowingchargereortsearch/batchid/"+ params.batchid + "/companyid/"+ commonService.session("companyId"), null, callback, null);
            },

            BroilerBatchFinancialPerformanceReport: function (params, callback) {
                console.log("params",params);
                commonService.runJQueryX("GET", "cbfreports/cbfbroilerbirdfinancebalancesearch/farmid/"+ params.farmid + "/fromdate/" + params.fromdate + "/todate/" + params.todate + "/companyid/"+ commonService.session("companyId"), null, callback, null);
            },
            BroilerBatchReconcilationPerformanceReport: function (params, callback) {
                console.log("params",params);
                commonService.runJQueryX("GET", "cbfreports/cbfbroilerbirdreconcilitatinbalancesearch/batchid/"+ params.batchid + "/fromdate/" + params.fromdate + "/todate/" + params.todate + "/companyid/"+ commonService.session("companyId"), null, callback, null);
            },
	       getFarmerstockReport: function (params, callback) {
                console.log("params",params);
                commonService.runJQueryX("GET", "cbfreports/getfarmerstocksearch/batchid/"+ params.batchid + "/companyid/"+ commonService.session("companyId"), null, callback, null);
            },
	     getAllShedid: function (params, callback) {
                console.log("params",params);
                 
                
                commonService.runJQueryX("GET", "cbfreports/shedsearchid/batchid/" +params.batchid + "/companyid/"+ commonService.session("companyId"), null, callback, null);
            },
	    
	       getBirdSalesRegisterReportBatchwise: function (params, callback) {
                commonService.runJQueryX("GET", "cbfreports/partyfarmerbatchsearch/fromdate/" + params.fromdate + "/todate/" + params.todate + "/batchid/" + params.batchid + "/shedid/" + params.shedid + "/customerid/" + params.customerid + "/companyid/" + commonService.session("companyId"), null, callback, null);
            },

	     getCbfDocumentCollectionByEnquiryid: function (params, callback) {
                commonService.runJQueryX("GET", "cbfreports/documentcollectionreport/farmerenquiryid/" + params.farmerenquiryid, null, callback, null);
            },

            getPendingGCReport: function (params, callback) {
                console.log("params",params);
                commonService.runJQueryX("GET", "cbfreports/pendinggc/branchid/"+ params.branchid + "/companyid/"+ commonService.session("companyId"), null, callback, null);
            },

            getPaymentPendingGCReport: function (params, callback) {
                console.log("params",params);
                commonService.runJQueryX("GET", "cbfreports/paymentpendinggc/branchid/"+ params.branchid + "/companyid/"+ commonService.session("companyId"), null, callback, null);
            },




        };
    }  
);




