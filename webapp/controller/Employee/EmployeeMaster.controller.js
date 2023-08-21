sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter',
    'sap/ui/elev8rerp/componentcontainer/formatter/fragment.formatter',
    'sap/ui/elev8rerp/componentcontainer/services/Employee/Employee.service'

], function (BaseController, JSONModel, Filter, FilterOperator, Sorter, formatter, employeeService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Employee.EmployeeMaster", {

        formatter: formatter,
        onInit: function () {
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.subscribe("employeemaster", this.setDetailPage, this);
            this.oFlexibleColumnLayout = this.byId("fclEmployeeMaster");
            this.bus.subscribe("employeemaster", "loadEmpolyeeData", this.loadEmpolyeeData, this);
            this.loadEmpolyeeData();
            this.fnShortCut();
            jQuery.sap.delayedCall(1000, this, function () {
				this.getView().byId("searchId").focus();
			});

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

        onExit: function () {
            this.bus.unsubscribe("employeemaster", this.setDetailPage, this);
        },

        setDetailPage: function (channel, event, data) {
            this.detailView = sap.ui.view({
                viewName: "sap.ui.elev8rerp.componentcontainer.view.Employee." + data.viewName,
                type: "XML"
            });

            this.detailView.setModel(data.viewModel, "viewModel");
            this.oFlexibleColumnLayout.removeAllMidColumnPages();
            this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
        },

        onSearch: function (oEvent) {
            var oTableSearchState = [],
                sQuery = oEvent.getParameter("query");
            var contains = sap.ui.model.FilterOperator.Contains;
            var columns = ['employeename', 'mobile'];
            var filters = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, contains, sQuery);
            }),
                false);  // false for OR condition

            if (sQuery && sQuery.length > 0) {
                oTableSearchState = [filters];
            }

            this.getView().byId("userTable").getBinding("items").filter(oTableSearchState, "Application");
        },

        onAddNew: function (oEvent) {
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("employeemaster", { viewName: "EmployeeMasterDetail" });
        },

        onListItemPress: function (oEvent) {
            var viewModel = oEvent.getSource().getBindingContext("employeeModel");
            var model = { "id": viewModel.getProperty("id") };
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("employeemaster", { viewName: "EmployeeMasterDetail", viewModel: model });
        },

        loadEmpolyeeData: function () {
            var currentContext = this;

            employeeService.getAllEmployee(function (data) {
                if(data.length && data[0].length){
                    for(let i = 0; i < data[0].length; i++){
                        data[0][i].isactive = data[0][i].isactive == 1 ? true : false;
                    }
                }
                var oModel = new JSONModel();
                oModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oModel, "employeeModel");
            });
        },
        onSort: function (oEvent) {
            this._bDescendingSort = !this._bDescendingSort;
            var oView = this.getView(),
                oTable = oView.byId("userTable"),
                oBinding = oTable.getBinding("items"),
                oSorter = new Sorter("employeename", this._bDescendingSort);
            oBinding.sort(oSorter);
        },
    });
});