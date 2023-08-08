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

            // SalesOrder apis
            getModuleWiseBatches: function (params, callback) {
                commonService.runJQueryX("GET", "breederbirdsalesorder/modulelocationwise/" + params.moduleid + "/" + params.locationid + "/" + params.fromweight + "/" + params.toweight + "/" + commonService.session("companyId"), null, callback, null);
            },

            getAllBirdSalesOrder: function (params, callback) {
                commonService.runJQueryX("GET", "breederbirdsalesorder/search/" + params + "/" + commonService.session("companyId"), null, callback, null);
            },
            getBirdSalesOrder: function (params, callback) {
                commonService.runJQueryX("GET", "breederbirdsalesorder/select/" + params.id + "/" + commonService.session("companyId"), null, callback, null);
            },

            saveBirdSalesOrder: function (params, callback) {
                commonService.runJQueryX("POST", "breederbirdsalesorder", params, callback, null);
            },

            // SalesOrder details apis
            getBirdAllSalesOrderDetail: function (params, callback) {
                console.log("params",params);
                commonService.runJQueryX("GET", "breederbirdsalesorderdetail/search/" + params.breederbirdsalesorderid+ "/" + params.moduleid+ "/" + commonService.session("companyId"), null, callback, null);
            },

            getSalesOrderDetail: function (params, callback) {
                commonService.runJQueryX("GET", "breederbirdsalesorderdetail/" + params.id, null, callback, null);
            },

            saveBirdSalesorderDetail: function (params, callback) {
                commonService.runJQueryX("POST", "breederbirdsalesorderdetail", params, callback, null);
            },

            deleteSalesOrderDetail: function (params, callback) {
                commonService.runJQueryX("DELETE", "breederbirdsalesorderdetail/" + id + "/" + commonService.session("companyId") + "/" + commonService.session("userId"), null, callback, null);
            },
            getAllBirdSalesOrderbatch: function (params, callback) {
                commonService.runJQueryX("GET", "breederbirdsalesorderdetail/orderbatch/" + params.breederbirdsalesorderid + "/" + params.warehouseid + "/" + commonService.session("companyId"), null, callback, null);
            },

            getAllBirdSalesOrderItem: function (params, callback) {
                commonService.runJQueryX("GET", "breederbirdsalesorderdetail/orderitem/" + params.breederbirdsalesorderid + "/" + params.batchid + "/" + params.warehouseid + "/" + commonService.session("companyId"), null, callback, null);
            },

        };
    }
);