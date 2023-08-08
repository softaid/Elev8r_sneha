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

            // searchSubscription: function (callback) {
            //     commonService.runJQueryX("GET", "managesubscription/search/" +commonService.session("companyId"), null, callback, null);
            // },

            activeLicenses: function (callback) {
                commonService.runJQueryX("GET", "managesubscription/activelicenses/" +commonService.session("companyId"), null, callback, null);
            },

            userLicenses: function (callback) {
                commonService.runJQueryX("GET", "managesubscription/userlicenses/" +commonService.session("companyId"), null, callback, null);
            },

            userLicensesDdl: function (params, callback) {
                commonService.runJQueryX("GET", "managesubscription/userlicensesddl/" + params.userid +"/"+ +commonService.session("companyId"), null, callback, null);
            },

            // getSubscription: function (params, callback) {
            //     commonService.runJQueryX("GET", "managesubscription/" + params.id+"/"+ commonService.session("companyId"), null, callback, null);
            // },

            saveSubscription: function (params, callback) {
                console.log("params:",params);
                commonService.runJQueryX("POST", "managesubscription/saveuserlicenses", params, callback, null);
            },

            // deleteSubscription: function (params, callback) {
            //     commonService.runJQueryX("DELETE", "managesubscription/" + params.id, null, callback, null);
            // },
        };
    }
);