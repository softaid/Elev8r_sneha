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

            getAllItemHSN: function(callback){
                commonService.runJQueryX("GET", "itemhsn/search/" + commonService.session("companyId"), null, callback, null);
            },

           
     
            getItemHSN : function(params, callback){
                commonService.runJQueryX("GET", "itemhsn/" + params.id, null, callback, null);
            },

            saveItemHSN : function(params, callback){
                commonService.runJQueryX("POST", "itemhsn" , params, callback, null);
            },

            deleteItemHSN : function(params, callback){
                commonService.runJQueryX("DELETE", "itemhsn/" + params.id, null, callback, null);
            },
        };
    }
);