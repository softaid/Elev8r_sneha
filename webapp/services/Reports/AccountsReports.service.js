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

            getSubledgerRegister: function (params, callback) {
                commonService.runJQueryX("GET", "accountsreports/subledgerregister/"+ params.partyroleid + "/"  + params.partyid + "/" + params.fromdate + "/" + params.todate + "/" + commonService.session("companyId"), null, callback, null);
            },
	    
             getPayableBalanceReport: function (params, callback) {
                commonService.runJQueryX("GET", "accountsreports/payablebalance/"+ params.partyid + "/" + params.fromdate + "/" + params.todate + "/" + commonService.session("companyId"), null, callback, null);
            },

           getReceivableBalanceReport: function (params, callback) {
                commonService.runJQueryX("GET", "accountsreports/receivablebalance/"+ params.partyid + "/" + params.fromdate + "/" + params.todate + "/" + commonService.session("companyId"), null, callback, null);
            },


            getSubledgerRegisterforsingleparty: function (params, callback) {
                commonService.runJQueryX("GET", "accountsreports/subledgerregisterforsingleparty/"+ params.partyroleid + "/"  + params.partyid + "/" + params.fromdate + "/" + params.todate + "/" + commonService.session("companyId"), null, callback, null);
            },

            getGLRegister: function (params, callback) {
                commonService.runJQueryX("GET", "accountsreports/glregister/" + params.ledgerid + "/" + params.fromdate + "/" + params.todate + "/" + commonService.session("companyId"), null, callback, null);
            },

            getBankBookRegister : function (params, callback) {
                commonService.runJQueryX("GET", "accountsreports/bankbookregister/" + params.ledgerid + "/" + params.fromdate + "/" + params.todate + "/" + commonService.session("companyId"), null, callback, null);
            },

            getCashBookRegister : function (params, callback) {
                commonService.runJQueryX("GET", "accountsreports/cashbookregister/" + params.ledgerid + "/" + params.fromdate + "/" + params.todate + "/" + commonService.session("companyId"), null, callback, null);
            },

            getGeneralLedgerTB : function (params, callback) {
                commonService.runJQueryX("GET", "accountsreports/gltb/" + params.branchid + "/" + params.fromdate + "/" + params.todate + "/" + commonService.session("companyId"), null, callback, null);
            },
            
            getDayBookRegister : function (params, callback) {
                commonService.runJQueryX("GET", "accountsreports/daybooksearch/" + params.date + "/" + commonService.session("companyId"), null, callback, null);
            },

            getBalanceSheet : function(params, callback){
                commonService.runJQueryX("GET", "accountsreports/balancesheet/" + params.todate + "/" + commonService.session("companyId"), null, callback, null);
            },

            getProfitAndLoss : function(params, callback){
                commonService.runJQueryX("GET", "accountsreports/profitandloss/" + params.fromdate + "/" + params.todate + "/" + commonService.session("companyId"), null, callback, null);
            },

            getSLTrialBalance : function (params, callback) {
                commonService.runJQueryX("GET", "accountsreports/sltb/" + params.branchid + "/" + params.partyroleid + "/" + params.fromdate + "/" + params.todate + "/" + commonService.session("companyId"), null, callback, null);
            },
            getProfitAndLossDiff : function(params, callback){
                commonService.runJQueryX("GET", "accountsreports/profitandlossdiff/" +params.todate + "/" + commonService.session("companyId"), null, callback, null);
            },
        };
    }
);