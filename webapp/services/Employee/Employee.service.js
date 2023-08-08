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
  
            getAllEmployee: function(callback){
                commonService.runJQueryX("GET", "employee/search/companyid/" + commonService.session("companyId"), null, callback, null);
            },


            getEmployee: function (params, callback) {
                commonService.runJQueryX("GET", "employee/select/id/" + params.id, null, callback, null);
            },

            saveEmployee: function (params, callback) {
                console.log("----------params-----------",params);
                commonService.runJQueryX("POST", "employee", params, callback, null);
            },

            deleteEmployee: function (params, callback) {
                commonService.runJQueryX("DELETE", "employee", params, callback, null);
            },
        };
    }
);