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
  
            getAllProjectTracking: function(callback){
                commonService.runJQueryX("GET", "projecttracking/searchprojecttracking/" + commonService.session("companyId"), null, callback, null);
            },
           
            getProjectTracking : function(params, callback){
                commonService.runJQueryX("GET", "projecttracking/selectprojecttracking/" + params.id, null, callback, null);
            },

            saveProjectTracking : function(params, callback){
                console.log("params",params);
                commonService.runJQueryX("POST", "projecttracking/saveprojecttracking/" , params, callback, null);
            },

            deleteProjectTracking : function(params, callback){
                commonService.runJQueryX("DELETE", "projecttracking/deleteprojecttracking/" + params.id, null, callback, null);
            },
            getAllProject: function(callback){
                commonService.runJQueryX("GET", "project/searchprojectdetails/" + commonService.session("companyId"), null, callback, null);
            },
        };
    }
);