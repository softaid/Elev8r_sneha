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

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.LeadManagement.ProjectList", {

		onInit: function () {

			this.bus = sap.ui.getCore().getEventBus();

			this.afilters = [];

			this.bus.subscribe("qutationcreen", "handleQutationList", this.handleQutationList, this);
			this.bus.subscribe("projectdetail", "handleProjectDetails", this.handleProjectDetails, this);
			this.bus.subscribe("loaddata", "loadData", this.loadData, this);
			

            var model = new JSONModel();
			model.setData([]);
			this.getView().setModel(model, "projectListModel");
			//this.oFlexibleColumnLayout = this.byId("fclQuotation");

			this.handleRouteMatched(null);

			jQuery.sap.delayedCall(1000, this, function () {
				// this.getView().byId("onSearchId").focus();
			});

			// bind Quote Type dropdown  
			//commonFunction.getReferenceByTypeForFilter("QuoteType", "quoteTypeModel", this);

			// bind Lead dropdown quote category
			//commonFunction.getReferenceByTypeForFilter("QuoteCategory", "quoteCategoryModel", this);
		},

		getModelDefault: function () {
			return {

			}
		},

		handleRouteMatched: function (evt) {
			this.loadProjectlistData();
		},

		handleProjectDetails: function (sChannel, sEvent, oData) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.bus = sap.ui.getCore().getEventBus();
			oRouter.getTargets().display(oData.pagekey, { viewModel: oData.viewModel });
			oRouter.navTo(oData.pagekey, true);
		},

		onListItemPress: function (oEvent) {
			debugger;
			var viewModel = oEvent.getSource().getBindingContext("projectListModel").getObject();
			
			var model = { "id": viewModel.id}
			this.bus = sap.ui.getCore().getEventBus();
			setTimeout(function () {
				this.bus = sap.ui.getCore().getEventBus();
				this.bus.publish("projectdetail", "handleProjectDetails", { pagekey: "projectdetail", viewModel: model });
			}, 1000);

            this.bus.publish("projectdetail", "handleProjectDetails", { pagekey: "projectdetail", viewModel: model });
		},

		// onAddNew: function () {
		// 	this.bus = sap.ui.getCore().getEventBus();
		// 	setTimeout(function () {
		// 		this.bus = sap.ui.getCore().getEventBus();
		// 		this.bus.publish("qutationcreen", "handleQutationList", { pagekey: "addqutation", viewModel: null });
		// 	}, 3000);
		// 	this.bus.publish("qutationcreen", "handleQutationList", { pagekey: "addqutation", viewModel: null });
		// },

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

		loadProjectlistData: function () {
			var currentContext = this;
			Projectservice.getAllProjects(function (data) {
				var oModel = currentContext.getView().getModel("projectListModel");
				oModel.setData(data[0]);
				oModel.refresh();
			});
        },

		onExit: function () {
			this.bus.unsubscribe("quotationmaster", "setDetailPage", this.setDetailPage, this);
		}
	});
}, true);
