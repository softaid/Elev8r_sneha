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

           getPurchaseOrderReport: function (params, callback) {
                commonService.runJQueryX("GET", "purchaseorder/search/fromdate/" + params.fromdate 
                + "/todate/" + params.todate + "/companyid/" + commonService.session("companyId"), null, callback, null);
            },
            
            
            
        };
    }
);