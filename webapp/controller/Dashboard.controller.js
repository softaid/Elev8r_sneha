sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/ui/Device',
    'sap/ui/elev8rerp/componentcontainer/model/formatter'
], function (BaseController, JSONModel, Device, formatter) {
    "use strict";
    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Dashboard", {
        formatter: formatter,

        onInit: function () {

            var oViewModel = new JSONModel({
                isPhone : Device.system.phone
            });
            this.setModel(oViewModel, "view");
            Device.media.attachHandler(function (oDevice) {
                this.getModel("view").setProperty("/isPhone", oDevice.name === "Phone");
            }.bind(this));

            this.getRouter().navTo("home");
        }

    });
});