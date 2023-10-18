
sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/Application/Permission.service',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, commonFunction, managePermissionService, commonService) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Application.Permission", {

		onInit: function () {
			var selectedItemId = null;

			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("managePermission", "getPermissionList", this.getPermissionList, this);

			this.getPermissionList();
		},
		getModelDefault: function () {
			return {
				itemcode: null,
				itemname: null,
			}
		},

		onSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");
			var contains = sap.ui.model.FilterOperator.Contains;
			var columns = ['displayname', 'Permissionname'];
			var filters = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, contains, sQuery);
			}),
				false);

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [filters];
			}

			this.getView().byId("managePermissionTable").getBinding("items").filter(oTableSearchState, "Application");
		},

		onSort: function (oEvent) {
			this._bDescendingSort = !this._bDescendingSort;
			var oView = this.getView(),
				oTable = oView.byId("tblHacher"),
				oBinding = oTable.getBinding("items"),
				oSorter = new Sorter("hatchername", this._bDescendingSort);
			oBinding.sort(oSorter);
		},

		getPermissionList: function (itemid) {
			var currentContext = this;

			managePermissionService.getAllPermission(function (data) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: data[0] });
				currentContext.getView().setModel(oModel, "managePermissionModel");
			});
		}
	});
}, true);
