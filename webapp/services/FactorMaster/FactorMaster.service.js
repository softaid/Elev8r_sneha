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
  
            getAllFactorMaster: function(callback){
                commonService.runJQueryX("GET", "factormaster/search/" + commonService.session("companyId"), null, callback, null);
            },


            getFactorMaster: function (params, callback) {
                commonService.runJQueryX("GET", "factormaster/select/" + params.id, null, callback, null);
            },

            saveFactorMaster: function (params, callback) {
                commonService.runJQueryX("POST", "factormaster", params, callback, null);
            }
            
        };
    }
);