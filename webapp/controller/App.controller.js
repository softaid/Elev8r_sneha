sap.ui.define([
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/ui/Device'
], function (BaseController, Controller, JSONModel,Device) {

		"use strict";

		return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.App", {

			_bExpanded: true,

			onInit: function () {
				this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

				// if the app starts on desktop devices with small or meduim screen size, collaps the sid navigation
				if (Device.resize.width <= 1024) {
					//this.onSideNavButtonPress();
				}
				Device.media.attachHandler(function (oDevice) {
					if ((oDevice.name === "Tablet" && this._bExpanded) || oDevice.name === "Desktop") {
					//	this.onSideNavButtonPress();
						// set the _bExpanded to false on tablet devices
						// extending and collapsing of side navigation should be done when resizing from
						// desktop to tablet screen sizes)
						this._bExpanded = (oDevice.name === "Desktop");
					}
				}.bind(this));
			},
			// onAfterRendering: function() {
			// 	// Initialize Gantt chart after rendering
			// 	gantt.init("gantt_here");
			//   }
			
		});
	});

