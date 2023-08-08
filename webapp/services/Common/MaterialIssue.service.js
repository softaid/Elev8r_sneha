
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

            // materialissue type apis
            getmaterialIssueTypeHatcherBatch : function(callback){
                commonService.runJQueryX("GET", "materialissue/hatcherbatchsearch/" + commonService.session("companyId"), null, callback, null);
            },
            saveMaterialIssue : function(params, callback){
                commonService.runJQueryX("POST", "materialissue" , params, callback, null);
            },
             
        };
    }
);