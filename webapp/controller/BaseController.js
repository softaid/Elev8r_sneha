sap.ui.define([
	"sap/ui/core/mvc/Controller",
	
	], function (Controller) {
		"use strict";

		return Controller.extend("sap.ui.elev8rerp.componentcontainer.controller.BaseController", {

			/**
			 * Convenience method for accessing the router.
			 * @public
			 * @returns {sap.ui.core.routing.Router} the router for this component
			 */

			onInit: function () {
				
			},

			getRouter : function () {

				return sap.ui.core.UIComponent.getRouterFor(this);
			},

			/**
			 * Convenience method for getting the view model by name.
			 * @public
			 * @param {string} [sName] the model name
			 * @returns {sap.ui.model.Model} the model instance
			 */
			getModel : function (sName) {
				return this.getView().getModel(sName);
			},

			/**
			 * Convenience method for setting the view model.
			 * @public
			 * @param {sap.ui.model.Model} oModel the model instance
			 * @param {string} sName the model name
			 * @returns {sap.ui.mvc.View} the view instance
			 */
			setModel : function (oModel, sName) {
				return this.getView().setModel(oModel, sName);
			},

			onNavBack: function (oEvent) {
				var oHistory, sPreviousHash;
	
				oHistory = History.getInstance();
				sPreviousHash = oHistory.getPreviousHash();
	
				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					this.getRouter().navTo("home", {}, true /*no history*/);
				}
			}
		});

	});