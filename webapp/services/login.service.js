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
            },

            getuserByMobileNo : function(params, callback, errorCallback, objArray){

                common.runJQueryX("POST", "login/" , params, callback, errorCallback, objArray);
            },

            resetPwd : function(params, callback, errorCallback, objArray){
                common.runJQueryX("POST", "login/reset" , params, callback, errorCallback, objArray);
            },
            
            getCompanyCodeByEmailfunction (params, callback, errorCallback, objArray) {
                common.runJQueryX("POST", "login/companycode/"+ params.email, null, callback, errorCallback, objArray);
            },

            sendCompanycodeByEmail: function (params, callback, errorCallback, objArray) {
                common.runJQueryX("POST", "login/email/send", params, callback, errorCallback, objArray);
            },

            sendEmail : async function(params, callback, errorCallback, objArray){
                common.runJQueryXSendEmail("POST", "profile/send-email", params, callback, errorCallback, objArray);
            },

        };
    }
);