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
  
            getAllProjectActivity: function(callback){
                commonService.runJQueryX("GET", "projectactivity/searchprojectactivity/" + commonService.session("companyId"), null, callback, null);
            },
           
            getProjectActivity : function(params, callback){
                commonService.runJQueryX("GET", "projectactivity/selectprojectactivity/" + params.id, null, callback, null);
            },

            saveProjectActivity : function(params, callback){
                console.log("params",params);
                commonService.runJQueryX("POST", "projectactivity/saveprojectactivity/" , params, callback, null);
            },

            deleteProjectActivity : function(params, callback){
                commonService.runJQueryX("DELETE", "projectactivity/deleteprojectactivity/" + params.id, null, callback, null);
            },

        };
    }
);