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

            // SalesOrder apis
            getAllSalesOrder : function(callback){
                commonService.runJQueryX("GET", "salesorder/search/" + commonService.session("companyId"), null, callback, null);
            },
     
            getSalesOrder : function(params, callback){
                commonService.runJQueryX("GET", "salesorder/" + params.id, null, callback, null);
            },

            saveSalesOrder : function(params, callback){
                console.log("params saveSalesOrder : ",params);
                commonService.runJQueryX("POST", "salesorder" , params, callback, null);
            },

            deleteSalesOrder : function(id, callback){
                commonService.runJQueryX("DELETE", "salesorder/" + id + "/" + commonService.session("companyId") + "/" + commonService.session("userId"), null, callback, null);
            },

            getSalesOrderOnDelivery : function(params, callback){
                commonService.runJQueryX("GET", "salesorder/" + params.salestypeid + "/" + commonService.session("companyId"), null, callback, null);
            },

            // SalesOrder details apis
            getAllSalesOrderDetail : function(params, callback){
                 commonService.runJQueryX("GET", "salesorderdetail/search/" + params.salesorderid + "/" + commonService.session("companyId"), null, callback, null);
            },

            getSalesOrderDetail : function(params, callback){
                commonService.runJQueryX("GET", "salesorderdetail/" + params.id, null, callback, null);
            },

            saveSalesOrderDetail : function(params, callback){
                console.log("params : ",params);
                commonService.runJQueryX("POST", "salesorderdetail" , params, callback, null);
            },

            deleteSalesOrderDetail : function(params, callback){
                console.log("PARAMS : ",params);
                 commonService.runJQueryX("DELETE", "salesorderdetail/" + id + "/" + commonService.session("companyId") + "/" + commonService.session("userId"), null, callback, null);
            },
            getSalesOrderList : function(params, callback){
                commonService.runJQueryX("GET", "salesorder/search_list/from_date/" + params.from_date + "/to_date/" + params.to_date, null, callback, null);
            }            
        };
    }
);