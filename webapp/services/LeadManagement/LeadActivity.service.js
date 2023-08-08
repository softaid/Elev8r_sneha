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
  
            getAllLeadActivities: function(callback){
                commonService.runJQueryX("GET", "leadactivity/search/" + commonService.session("companyId"), null, callback, null);
            },
           
            getLeadActivity : function(params, callback){
                commonService.runJQueryX("GET", "leadactivity/select/" + params.id, null, callback, null);
            },

            saveLeadActivity : function(params, callback){
                commonService.runJQueryX("POST", "leadactivity/saveleadactivity" , params, callback, null);
            },

            deleteLeadActivity : function(Params, Callback){
                commonService.runJQueryX("DELETE", "leadactivity/deleteleadactivity/" + Params.id, null, Callback, null);
            },


        };
    }
);