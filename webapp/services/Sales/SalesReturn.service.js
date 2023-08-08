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

            // stockadjustment apis
            getAllSalesReturn : function(callback){
                commonService.runJQueryX("GET", "salesreturn/search/" + commonService.session("companyId"), null, callback, null);
            },
     
            getSalesReturn : function(params, callback){
                commonService.runJQueryX("GET", "salesreturn/" + params.id, null, callback, null);
            },

            saveSalesReturn : function(params, callback){
                commonService.runJQueryX("POST", "salesreturn" , params, callback, null);
            },

            deleteSalesReturn : function(id, callback){
                commonService.runJQueryX("DELETE", "salesreturn/" + id + "/" + commonService.session("companyId"), null, callback, null);
            },

        };
    }
);