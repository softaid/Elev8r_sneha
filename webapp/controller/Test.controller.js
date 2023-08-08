sap.ui.define([
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/ui/model/json/JSONModel',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/m/MessageBox',
], function (oBaseController, JSONModel, oCommonFunction, oMessageBox) {
	"use strict";
	return oBaseController.extend("sap.ui.posfm.controller.Transaction.DailyTransactionChart", {

		onInit: function () {

			let oThis = this,
				oRouter = sap.ui.core.UIComponent.getRouterFor(oThis);

			oCommonFunction.setModel({
				context: oThis,
				sName: "oModel",
				aData: []
			});

			oRouter.getRoute("test").attachMatched(oThis.initializeData, oThis);

		},

		initializeData: async function () {

			let oThis = this;

			oThis.generateReport(oCommonFunction.getModel({ context: oThis, sName: "oModel", bReturnDataOnly: true }));

		},

		generateReport: async function (oArguments) {

			let oThis = this;

			let aBirdWeight = [{
				"week": "WEEK1",
				"live_birds": "07943",
				"expected_bird_weight": "057",
				"actual_bird_weight": "80"
			}, {
				"week": "WEEK2",
				"live_birds": "10395",
				"expected_bird_weight": "197",
				"actual_bird_weight": "299"
			}, {
				"week": "WEEK3",
				"live_birds": "26500",
				"expected_bird_weight": "393",
				"actual_bird_weight": "367"
			}, {
				"week": "WEEK4",
				"live_birds": "34877",
				"expected_bird_weight": "431",
				"actual_bird_weight": "453"
			}, {
				"week": "WEEK5",
				"live_birds": "70001",
				"expected_bird_weight": "557",
				"actual_bird_weight": "520"
			}];

			oCommonFunction.setModel({
				context: oThis,
				sName: "oBirdWeight",
				aData: aBirdWeight
			});


		},

		routeTo: function (sRouteName) {
			let oThis = this;
			return oThis.redirectTo(sRouteName);
		}

	});

});
