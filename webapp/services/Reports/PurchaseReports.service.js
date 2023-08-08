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

            getAllParty: function (callback) {
                commonService.runJQueryX("GET", "purchasereports/searchparty/companyid/" + commonService.session("companyId"),null, callback, null);
            },
     
            getPurchaseRegisterReport: function (params, callback) {
                commonService.runJQueryX("POST", "purchasereports/purchaseregisterreport", params, callback, null);
            },
         
            getItemWiseStockReport: function (params, callback) {
                 commonService.runJQueryX("GET", "purchasereports/itemwisestockreport/fromdate/"+ params.fromdate + "/todate/" + params.todate +  "/itemid/" + params.itemid +  "/warehouseids/" + params.warehouseids + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },


            getItemSubgroupReport: function (params, callback) {
                commonService.runJQueryX("POST", "purchasereports/itemsubgroupreport", params, callback, null);
            },
            getPartywisePurchaseOrderReport: function (params, callback) {
                 commonService.runJQueryX("GET", "purchasereports/search/fromdate/"+ params.fromdate + "/todate/" + params.todate +  "/customerid/" + params.customerid + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },

             getwarehousebylocation: function (params, callback) {
                
                 commonService.runJQueryX("GET", "purchasereports/locationwisewarehouse/locationid/"+ params.locationid + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },

             getGRNRegisterReport: function (params, callback) {
                 commonService.runJQueryX("GET", "purchasereports/search/fromdate/"+ params.fromdate + "/todate/" + params.todate + "/itemid/" + params.itemid + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },
             getPendingPurchaseOrderReport: function (params, callback) {
                 commonService.runJQueryX("GET", "purchasereports/pendingpurchaseordersearch/fromdate/"+ params.fromdate + "/todate/" + params.todate + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },

             dashboard: function (callback) {
                 commonService.runJQueryX("GET", "purchasereports/dashboard/companyid/"+ commonService.session("companyId"), null, callback, null);
             },
         
         
         
            
            
        };
    }
);