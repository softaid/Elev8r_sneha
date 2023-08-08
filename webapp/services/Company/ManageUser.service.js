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

            searchUser: function (callback) {
                commonService.runJQueryX("GET", "manageuser/search/" +commonService.session("companyId"), null, callback, null);
            },

            getUser: function (params, callback) {
                commonService.runJQueryX("GET", "manageuser/" + params.id+"/"+ commonService.session("companyId"), null, callback, null);
            },

            getUserPermissions: function (params, callback) {
                commonService.runJQueryX("GET", "manageuser/userpermissions/" + params.id+"/"+ commonService.session("companyId"), null, callback, null);
            },

            saveUser: function (params, callback) {
                console.log("params:",params);
                commonService.runJQueryX("POST", "manageuser", params, callback, null);
            },

            deleteUser: function (params, callback) {
                commonService.runJQueryX("DELETE", "manageuser/" + params.id, null, callback, null);
            },

            getUserByRole : function(params,callback){
                commonService.runJQueryX("GET", "manageuser/usersrole/" + commonService.session("companyId")+"/"+params.roleid , null, callback, null);
            },
        };
    }
);