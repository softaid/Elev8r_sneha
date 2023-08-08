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

          getCompany : function(callback){
                commonService.runJQueryX("GET", "company/" + commonService.session("companyId"), null, callback, null);
            },
     
          
        };
    }
);