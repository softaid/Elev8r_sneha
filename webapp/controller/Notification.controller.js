sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service'

], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, MessageToast, MessageBox, commonService) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Notification", {

		onInit: function () {

			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("notification", "setDetailPage", this.setDetailPage, this);
			this.bus.subscribe("loaddata", "loadData", this.loadData, this);
			this.oFlexibleColumnLayout = this.byId("fclNotification");

			this.handleRouteMatched(null);

			var currRouteName = this.getOwnerComponent().getModel("applicationModel").getProperty("/routeName");
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.getRoute(currRouteName).attachMatched(this.handleRouteMatched, this);
		},

		handleRouteMatched: function (evt) {
			// load data to grid
			this.loadData();
		},

		onExit: function () {
			this.bus.unsubscribe("notification", "setDetailPage", this.setDetailPage, this);
		},

		setDetailPage: function (channel, event, data) {
			this.detailView = sap.ui.view({
				viewName: "sap.ui.elev8rerp.componentcontainer.view." + data.viewName,
				type: "XML"
			});

			this.detailView.setModel(data.viewModel, "viewModel");
			this.oFlexibleColumnLayout.removeAllMidColumnPages();
			this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
		},

		checkAllChange: function (oEvent) {
			var context = this.getView().byId('tblNotification').getSelectedContexts();
			var selectedIds = [];
			var items = context.map(function (c) {
				var oLineItems = c.getObject();
				if(oLineItems["isread"] == "0")
					selectedIds.push(oLineItems["id"]);
			});
			
			if (selectedIds.length > 0) {
				var model = { "userid": commonService.session("userId"), "notificationids": selectedIds.join() }
				this.readNotifications(model, this);
			}
			else{
				MessageBox.warning("Please select unread notification(s) to mark as read!");
			}
		},

		onListItemPress: function (oEvent) {
			var currentContext = this;
			var viewModel = oEvent.getSource().getBindingContext("notificationHistoryModel");
			currentContext.model = { "userid": commonService.session("userId"), "notificationids": viewModel.getProperty("id") }
			
			var actionButtons = [];
			var confirmMessage = "";
			if(viewModel.getProperty("isread") == "0") {
				actionButtons = ["Go to Transaction", "Read Notification", "Cancel"] 
				confirmMessage = "Do you want to go to Transaction page or just to read Notification?"
			}
			else{
				actionButtons =["Go to Transaction", "Cancel"];
				confirmMessage = "Do you want to go to Transaction page?"
			}

			MessageBox.show( confirmMessage, {
					styleClass: "sapUiSizeCompact",
					title: "Confirmation",
					actions: actionButtons,
					onClose: function (sAction) {

						if (sAction == "Go to Transaction") {
							if(viewModel.getProperty("isread") == "0")
								currentContext.readNotifications(currentContext.model, currentContext);

							currentContext.bus = sap.ui.getCore().getEventBus();
							currentContext.bus.publish("masterpage", "redirectToTransaction", { id : viewModel.getProperty("transactionid"), pagekey : viewModel.getProperty("pagekey") });
						}
						else if (sAction == "Read Notification") {
							if(viewModel.getProperty("isread") == "0")
								currentContext.readNotifications(currentContext.model, currentContext);
						}
						else if (sAction == "Cancel") {}
					}
				}
			);
		},

		readNotifications: function (model, currentContext) {
			commonService.readNotifications(model, function (data) {
				if (data) {
					currentContext.bus = sap.ui.getCore().getEventBus();
					currentContext.bus.publish("loaddata", "loadData");
					currentContext.bus.publish("masterpage", "notificationHistoryPopupList", { data: { limit : 3 } });
				}
			});
		},


		onAddNew: function (oEvent) {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("notification", "setDetailPage", { viewName: "NotificationDetail" });
		},

		onSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");
			var contains = sap.ui.model.FilterOperator.Contains;
			var columns = ['notificationname', 'locationname', 'warehousename', 'machinetype'];
			var filters = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, contains, sQuery);
			}),
				false);

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [filters];
			}

			this.getView().byId("tblNotification").getBinding("items").filter(oTableSearchState, "Application");
		},

		onSort: function (oEvent) {
			this._bDescendingSort = !this._bDescendingSort;
			var oView = this.getView(),
				oTable = oView.byId("tblNotification"),
				oBinding = oTable.getBinding("items"),
				oSorter = new Sorter("notificationname", this._bDescendingSort);
			oBinding.sort(oSorter);
		},

		loadData: function () {
			var currentContext = this;
			commonService.getNotificationHistoryList(function (data) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: data[0] });
				currentContext.getView().setModel(oModel, "notificationHistoryModel");
			});
		}

	});

}, true);
