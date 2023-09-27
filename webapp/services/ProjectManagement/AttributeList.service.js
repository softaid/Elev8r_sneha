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
  
            getAllQcchecklist: function(callback){
                commonService.runJQueryX("GET", "qcchecklist/searchqcchecklist/" + commonService.session("companyId"), null, callback, null);
            },
           
            getAttributelist: function(params, callback){
                commonService.runJQueryX("GET", "attributelist/selectattributelist/" + params.id, null, callback, null);
            },

            saveQcchecklist: function(params, callback){
                commonService.runJQueryX("POST", "qcchecklist/saveqcchecklist" , params, callback, null);
            }


        };
    }
);