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


            //get salesorder by location
            getSalesOrderByLocation: function (params, callback) {
                commonService.runJQueryX("GET", "breederliftingschedule/locationwisesalesorder/" + params.locationid + "/" + params.date + "/" + params.moduleid + "/" + commonService.session("companyId"), null, callback, null);
            },

            // gat all lifting schedule 
            getAllBreederLfSchedule: function (callback) {
                commonService.runJQueryX("GET", "breederliftingschedule/search/" + commonService.session("companyId"), null, callback, null);
            },

            getBreederLfSchedule: function (params, callback) {
                commonService.runJQueryX("GET", "breederliftingschedule/" + params.id + "/" + commonService.session("companyId"), null, callback, null);
            },

            saveBreederLfSchedule: function (params, callback) {
                commonService.runJQueryX("POST", "breederliftingschedule", params, callback, null);
            },

            // SalesDelivery details apis
            getAllBreederLfScheduleDetail: function (params, callback) {
                commonService.runJQueryX("GET", "breederliftingscheduledetail/search/" + params.liftingscheduleid, null, callback, null);
            },

            getBreederLfScheduleDetail: function (params, callback) {
                commonService.runJQueryX("GET", "breederliftingscheduledetail/select/" + params.id + "/" + commonService.session("companyId"), null, callback, null);
            },

            saveBreederLfScheduleDetail: function (params, callback) {
                commonService.runJQueryX("POST", "breederliftingscheduledetail", params, callback, null);
            },

            deleteSalesDeliveryDetail: function (params, callback) {
                commonService.runJQueryX("DELETE", "breederliftingscheduledetail/" + id + "/" + commonService.session("companyId") + "/" + commonService.session("userId"), null, callback, null);
            },


            getBirdSalesOrderByLfSchedule: function (params, callback) {
                commonService.runJQueryX("GET", "breederliftingschedule/birdsalesorderbylfschedule/" + params.liftingscheduleid + "/" + commonService.session("companyId"), null, callback, null);
            },

        };
    }
);