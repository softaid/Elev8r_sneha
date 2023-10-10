
sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/ui/elev8rerp/componentcontainer/services/Masters/Masters.service',
    'sap/ui/elev8rerp/componentcontainer/utility/xlsx',
    'sap/m/MessageToast',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',
    'sap/m/MessageBox',
], function (JSONModel, BaseController, masterService, xlsx, MessageToast, commonService, MessageBox) {

    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Masters.ProjectMaster", {

        onInit: function () {
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.subscribe("master", "setDetailPage", this.setDetailPage, this);
            this.oFlexibleColumnLayout = this.byId("fclLeadMaster");

            this.bus = sap.ui.getCore().getEventBus();
            this.bus.subscribe("loaddata", "loadData", this.loadData, this);

            var emptyModel = this.getModelDefault();

            var projectMasterModel = new JSONModel();
            projectMasterModel.setData(emptyModel);
            this.getView().setModel(projectMasterModel, "projectMasterModel");

            var visibleModel = new JSONModel();
            visibleModel.setData(emptyModel);
            this.getView().setModel(visibleModel, "visibleModel");

            var currentContext = this;

            var oVisModel = new JSONModel({
                row: "true",
                row2: "true"
            });
            this.setModel(oVisModel, "visModel");

            currentContext.getReferenceTypeByMaster();
        },

        getReferenceTypeByMaster: function () {
            var currentContext = this;

            masterService.getReferenceTypeByMaster({ master: 'ProjectMaster' }, function (data) {
                console.log(data);
                if (data.length && data[0].length) {
                    var oModel = new sap.ui.model.json.JSONModel();
                    oModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oModel, "masterModel");
                }

                var pModel = currentContext.getView().getModel("projectMasterModel");
                pModel.oData.masterid = data[0][0].id;
                pModel.oData.master = data[0][0].master;
                pModel.oData.typename = data[0][0].typename;
                pModel.oData.typecode = data[0][0].typecode;

                pModel.refresh();

                currentContext.loadData("", "", pModel.oData);

            });
        },


        onListItemPress: function (oEvent) {

            var viewModel = oEvent.getSource().getBindingContext("masterDetailModel");
            var model = {
                "id": viewModel.getProperty("id"),
                "typecode": viewModel.getProperty("typecode"),
                "description": viewModel.getProperty("description"),
                "active": viewModel.getProperty("active"),
                "iscustomersignoffrequired": viewModel.getProperty("iscustomersignoffrequired"),
                "addtocurrentproject": viewModel.getProperty("addtocurrentproject"),
                "notifyinternaluser": viewModel.getProperty("notifyinternaluser"),
                "defaultvalue": viewModel.getProperty("defaultvalue"),
                "projectper": viewModel.getProperty("projectper"),
                "stageper": viewModel.getProperty("stageper"),
                "departmentid": viewModel.getProperty("departmentid"),
                "parentid": viewModel.getProperty("parentid"),
                "sequenceno": viewModel.getProperty("sequenceno"),
                "type" : viewModel.getProperty("type"),
                "dependency" : viewModel.getProperty("dependency"),
                "attributetypes" : viewModel.getProperty("attributetypes"),
                "row1": "true",
            }
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("master", "setDetailPage", { viewName: "ProjectMasterDetail", viewModel: model });
        },

        getModelDefault: function () {
            var date = new Date();
            return {
                typecode: "ProjStgType",
                visible: false
            }
        },

        onExit: function () {
            this.bus.unsubscribe("master", "setDetailPage", this.setDetailPage, this);
        },

        setDetailPage: function (channel, event, data) {
            this.detailView = sap.ui.view({
                viewName: "sap.ui.elev8rerp.componentcontainer.view.Masters.ProjectMasterDetail",
                type: "XML"
            });

            this.detailView.setModel(data.viewModel, "viewModel");
            this.oFlexibleColumnLayout.removeAllMidColumnPages();
            this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
        },

        pressTitle: function () {
            this.setDetailPage();
        },

        //lazy loading of view on tab select        
        onTabSelect: function (oControlEvent) {

            var key = oControlEvent.getParameters().key;
            var text = oControlEvent.getParameters().selectedItem.mProperties.text;
            var item = oControlEvent.getParameter("item");
            var isViewRendered = item.getContent().length > 0;
            var pModel = this.getView().getModel("projectMasterModel");

            let oVisibleModel = this.getView().getModel("visibleModel");
            let oVisibleModelData = oVisibleModel.getData();

            oVisibleModelData.visible = (key === "ProMilestones");
            console.log(pModel.oData.typecode);
            var oTable = this.byId("table");
           

            if(pModel.oData.typecode )
            if (pModel.oData.typecode != "ProMilestones") {
                var masterDetailModel = this.getView().getModel("masterDetailModel").oData.modelData;
                for (let i = 0; i < masterDetailModel.length; i++) {
                    masterDetailModel[i].row1 = true;
                }

            }

            pModel.oData.typecode = key;
            pModel.oData.typename = text;
            oVisibleModel.refresh();
            console.log(oVisibleModelData);
            pModel.refresh();

            this.loadData("", "", pModel.oData);

            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
        },

        rowFunction: function (item, index) {
            console.log(item);
        },

        loadData1: function (sChannel, sEvent, oData) {
            this.getAllLeadMasters();
        },

        loadData: function (sChannel, sEvent, oData) {
            var currentContext = this;

            masterService.getReferenceByTypeCode({ typecode: oData.typecode }, function (data) {
                var oModel = new sap.ui.model.json.JSONModel();
                // if (data.length && data[0].length) {
                //     for (let i = 0; i < data[0].length; i++) {
                //         data[0][i].active = data[0][i].active == 1 ? true : false;
                //         data[0][i].defaultvalue = data[0][i].defaultvalue == 1 ? true : false;
                //     }
                //     oModel.setData({ modelData: data[0] });
                //     currentContext.getView().setModel(oModel, "masterDetailModel");
                //     console.log("masterDetailModel", oModel);
                // } else {
                //     oModel.setData({ modelData: [] });
                //     currentContext.getView().setModel(oModel, "masterDetailModel");
                //     console.log("masterDetailModel1", oModel);
                // }

                var map = {}, node, roots = [], i;
                for (i = 0; i < data[0].length; i += 1) {
                    map[data[0][i].id] = i; // initialize the map
                    data[0][i].children = []; // initialize the children
                }
                for (i = 0; i < data[0].length; i += 1) {
                    node = data[0][i];
                    if (node.parentid !== null) {
                        // if you have dangling branches check that map[node.parentId] exists
                        data[0][map[node.parentid]].children.push(node);
                    } else {
                        roots.push(node);
                    }
                }

                oModel.setData({ modelData: roots });
                currentContext.getView().setModel(oModel, "masterDetailModel");

            });
        },

        onAddIconPress: function (oEvent) {

            var oModel = this.getView().getModel("projectMasterModel");

            console.log("projectMasterModel : ", oModel);
            var model = {
                id: null,
                typecode: oModel.oData.typecode,
                typename: oModel.oData.typename,
                description: oModel.oData.description,
                active: true,
                iscustomersignoffrequired:false,
                addtocurrentproject:false,
                notifyinternaluser:false,
                defaultvalue: true,
                type : "Stage"
            };
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("master", "setDetailPage", { viewName: "ProjectMasterDetail", viewModel: model });
        },


        loadAllCOAData: function () {

            var currentContext = this;
            commonService.getLedgerList(function (data) {
                currentContext.onDataExport(data[0]);
            });
        },
        onDataExport: function (data) {

            var ReportTitle = "Chart OF Account";
            // get model for ledger list
            var JSONData = data;
            var aData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
            if (aData.length) {
                var aFinalXlsxData,
                    aXlsxHeaderData;

                // Array variable to store header data in XLSX file
                aXlsxHeaderData = [];
                aFinalXlsxData = [];

                // Below array for  header data
                aXlsxHeaderData.push("id", "Category Id", "Coname", "Gl Code", "Coa Type Id", "Is Parent", "Group Id", "Is Active")

                // Adding column header data in final XLSX data
                aFinalXlsxData.push(aXlsxHeaderData);

                // Below loop to extract data
                for (var i = 0; i < aData.length; i++) {
                    // Array variable to store content data in XLSX file
                    var aXlsxContentData = [];
                    aXlsxContentData.push(aData[i].id, aData[i].categoryid, aData[i].coaname, aData[i].glcode, aData[i].coatypeid, aData[i].isparent, aData[i].groupid, aData[i].isactive);

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

        onDownloadTemplate: function () {

            var ReportTitle = "chartofaccount";
            var oModelSideNav = new JSONModel("model/chart_of_acount.json");
            console.log(oModelSideNav)
            oModelSideNav.attachRequestCompleted(function (oEvent) {
                var JSONData = oModelSideNav.getData("/")["sa_chartofaccount"];

                var aData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
                console.log("0000aData", aData)
                if (aData.length) {
                    var aFinalXlsxData,
                        aXlsxHeaderData;

                    // Array variable to store header data in XLSX file
                    aXlsxHeaderData = [];
                    aFinalXlsxData = [];
                    var des_aFinalXlsxData = [];
                    // Below array for header data
                    aXlsxHeaderData.push("id", "categoryid", "coaname", "glcode", "coatypeid", "isparent", "groupid", "iscontrolacc", "isblockmanualposting", "iscashacc", "isproject", "projectid", "is_deleted", "isactive", "iscostcenterapplicable",)

                    des_aFinalXlsxData.push(["Column Name", "Description"], ["ID", "Unique Identification Number"], ["Category Id", "Description"], ["", "1-Asset"], ["", "2-Liability"], ["", "3-Equity"], ["", "4-Revenue"], ["", "5-Expenditure"], ["COA Name", "Ledger Name"], ["GL Code", "E.g. glcode always starts with category id"], ["Category Type ID", "Description"], ["", "11-Group"], ["", "12-SubGroup"], ["", "13-Ledger"], ["isparent", "If its parent then 1 else 0"], ["groupid", "Parent ID of Sub Group"],
                        ["isactive", "If its active then 1 else 0"]);
                    // Adding column header data in final XLSX data
                    aFinalXlsxData.push(aXlsxHeaderData);

                    // Below loop to extract data
                    for (var i = 0; i < aData.length; i++) {
                        // Array variable to store content data in XLSX file
                        var aXlsxContentData = [];
                        aXlsxContentData.push(aData[i].id, aData[i].categoryid, aData[i].coaname, aData[i].glcode, aData[i].coatypeid, aData[i].isparent, aData[i].groupid, aData[i].iscontrolacc, aData[i].isblockmanualposting, aData[i].iscashacc, aData[i].isproject, aData[i].projectid, aData[i].is_deleted, aData[i].isactive, aData[i].iscostcenterapplicable);

                        // Adding content data in final XLSX data
                        aFinalXlsxData.push(aXlsxContentData);
                    }

                    var Workbook = function Workbook() {
                        if (!(this instanceof Workbook)) return new Workbook();
                        this.SheetNames = [];
                        this.Sheets = {};
                    }
                    var wb = Workbook();
                    wb.SheetNames.push("Chart of Account Description");
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
                        console.log(wb.SheetNames[i])
                        var ReportTitle1 = wb.SheetNames[i];
                        if (wb.SheetNames[i] == 'Chart of Account Description') {
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
                        wb.Sheets[ReportTitle1] = ws; // wb.Sheets[ReportTitle] -> To set sheet name

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
                    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "COA Template" + ".xlsx");


                }
            })
        },
        handleExcelUpload: function (e) {
            var currentContext = this;
            var fileInput = currentContext.getView().byId("fileUploader").getValue();
            var allowedExtensions = /(\.xlsx)$/i;
            if (allowedExtensions.exec(fileInput) != null) {
                // Excluded ExcelSheets from Showing and importing data
                var excludedSheets = ["foryourreference", "fyr", "for your reference"];

                // Upload button visible
                currentContext.getView().byId("btnUploadData").setVisible(true);

                // Content removed
                var oHBox = currentContext.getView().byId("pnlMasterData");
                oHBox.destroyItems();

                // Remove previous error messages
                var pnlError = currentContext.getView().byId("pnlErrMessage");
                pnlError.setVisible(false);
                pnlError.removeAllItems();
                // Add Tabs using tabname
                var oHBox = currentContext.getView().byId("pnlDataTabs");
                oHBox.setVisible(true);
                oHBox.destroyItems();
                var file = e.getParameter("files") && e.getParameter("files")[0];
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
                        xlsx.SheetNames.forEach(function (sheetName) {
                            if (sheetName == "chartofaccount" || sheetName == "ledgeropeningbalance") {
                                var rObjArr = XLSX.utils.sheet_to_row_object_array(xlsx.Sheets[sheetName]);
                                if (excludedSheets.indexOf(sheetName.toLowerCase()) < 0) {
                                    result[sheetName] = rObjArr;
                                    arrSheets.push(rObjArr);
                                }
                            }
                        });
                        if (!result.chartofaccount) {
                            // check validation for upload sheet
                            for (var i = 0; result.ledgeropeningbalance.length > i; i++) {
                                var parray = result.ledgeropeningbalance[i];

                                if (typeof (parray.ledgerid) == "number" && typeof (parray.openingbalance) == "number" && typeof (parray.transactiontypeid) == "number" && typeof new Date(parray.openingbalancedate) == "object" && (((parray.transactiontypeid) == 1321) || ((parray.transactiontypeid) == 1322)) && typeof (parray.branchid) == "number") {
                                } else {
                                    if (typeof ((parray.ledgerid)) != "number") {
                                        result.ledgeropeningbalance[i].ledgerid = "Invalid Ledger Id"
                                    } else if (typeof ((parray.openingbalance)) != "number") {
                                        result.ledgeropeningbalance[i].openingbalance = "Invalid Opening Balance"
                                    } else if (typeof ((parray.transactiontypeid)) != "number") {
                                        result.ledgeropeningbalance[i].transactiontypeid = "Invalid Transaction Type ID like 1321 or 1322"
                                    } else if (typeof (new Date(parray.openingbalancedate)) != "object") {
                                        result.ledgeropeningbalance[i].openingbalancedate = "Invalid Date"
                                    }
                                    else if ((((parray.transactiontypeid) != 1321) && ((parray.transactiontypeid) != 1322))) {
                                        result.ledgeropeningbalance[i].transactiontypeid = "Please insert valid transaction type id for CR-1321 and DR-1322"
                                    }
                                    else if (typeof (parray.branchid) != "number") {
                                        result.ledgeropeningbalance[i].transactiontypeid = "Please insert valid branchid"
                                    }

                                    MessageToast.show("Please insert valid sheet.");
                                    currentContext.getView().byId("btnUploadData").setVisible(false);
                                }
                            }
                        }

                        if (result != null) {
                            var oModel = new JSONModel();
                            oModel.setData({ modelData: result });
                            currentContext.getView().setModel(oModel, "xlsxDocModel");
                            currentContext.previewMeterSlab();
                            var tabName = [];
                            for (var key in result) {
                                tabName.push(key);
                            }

                        }
                        return result;
                        //that.b64toBlob(xlsx, "binary");
                    };
                    reader.readAsArrayBuffer(file);
                }

            } else {
                MessageToast.show("In-correct file format!");
                currentContext.getView().byId("btnUploadData").setVisible(false);
                currentContext.getView().byId("fileUploader").setValue("");
            }
        },
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
        previewMeterSlab: function () {
            this.getView().byId("fileUploader").setValue("");
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
        onUploadMasterData: function () {
            var currentContext = this;
            MessageBox.confirm(
                "If there are previous opening balance entries, those will be deleted, Please confirm!", {
                actions: ['Ok', MessageBox.Action.CANCEL],
                styleClass: "sapUiSizeCompact",
                onClose: function (sAction) {
                    if (sAction == "Ok") {
                        var oData = currentContext.getView().getModel("xlsxDocModel").oData.modelData;
                        // Remove previous errors messages and hide
                        var pnlError = currentContext.getView().byId("pnlErrMessage");
                        pnlError.setVisible(false);
                        pnlError.removeAllItems();
                        pnlError.addItem(new sap.m.Label({ text: "ERROR :" }));
                        for (var key in oData) {
                            // No error in another tab data
                            currentContext.tabName = key.toLowerCase();
                            var tabData = oData[key];


                            var dt1 = tabData[0];
                            var columns = [];

                            // Column excluded by bracket headers by regular expression
                            var regExp = /\[.*?\]/; //--- same result - /\[([^)]+)\]/;

                            for (var t in dt1) {
                                (regExp.test(t)) ? "" : columns.push(t);
                            }

                            var colNames = columns.join();
                            var strQuery = "";

                            currentContext.tabName = currentContext.tabName;
                            //=========================================


                        }

                        var tblname = currentContext.tabName;
                        // var arr = oData[currentContext.tabName];
                        var model = {
                            jsondata: JSON.stringify(oData[currentContext.tabName]),
                            table: currentContext.tabName,
                            company_id: commonService.session("companyId"),
                            user_id: commonService.session("userId")
                        }
                        // save data
                        commonService.importMaster(model, function (data) {
                            console.log(data)
                            var pModel = currentContext.getView().getModel("projectMasterModel");
                            setTimeout(function () {

                                var oModel = new JSONModel();
                                oModel.setData({ modelData: [] });
                                currentContext.getView().setModel(oModel, "xlsxDocModel");
                                currentContext.getView().byId("fileUploader").setValue("");
                                var oHBox = currentContext.getView().byId("pnlMasterData");
                                oHBox.destroyItems();
                                MessageToast.show(tblname + " - master data successfully imported!", {
                                    animationTimingFunction: 'ease-in-out'
                                });

                                currentContext.loadData("", "", pModel.oData);

                            }, 400);

                        })


                    }
                }
            }
            );

        },

        onLedgerTemplate: function () {

            var currentContext = this;
            commonService.getLedgerList(function (data) {
                currentContext.fnJSONToXLSXConvertor("ledgeropeningbalance", data[0])
            });
        },


        // for dowload xlsx file
        fnJSONToXLSXConvertor: function (ReportTitle, JSONData) {
            // get model for ledger list
            // var JSONData = this.getView().getModel("ledgerList").oData.modelData;
            var aData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
            if (aData.length) {
                var aFinalXlsxData,
                    aXlsxHeaderData;

                // Array variable to store header data in XLSX file
                aXlsxHeaderData = [];
                aFinalXlsxData = [];
                var des_aFinalXlsxData = [];
                // Below array for  header data
                aXlsxHeaderData.push("ledgerid", "ledgername", "openingbalancedate", "branchid", "openingbalance", "transactiontypeid")

                des_aFinalXlsxData.push(["Column Name", "Description"], ["openingbalancedate", "Date"], ["branchid", "Identification Number of Branch from Branch Master"], ["openingbalance", "Amount"], ["transactiontypeid", "1321 - Credit, 1322 - Debit"]);
                // Adding column header data in final XLSX data
                aFinalXlsxData.push(aXlsxHeaderData);

                // Below loop to extract data
                for (var i = 0; i < aData.length; i++) {
                    // Array variable to store content data in XLSX file
                    var aXlsxContentData = [];
                    aXlsxContentData.push(aData[i].id, aData[i].coaname);

                    // Adding content data in final XLSX data
                    aFinalXlsxData.push(aXlsxContentData);
                }

                var Workbook = function Workbook() {
                    if (!(this instanceof Workbook)) return new Workbook();
                    this.SheetNames = [];
                    this.Sheets = {};
                }
                var wb = Workbook();
                wb.SheetNames.push("Ledger Opening Description");
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
                    console.log(wb.SheetNames[i])
                    var ReportTitle1 = wb.SheetNames[i];
                    if (wb.SheetNames[i] == 'Ledger Opening Description') {
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
            }
        },

    });
});