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

            getAllLocations : function(callback){
                commonService.runJQueryX("GET", "elocation/search/" + commonService.session("companyId"), null, callback, null);
            },
     
            getLocation : function(params, callback){
                commonService.runJQueryX("GET", "elocation/" + params.locationid, null, callback, null);
            },

            saveLocation : function(params, callback){
                commonService.runJQueryX("POST", "elocation" , params, callback, null);
            },

            deleteLocation : function(params, callback){
                commonService.runJQueryX("DELETE", "elocation/" + params.locationid, null, callback, null);
            },
        };
    }
);