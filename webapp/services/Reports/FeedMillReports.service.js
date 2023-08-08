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

            // FeedMill BillOfMaterial Report Service

           getBillOfMaterialReport: function (params, callback) {
              
                commonService.runJQueryX("GET", "feedmillreports/search/itemid/" +params.itemid+"/companyid/"+ commonService.session("companyId"), null, callback, null);
            },
             
            // FeedMill AcknowledgementSlip Report Service

            getAcknowledgementSlipRegisterReport: function (params, callback) {
                commonService.runJQueryX("GET", "feedmillreports/search/fromdate/" +params.fromdate
                + "/todate/"+params.todate+"/companyid/"+ commonService.session("companyId"), null, callback, null);
            },

            getWeightSlipRegisterReport: function (params, callback) {
                commonService.runJQueryX("GET", "feedmillreports/weightslipsearch/fromdate/" +params.fromdate
                + "/todate/"+params.todate+"/companyid/"+ commonService.session("companyId"), null, callback, null);
            },
            getTestResultRegisterReport: function (params, callback) {
                commonService.runJQueryX("GET", "feedmillreports/testregistersearch/fromdate/" +params.fromdate
                + "/todate/"+params.todate+"/companyid/"+ commonService.session("companyId"), null, callback, null);
            },
            getWarehouseByBranchnameReport: function (params, callback) {
                commonService.runJQueryX("GET", "feedmillreports/warehousesearch/branchid/" +params.branchid
                +"/companyid/"+ commonService.session("companyId"), null, callback, null);
            },
	      getWarehousebinByWarehouseid: function (params, callback) {
                commonService.runJQueryX("GET", "feedmillreports/warehousebinsearch/warehouseid/" +params.warehouseid
                +"/companyid/"+ commonService.session("companyId"), null, callback, null);
            },
            getitemByWarehousebinid: function (params, callback) {
                commonService.runJQueryX("GET", "feedmillreports/itemsearch/warehousebinid/" +params.warehousebinid
                +"/companyid/"+ commonService.session("companyId"), null, callback, null);
            },
            getDataForDailyGodownStockReport: function (params, callback) {
                commonService.runJQueryX("GET", "feedmillreports/godownstocksearch/fromdate/" +params.fromdate
                + "/todate/"+params.todate + "/warehouseid/"+ params.warehouseid +"/companyid/"+ commonService.session("companyId"), null, callback, null);
            },
            getFeedFormulaReportitem: function (params, callback) {
                commonService.runJQueryX("GET", "feedmillreports/feedformulasearch/itemgroupid/" + params.itemgroupid
                +"/companyid/"+ commonService.session("companyId"), null, callback, null);
            },
            getFeedFormulaReport: function (params, callback) {
                commonService.runJQueryX("GET", "feedmillreports/feedformulasearch/fromdate/" + params.fromdate
                + "/todate/"+params.todate + "/itemgroupid/"+params.itemgroupid + "/itemid/"+params.itemid +"/companyid/"+ commonService.session("companyId"), null, callback, null);
            },
             getFeedProductionReport: function (params, callback) {
                commonService.runJQueryX("GET", "feedmillreports/feedproductionsearch/fromdate/" + params.fromdate
                + "/todate/"+params.todate +  "/itemid/"+params.itemid +"/companyid/"+ commonService.session("companyId"), null, callback, null);
            },
	       getStockadjustmentReport: function (params, callback) {
                commonService.runJQueryX("GET", "feedmillreports/stockadjustmentsearch/itemid/" + params.itemid
               +"/companyid/"+ commonService.session("companyId"), null, callback, null);
            },
	       getQualityCheckReport: function (params, callback) {
                commonService.runJQueryX("GET", "feedmillreports/qualitychecksearch/fromdate/" +params.fromdate
                + "/todate/"+params.todate+ "/itemid/"+params.itemid+"/companyid/"+ commonService.session("companyId"), null, callback, null);
            },
            
            
        };
    }
);