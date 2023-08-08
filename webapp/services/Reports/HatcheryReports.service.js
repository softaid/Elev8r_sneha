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
            // get Setting Report 
            getSettingReport: function (params, callback) {
                commonService.runJQueryX("POST", "hatcheryreports/settingreport", params, callback, null);
            },

            // get Hatch Report 
            getHatchReport: function (params, callback) {
                commonService.runJQueryX("POST", "hatcheryreports/hatchreport", params, callback, null);
            },

            // get Economy Report 
            getEconomyReport: function (params, callback) {
                commonService.runJQueryX("POST", "hatcheryreports/economyreport", params, callback, null);
            },

            // get CandlingTest Report 
            getCandlingTestReport: function (params, callback) {
                commonService.runJQueryX("POST", "hatcheryreports/candlingtestreport", params, callback, null);
            },

            // get Setting Report With Bin Quantity
            getSettingReportWithBinQty: function (params, callback) {
                console.log("params", params);
                commonService.runJQueryX("GET", "hatcheryreports/settingreportwithbinqty/fromdate/" + params.fromdate + "/todate/" + params.todate + "/companyid/" + commonService.session("companyId"), null, callback, null);
            },

            // get Transfer To Hatcher Report 
            getTransferToHatcher: function (params, callback) {
                console.log("params", params);
                commonService.runJQueryX("GET", "hatcheryreports/transfertohatcher/fromdate/" + params.fromdate + "/todate/" + params.todate + "/companyid/" + commonService.session("companyId"), null, callback, null);
            },

             //get Egg collection value Report
            getEggcollectionValueWthControlValue: function (params, callback) {
                console.log("params", params);
                commonService.runJQueryX("GET", "hatcheryreports/eggcollectionvaluewithcontrolvalue/fromdate/" + params.fromdate + "/todate/" + params.todate + "/companyid/" + commonService.session("companyId"), null, callback, null);
            },

            // Sale Module Reports
            // get Iten Wise Sale Report 
            getItemWiseSaleReport: function (params, callback) {
                console.log("params", params);
                commonService.runJQueryX("GET", "hatcheryreports/itemwisesalereport/fromdate/" + params.fromdate + "/todate/" + params.todate + "/itemid/" + params.itemid + "/companyid/" + commonService.session("companyId"), null, callback, null);
            },

            // get Customer Wise Sale Report 
            getCustomerWiseSaleReport: function (params, callback) {
                console.log("customerwiseservice", params);
                commonService.runJQueryX("GET", "hatcheryreports/customerwisesalereport/fromdate/" + params.fromdate + "/todate/" + params.todate + "/partyid/" + params.partyid + "/companyid/" + commonService.session("companyId"), null, callback, null);
            },

            // get Customer Wise Sale without Group Report 
            getCustomerWiseSaleWithoutGroupReport: function (params, callback) {
                console.log("params", params);
                commonService.runJQueryX("GET", "hatcheryreports/customerwisesalewithoutgroupreport/fromdate/" + params.fromdate + "/todate/" + params.todate + "/partyid/" + params.partyid + "/companyid/" + commonService.session("companyId"), null, callback, null);
            },

            // get Item Wise Sale Summary Report 
            getItemWiseSaleSummaryReport: function (params, callback) {
                console.log("params", params);
                commonService.runJQueryX("GET", "hatcheryreports/itemwisesalesummaryreport/fromdate/" + params.fromdate + "/todate/" + params.todate + "/companyid/" + commonService.session("companyId"), null, callback, null);
            },

            // get Collection Summary Report 
            getCollectionSummaryReport: function (params, callback) {
                console.log("params", params);
                commonService.runJQueryX("GET", "hatcheryreports/collectionsummaryreport/fromdate/" + params.fromdate + "/todate/" + params.todate + "/partyid/" + params.partyid + "/companyid/" + commonService.session("companyId"), null, callback, null);
            },

            // get Sale Summary Report 
            getSaleSummaryReport: function (params, callback) {
                console.log("params", params);
                commonService.runJQueryX("GET", "hatcheryreports/salesummaryreport/fromdate/" + params.fromdate + "/todate/" + params.todate + "/partyid/" + params.partyid + "/companyid/" + commonService.session("companyId"), null, callback, null);
            },

            //get Partybylocatinid for Production Report in Hatchery
            getPartbyLocation: function (params, callback) {
                console.log("params", params);
                commonService.runJQueryX("GET", "hatcheryreports/getpartybylocation/locationid/" + params.locationid + "/companyid/" + commonService.session("companyId"), null, callback, null);
            },

            //get breederbatchbylocatinid for Production Report in Hatchery
            getBreederBatchbyLocation: function (params, callback) {
                console.log("params", params);
                commonService.runJQueryX("GET", "hatcheryreports/getbreederbatchbylocation/locationid/" + params.locationid + "/companyid/" + commonService.session("companyId"), null, callback, null);
            },

            //get Hatchery Production Report
            getHatcheryProductionReport: function (params, callback) {
                console.log("params", params);
                commonService.runJQueryX("GET", "hatcheryreports/gethatcheryproduuctioneport/locationid/" + params.locationid + "/breederbatchid/" + params.breederbatchid + "/partyid/" + params.partyid + "/companyid/" + commonService.session("companyId"), null, callback, null);
            },
	    
	     // get all hatcherbatches by locationid
            getAllhtacherbatch: function (params, callback) {
                console.log("params", params);
                commonService.runJQueryX("GET", "hatcheryreports/gethatcherbatchbylocationid/locationid/" + params.locationid +  "/companyid/" + commonService.session("companyId"), null, callback, null);
            },

            getHatcheryvaccinationReport: function (params, callback) {
                console.log("params", params);
                commonService.runJQueryX("GET", "hatcheryreports/gethatcherbatchbylocationid/locationid/" + params.locationid + "/hatcherbatchid/" + params.hatcherbatchid + "/companyid/" + commonService.session("companyId"), null, callback, null);
            },

        };
    }
);