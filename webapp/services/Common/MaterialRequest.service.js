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

            getMaterialRequestByCompanyid :  function(callback){
                commonService.runJQueryX("GET", "materialrequest/search/companyid/" + commonService.session("companyId"), null, callback, null);
            },
     
            getMaterialRequestDetailsFromRequest :  function(params, callback){
                commonService.runJQueryX("GET", "materialrequestdetail/search/" + params.materialrequestid, null, callback, null);
            },

            // getMaterialTransferDetail : function(params, callback){
            //     commonService.runJQueryX("GET", "materialrequestdetail/" + params.id, null, callback, null);
            // },

            saveMaterialRequest : function(params, callback){
                 commonService.runJQueryX("POST", "materialrequest" , params, callback, null);
            },

            //get batches by request target
            getBatchesByRequesTtarget :  function(params,callback){
                commonService.runJQueryX("GET", "materialrequest/search/" + commonService.session("companyId") + "/" + params.requesttarget, null, callback, null);
            },


            saveMaterialRequestDetail : function(params, callback){
                commonService.runJQueryX("POST", "materialrequestdetail" , params, callback, null);
            },

            
        };
    }
);