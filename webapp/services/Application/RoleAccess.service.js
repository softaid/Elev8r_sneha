sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',        
], 
    function (commonService) 
    {
        "use strict";

         return {
           /**
              * @public
              * @param {boolean} bIsPhone the value to be checked
              * @returns {string} path to image
           */

            getAllRoleAccess : function(callback){
                commonService.runJQueryX("GET", "roleaccess/search/" + commonService.session("companyId"), null, callback, null);
            },

            getEntityByRole : function(params, callback){
                commonService.runJQueryX("GET", "roleaccess/searchbyrole/" + params.roleid, null, callback, null);
            },

            getPermissions : function(callback){
                commonService.runJQueryX("GET", "roleaccess/permissions", null, callback, null);
            },

            getRoles : function(callback){
                commonService.runJQueryX("GET", "roleaccess/roles", null, callback, null);
            },
     
            getRoleAccess : function(params, callback){
                commonService.runJQueryX("GET", "roleaccess/" + params.id, null, callback, null);
            },

            saveRoleAccess : function(params, callback){
                commonService.runJQueryX("POST", "roleaccess" , params, callback, null);
            },

            deleteRoleAccess : function(params, callback){
                commonService.runJQueryX("DELETE", "roleaccess/" + params.id, null, callback, null);
            },

        };
    }
);