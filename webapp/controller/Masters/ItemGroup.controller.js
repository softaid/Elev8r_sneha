sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/ui/elev8rerp/componentcontainer/services/Masters/ItemGroup.service',
	'sap/ui/elev8rerp/componentcontainer/utility/xlsx'
], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, itemgroupService,xlsx) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Masters.ItemGroup", {

		onInit: function () {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("loaddata", "loadData", this.loadData, this);
			this.loadData();
			this.oFlexibleColumnLayout = this.byId("fclItemMaster");
			this.fnShortCut();

		},

		onAfterRendering: function () {
			jQuery.sap.delayedCall(1000, this, function () {
				this.getView().byId("search").focus();
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

		onListItemPress: function (oEvent) {
			var viewModel = oEvent.getSource().getBindingContext("itemGroupModel");
			var model = { "id": viewModel.getProperty("id") }
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("itemmaster", "setDetailPage", { viewName: "ItemGroupDetail", viewModel: model });
		},

		onAddNew: function () {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("itemmaster", "setDetailPage", { viewName: "ItemGroupDetail" });
		},

		onSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");
			var contains = sap.ui.model.FilterOperator.Contains;
			var columns = ['groupname', 'description'];
			var filters = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, contains, sQuery);
			}),
				false);  // false for OR condition

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [filters];
			}

			this.getView().byId("tblItemGroup").getBinding("items").filter(oTableSearchState, "Application");
		},

		onSort: function (oEvent) {
			this._bDescendingSort = !this._bDescendingSort;
			var oView = this.getView(),
				oTable = oView.byId("tblItemGroup"),
				oBinding = oTable.getBinding("items"),
				oSorter = new Sorter("groupname", this._bDescendingSort);
			oBinding.sort(oSorter);
		},

		loadData: function () {
			var currentContext = this;
			itemgroupService.getAllItemGroup(function (data) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: data[0] });
				currentContext.getView().setModel(oModel, "itemGroupModel");
			});
		},
		// export a item group
		onItemGroupExport : function(){
			var ReportTitle = "Item Group List";
			// get model for item group list
			var JSONData = this.getView().getModel("itemGroupModel").oData.modelData;
			var aData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
			if (aData.length) {
				var aFinalXlsxData,
					aXlsxHeaderData;

				// Array variable to store header data in XLSX file
				aXlsxHeaderData = [];
				aFinalXlsxData = [];

				// Below array for  header data
				aXlsxHeaderData.push("Item Id", "Item Group")

				// Adding column header data in final XLSX data
				aFinalXlsxData.push(aXlsxHeaderData);

				// Below loop to extract data
				for (var i = 0; i < aData.length; i++) {
					// Array variable to store content data in XLSX file
					var aXlsxContentData = [];
					aXlsxContentData.push(aData[i].id, aData[i].groupname);

					// Adding content data in final XLSX data
					aFinalXlsxData.push(aXlsxContentData);
				}

				var Workbook = function Workbook() {
					if (!(this instanceof Workbook)) return new Workbook();
					this.SheetNames = [];
					this.Sheets = {};
				}
				var wb = Workbook();
				wb.SheetNames.push(ReportTitle);

				var sheet_from_array_of_arrays = function sheet_from_array_of_arrays(data, opts) {
					var ws = {};
					var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
					for (var R = 0; R != data.length; ++R) {
						for (var C = 0; C != data[R].length; ++C) {
							if (range.s.r > R) range.s.r = R;
							if (range.s.c > C) range.s.c = C;
							if (range.e.r < R) range.e.r = R;
							if (range.e.c < C) range.e.c = C;
							var cell = { v: data[R][C] };
							if (cell.v == null) continue;
							var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

							if (typeof cell.v === 'number') cell.t = 'n';
							else if (typeof cell.v === 'boolean') cell.t = 'b';
							else if (cell.v instanceof Date) {
								cell.t = 'n'; cell.z = XLSX.SSF._table[14];
								cell.v = datenum(cell.v);
							}
							else cell.t = 's';

							ws[cell_ref] = cell;
						}
					}
					if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
					return ws;
				}

				var ws = sheet_from_array_of_arrays(aFinalXlsxData);

				// Setting up Excel column width
				ws['!cols'] = [
					{ wch: 14 },
					{ wch: 12 }
				];
				wb.Sheets[ReportTitle] = ws;        // wb.Sheets[ReportTitle] -> To set sheet name

				var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
				var s2ab = function s2ab(s) {
					var buf = new ArrayBuffer(s.length);
					var view = new Uint8Array(buf);
					for (var i = 0; i != s.length; ++i) {
						view[i] = s.charCodeAt(i) & 0xFF;
					}
					return buf;
				};
				saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), ReportTitle + ".xlsx");
			}
		},

	});
}, true);
