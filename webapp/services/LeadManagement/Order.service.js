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
  
            getAllOrders: function(callback){
                commonService.runJQueryX("GET", "order/search/" + commonService.session("companyId"), null, callback, null);
            },
           
            getOrder : function(params, callback){
                commonService.runJQueryX("GET", "order/select/" + params.id, null, callback, null);
            },

            saveOrder : function(params, callback){
                commonService.runJQueryX("POST", "order/saveorder" , params, callback, null);
            },

            deleteOrder : function(Params, Callback){
                commonService.runJQueryX("DELETE", "order/deleteorder/" + Params.id, null, Callback, null);
            },

            getOrderPDF : function(Params, Callback){
                commonService.runJQueryX("GET", "order/converttopdf/" + Params.id, null, Callback, null);
            }
        };
    }
);