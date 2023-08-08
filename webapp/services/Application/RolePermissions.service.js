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

            getAllrolePermissions : function(callback){
                commonService.runJQueryX("GET", "rolepermissions/search/" + commonService.session("companyId"), null, callback, null);
            },

            getEntityByRole : function(params, callback){
                commonService.runJQueryX("GET", "rolepermissions/searchbyrole/" + params.roleid, null, callback, null);
            },

            getPermissions : function(callback){
                commonService.runJQueryX("GET", "rolepermissions/permissions", null, callback, null);
            },

            getRoles : function(callback){
                commonService.runJQueryX("GET", "rolepermissions/roles", null, callback, null);
            },
     
            getRolePermissions : function(params, callback){
                commonService.runJQueryX("GET", "rolepermissions/" + params.id, null, callback, null);
            },

            saveRolePermissions : function(params, callback){
                commonService.runJQueryX("POST", "rolepermissions" , params, callback, null);
            },

            deleteRolePermissions : function(params, callback){
                commonService.runJQueryX("DELETE", "rolepermissions/" + params.id, null, callback, null);
            },

        };
    }
);