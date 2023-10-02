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
           
            // get all attribute for particular project
            getAttributeList: function(params, callback){
                commonService.runJQueryX("GET", "attributelist/selectattributelist/" + params.projectid, null, callback, null);
            },


            // save attribute for particular project
            saveAttributeList: function(params, callback){
                commonService.runJQueryX("POST", "Attributelist/saveAttributelist" , params, callback, null);
            }


        };
    }
);