sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',

], function (JSONModel, BaseController, MessageToast, CommonService, commonFunction) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Common.DashboardSettingpage", {

        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        onInit: function () {
            this.oFlexibleColumnLayout = this.byId("fcldashboardcommonsetting");
        },

        navtoBreederSetting: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getTargets().display("breedersettings", {});
            oRouter.navTo("breedersettings", true);
            MessageToast.show("Your Breeder settings are not complete, Please click here to complete the setup.");
        },

        navtoLayerSetting: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getTargets().display("layersetting", {});
            oRouter.navTo("layersetting", true);
            MessageToast.show("Your Layer settings are not complete, Please click here to complete the setup.");
        },

        navtoFeedMillSetting: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getTargets().display("FeedMillSetting", {});
            oRouter.navTo("FeedMillSetting", true);
            MessageToast.show("Your Feed Mill settings are not complete, Please click here to complete the setup.");
        },

        navtoProcessingSetting: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getTargets().display("processingsettings", {});
            oRouter.navTo("processingsettings", true);
            MessageToast.show("Your Processing settings are not complete, Please click here to complete the setup.");
        },

        navtoCBFSetting: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getTargets().display("cbfsetting", {});
            oRouter.navTo("cbfsetting", true);
            MessageToast.show("Your CBF settings are not complete, Please click here to complete the setup.");
        },

        navtoCommonSetting: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getTargets().display("commonsetting", {});
            oRouter.navTo("commonsetting", true);
            MessageToast.show("Your common settings are not complete, Please click here to complete the setup.");
        },

        navtoHatcherySetting: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getTargets().display("hatcherysettings", {});
            oRouter.navTo("hatcherysettings", true);
            MessageToast.show("Your Hatchery settings are not complete, Please click here to complete the setup.");
        },

        onExit: function () {
            if (this._oDialog) {
                this._oDialog.destroy();
            }
        },
    });
}, true);
