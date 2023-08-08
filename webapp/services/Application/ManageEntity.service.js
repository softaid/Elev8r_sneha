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

          getAllEntity : function(callback){
                commonService.runJQueryX("GET", "manageentity/search", null, callback, null);
            },

            getAllEntityByRole : function(params, callback){
                commonService.runJQueryX("GET", "manageentity/searchbyrole/" + params.roleid, null, callback, null);
            },

            getAllEntityByUser : function(params, callback){
                commonService.runJQueryX("GET", "manageentity/searchbyuser/" + params.userid, null, callback, null);
            },
     
            getEntity : function(params, callback){
                commonService.runJQueryX("GET", "manageentity/" + params.id, null, callback, null);
            },

            saveEntity : function(params, callback){
                commonService.runJQueryX("POST", "manageentity" , params, callback, null);
            },

            deleteEntity : function(params, callback){
                commonService.runJQueryX("DELETE", "manageentity/" + params.id, null, callback, null);
            },

        };
    }
);