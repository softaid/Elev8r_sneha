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

            // breeder shed ready apis
            getAllMaterialReceipt : function(callback){
                commonService.runJQueryX("GET", "materialreceipt/search/" + commonService.session("companyId"), null, callback, null);
            },
     
            getMaterialReceipt : function(params, callback){
                commonService.runJQueryX("GET", "materialreceipt/" + params.id, null, callback, null);
            },

            saveMaterialReceipt : function(params, callback){
                commonService.runJQueryX("POST", "materialreceipt" , params, callback, null);
            },

            // getAllBreederShedsForApproval : function(callback){
            //     commonService.runJQueryX("GET", "breedershedready/search/" + commonService.session("companyId"), null, callback, null);
            // },
           
            deleteMaterialReceipt : function(id, callback){
                commonService.runJQueryX("DELETE", "materialreceipt/" + id, null, callback, null);
            },

            getAllMaterialReceiptHatcherBatches : function(callback){
                commonService.runJQueryX("GET", "materialreceipt/select/" + commonService.session("companyId"), null, callback, null);
            },

            
            // MaterialReceipt detail apis
            getAllMaterialReceiptDetail : function(params, callback){
                 commonService.runJQueryX("GET", "materialreceiptdetail/search/" + params.materialreceiptid, null, callback, null);
            },

            getMaterialReceiptDetail : function(params, callback){
                commonService.runJQueryX("GET", "materialreceiptdetail/" + params.id + "/"  + commonService.session("companyId"), null, callback, null);
            },

            saveMaterialReceiptDetail : function(params, callback){
                commonService.runJQueryX("POST", "materialreceiptdetail" , params, callback, null);
            },

            deleteMaterialReceiptDetail : function(params, callback){
                 commonService.runJQueryX("DELETE", "materialreceiptdetail/" + params.id, null, callback, null);
            },
             
            getItembatchFromWarehouse : function(params, callback){
                commonService.runJQueryX("GET", "materialreceiptdetail/select/warehouseid/" + params.warehouseid , null, callback, null);
            }, 

            getVaccinatedItembatches : function(callback){
                commonService.runJQueryX("GET", "materialreceiptdetail/select/companyid/" + commonService.session("companyId") , null, callback, null);
            }, 

             
        };
    }
);