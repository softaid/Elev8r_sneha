sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',
],
    function (common) {
        "use strict";

        return {
            /**
             * @public
             * @param {boolean} bIsPhone the value to be checked
             * @returns {string} path to image
             */

            // For test purpose
            login: function (params, callback, errorCallback, objArray) {
                common.runJQueryX("POST", "login", params, callback, errorCallback, objArray);
            },

            validateCompany: function (params, callback, errorCallback, objArray) {
                common.runJQueryX("POST", "login/validatecompany", params, callback, errorCallback, objArray);
            },

            // This is implemented for license users
            userLogin: function (params, callback, errorCallback, objArray) {
                common.runJQueryX("POST", "login/user", params, callback, errorCallback, objArray);
            },

            sendSMSForgetPsw: function (fullUrl, callback, errorCallback) {
                common.runJQueryUrl(fullUrl, "GET", null, callback, errorCallback);
            }

        };
    }
);