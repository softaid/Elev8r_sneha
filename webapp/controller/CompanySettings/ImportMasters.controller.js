
sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/elev8rerp/componentcontainer/utility/xlsx',
    'sap/ui/elev8rerp/componentcontainer/utility/SessionManager',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',
    'jquery.sap.storage',

], function (BaseController, JSONModel, Filter, FilterOperator, Sorter, MessageToast, MessageBox, xlsx, SessionManager, commonFunction, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.CompanySettings.ImportMasters", {

        metadata: {
            manifest: "json"
        },

        onInit: function () {

            this.bus = sap.ui.getCore().getEventBus();
            this.bus.subscribe("licensemanagementmaster", "setDetailPage", this.setDetailPage, this);

            this.oFlexibleColumnLayout = this.byId("fclImportMasters");

            var oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.elev8rerp.componentcontainer.model", "/importmasters.json"));
            this.getView().setModel(oModel, "importMastersModel");


            this.handleRouteMatched(null);

            var currRouteName = this.getOwnerComponent().getModel("applicationModel").getProperty("/routeName");
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this._oRouter.getRoute(currRouteName).attachMatched(this.handleRouteMatched, this);
        },

        handleRouteMatched: function () {

            var oTabContainer = this.getView().byId("pnlDataTabs");
            oTabContainer.addEventDelegate({
              onAfterRendering: function() {
                var oTabStrip = this.getAggregation("_tabStrip");
                var oItems = oTabStrip.getItems();
                for (var i = 0; i < oItems.length; i++) {
                  var oCloseButton = oItems[i].getAggregation("_closeButton");
                  oCloseButton.setVisible(false);
                }
              }
            }, oTabContainer);

        },

        onAfterRendering: function () {
            jQuery("#componentcontainer---importmasters--fUploadExcel").parent().hide();
        },

        onImportFile: function () {
            jQuery("input[name='fUploadExcel']").trigger('click');
        },

        handleUploadComplete: function () {

        },

        onDownloadTemplate: function () {

            var selectedCode = this.getView().byId("selImportMasters").getSelectedKey();
            var selectedText = this.getView().byId("selImportMasters").getSelectedItem().getText();
            
            MessageBox.confirm("Do you want to download template for selected - (" + selectedText + ") to add data?", {
                styleClass: "sapUiSizeCompact",
                onClose: function (sAction) {
                    if (sAction == "OK") {
                        var iframe = document.createElement('iframe');
                        var filepath = "";
                        switch (selectedCode) {
                            case "Item Master": filepath = "Item.xlsx"; break;
                            case "Ledger Opening Balance": filepath = "Ledger Opening Balance.xlsx"; break;
                            case "Party Opening Balance": filepath = "Party Opening Balance.xlsx"; break;
                            case "Item Opening Balance": filepath = "Item Opening Balance.xlsx"; break;
                            case "DOCSERIES": filepath = "DOCSERIES.xlsx"; break;
                            case "State": filepath = "State.xlsx"; break;
                            case "City": filepath = "City.xlsx"; break;
                            case "Country": filepath = "Country.xlsx"; break;
                            case "Chart of Account": filepath = "Chart of Account.xlsx"; break;
                        }
                        console.log("selectedCode : ",selectedCode);
                        console.log("filepath : ",filepath);

                        if (filepath != "") {
                            iframe.setAttribute("download", "download");
                            iframe.setAttribute("src", "./importmasters/" + filepath);
                            document.body.appendChild(iframe);
                            MessageToast.show("Fill up appropriate data in downloaded template file.");
                        }
                        else {
                            MessageToast.show("File not found");
                        }

                    }
                }
            });
        },

        changeTabColor: function () {
            jQuery("#componentcontainer---importmasters--pnlDataTabs > div").each(function () {
                console.log(jQuery(this).removeClass('importmasters-active-tab'));
            });
        },

        handleExcelUpload: function (e) {

            var currentContext = this;

            // Excluded ExcelSheets from Showing and importing data
            var excludedSheets = ["foryourreference", "fyr", "for your reference"];

            // Upload button visible
            currentContext.getView().byId("btnUploadData").setVisible(false);

            // Content removed
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

            var file = e.getParameter("files") && e.getParameter("files")[0];
            if (file && window.FileReader) {
                var reader = new FileReader();
                //that = this;
                var result = {};
                //var data;
                reader.onload = function (evt) {
                    console.log("DATAAAAAAAAAA : ",evt.target.result);
                    var data = evt.target.result;
                    //var xlsx = XLSX.read(data, {type: 'binary'});
                    var arr = String.fromCharCode.apply(null, new Uint8Array(data));
                    var xlsx = XLSX.read(btoa(arr), { type: 'base64', cellDates: true, dateNF: 'yyyy/mm/dd;@'});
                    result = xlsx.Strings;
                    result = {};
                    var arrSheets = [];
                    xlsx.SheetNames.forEach(function (sheetName) {
                        var rObjArr = XLSX.utils.sheet_to_row_object_array(xlsx.Sheets[sheetName]);
                        //if (rObjArr.length > 0) {
                        if (excludedSheets.indexOf(sheetName.toLowerCase()) < 0) {
                            result[sheetName] = rObjArr;
                            arrSheets.push(rObjArr);
                        }
                        //}
                    });

                    if (result != null) {
                        console.log("result : ",result);
                        var oModel = new JSONModel();
                        oModel.setData({ modelData: result });
                        currentContext.getView().setModel(oModel, "xlsxDocModel");

                        var tabName = [];
                        for (var key in result) {
                            tabName.push(key);
                        }

                      

                        for (var i = 1; i <= tabName.length; i++) {

                            // var lnk = new sap.m.Link({
                            //     id: "lnk" + tabName[i - 1],
                            //     text: tabName[i - 1],
                            //     subtle: true,
                            //     tooltip: tabName[i - 1],
                            //     press: function (oEvent) {
                            //         currentContext.changeTabColor();
                            //         jQuery("#" + oEvent.getSource().getId()).parent().addClass('importmasters-active-tab');
                            //         currentContext.fillSheetData(oEvent.getSource().getText(), currentContext);
                            //     }
                            // });
                            // oHBox.addItem(lnk);

                            // // First time Tab content loading
                            // setTimeout(function () {
                            //     jQuery("#lnk"+tabName[0]).parent().addClass('importmasters-active-tab');
                            //     currentContext.fillSheetData(tabName[0], currentContext);
                            // }, 100);

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
                    }
                    return result;
                    //that.b64toBlob(xlsx, "binary");
                };
                reader.readAsArrayBuffer(file);
            };
        },

        onItemSelect: function (evt) {
            (evt.getSource());
        },

        fillSheetData: function (name, currentContext) {

            console.log('model data : ', currentContext.getView().getModel("xlsxDocModel"));
            var oData = currentContext.getView().getModel("xlsxDocModel").oData.modelData;
            console.log(oData);
            // Upload button visible
            if (oData[name].length > 0)
                currentContext.getView().byId("btnUploadData").setVisible(true);

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

            // == Using sap.m.Table ==============================

            // Create Table and configuration
            // var oTable = new sap.m.Table({});
            // oTable.setHeaderText(name);
            // oTable.setGrowing(true);
            // oTable.setGrowingThreshold(100);
            // oTable.setGrowingScrollToLoad(true);
            // oTable.setModel(oModel);

            // // Bind columns with table
            // oTable.bindAggregation("columns", "/columns", function (index, context) {
            //     return new sap.m.Column({
            //         header: new sap.m.Label({ text: context.getObject().columnId }),
            //     });
            // });

            // // Bind data rows with table
            // oTable.bindItems("/rows", function (index, context) {
            //     var obj = context.getObject();
            //     var row = new sap.m.ColumnListItem();

            //     for (var k in obj) {
            //         row.addCell(new sap.m.Text({ text: obj[k] }));
            //     }

            //     return row;
            // });


            // == Using sap.ui.table.Table =======================
            
            var oTable = new sap.ui.table.Table({
                visibleRowCount: 10,
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

        onUploadMasterData: function () {

            var oData = this.getView().getModel("xlsxDocModel").oData.modelData;
           

            var companyid = commonService.session("companyId");

            // Remove previous errors messages and hide
            var pnlError = this.getView().byId("pnlErrMessage");
            pnlError.setVisible(false);
            pnlError.removeAllItems();
            pnlError.addItem(new sap.m.Label({ text: "ERROR :" }));
            console.log("oData",oData)
            for (var key in oData) {
                // No error in another tab data
                this.tabName = key.toLowerCase();
                var tabData = oData[key];
                console.log("tabData",tabData);
               

                var dt1 = tabData[0];
                var columns = [];
                
                // Column excluded by bracket headers by regular expression
                var regExp = /\[.*?\]/;      //--- same result -  /\[([^)]+)\]/;
                
                for (var t in dt1) {
                    (regExp.test(t)) ? "" : columns.push(t);
                }

                var colNames = columns.join();
                var strQuery = "";

                // Remove this for original tables ===============
                // tabName = tabName + "_temp";
                this.tabName = this.tabName;
                //================================================
                console.log("tabData : ",tabData);
                
                if (tabData.length > 0) {

                    // strQuery += "TRUNCATE TABLE " + tabName + "; INSERT INTO " + tabName + "(" + colNames + ",companyid) values "
                    strQuery += "TRUNCATE TABLE " + this.tabName + "; INSERT INTO " + this.tabName +" values"

                    for (var dt in tabData) {
                        //debugger;
                        var currRow = tabData[dt];

                        var colVals = [];
                        for (var cl in columns) {
                            colVals.push("'" + currRow[columns[cl]] + "'");
                        }
                        
                        // CompanyId data is set dynamcally through code
                        // colVals.push("'" + companyid + "'");

                        var rowData = colVals.join();
                        strQuery += "(" + rowData + "),";
                    }

                    strQuery = strQuery.substr(0, strQuery.length - 1) + "; select 1;";

                    console.log('Query : ', strQuery);
                    console.log("tabname",key);

                    // commonService.masterDataExport({ query: strQuery, tabname: key }, function (data) {
                    //     console.log(data);
                    //     if (data.length > 0 && data[1])
                    //         setTimeout(function () {
                    //             MessageToast.show(tabName + " - master data successfully imported!", {
                    //                 animationTimingFunction: 'ease-in-out'
                    //             });
                    //         }, 400);

                    // }, function (err) {
                        
                    //     var error = err.responseJSON.error.replace('Error: ', '');
                    //     error = err.responseJSON.tabname + " : " + error;
                    //     pnlError.addItem(new sap.m.Label({ text: error }));
                    //     pnlError.setVisible(true);

                    //     // MessageBox.show(error + ". Please correct the data, and try again!", {
                    //     //     styleClass: "sapUiSizeCompact",
                    //     //     title: "Error in " + err.responseJSON.tabname + " - Export Data"
                    //     // });
                    // });

                    // commonService.importMaster({jsondata : tabData, table : this.tabName}, function(data){
                    //     setTimeout(function () {
                    //         MessageToast.show(tabName + " - master data successfully imported!", {
                    //             animationTimingFunction: 'ease-in-out'
                    //         });
                    //     }, 400);
                    // })
                }
            }

            console.log("oData : ",oData);
            var tblname = this.tabName;
            var arr = oData[this.tabName];
            commonService.importMaster({jsondata : JSON.stringify(oData[this.tabName]), table : this.tabName}, function(data){
                setTimeout(function () {
                    MessageToast.show(tblname + " - master data successfully imported!", {
                        animationTimingFunction: 'ease-in-out'
                    });
                }, 400);
            })

            
        },


        // b64toBlob: function (b64Data, contentType) {
        //     contentType = contentType || '';
        //     var sliceSize = 512;
        //     b64Data = b64Data.replace(/^[^,]+,/, '');
        //     b64Data = b64Data.replace(/\s/g, '');
        //     var byteCharacters = Base64.decode(b64Data);
        //     var byteArrays = [];

        //     for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        //         var slice = byteCharacters.slice(offset, offset + sliceSize);

        //         var byteNumbers = new Array(slice.length);
        //         for (var i = 0; i < slice.length; i++) {
        //             byteNumbers[i] = slice.charCodeAt(i);
        //         }

        //         var byteArray = new Uint8Array(byteNumbers);
        //         byteArrays.push(byteArray);
        //     }
        //     var blob = new Blob(byteArrays, {
        //         type: contentType
        //     });
        // },

        setDetailPage: function (channel, event, data) {
            this.detailView = sap.ui.view({
                viewName: "sap.ui.elev8rerp.componentcontainer.view.CompanySettings." + data.viewName,
                type: "XML"
            });

            this.detailView.setModel(data.viewModel, "viewModel");
            this.oFlexibleColumnLayout.removeAllMidColumnPages();
            this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
        },

        getActiveLicenseList: function () {
            var currentContext = this;
            manageSubscriptionService.activeLicenses(function (data) {
                var oModel = new JSONModel();
                console.log("Active Licenses data loaded : ", data[0])
                oModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oModel, "activeLicenseModel");
            });
        },

        onMasterPressed: function (oEvent) {
			var oContext = oEvent.getParameter("listItem").getBindingContext("side");
			var sPath = oContext.getPath() + "/selected";
			oContext.getModel().setProperty(sPath, true);
			var sSelectedMasterElement = oContext.getProperty("title");
			var sKey = oContext.getProperty("key");
			// switch (sSelectedMasterElement) {
			// 	case "System Settings": {
			// 		this.getRouter().navTo(sKey);
			// 		break;
			// 	}
			// 	default: {
			// 		MessageToast.show(sSelectedMasterElement + " was pressed");
			// 		break;
			// 	}
			// }

			this.getRouter().getTargets().display(sKey, {});
			this.getRouter().navTo(sKey);
		},

    });
});