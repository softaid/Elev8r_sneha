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

            getAllPermission : function(callback){
                commonService.runJQueryX("GET", "managepermission/search", null, callback, null);
            },

            // getAllPermissionByRole : function(params, callback){
            //     commonService.runJQueryX("GET", "managepermission/searchbyrole/" + params.roleid, null, callback, null);
            // },
     
            // getPermission : function(params, callback){
            //     commonService.runJQueryX("GET", "managepermission/" + params.id, null, callback, null);
            // },

            // savePermission : function(params, callback){
            //     commonService.runJQueryX("POST", "managepermission" , params, callback, null);
            // },

            // deletePermission : function(params, callback){
            //     commonService.runJQueryX("DELETE", "managepermission/" + params.id, null, callback, null);
            // },

        };
    }
);