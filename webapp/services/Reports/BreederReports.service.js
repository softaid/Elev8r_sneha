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
            gatAllBreederBatch: function (params, callback) {
                commonService.runJQueryX("GET", "breederreports/search/companyid/" + commonService.session("companyId") + "/locationid/" + params.locationid, null, callback, null);
            },
            getAllbreederbatchbywarehouse: function (params, callback) {
                commonService.runJQueryX("GET", "breederreports/search/companyid/" + commonService.session("companyId") + "/warehouseid/" + params.warehouseid, null, callback, null);
            },
            getLocationwisebreederbatches: function (params, callback) {
                commonService.runJQueryX("GET", "breederreports/select/companyid/" + commonService.session("companyId") + "/locationid/" + params.locationid, null, callback, null);
            },
            getShedByBatchid: function (params,callback) {
                commonService.runJQueryX("GET", "breederreports/selectshed/breederbatchid/" + params.breederbatchid, null, callback, null);
            },
            getEggscollectionReport: function (params, callback) {
                commonService.runJQueryX("POST", "breederreports/breederreport", params, callback, null);
            },
            getbreedershed: function (params, callback) {
                commonService.runJQueryX("GET", "breederreports/breedershedsearch/breederbatchid/"+ params.breederbatchid, null, callback, null);
            },
            getFlockDetailReport : function (params, callback) {
                commonService.runJQueryX("GET", "breederreports/report/" + params.breederbatchid + "/" + params.fromdate + "/" + params.todate + "/" + commonService.session("companyId"),null, callback, null);
            },
            getDailyBrodGrowReport :function (params, callback) {
                commonService.runJQueryX("POST", "breederreports/dailyBrodGrow", params, callback, null);
            },
            getflockgatherReport :function (params, callback) {
                commonService.runJQueryX("POST", "breederreports/flockgatherreport", params, callback, null);
            },
            getdailyconsumptionReport :function (params, callback) {
                commonService.runJQueryX("POST", "breederreports/daliyconsumptionReport", params, callback, null);
            },
            getFeedRequiredPlanReport :function (params, callback) {
                commonService.runJQueryX("POST", "breederreports/feedrequiredplan", params, callback, null);
            },
            getItemWisedailyconsumptionReport :function (params, callback) {
                commonService.runJQueryX("POST", "breederreports/itemWiseConsumption", params, callback, null);
            },
            getEggscollectiontilldate :function (params, callback) {
                commonService.runJQueryX("POST", "breederreports/eggscollectiontilldate", params, callback, null);
            },
            getFutureEggsCollection :function (params, callback) {
                commonService.runJQueryX("POST", "breederreports/futureeggscollection", params, callback, null);
            },
            getFeedDeviationReport :function (params, callback) {
                commonService.runJQueryX("POST", "breederreports/feeddeviationreport", params, callback, null);
            },
            getbatchwisedailypronconReport: function (params, callback) {
              commonService.runJQueryX("GET", "breederreports/batchwisedailypronconreport/breederbatchid/"+ params.breederbatchid +  "/shedid/" + params.shedid + "/fromdate/" + params.fromdate +  "/todate/" + params.todate  + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },
             flockExpencesBefore24WeekReport: function (params, callback) {
                 console.log("params",params);
               commonService.runJQueryX("GET", "breederreports/flockExpencesBeforeWeekReport/batchid/"+ params.batchid + "/fromdate/" + params.fromdate +  "/todate/" + params.todate  + "/companyid/"+ commonService.session("companyId"), null, callback, null);
            },
            ParentBirdBalanceReport: function (params, callback) {
                commonService.runJQueryX("GET", "breederreports/ParentBirdBalance/batchid/"+ params.batchid + "/fromdate/" + params.fromdate +  "/todate/" + params.todate  + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },
             flocksummaryReport: function (params, callback) {
                commonService.runJQueryX("GET", "breederreports/flocksummary/breederbatchid/"+ params.breederbatchid + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },
             getFarmPerformanceReport: function (params, callback) {
                commonService.runJQueryX("GET", "breederreports/farmperformance/fromdate/" + params.fromdate +  "/todate/" + params.todate +"/batchid/"+ params.batchid, null, callback, null);
             }, 
             getFlockWiseCostAnalysisReport: function (params, callback) {
                commonService.runJQueryX("GET", "breederreports/flockwisecostanalysis/fromdate/" + params.fromdate +  "/todate/" + params.todate +"/batchid/"+ params.batchid + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },
             getFlockWiseCostAnalysisReportPartOne: function (params, callback) {
                commonService.runJQueryX("GET", "breederreports/flockwisecostanalysispartone/fromdate/" + params.fromdate +  "/todate/" + params.todate +"/batchid/"+ params.batchid + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },
             getshedwisefarmperformancereport: function (params, callback) {
                commonService.runJQueryX("GET", "breederreports/shedwisefarmperformancereport/breederbatchid/" + params.breederbatchid  + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },
			 
	     getEggStockReport: function (params, callback) {
                commonService.runJQueryX("GET", "breederreports/eggstock/" + params.fromdate + "/" + params.todate + "/" + params.breederbatchids, null, callback, null);
             },

	     getbatchwiseprofitandlossReport: function (params, callback) {
                commonService.runJQueryX("GET", "breederreports/batchwiseprofitandloss/" + params.breederbatchid +  "/" + params.fromdate + "/" + params.todate + "/" + commonService.session("companyId"), null, callback, null);
             },

	     getBatchValuationReport : function (params, callback) {
                commonService.runJQueryX("GET", "breederreports/batchvaluation/" + params.breederbatchid + "/" + commonService.session("companyId"), null, callback, null);
             },

        };
    }
);