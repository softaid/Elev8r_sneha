sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/ui/elev8rerp/componentcontainer/formatter/fragment.formatter',
	'sap/ui/elev8rerp/componentcontainer/services/Masters/Item.service',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/m/MessageToast'
], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, formatter, itemService, commonService, MessageToast) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Masters.Item", {

		formatter: formatter,

		onInit: function () {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("loaddata", "loadData", this.loadData, this);
			this.loadData();
			this.oFlexibleColumnLayout = this.byId("fclItemMaster");
			this.fnShortCut();

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

		onAfterRendering: function () {
			jQuery.sap.delayedCall(1000, this, function () {
				this.getView().byId("search").focus();
			});

		},

		onListItemPress: function (oEvent) {
			//debugger;
			var viewModel = oEvent.getSource().getBindingContext("itemModel");
			var model = { "id": viewModel.getProperty("id") }
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("itemmaster", "setDetailPage", { viewName: "ItemDetail", viewModel: model });
		},

		onAddNew: function (oEvent) {
			//debugger;
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("itemmaster", "setDetailPage", { viewName: "ItemDetail" });
		},

		onSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");
			var contains = sap.ui.model.FilterOperator.Contains;
			var columns = ['itemname', 'description', 'groupname', 'itemcode'];
			var filters = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, contains, sQuery);
			}),
				false);  // false for OR condition

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [filters];
			}

			this.getView().byId("tblItem").getBinding("items").filter(oTableSearchState, "Application");
		},

		onSort: function (oEvent) {
			this._bDescendingSort = !this._bDescendingSort;
			var oView = this.getView(),
				oTable = oView.byId("tblItem"),
				oBinding = oTable.getBinding("items"),
				oSorter = new Sorter("itemname", this._bDescendingSort);
			oBinding.sort(oSorter);
		},

		loadData: function () {
			var currentContext = this;
			itemService.getAllItem(function (data) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: data[0] });
				currentContext.getView().setModel(oModel, "itemModel");
			});
		},

		onItemExport: function () {
			var ReportTitle = "Item List";
			// get model for item group list
			var JSONData = this.getView().getModel("itemModel").oData.modelData;
			var aData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
			if (aData.length) {
				var aFinalXlsxData,
					aXlsxHeaderData;

				// Array variable to store header data in XLSX file
				aXlsxHeaderData = [];
				aFinalXlsxData = [];

				// Below array for  header data
				aXlsxHeaderData.push("Id", "Item Group", "Item Code", "Item Name", "Item Description", "Item Active", "Unit Cost", "Material Type", "Tax Category", "Item Unit")

				// Adding column header data in final XLSX data
				aFinalXlsxData.push(aXlsxHeaderData);

				// Below loop to extract data
				for (var i = 0; i < aData.length; i++) {
					// Array variable to store content data in XLSX file
					var aXlsxContentData = [];
					aXlsxContentData.push(aData[i].id, aData[i].groupname, aData[i].itemcode, aData[i].itemname, aData[i].description, aData[i].active, aData[i].unitcost, aData[i].materialtypename, aData[i].taxcategoryname, aData[i].itemunitname);

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
		// import item master using excel sheet
		onItemImport: function () {
			var ReportTitle = "item";

			var aFinalXlsxData,
				aXlsxHeaderData;

			// Array variable to store header data in XLSX file
			aXlsxHeaderData = [];
			aFinalXlsxData = [];
			var des_aFinalXlsxData = [];
			// Below array for  header data
			aXlsxHeaderData.push("itemgroupid", "itemcode", "itemname", "description", "manufacturer", "itemunitid", "active", "unitcost", "isgst", "materialtypeid", "hsnid", "taxcategoryid", "issalable", "revenueledgerid", "ledgerid")
			// des_aXlsxHeaderData.push("Column Name","Description");
			des_aFinalXlsxData.push(["Column Name", "Description"], ["itemgroupid", "Identification Number of Item group ID"], ["itemcode", "code for item"], ["itemname", "Name of Item"], ["description", "Description For Item"], ["manufacturer", "Manufacturer For Item"], ["itemunitid", "Unit Of Item"],["", "141-No.,142-Kg,143-LTR,144-50PP,145-30pp,146-Doses"], ["active", "set 1 If Item is active other wise set 0"], ["unitcost", "Unit Cost Of Item"], ["isgst", "Set 1 If Gst is applicable other wise set 0 "], ["materialtypeid", "Set Type of material"], ["", "1501-Raw Material,1502-Finished Good,1503-Semi Finished Good"], ["hsnid", "Set HSN id from HSN Master"], ["taxcategoryid", "Set category for tax"], [" ", "1521-Regular,1522-Nil Rated,1523-Exempt"], ["issalable", "set 1 If Item is salable other wise set 0"], ["revenueledgerid", "set ledger id from COA"]);

			// Adding column header data in final XLSX data
			aFinalXlsxData.push(aXlsxHeaderData);


			var Workbook = function Workbook() {
				if (!(this instanceof Workbook)) return new Workbook();
				this.SheetNames = [];
				this.Sheets = {};
			}
			var wb = Workbook();
			wb.SheetNames.push("Item Description");
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
			for (var i = 0; wb.SheetNames.length > i; i++) {
				var ReportTitle1 = wb.SheetNames[i];
				if (wb.SheetNames[i] == 'Item Description') {
					var detaildata = des_aFinalXlsxData;

				} else {
					var detaildata = aFinalXlsxData;
				}
				var ws = sheet_from_array_of_arrays(detaildata);

				// Setting up Excel column width
				ws['!cols'] = [
					{ wch: 14 },
					{ wch: 12 }
				];
				wb.Sheets[ReportTitle1] = ws;        // wb.Sheets[ReportTitle] -> To set sheet name

				var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
				var s2ab = function s2ab(s) {
					var buf = new ArrayBuffer(s.length);
					var view = new Uint8Array(buf);
					for (var i = 0; i != s.length; ++i) {
						view[i] = s.charCodeAt(i) & 0xFF;
					}
					return buf;
				};
			}
			saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), ReportTitle + ".xlsx");

			// } 



		},

		//upload xml
		handleExcelUpload: function (e) {
			var currentContext = this;
			var fileInput = this.getView().byId("fileUploader").getValue();
			var allowedExtensions = /(\.xlsx)$/i;

			if (allowedExtensions.exec(fileInput)) {
				// Excluded ExcelSheets from Showing and importing data
				var excludedSheets = ["foryourreference", "fyr", "for your reference"];


				// Remove previous error messages
				var pnlError = currentContext.getView().byId("pnlErrMessage");
				pnlError.setVisible(false);
				pnlError.removeAllItems();
				// Add Tabs using tabname
				var oHBox = currentContext.getView().byId("pnlDataTabs");
				oHBox.setVisible(true);
				oHBox.destroyItems();

				var file = e.getParameter("files") && e.getParameter("files")[0];
				// if (file.type == "xlsx") {
				// Upload button visible
				currentContext.getView().byId("btnUploadData").setVisible(true);
				if (file && window.FileReader) {
					var reader = new FileReader();
					//that = this;
					var result = {};
					//var data;
					reader.onload = function (evt) {
						var data = evt.target.result;
						//var xlsx = XLSX.read(data, {type: 'binary'});
						var arr = String.fromCharCode.apply(null, new Uint8Array(data));
						var xlsx = XLSX.read(btoa(arr), { type: 'base64', cellDates: true, dateNF: 'yyyy/mm/dd;@' });
						result = xlsx.Strings;
						result = {};
						var arrSheets = [];
						var sheetname = "";
						xlsx.SheetNames.forEach(function (sheetName) {
							sheetname = sheetName
							if (sheetName == "item") {
								var rObjArr = XLSX.utils.sheet_to_row_object_array(xlsx.Sheets[sheetName]);
								if (excludedSheets.indexOf(sheetName.toLowerCase()) < 0) {
									result[sheetName] = rObjArr;
									arrSheets.push(rObjArr);

								}
							}
						});

						if (sheetname == "item") {
							// check validation for upload sheet
							for (var i = 0; result.item.length > i; i++) {
								var item = result.item[i];
								if (typeof (item.itemgroupid) == "number" && typeof (item.itemunitid) == "number" && typeof (item.unitcost) == "number" && typeof (item.ledgerid) == "number" && typeof ((item.materialtypeid)) == "number" && typeof (item.hsnid) == "number" && typeof (item.taxcategoryid) == "number" && typeof (item.revenueledgerid == "number") && (((item.materialtypeid) == 1501) || ((item.materialtypeid) == 1502) || ((item.materialtypeid) == 1503)) && (((item.taxcategoryid) == 1521) || ((item.taxcategoryid) == 1522) || ((item.taxcategoryid) == 1523))) {
							
								} else {
									if (typeof ((item.itemgroupid)) != "number") {
										result.item[i].itemgroupid = "Invalid Item Group Id"
									} else if (typeof ((item.itemunitid)) != "number") {
										result.item[i].itemunitid = "Invalid Item Unit Id"
									} else if (typeof ((item.unitcost)) != "number") {
										result.item[i].unitcost = "Invalid Unit Cost"
									} else if (typeof ((item.ledgerid)) != "number") {
										result.item[i].ledgerid = "Invalid Ledger Id"
									} else if (typeof ((item.materialtypeid)) != "number") {
										result.item[i].materialtypeid = "Invalid Material type id"
									} else if (typeof ((item.hsnid)) != "number") {
										result.item[i].hsnid = "Invalid HSN id"
									} else if (typeof ((item.taxcategoryid)) != "number") {
										result.item[i].taxcategoryid = "Invalid Tax category id"
									} else if (typeof ((item.materialtypeid)) != "number") {
										result.item[i].materialtypeid = "Invalid Material Type id"
									}

									else if (((item.taxcategoryid) != 1521) && ((item.taxcategoryid) != 1522) && ((item.taxcategoryid) != 1523)) {
										result.item[i].taxcategoryid = "Please insert valid tax category"
									}

									else if (((item.materialtypeid) != 1501) && ((item.materialtypeid) != 1502) && ((item.materialtypeid) != 1503)) {

										result.item[i].materialtypeid = "Please insert valid Material Type"
									}
									MessageToast.show("Please insert valid sheet.");
									currentContext.getView().byId("btnUploadData").setVisible(false);
								}
							}
						}
						if (result != null) {
							var oModel = new JSONModel();
							oModel.setData({ modelData: result });
							oModel.setSizeLimit(result.length);
							currentContext.getView().setModel(oModel, "xlsxDocModel");
							var tabName = [];
							for (var key in result) {
								tabName.push(key);
							}
							if (tabName.length > 0) {
								currentContext.previewMeterSlab();
							}

						}
						return result;
						//that.b64toBlob(xlsx, "binary");
					};
					reader.readAsArrayBuffer(file);
				};
			} else {
				MessageToast.show("In-correct file format!");
				currentContext.getView().byId("btnUploadData").setVisible(false);
				currentContext.getView().byId("fileUploader").setValue("");

			}
		},

		// fill the data in uploded sheet
		fillSheetData: function (name, currentContext) {
			var oData = currentContext.getView().getModel("xlsxDocModel").oData.modelData;
			// Upload button visible
			if (oData[name].length > 0)
				// currentContext.getView().byId("btnUploadData").setVisible(true);

				var dt1 = oData[name][0];
			var aColumnData = [];

			// Create table columns
			for (var key in dt1) {
				aColumnData.push({ columnName: key });
			}

			// Create Table data model
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				columns: aColumnData,
				rows: oData[name]
			});
			var oTable = new sap.ui.table.Table({
				visibleRowCount: 5,
				selectionMode: "None"
			});

			oTable.setModel(oModel);

			oTable.bindColumns("/columns", function (sId, oContext) {
				var columnName = oContext.getObject().columnName;
				return new sap.ui.table.Column({
					label: columnName,
					template: columnName,
				});
			});

			oTable.bindRows("/rows");

			// Add Table in HBox container
			var oHBox = currentContext.getView().byId("pnlMasterData");
			oHBox.destroyItems();
			oHBox.addItem(new sap.m.HBox());
			oHBox.addItem(oTable);
		},
		// preview for sheet
		previewMeterSlab: function () {
			// this.getView().byId("fileUploader").setValue("");
			var currentContext = this;
			var oHBox = currentContext.getView().byId("pnlMasterData");
			oHBox.destroyItems();

			// Remove previous error messages
			var pnlError = currentContext.getView().byId("pnlErrMessage");
			pnlError.setVisible(false);
			pnlError.removeAllItems();


			// Add Tabs using tabname
			var oHBox = currentContext.getView().byId("pnlDataTabs");
			oHBox.setVisible(false);
			oHBox.destroyItems();
			var result = this.getView().getModel("xlsxDocModel").oData.modelData;
			var tabName = [];
			for (var key in result) {
				tabName.push(key);
			}
			for (var i = 1; i <= tabName.length; i++) {
				var oTemplate = new sap.m.TabContainerItem({
					name: tabName[i - 1],
					content: []
				});
				oHBox.addItem(oTemplate);
			}
			oHBox.setVisible(true);
			oHBox.attachItemSelect(null, function (evt) {
				var tabtitle = evt.getParameter("item").getName();
				currentContext.fillSheetData(tabtitle, currentContext);
			}, null);

		},
		// for upload master data
		onUploadMasterData: function () {
			var currentContext = this;
			var oData = this.getView().getModel("xlsxDocModel").oData.modelData;
			// Remove previous errors messages and hide
			var pnlError = this.getView().byId("pnlErrMessage");
			pnlError.setVisible(false);
			pnlError.removeAllItems();
			pnlError.addItem(new sap.m.Label({ text: "ERROR :" }));
			for (var key in oData) {
				// No error in another tab data
				this.tabName = key.toLowerCase();
				var tabData = oData[key];


				var dt1 = tabData[0];
				var columns = [];

				// Column excluded by bracket headers by regular expression
				var regExp = /\[.*?\]/;      //--- same result -  /\[([^)]+)\]/;

				for (var t in dt1) {
					(regExp.test(t)) ? "" : columns.push(t);
				}

				var colNames = columns.join();
				var strQuery = "";

				this.tabName = this.tabName;
				//=========================================


			}

			var tblname = this.tabName;
			var arr = oData[this.tabName];
			var model = {
				jsondata: JSON.stringify(oData[this.tabName]),
				table: this.tabName,
				company_id: commonService.session("companyId"),
				user_id: commonService.session("userId")
			}
			var array = [];

			var currentContext = this;
			commonService.importMaster(model, function (data) {
				setTimeout(function () {

					var oModel = new JSONModel();
					oModel.setData({ modelData: [] });
					currentContext.getView().setModel(oModel, "xlsxDocModel");
					currentContext.getView().byId("fileUploader").setValue("");
					var oHBox = currentContext.getView().byId("pnlMasterData");
					oHBox.destroyItems();
					var oHBox = currentContext.getView().byId("pnlDataTabs");
				   oHBox.setVisible(false);
				     oHBox.destroyItems();
					MessageToast.show(tblname + " - master data successfully imported!", {
						animationTimingFunction: 'ease-in-out'
					});
					currentContext.loadData();

				}, 400);
			})

			// this.getView().byId("pnlMasterData2").setVisible(true);


		},




	});
}, true);
