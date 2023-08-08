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

            getAllFinancialYearSetting : function(callback){
                commonService.runJQueryX("GET", "financialyearsetting/search/" + commonService.session("companyId"), null, callback, null);
            },

            getFinancialYearList : function(callback){
                commonService.runJQueryX("GET", "financialyearsetting/list/" + commonService.session("companyId"), null, callback, null);
            },
     
            getFinancialYearSetting : function(params, callback){
                commonService.runJQueryX("GET", "financialyearsetting/" + params.id, null, callback, null);
            },

            saveFinancialYearSetting : function(params, callback){
                commonService.runJQueryX("POST", "financialyearsetting" , params, callback, null);
            },

            deleteFinancialYearSetting : function(params, callback){
                commonService.runJQueryX("DELETE", "financialyearsetting/" + params.id, null, callback, null);
            },

            
        };
    }
);