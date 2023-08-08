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

            // CBF Reports Service

           

            getAllInputItems: function (params, callback) {
                 commonService.runJQueryX("GET", "processingreports/search/fromdate/" + params.fromdate +  "/" +  params.todate + "/companyid/"+ commonService.session("companyId"), null, callback, null);
             },

             getAllInputBatches: function (params, callback) {
                commonService.runJQueryX("GET", "processingreports/search/fromdate/" + params.fromdate +  "/" +  params.todate +   "/" +  params.inputitems + "/companyid/"+ commonService.session("companyId"), null, callback, null);
            },

            getAllOutputitems: function (callback) {
                commonService.runJQueryX("GET", "processingreports/search/" + commonService.session("companyId"), null, callback, null);
            },

             getProcessingRegisterReport: function (params, callback) {
                 commonService.runJQueryX("GET", "processingreports/search/fromdate/" + params.fromdate +  "/" +  params.todate +  "/" +  params.inputitems +   "/" +  params.inputitembatches +  "/" +  params.outputitems +"/companyid/"+ commonService.session("companyId"), null, callback, null);
             },

             getProcessingLiveBirdDetailReport: function (params, callback) {
                commonService.runJQueryX("GET", "processingreports/search/livebird/" + params.moduleid +  "/" +  params.itemid  +"/companyid/"+ commonService.session("companyId"), null, callback, null);
            },

            getItemWiseStockReport: function (params, callback) {
                commonService.runJQueryX("GET", "processingreports/itemwisestockweaightwisereport/fromdate/"+ params.fromdate + "/todate/" + params.todate +  "/itemid/" + params.itemid +  "/warehouseids/" + params.warehouseids + "/companyid/"+ commonService.session("companyId"), null, callback, null);
            },



        };
    }  
);




