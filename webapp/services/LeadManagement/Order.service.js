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
            },
            getorderDetail:function(params,callback){
                commonService.runJQueryX("GET","order/orderdetail/" + params.id, null, callback, null )
            },
            saveOrderRevisions : function(params, callback){
                commonService.runJQueryX("POST", "order/saveorder/revisionsave" , params, callback, null);
            },

            // Document collection services

            getAllDocumentCollection : function(callback){
                console.log(commonService.session("companyId"));
                commonService.runJQueryX("GET", "documentcollection/search/" + commonService.session("companyId"), null, callback, null);
            },
     
            getDocumentCollection : function(params, callback){
                commonService.runJQueryX("GET", "documentcollection/select/id/" + params.id, null, callback, null);
            },

            saveDocumentCollection : function(params, callback){
                console.log("Params : " , params);
                commonService.runJQueryX("POST", "documentcollection" , params, callback, null);
           },

            deleteDocumentCollection : function(params, callback){
                commonService.runJQueryX("DELETE", "documentcollection" , params, callback, null);
            },

            getAllDocumentCollectionDetails : function(params, callback){
                commonService.runJQueryX("GET", "elevproject/documentcollectiondetails/search/" + commonService.session("companyId"), null, callback, null);
            },
     
            // get document   for that particular stage or activity or attribute
            getOrderDocumentCollectionDetails : function(params, callback){
                commonService.runJQueryX("GET", "elevproject/orderdocumentcollectiondetails/select/" +  params.orderid + "/" +  params.type + "/"+  commonService.session("companyId"), null, callback, null);
            },

            saveDocumentCollectionDetails : function(params, callback){
                console.log("Params : " , params);
                commonService.runJQueryX("POST", "elevproject/documentcollectiondetails" , params, callback, null);
            },


            deleteDocumentCollectionDetails : function(params, callback){
                commonService.runJQueryX("DELETE", "elevproject/documentcollectiondetails/delete" , params, callback, null);
            },

        };
    }
);