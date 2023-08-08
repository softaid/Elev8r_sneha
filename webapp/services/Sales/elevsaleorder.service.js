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
  
            getAllSaleOrder: function(callback){
                commonService.runJQueryX("GET", "elevsaleorder/searchelevsaleorder/" + commonService.session("companyId"), null, callback, null);
            },
           
            getProjectTracking : function(params, callback){
                commonService.runJQueryX("GET", "elevsaleorder/selectelevsaleorder/" + params.id, null, callback, null);
            },

            saveProjectTracking : function(params, callback){
                console.log("params",params);
                commonService.runJQueryX("POST", "elevsaleorder/saveelevsaleorder/" , params, callback, null);
            },

            deleteelevsaleorder : function(params, callback){
                commonService.runJQueryX("DELETE", "elevsaleorder/deleteelevsaleorder/" + params.id, null, callback, null);
            },


        };
    }
);