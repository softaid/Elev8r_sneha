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

            getAllItem: function (callback) {
                commonService.runJQueryX("GET", "item/search/" +commonService.session("companyId"), null, callback, null);
            },

            getItem: function (params, callback) {
                commonService.runJQueryX("GET", "item/" + params.id, null, callback, null);
            },

            saveItem: function (params, callback) {
                commonService.runJQueryX("POST", "item", params, callback, null);
            },

            deleteItem: function (params, callback) {
                commonService.runJQueryX("DELETE", "item/" + params.id, null, callback, null);
            },
        };
    }
);