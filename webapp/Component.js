sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/f/FlexibleColumnLayoutSemanticHelper",
    "sap/ui/elev8rerp/componentcontainer/model/models",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/Device"

], function (jQuery, UIComponent, JSONModel, FlexibleColumnLayoutSemanticHelper, models, Device) {
    "use strict";
    return UIComponent.extend("sap.ui.elev8rerp.componentcontainer.Component", {
        metadata: {
            manifest: "json",
            rootView: "sap.ui.elev8rerp.componentcontainer.view.App",
        },
        init: function () {
            // reset the routing hash
            // HashChanger.getInstance().replaceHash("");
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);

            var rootPath = jQuery.sap.getModulePath("sap.ui.elev8rerp.componentcontainer.view.App");

			// Config Model
			var oConfig= new sap.ui.model.json.JSONModel("./config/config.json");
			sap.ui.getCore().setModel(oConfig,"configModel");

			// set device model
			var oDeviceModel = new JSONModel(Device);
			oDeviceModel.setDefaultBindingMode("OneWay");
			this.setModel(oDeviceModel, "device");

            this.setModel(models.createDeviceModel(), "device");
            this.getRouter().initialize();
        },

        myNavBack: function () {
            var oHistory = sap.ui.core.routing.History.getInstance();
            var oPrevHash = oHistory.getPreviousHash();
            if (oPrevHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getRouter().navTo("masterSettings", {}, true);
            }
        },

        getContentDensityClass: function () {
            if (!this._sContentDensityClass) {
                if (!sap.ui.Device.support.touch) {
                    this._sContentDensityClass = "sapUiSizeCompact";
                } else {
                    this._sContentDensityClass = "sapUiSizeCozy";
                }
            }
            return this._sContentDensityClass;
        }
    });
});