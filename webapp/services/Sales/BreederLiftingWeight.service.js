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




            // gat all lifting Weight 
            getAllBreederLfWeight: function (callback) {
                commonService.runJQueryX("GET", "breederliftingweight/search/" + commonService.session("companyId"), null, callback, null);
            },

            getBreederLfWeight: function (params, callback) {
                commonService.runJQueryX("GET", "breederliftingweight/" + params.id + "/" + commonService.session("companyId"), null, callback, null);
            },

            saveBreederLfWeight: function (params, callback) {
                commonService.runJQueryX("POST", "breederliftingweight", params, callback, null);
            },

            // SalesDelivery details apis
            getAllBreederLfWeightDetail: function (params, callback) {
                commonService.runJQueryX("GET", "breederliftingweightdetail/search/" + params.breederliftingweightid + "/" + commonService.session("companyId"), null, callback, null);
            },

            getBreederLfWeightDetail: function (params, callback) {
                commonService.runJQueryX("GET", "breederliftingweightdetail/select/" + params.id + "/" + commonService.session("companyId"), null, callback, null);
            },

            saveBreederLfWeightDetail: function (params, callback) {
                commonService.runJQueryX("POST", "breederliftingweightdetail", params, callback, null);
            },
            getWarehouseBySalesOrder: function (params, callback) {
                commonService.runJQueryX("GET", "breederliftingweight/getwarehouse/" + params.salesorderid + "/" + commonService.session("companyId"), null, callback, null);
            },



        };
    }
);