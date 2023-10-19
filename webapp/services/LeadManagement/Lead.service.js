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
  
            getAllLeads: function(callback){
                commonService.runJQueryX("GET", "lead/searchlead/" + commonService.session("companyId"), null, callback, null);
            },

            getLeadDetails : function(params, callback){
                commonService.runJQueryX("GET", "lead/leaddetails/" + params.id, null, callback, null);
            },
           
            getLeads: function(params, callback){
                commonService.runJQueryX("GET", "lead/leadselect/" + params.id, null, callback, null);
            },

            saveLead: function(params, callback){
                commonService.runJQueryX("POST", "lead/" , params, callback, null);
            },

            saveLeadAddress: function(Params, Callback){
                commonService.runJQueryX("POST", "lead/leadaddress" , Params, Callback, null);
            },

            deleteLead  : function(params, callback){
                console.log(params);
                commonService.runJQueryX("DELETE", "lead/" + params.id, null, callback, null);
            },
            
            convertToQuote : function(params, callback){
                console.log(params);
                commonService.runJQueryX("GET", "lead/converttoquote/" + params.id, null, callback, null);
            },

            getSalesDashboard : function(callback){
                commonService.runJQueryX("GET", "leadmaster/salesdashboard/companyid/" + commonService.session("companyId"), null, callback, null);
            }
        };
    }
);