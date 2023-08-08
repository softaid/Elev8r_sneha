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

            getAllItemGroup: function(callback){
                commonService.runJQueryX("GET", "itemgroup/search/" + commonService.session("companyId"), null, callback, null);
            },
     
            getItemGroup : function(params, callback){
                commonService.runJQueryX("GET", "itemgroup/" + params.id, null, callback, null);
            },

            saveItemGroup : function(params, callback){
                commonService.runJQueryX("POST", "itemgroup" , params, callback, null);
            },

            deleteItemGroup : function(params, callback){
                commonService.runJQueryX("DELETE", "itemgroup/" + params.id, null, callback, null);
            },
        };
    }
);