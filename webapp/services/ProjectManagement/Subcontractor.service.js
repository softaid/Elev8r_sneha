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
  
            getAllSubcontractors: function(callback){
                commonService.runJQueryX("GET", "subcontractor/searchsubcontractors/" + commonService.session("companyId"), null, callback, null);
            },
           
            getSubcontractor : function(params, callback){
                commonService.runJQueryX("GET", "subcontractor/selectsubcontractor/" + params.id, null, callback, null);
            },

            saveSubcontractor : function(params, callback){
                commonService.runJQueryX("POST", "subcontractor/savesubcontractor" , params, callback, null);
            },

            deleteSubcontractor : function(Params, Callback){
                commonService.runJQueryX("DELETE", "subcontractor/deletesubcontractor/" + Params.id, null, Callback, null);
            },


        };
    }
);