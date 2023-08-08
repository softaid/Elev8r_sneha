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

            gatAllLayerBatch: function (params, callback) {
                commonService.runJQueryX("GET", "layerreports/search/companyid/" + commonService.session("companyId") + "/locationid/" + params.locationid, null, callback, null);
            },

            getLocationwiselayerbatches: function (params, callback) {
                commonService.runJQueryX("GET", "layerreports/select/companyid/" + commonService.session("companyId") + "/locationid/" + params.locationid, null, callback, null);
            },

            getLayerShedByBatchid: function (params,callback) {
                commonService.runJQueryX("GET", "layerreports/selectshed/layerbatchid/" + params.layerbatchid, null, callback, null);
            },
            getLayerEggscollectionReport: function (params, callback) {
                commonService.runJQueryX("POST", "layerreports/layerreport", params, callback, null);
            },
            getLayershed: function (params, callback) {
                commonService.runJQueryX("GET", "layerreports/layershedsearch/layerbatchid/"+ params.layerbatchid, null, callback, null);
            },

            getLayerFlockDetailReport : function (params, callback) {
                commonService.runJQueryX("GET", "layerreports/LayerFlockDetailReport/" + params.layerbatchid + "/" + params.fromdate + "/" + params.todate+"/"+commonService.session("companyId"), null, callback, null);

            },

            getLayerDailyBrodGrowReport :function (params, callback) {
                commonService.runJQueryX("POST", "layerreports/layerdailyBrodGrow", params, callback, null);
            },
            getlayerflockgatherReport :function (params, callback) {
                commonService.runJQueryX("POST", "layerreports/layerflockgatherreport", params, callback, null);
            },
            getLayerDailyConsumptionReport :function (params, callback) {
                commonService.runJQueryX("POST", "layerreports/layerdaliyconsumptionReport", params, callback, null);
            },
            getLayerFeedDeviationReport :function (params, callback) {
                commonService.runJQueryX("POST", "layerreports/layerfeeddeviationreport", params, callback, null);
            },
            getLayerItemWisedailyconsumptionReport :function (params, callback) {
                commonService.runJQueryX("POST", "layerreports/itemWiseLyrConsumption", params, callback, null);
            },

            getLayerEggscollectiontilldate :function (params, callback) {
                commonService.runJQueryX("POST", "layerreports/lyreggscollectiontilldate", params, callback, null);
            },
            getLayerFutureEggsCollection :function (params, callback) {
                commonService.runJQueryX("POST", "layerreports/lyrfutureeggscollection", params, callback, null);
            },
            getParentBirdBalanceStockWithAllDetail: function (params, callback) {
                commonService.runJQueryX("GET", "layerreports/parentbirdbalancereportwithalldetail/batchid/" + params.batchid +  "/todate/" + params.todate + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },
             getParentBirdBalance: function (params, callback) {
                commonService.runJQueryX("GET", "layerreports/parentbirdbalancereport/batchid/" + params.batchid + "/fromdate/" + params.fromdate + "/todate/" + params.todate + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },
             getFlockExpencesBefore19Week: function (params, callback) {
                commonService.runJQueryX("GET", "layerreports/flockexpencesbefore19weekreport/batchid/" + params.batchid + "/fromdate/" + params.fromdate + "/todate/" + params.todate + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },
             getFlockWisecostanalysisReport: function (params, callback) {
                commonService.runJQueryX("GET", "layerreports/flockwisecostanalysisreport/fromdate/" + params.fromdate + "/todate/" + params.todate + "/batchid/" + params.batchid + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },
             getFlockWisecostanalysispartoneReport: function (params, callback) {
                commonService.runJQueryX("GET", "layerreports/flockwisecostanalysispartonereport/fromdate/" + params.fromdate + "/todate/" + params.todate + "/batchid/" + params.batchid + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },
	     getBatchDetailData: function (params, callback) {
                commonService.runJQueryX("GET", "layerreports/layerbatchdetaildatareport/fromdate/" + params.fromdate + "/todate/" + params.todate + "/layerbatchid/" + params.layerbatchid + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },
             getAlllayerbatchbywarehouse: function (params, callback) {
                commonService.runJQueryX("GET", "layerreports/search/companyid/" + commonService.session("companyId") + "/warehouseid/" + params.warehouseid, null, callback, null);
            },
            layerflocksummaryReport: function (params, callback) {
                console.log("params",params);
                commonService.runJQueryX("GET", "layerreports/layerflocksummary/batchid/"+ params.batchid + "/companyid/"+ commonService.session("companyId"), null, callback, null);
            },
	    getlayerbatchwiseprofitandlossReport: function (params, callback) {
                commonService.runJQueryX("GET", "layerreports/layerbatchwiseprofitandloss/" + params.layerbatchid +  "/" + params.fromdate + "/" + params.todate + "/" + commonService.session("companyId"), null, callback, null);
            },
            getLayerBatchValuationReport : function (params, callback) {
                commonService.runJQueryX("GET", "layerreports/layerbatchvaluation/" + params.layerbatchid + "/" + commonService.session("companyId"), null, callback, null);
            },
            
        };
    }
);