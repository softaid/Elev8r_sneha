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

            getAllMaterialTransfer :  function(callback){
                commonService.runJQueryX("GET", "materialtransfer/search/" + commonService.session("companyId"), null, callback, null);
            },

            getMaterialRequestDetailsFromRequest : function(params,callback){
                commonService.runJQueryX("GET", "materialrequestdetail/search/" + params.materialrequestid, null, callback, null);
            },
     
            getMaterialRequestDetail :  function(params, callback){
                commonService.runJQueryX("GET", "materialrequestdetail/" + params.id, null, callback, null);
            },

            getMaterialTransferDetail : function(params, callback){
                commonService.runJQueryX("GET", "materialtransferdetails/" + params.id, null, callback, null);
            },

            saveMaterialTransfer : function(params, callback){
                 commonService.runJQueryX("POST", "materialtransfer" , params, callback, null);
            },


            getTransferDetailsByTransferID : function(params, callback){
                commonService.runJQueryX("GET", "materialtransferdetails/search/" + params.transferid, null, callback, null);
            },

            saveMaterialTransferDetail : function(params, callback){
                commonService.runJQueryX("POST", "materialtransferdetails" , params, callback, null);
            },

	        saveMaterialTransferJE:  function(params, callback){
                commonService.runJQueryX("GET", "materialtransfer/materialtransferje/" + params.materialtransferid+ "/" + commonService.session("companyId") + "/" + commonService.session("userId"), null, callback, null);
            },

            getMaterialRequestandtransferScheduleList: function(params, callback){
                commonService.runJQueryX("GET", "materialtransfer/materialrequestandtransferschedulelist/" + params.from_date + "/" + params.to_date, null, callback, null);
            },

        };
    }
);