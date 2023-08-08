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
  
            getAllQuotations: function(callback){
                commonService.runJQueryX("GET", "quotation/search/" + commonService.session("companyId"), null, callback, null);
            },
           
            getQuotation : function(params, callback){
                commonService.runJQueryX("GET", "quotation/select/" + params.id, null, callback, null);
            },

            getQuotationPDF : function(params, callback){
                commonService.runJQueryX("GET", "quotation/converttopdf/" + params.id, null, callback, null);
            },

            saveQuotation : function(params, callback){
                commonService.runJQueryX("POST", "quotation/savequotation" , params, callback, null);
            },

            deleteQuotation : function(Params, Callback){
                commonService.runJQueryX("DELETE", "quotation/deletequotation/" + Params.id, null, Callback, null);
            },

            convertToOrder : function(params, callback){
                console.log(params);
                commonService.runJQueryX("GET", "quotation/converttoorder/" + params.id, null, callback, null);
            },
        };
    }
);