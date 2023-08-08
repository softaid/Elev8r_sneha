sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',
],
    function (commonService) {
        "use strict";

        return {

            getAllProjects : function(callback){
                commonService.runJQueryX("GET", "elevproject/searchprojects/" + commonService.session("companyId"), null, callback, null);
            },

            getProjectdetail : function(param,callback){
                commonService.runJQueryX("GET", "elevproject/selectprojectdetail/" + param.id, null, callback, null);
            },

            // get all NI details
            getNIdetail : function(param,callback){
                commonService.runJQueryX("GET", "elevproject/selectnidetail/" + param.id, null, callback, null);
            },

            getProject : function(param,callback){
                commonService.runJQueryX("GET", "elevproject/selectproject/" + param.id, null, callback, null);
            },

            getAllProjectsDetail : function(callback){
                commonService.runJQueryX("GET", "elevproject/projectsdetail/" + commonService.session("companyId"), null, callback, null);
            },    
            getAllProjectsStagePerDetail : function(callback){
                commonService.runJQueryX("GET", "elevproject/projectsdetailstageper/" + commonService.session("companyId"), null, callback, null);
            },    
            getAllProjectsProjWeightageDetail : function(callback){
                commonService.runJQueryX("GET", "elevproject/projectsdetailproweightage/" + commonService.session("companyId"), null, callback, null);
            },   
            getAllProjectDepartmentDetail : function(callback){
                commonService.runJQueryX("GET", "elevproject/projectsdetaildepartments/" + commonService.session("companyId"), null, callback, null);
            },   
            getAllProjectEndDateDetail : function(callback){
                commonService.runJQueryX("GET", "elevproject/projectsdetailenddate/" + commonService.session("companyId"), null, callback, null);
            },    

            getAllProjectsDetailFinal : function(callback){
                commonService.runJQueryX("GET", "elevproject/finalprojectsdetail/" + commonService.session("companyId"), null, callback, null);
            },    
            getAllProjectsStagePerDetailFinal : function(callback){
                commonService.runJQueryX("GET", "elevproject/finalprojectsdetailstageper/" + commonService.session("companyId"), null, callback, null);
            },    
            getAllProjectsProjWeightageDetailFinal : function(callback){
                commonService.runJQueryX("GET", "elevproject/finalprojectsdetailproweightage/" + commonService.session("companyId"), null, callback, null);
            },   
            getAllProjectDepartmentDetailFinal : function(callback){
                commonService.runJQueryX("GET", "elevproject/finalprojectsdetaildepartments/" + commonService.session("companyId"), null, callback, null);
            },   
            getAllProjectEndDateDetailFinal : function(callback){
                commonService.runJQueryX("GET", "elevproject/finalprojectsdetailenddate/" + commonService.session("companyId"), null, callback, null);
            },
            
            getAllNiProjectsDetail : function(callback){
                commonService.runJQueryX("GET", "elevproject/niprojectsdetail/" + commonService.session("companyId"), null, callback, null);
            },    
            getAllProjectsStagePerDetailFinal : function(callback){
                commonService.runJQueryX("GET", "elevproject/finalprojectsdetailstageper/" + commonService.session("companyId"), null, callback, null);
            },    
            getAllNiProjectsProjWeightageDetail : function(callback){
                commonService.runJQueryX("GET", "elevproject/niprojectsdetailproweightage/" + commonService.session("companyId"), null, callback, null);
            },   
            getAllProjectDepartmentDetailFinal : function(callback){
                commonService.runJQueryX("GET", "elevproject/finalprojectsdetaildepartments/" + commonService.session("companyId"), null, callback, null);
            },   
            getAllNIProjectEndDateDetailFinal : function(callback){
                commonService.runJQueryX("GET", "elevproject/finalniprojectsdetailenddate/" + commonService.session("companyId"), null, callback, null);
            },

            getAllProjectstageDetail : function(callback){
                commonService.runJQueryX("GET", "elevproject/finalprojectsdetailstagedate/" + commonService.session("companyId"), null, callback, null);
            },  
            getAllNiProjectsStageName : function(callback){
                commonService.runJQueryX("GET", "elevproject/niprojectsdetailstagename/" + commonService.session("companyId"), null, callback, null);
            },      
            getAllstagesSequencewise : function(callback){
                commonService.runJQueryX("GET", "elevproject/finalprojectsdetailstagesandsequence/" + commonService.session("companyId"), null, callback, null);
            },    

            getAllNIstagesSequencewise : function(callback){
                commonService.runJQueryX("GET", "elevproject/finalprojectsdetailnistagesandsequence/" + commonService.session("companyId"), null, callback, null);
            },    
            
            saveProject : function(params,callback){
                commonService.runJQueryX("POST", "elevproject/saveproject/", params,callback, null);
            },

            // save project details like  end date , completion per
            updateProjectManagement : function(params,callback){
                commonService.runJQueryX("POST", "elevproject/updateProjectManagement/", params,callback, null);
            },

            // save project details like  end date , completion per
            updateNIProjectDetail : function(params,callback){
                commonService.runJQueryX("POST", "elevproject/updateProjectNIManagement/", params,callback, null);
            },

            saveProjectActivityDetail: function(params,callback){
                commonService.runJQueryX("POST", "elevproject/saveprojectdetail/",params, callback, null);
            },
            // Save NI Detail
            saveNIActivityDetail: function(params,callback){
                commonService.runJQueryX("POST", "elevproject/saveNIdetail/",params, callback, null);
            },
            updateProjectActivityDetail: function(params,callback){
                commonService.runJQueryX("POST", "elevproject/updateprojectdetail/",params, callback, null);
            },
            updateNIProjectActivityDetail: function(params,callback){
                commonService.runJQueryX("POST", "elevproject/updateniprojectdetail/",params, callback, null);
            },

            deleteProjectActivityDetail : function(params,callback){
                commonService.runJQueryX("DELETE", "elevproject/deleteprojectdetail/"+params.id, null, callback, null);
            },

            getProjectList : function(params, callback){
                commonService.runJQueryX("GET", "project/projectlist/" + params.leadid, null, callback, null);
            },
    
            
            getAllDepartment : function(callback){
                commonService.runJQueryX("GET", "department/search/" + commonService.session("companyId"), null, callback, null);
            },

            getAllDocumentCollection : function(callback){
                console.log(commonService.session("companyId"));
                commonService.runJQueryX("GET", "documentcollection/search/" + commonService.session("companyId"), null, callback, null);
            },
     
            getDocumentCollection : function(params, callback){
                commonService.runJQueryX("GET", "documentcollection/select/id/" + params.id, null, callback, null);
            },

            saveDocumentCollection : function(params, callback){
                console.log("Params : " , params);
                commonService.runJQueryX("POST", "documentcollection" , params, callback, null);
           },

            deleteDocumentCollection : function(params, callback){
                commonService.runJQueryX("DELETE", "documentcollection" , params, callback, null);
            },

            getAllDocumentCollectionDetails : function(params, callback){
                commonService.runJQueryX("GET", "elevproject/documentcollectiondetails/search/" + commonService.session("companyId"), null, callback, null);
            },
     
            getDocumentCollectionDetails : function(params, callback){
                commonService.runJQueryX("GET", "elevproject/documentcollectiondetails/select/" +  params.projectid + "/" +  params.stageid + "/"+  commonService.session("companyId")+"/"+ params.document_id, null, callback, null);
            },

            // getAllBatchReport: function (params, callback) {
            //     commonService.runJQueryX("GET", "cbfreports/search/branch_id/" + params.branch_id +  "/" +  params.line_id +"/companyid/"+ commonService.session("companyId"), null, callback, null);
            // },
            saveDocumentCollectionDetails : function(params, callback){
                console.log("Params : " , params);
                commonService.runJQueryX("POST", "elevproject/documentcollectiondetails" , params, callback, null);
            },


            deleteDocumentCollectionDetails : function(params, callback){
                commonService.runJQueryX("DELETE", "elevproject/documentcollectiondetails/delete" , params, callback, null);
            },
         }
    })