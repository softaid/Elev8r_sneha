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

            getAllWarehouseBin : function(params, callback){
                commonService.runJQueryX("GET", "warehousebin/search/" + params.companyid, null, callback, null);
            },
     
            getWarehouseBin : function(params, callback){
                commonService.runJQueryX("GET", "warehousebin/" + params.id, null, callback, null);
            },

            saveWarehouseBin : function(params, callback){
                commonService.runJQueryX("POST", "warehousebin" , params, callback, null);
            },

            deleteWarehouseBin : function(params, callback){
                commonService.runJQueryX("DELETE", "warehousebin/" + params.id, null, callback, null);
            },
        };
    }
);