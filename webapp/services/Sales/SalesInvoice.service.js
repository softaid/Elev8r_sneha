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

            // SalesInvoice apis
            getAllSalesInvoice : function(callback){
                commonService.runJQueryX("GET", "salesinvoice/search/" + commonService.session("companyId"), null, callback, null);
            },
     
            getSalesInvoice : function(params, callback){
                commonService.runJQueryX("GET", "salesinvoice/" + params.id, null, callback, null);
            },

            saveSalesInvoice : function(params, callback){
                commonService.runJQueryX("POST", "salesinvoice" , params, callback, null);
            },

            deleteSalesInvoice : function(id, callback){
                commonService.runJQueryX("DELETE", "salesinvoice/" + id + "/" + commonService.session("companyId") + "/" + commonService.session("userId"), null, callback, null);
            },

            getSalesDeliveryByOrder : function(params, callback){
                commonService.runJQueryX("GET", "salesinvoice/salesdeliverylist/" + params.salesorderid + "/" + params.salesinvoiceid + "/" + commonService.session("companyId"), null, callback, null);
            },

            getdeliverydetailsearchByOrder : function(params, callback){
                commonService.runJQueryX("GET", "salesinvoice/deliverydetailsearch/"+ params.salesdeliveryids + "/" + params.salesorderid + "/" + commonService.session("companyId"), null, callback, null);
            },

            getSalesOrderOnInvoice : function(callback){
                commonService.runJQueryX("GET", "salesinvoice/salesorder/"+ commonService.session("companyId"), null, callback, null);
            },

            // SalesInvoice details apis
            getAllSalesInvoiceDetail : function(params, callback){
                 commonService.runJQueryX("GET", "salesinvoicedetail/search/" + params.salesinvoiceid + "/" + commonService.session("companyId"), null, callback, null);
            },

            getSalesInvoiceDetailByInvoice : function(params, callback){
                commonService.runJQueryX("GET", "salesinvoicedetail/invoicesearch/" + params.salesinvoiceid + "/" + commonService.session("companyId"), null, callback, null);
            },

            getSalesInvoiceDetail : function(params, callback){
                commonService.runJQueryX("GET", "salesinvoicedetail/" + params.id, null, callback, null);
            },

            saveSalesInvoiceDetail : function(params, callback){
                commonService.runJQueryX("POST", "salesinvoicedetail" , params, callback, null);
            },

            deleteSalesInvoiceDetail : function(params, callback){
                 commonService.runJQueryX("DELETE", "salesinvoicedetail/" + id + "/" + commonService.session("companyId") + "/" + commonService.session("userId"), null, callback, null);
            },

            saveSalesInvoiceJE : function(params, callback){
                commonService.runJQueryX("GET", "salesinvoicedetail/savesalesinvoiceje/" + params.salesinvoiceid +"/companyid/"+ commonService.session("companyId") +"/userid/"+ commonService.session("userId"), null, callback, null);
            },

             // SalesInvoice details apis
            getAllSalesInvoiceFreight : function(params, callback){
                commonService.runJQueryX("GET", "salesinvoicefreight/search/" + params.salesinvoiceid + "/" + commonService.session("companyId"), null, callback, null);
            },

            getSalesInvoiceFreight : function(params, callback){
               commonService.runJQueryX("GET", "salesinvoicefreight/" + params.id, null, callback, null);
            },

            saveSalesInvoiceFreight : function(params, callback){
               commonService.runJQueryX("POST", "salesinvoicefreight" , params, callback, null);
            },

            deleteSalesInvoiceFreight : function(params, callback){
                commonService.runJQueryX("DELETE", "salesinvoicefreight/" + id + "/" + commonService.session("companyId") + "/" + commonService.session("userId"), null, callback, null);
            },
            getSalesInvoiceList : function(params, callback){
                commonService.runJQueryX("GET", "salesinvoice/search/from_date/" + params.from_date + "/to_date/" + params.to_date, null, callback, null);
            },

	    salesInvoiceIssueItems : function(params, callback){
                commonService.runJQueryX("GET", "salesinvoice/issueitems/" + params.salesinvoiceid + "/" + commonService.session("userId") + "/" + commonService.session("companyId"), null, callback, null);
            },


        };
    }
);