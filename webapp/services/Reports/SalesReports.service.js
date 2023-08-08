sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',        
], 
    function (commonService) 
    {
        "use strict";

         return {
           /**
              * @public
              * @param {boolean} bIsPhone the value to be checked
              * @returns {string} path to image
           */

            getItemWiseSaleReport: function (params, callback) {
                console.log("params",params);
                commonService.runJQueryX("GET", "salesreports/itemwisesalereport/fromdate/"+ params.fromdate +  "/todate/" + params.todate +  "/partyid/" + params.partyid + "/companyid/"+ commonService.session("companyId"), null, callback, null);
            },


        };
    }
);