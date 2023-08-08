sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',        
], 
    function (commonService) 
    {
        "use strict";

         return {
    
            getApplicationSettings : function(callback){
                commonService.runJQueryX("GET", "applicationsettings/search/" + commonService.session("companyId"), null, callback, null);
            },
     
            saveApplicationSettings : function(params, callback){
                commonService.runJQueryX("POST", "applicationsettings" , params, callback, null);
            },
        };
    }
);