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
  
            getAllContacts: function(callback){
                commonService.runJQueryX("GET", "contact/search/" + commonService.session("companyId"), null, callback, null);
            },
           
            getContact : function(params, callback){
                commonService.runJQueryX("GET", "contact/select/" + params.id, null, callback, null);
            },

            saveContact : function(params, callback){
                console.log(params);
                commonService.runJQueryX("POST", "contact/" , params, callback, null);
            },

            deleteContact : function(Params, Callback){
                commonService.runJQueryX("DELETE", "contact/deletecontact/" + Params.id, null, Callback, null);
            },

            convertToLead : function(params, callback){
                console.log(params);
                commonService.runJQueryX("GET", "contact/converttolead/" + params.id, null, callback, null);
            },
        };
    }
);