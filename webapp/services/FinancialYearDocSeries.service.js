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

            getAllFinancialYearDocSeries : function(params, callback){
                commonService.runJQueryX("GET", "financialyeardocseries/search/" + params.settingid + "/" + commonService.session("companyId"), null, callback, null);
            },
     
            getFinancialYearDocSeries : function(params, callback){
                commonService.runJQueryX("GET", "financialyeardocseries/" + params.id, null, callback, null);
            },

            saveFinancialYearDocSeries : function(params, callback){
                commonService.runJQueryX("POST", "financialyeardocseries" , params, callback, null);
            },

            deleteFinancialYearDocSeries : function(params, callback){
                commonService.runJQueryX("DELETE", "financialyeardocseries/" + params.id, null, callback, null);
            },

            
        };
    }
);