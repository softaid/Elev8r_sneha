sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/ui/model/Sorter',
	'sap/ui/elev8rerp/componentcontainer/services/ProjectManagement/Project.service',
	'sap/ui/elev8rerp/componentcontainer/utility/xlsx',
	'sap/m/MessageToast'
], function (JSONModel, BaseController, Sorter,projectService, xlsx,MessageToast) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.ProjectManagement.Project", {

		onInit: function () {

			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("activitymaster", "setDetailPage", this.setDetailPage, this);
			this.bus.subscribe("loaddata", "loadData", this.loadData, this);
			this.oFlexibleColumnLayout = this.byId("fclProjecttracking");

			this.handleRouteMatched(null);

			var model = new JSONModel();
			var emptyModel = this.getModelDefault();
			model.setData(emptyModel);
			this.getView().setModel(model, "partyModel");

			var model = new JSONModel();
			model.setData(emptyModel);
			this.fnShortCut();
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
			this.loadData();
		},

		setDetailPage: function (channel, event, data) {
			this.detailView = sap.ui.view({
				viewName: "sap.ui.elev8rerp.componentcontainer.view.ProjectManagement." + data.viewName,
				type: "XML"
			});

			this.detailView.setModel(data.viewModel, "viewModel");
			this.oFlexibleColumnLayout.removeAllMidColumnPages();
			this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
		},

		onListItemPress: function (oEvent) {
			var viewModel = oEvent.getSource().getBindingContext("projectModel");
			var model = { "id": viewModel.getProperty("id") }
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("activitymaster", "setDetailPage", { viewName: "ProjectDetail", viewModel: model });
		},

		onAddNew: function (oEvent) {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("activitymaster", "setDetailPage", { viewName: "ProjectDetail" });
		},

		onSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");
			var contains = sap.ui.model.FilterOperator.Contains;
			var columns = ['projectname', 'milestone', 'status','startdate'];
			var filters = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, contains, sQuery);
			}),
				false);

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [filters];
			}

			this.getView().byId("tblProjectMaster").getBinding("items").filter(oTableSearchState, "Application");
		},

		onSort: function (oEvent) {
			this._bDescendingSort = !this._bDescendingSort;
			var oView = this.getView(),
				oTable = oView.byId("tblProjectMaster"),
				oBinding = oTable.getBinding("items"),
				oSorter = new Sorter("partyname", this._bDescendingSort);
			oBinding.sort(oSorter);
		},

		loadData: function () {
			var currentContext = this;
			projectService.getAllProjects(function (data) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: data[0] });
				currentContext.getView().setModel(oModel, "projectModel");
                console.log("projectModel",oModel);
			});
		},

		onExit: function () {
			this.bus.unsubscribe("settermaster", "setDetailPage", this.setDetailPage, this);
		}
	});

}, true);
