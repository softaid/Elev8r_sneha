sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/ui/Device',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service'
    
], function (BaseController, JSONModel, Device,commonService) {
    "use strict";
    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Chome", {

        getRouter : function () {
            return sap.ui.core.UIComponent.getRouterFor(this);	
        },
    
        onInit: function (evt) {
        
            var oViewModel = new JSONModel({
                isPhone : Device.system.phone
            });

            var oViewModel = new JSONModel({
                companyname : commonService.session("companyname"),
                companyaddress : commonService.session("address"),
                detailaddress : commonService.session("detailaddress"),
                companycontact : commonService.session("companycontact"),
                companyemail : commonService.session("companyemail"),
                city : commonService.session("city"),
                pincode : commonService.session("pincode"),
                contactno2 : commonService.session("contactno2"),
                faxnumber : commonService.session("faxnumber"),
            });

        this.setModel(oViewModel, "view");	

        

            this.setModel(oViewModel, "view");
            Device.media.attachHandler(function (oDevice) {
                this.getModel("view").setProperty("/isPhone", oDevice.name === "Phone");
            }.bind(this));
        },
        

    
});
});