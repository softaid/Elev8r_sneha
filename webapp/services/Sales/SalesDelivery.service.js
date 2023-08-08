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

            // SalesDelivery apis
            getAllSalesDelivery : function(callback){
                commonService.runJQueryX("GET", "salesdelivery/search/" + commonService.session("companyId"), null, callback, null);
            },
     
            getSalesDelivery : function(params, callback){
                commonService.runJQueryX("GET", "salesdelivery/" + params.id, null, callback, null);
            },

            saveSalesDelivery : function(params, callback){
                console.log("params saveSalesDelivery : ",params);
                commonService.runJQueryX("POST", "salesdelivery" , params, callback, null);
            },

            deleteSalesDelivery : function(id, callback){
                commonService.runJQueryX("DELETE", "salesdelivery/" + id + "/" + commonService.session("companyId") + "/" + commonService.session("userId"), null, callback, null);
            },

            saveSalesDeliveryJE : function(params, callback){
                commonService.runJQueryX("GET", "salesdelivery/savesalesdeliveryje/" + params.salesdeliveryid +"/companyid/"+ commonService.session("companyId") +"/userid/"+ commonService.session("userId"), null, callback, null);
            },

            // SalesDelivery details apis
            getCalculatedSalesOrderDetail : function(params, callback){
                commonService.runJQueryX("GET", "salesdelivery/orderdetailsearch/" + params.salesorderid + "/" + commonService.session("companyId"), null, callback, null);
           },

           
            // SalesDelivery details apis
            getAllSalesDeliveryDetail : function(params, callback){
                 commonService.runJQueryX("GET", "salesdeliverydetail/search/" + params.salesdeliveryid + "/" + commonService.session("companyId"), null, callback, null);
            },

            getSalesDeliveryDetail : function(params, callback){
                commonService.runJQueryX("GET", "salesdeliverydetail/" + params.id, null, callback, null);
            },

            saveSalesDeliveryDetail : function(params, callback){
                console.log("params : ",params);
                commonService.runJQueryX("POST", "salesdeliverydetail" , params, callback, null);
            },

            deleteSalesDeliveryDetail : function(params, callback){
                console.log("PARAMS : ",params);
                 commonService.runJQueryX("DELETE", "salesdeliverydetail/" + id + "/" + commonService.session("companyId") + "/" + commonService.session("userId"), null, callback, null);
            },

	    salesDeliveryIssueItems : function(params, callback){
                commonService.runJQueryX("GET", "salesdelivery/issueitems/" + params.salesdeliveryid + "/" + commonService.session("userId") + "/" + commonService.session("companyId"), null, callback, null);
            },

	    saveSalesDeliveryJE : function(params, callback){
            commonService.runJQueryX("GET", "salesdelivery/savesalesdeliveryje/" + params.salesdeliveryid + "/companyid/" + commonService.session("companyId") + "/userid/" + commonService.session("userId"), null, callback, null);
        },

	    saveSalesInvoiceBySalesDelivery : function(params, callback){
            commonService.runJQueryX("GET", "salesdelivery/savesalesinvoicebysalesdelivery/" + params.salesdeliveryid + "/companyid/" + commonService.session("companyId") + "/userid/" + commonService.session("userId"), null, callback, null);
        },
        getSalesDeliveryList : function(params, callback){
            commonService.runJQueryX("GET", "salesdelivery/search/from_date/" + params.from_date + "/to_date/" + params.to_date, null, callback, null);
        },

        };
    }
);