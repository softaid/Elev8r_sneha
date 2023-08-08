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

            getSalesInvoiceOverDue : function(params, callback){
                commonService.runJQueryX("GET", "commondashboard/SI/search/company_id/" + commonService.session("companyId")+"/to_date/"+params.to_date, null, callback, null);
            },
            getPurchaseInvoiceOverDue : function(params, callback){
                commonService.runJQueryX("GET", "commondashboard/PI/search/company_id/" + commonService.session("companyId")+"/to_date/"+params.to_date, null, callback, null);
            },
            get_Profitandloss_data:function(params, callback){
                commonService.runJQueryX("GET", "commondashboard/pandl/search/to_date/" +params.to_date + "/company_id/" + commonService.session("companyId"), null, callback, null);
            },
        };
    }
);