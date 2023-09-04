sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/ui/model/Sorter',
	'sap/ui/elev8rerp/componentcontainer/services/ProjectManagement/Project.service',
	'sap/ui/elev8rerp/componentcontainer/utility/xlsx',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/ui/elev8rerp/componentcontainer/services/Company/ManageUser.service',
	'sap/m/MessageToast',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/controller/formatter/fragment.formatter',

], function (JSONModel, BaseController, Sorter, Projectservice, xlsx, commonService, ManageUserService, MessageToast, commonFunction, formatter) {

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.LeadManagement.Quotations", {

		onInit: function () {

			this.bus = sap.ui.getCore().getEventBus();

			this.afilters = [];

			this.bus.subscribe("qutationcreen", "handleQutationList", this.handleQutationList, this);
			this.bus.subscribe("qutationdetail", "handleQutationDetails", this.handleQutationDetails, this);
			this.bus.subscribe("loaddata", "loadData", this.loadData, this);
			
			this.bus.subscribe("loadQuotationData", "loadQuotationData", this.loadQuotationData, this);
			//this.oFlexibleColumnLayout = this.byId("fclQuotation");

			this.handleRouteMatched(null);

			jQuery.sap.delayedCall(1000, this, function () {
				// this.getView().byId("onSearchId").focus();
			});
			this.fnShortCut();

			// bind Quote Type dropdown  
			commonFunction.getReferenceByTypeForFilter("QuoteType", "quoteTypeModel", this);

			// bind Lead dropdown quote category
			commonFunction.getReferenceByTypeForFilter("QuoteCategory", "quoteCategoryModel", this);
		},

		getModelDefault: function () {
			return {

			}
		},

		fnShortCut: function () {
			var currentContext = this;
			$(document).keydown(function (evt) {
				if (evt.keyCode == 79 && evt.ctrlKey) {
					jQuery(document).ready(function ($) {
						evt.preventDefault();
						currentContext.onAddNew()

					})
				}
			});
		},

		handleRouteMatched: function (evt) {
			this.loadQuotationData();
		},

		// Function for display Type wise quotations
		onQuoteType: function (oEvent) {
			let filterText = oEvent.getSource().mProperties.text.split("(");
			var sQuery = filterText[0];
			var contains = sap.ui.model.FilterOperator.EQ;
			var columns = 'quotetype';

			this.afilters.push(new sap.ui.model.Filter(columns, contains, sQuery));
			if (sQuery == "All") {
				this.afilters = [];
			}
			// if (sQuery == "All") {
			// 	let i = this.afilters.length;
			// 	while (i--) {
			// 		if (this.afilters[i].sPath == "quotetype") {
			// 			this.afilters.splice(i, 1);
			// 		}
			// 	}
			// }
			var list = this.getView().byId("tblQuotationMaster");
			var binding = list.getBinding("items");

			binding.filter(new sap.ui.model.Filter({ filters: this.afilters, and: true | false }));
		},

		// Function for display categorywise quotations
		onQuoteCategory: function (oEvent) {
			let filterText = oEvent.getSource().mProperties.text.split("(");
			var sQuery = filterText[0];
			var contains = sap.ui.model.FilterOperator.EQ;
			var columns = 'quotecategory';

			this.afilters.push(new sap.ui.model.Filter(columns, contains, sQuery));
			if (sQuery == "All") {
				let i = this.afilters.length;
				while (i--) {
					if (this.afilters[i].sPath == "quotecategory") {
						this.afilters.splice(i, 1);
					}
				}
			}
			var list = this.getView().byId("tblQuotationMaster");
			var binding = list.getBinding("items");

			binding.filter(new sap.ui.model.Filter({ filters: this.afilters, and: true | false }));
		},

		handleQutationDetails: function (sChannel, sEvent, oData) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.bus = sap.ui.getCore().getEventBus();
			oRouter.getTargets().display(oData.pagekey, { viewModel: oData.viewModel });
			oRouter.navTo(oData.pagekey, true);
		},

		onListItemPress: function (oEvent) {
			var viewModel = oEvent.getSource().getBindingContext("QuotationMasterModel").getObject();
			
			var model = { "id": viewModel.leadid, "quotid": viewModel.id }
			this.bus = sap.ui.getCore().getEventBus();
			setTimeout(function () {
				this.bus = sap.ui.getCore().getEventBus();
				this.bus.publish("qutationdetail", "handleQutationDetails", { pagekey: "qutationdetail", viewModel: model });
			}, 1000);

			this.bus.publish("qutationdetail", "handleQutationDetails", { pagekey: "qutationdetail", viewModel: model });
		},

		onAddNew: function () {
			this.bus = sap.ui.getCore().getEventBus();
			setTimeout(function () {
				this.bus = sap.ui.getCore().getEventBus();
				this.bus.publish("qutationcreen", "handleQutationList", { pagekey: "addqutation", viewModel: null });
			}, 3000);
			this.bus.publish("qutationcreen", "handleQutationList", { pagekey: "addqutation", viewModel: null });
		},

		/**
		* Function to navigate to specified route.
		* @param {*} sChannel 
		* @param {*} sEvent 
		* @param {*} oData 
		*/
		handleQutationList: function (sChannel, sEvent, oData) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.bus = sap.ui.getCore().getEventBus();
			oRouter.getTargets().display(oData.pagekey, { viewModel: oData.viewModel });
			oRouter.navTo(oData.pagekey, true);
		},

		onSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");
			var contains = sap.ui.model.FilterOperator.Contains;
			var columns = ['leadname', 'contactname'];
			var filters = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, contains, sQuery);
			}),
				false);

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [filters];
			}

			this.getView().byId("tblQuotationMaster").getBinding("items").filter(oTableSearchState, "Application");
		},

		onSort: function (oEvent) {
			this._bDescendingSort = !this._bDescendingSort;
			var oView = this.getView(),
				oTable = oView.byId("tblQuotationMaster"),
				oBinding = oTable.getBinding("items"),
				oSorter = new Sorter("leadname", this._bDescendingSort);
			oBinding.sort(oSorter);
		},

		loadQuotationData: function () {
			var currentContext = this;
			quotationService.getAllQuotations(function (data) {
				var oModel = new JSONModel();
				if (data.length && data[0].length) {
					oModel.setData({ modelData: data[0] });
					currentContext.getView().setModel(oModel, "QuotationMasterModel");
				} else {
					oModel.setData({ modelData: [] });
					currentContext.getView().setModel(oModel, "QuotationMasterModel");
				}
			});
		},

		onExit: function () {
			this.bus.unsubscribe("quotationmaster", "setDetailPage", this.setDetailPage, this);
		}
	});
}, true);
