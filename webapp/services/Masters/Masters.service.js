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

            getAllReferenceTypes : function(params, callback){
                commonService.runJQueryX("GET", "leadmaster/searchreferencetype/" + commonService.session("companyId"), null, callback, null);
            },
     
            getReferenceType : function(params, callback){
                commonService.runJQueryX("GET", "leadmaster/select/" + params.id, null, callback, null);
            },

            saveReferenceType : function(params, callback){
                
                commonService.runJQueryX("POST", "leadmaster/savereferencetype" , params, callback, null);
            },

            deleteReferenceType : function(params, callback){
                commonService.runJQueryX("DELETE", "leadmaster/deletereferencetype/" + params.id, null, callback, null);
            },

            getReferenceTypeByMaster : function(params, callback){
                commonService.runJQueryX("GET", "leadmaster/selectbymaster/" + params.master, null, callback, null);
            },

            getAllReference : function(params, callback){
                commonService.runJQueryX("GET", "leadmaster/search/" + params.typecode, null, callback, null);
            },
     
            getReference : function(params, callback){
                commonService.runJQueryX("GET", "leadmaster/selectreference/" + params.id, null, callback, null);
            },

            getReferenceByTypeCode : function(params, callback){
                commonService.runJQueryX("GET", "leadmaster/referencebytypecode/" + params.typecode, null, callback, null);
            },

            getReferenceByTypeCodeAndParentType : function(params, callback){
                commonService.runJQueryX("GET", "leadmaster/referencebytypecodeandparenttype/" + params.typecode + "/" + params.parenttype, null, callback, null);
            },
            
            // getReferenceByTypeCodeAndParentType : function(params, callback){
            //     commonService.runJQueryX("GET", "leadmaster/referencebytypecodeandparenttype/" + params.typecode + "/" + params.parenttype, null, callback, null);
            // },


            getReferenceByTypeCodeDepartment : function(params, callback){
                commonService.runJQueryX("GET", "leadmaster/referencebytypecode/Department/"+params.typecode+"/"+ params.departmentid, null, callback, null);
            },//6

            saveReference : function(params, callback){
                
                commonService.runJQueryX("POST", "leadmaster" , params, callback, null);
            },

            deleteReference : function(params, callback){
                commonService.runJQueryX("DELETE", "leadmaster/" + params.id, null, callback, null);
            },

            getAllDepartments : function(callback){
                commonService.runJQueryX("GET", "department/search/" + commonService.session("companyId"), null, callback, null);
            }
            
        };
    }
);