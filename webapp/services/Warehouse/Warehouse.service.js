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

            getAllWarehouse : function(callback){
                commonService.runJQueryX("GET", "warehouse/search/" + commonService.session("companyId"), null, callback, null);
            },
     
            getWarehouse : function(params, callback){
                commonService.runJQueryX("GET", "warehouse/" + params.id, null, callback, null);
            },

            saveWarehouse : function(params, callback){
                commonService.runJQueryX("POST", "warehouse" , params, callback, null);
            },

            deleteWarehouse : function(params, callback){
                commonService.runJQueryX("DELETE", "warehouse/" + params.id, null, callback, null);
            },
        };
    }
);