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

            getAppTransactions : function(callback){
                commonService.runJQueryX("GET", "notificationsetting/apptransactions", null, callback, null);
            },

            getNotificationPlaceholders : function(params, callback){
                commonService.runJQueryX("GET", "notificationsetting/notificationplaceholders/"+ params.transactiontypeid, null, callback, null);
            },

            getAllNotificationSetting : function(callback){
                commonService.runJQueryX("GET", "notificationsetting/search", null, callback, null);
            },
     
            getNotificationSettingById : function(params, callback){
                commonService.runJQueryX("GET", "notificationsetting/" + params.id, null, callback, null);
            },

            saveNotificationSetting : function(params, callback){
                commonService.runJQueryX("POST", "notificationsetting" , params, callback, null);
            },

            deleteNotificationSetting : function(params, callback){
                commonService.runJQueryX("DELETE", "notificationsetting/" + params.id, null, callback, null);
            },

        };
    }
);