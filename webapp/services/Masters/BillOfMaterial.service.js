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

            getAllBillOfMaterialResult : function(callback){
                commonService.runJQueryX("GET", "billofmaterial/search/" + commonService.session("companyId"), null, callback, null);
            },
     
            getBillOfMaterial : function(params, callback){
                commonService.runJQueryX("GET", "billofmaterial/select/" + params.id + "/"  + commonService.session("companyId"), null, callback, null);
            },

            saveBillOfMaterial : function(params, callback){
                commonService.runJQueryX("POST", "billofmaterial" , params, callback, null);
            },

            deleteBillOfMaterial : function(params, callback){
                commonService.runJQueryX("DELETE", "billofmaterial/" + params.id, null, callback, null);
            },

            //child API

            getAllBillOfMaterialDetailResult : function(params, callback){
                commonService.runJQueryX("GET", "billofmaterialdetail/search/" + params.bomid, null, callback, null);
            },
     
            getBillOfMaterialDetail : function(params, callback){
                commonService.runJQueryX("GET", "billofmaterialdetail/select/" + params.id + "/"  + commonService.session("companyId"), null, callback, null);
            },

            saveBillOfMaterialDetail : function(params, callback){
                commonService.runJQueryX("POST", "billofmaterialdetail" , params, callback, null);
            },
            
            deleteBillOfMaterialDetail : function(params, callback){
                commonService.runJQueryX("DELETE", "billofmaterialdetail" , params, callback, null);
            },

            getItemLastPucrchaseCost : function(params, callback){
                commonService.runJQueryX("GET", "billofmaterial/itemlastpuchasecost/" + params.itemid + "/"  + commonService.session("companyId"), null, callback, null);
            },

            getBomByItemid: function(params, callback){
                commonService.runJQueryX("GET", "billofmaterial/bombyitemid/" + params.itemid + "/"+params.bomcode+"/" + commonService.session("companyId"), null, callback, null);
            },

            getBillOfMaterialList : function(params, callback){
                commonService.runJQueryX("GET", "billofmaterial/search/product_group/" + params.product_group + "/product_name/" + params.product_name + "/from_date/" + params.from_date + "/to_date/" + params.to_date, null, callback, null);
            }

        };
    }
);