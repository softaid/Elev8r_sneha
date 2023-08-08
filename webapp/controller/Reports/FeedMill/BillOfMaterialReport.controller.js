sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/MockServer',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/FeedMillReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',

], function (JSONModel, BaseController, MessageToast, MessageBox, Export, MockServer, ExportTypeCSV, commonFunction, feedMillReportsService, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.FeedMill.BillOfMaterialReport", {


        onInit: function () {
            var currentContext = this;
            this.imagepath = null;
            this.toDataURL('../images/logical.png', function (dataUrl) {
                currentContext.imagepath = dataUrl;
            });

            this.currentContext = this;
            var moduleitemid = '1502,1503';
            var modulename = 'itemList';
            commonFunction.getItemByMaterailType(moduleitemid, this, modulename);
            var emptyModel = this.getModelDefault();
            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "billOfMaterialReportModel");
            this.getView().byId("txtdownload").setVisible(false);
        },

        getModelDefault: function () {
            return {
                // breederbatchid: null,
            }
        },

        resetModel: function () {
            var tbleModel = this.getView().getModel("billOfMaterialReportModel");
            tbleModel.setData({ modelData: [] });

        },

        handleSelectionFinish: function (oEvt) {

            // this.resetModel();

            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedKeys = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedKeys.push({ itemid: selectedItems[i].getProperty("key"), "itemname": selectedItems[i].getProperty("text") });
            }


            this.selectedItemname = [];
            for (var i = 0; selectedKeys.length > i; i++) {
                this.selectedItemname.push(selectedKeys[i].itemname);

            }

            var oModel = this.getView().getModel("billOfMaterialReportModel");
            oModel.oData.itemid = selectedKeys[0].itemid;
            oModel.oData.itemname = selectedKeys[0].itemname;
        },

        handleSelectionChange: function (oEvent) {
            var changedItem = oEvent.getParameter("changedItem");
            var isSelected = oEvent.getParameter("selected");
            var state = "Selected";

            if (!isSelected) {
                state = "Deselected"
            }

            //Check if "Selected All is selected
            if (changedItem.mProperties.key == "All") {
                var oName, res;

                //If it is Selected
                if (state == "Selected") {

                    var oItems = oEvent.oSource.mAggregations.items;
                    for (var i = 0; i < oItems.length; i++) {
                        if (i == 0) {
                            oName = oItems[i].mProperties.key;
                        } else {
                            oName = oName + ',' + oItems[i].mProperties.key;
                        } //If i == 0									
                    } //End of For Loop

                    res = oName.split(",");
                    oEvent.oSource.setSelectedKeys(res);

                } else {
                    res = null;
                    oEvent.oSource.setSelectedKeys(res);
                }
            }
        },

        // This function used for Bindind table data and it contains fun which contain service

        getbillofmaterialReport: function () {

            var currentContext = this;
            var tbleModel = this.getView().getModel("billOfMaterialReportModel");

            var itemid = tbleModel.oData.itemid;
            var todayDate = new Date();
            var curDate = commonFunction.getDateFromDB(todayDate);
            var curTime = todayDate.getHours() + ":" + todayDate.getMinutes() + ":" + todayDate.getSeconds();

            feedMillReportsService.getBillOfMaterialReport({ itemid: itemid }, function async(data) {
                var oBatchModel = new sap.ui.model.json.JSONModel();
                oBatchModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oBatchModel, "tblModel");
            })
            this.getView().byId("txtdownload").setVisible(true);
        },

        toDataURL: function (url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                var reader = new FileReader();
                reader.onloadend = function () {
                    callback(reader.result);
                }
                reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.send();
            //}
        },


        onPdfExport: function (oEvent) {


            var that = this;
            //  map the bound data of the table to a pdfMake array

            var createListData = function () {

                var sumone = { count: 0, totalDistance: 0 };
                var Items = that.selectedItemname;

                var mapArrone = Items.map(function (objone) {


                    sumone.count += 1;
                    sumone.totalDistance += Number.parseInt(Items);

                    var retone = [{
                        columns: [
                            {
                                ul: [
                                    objone,
                                ]
                            }
                        ]
                    },
                    ];
                    return retone;
                });

                mapArrone.push([
                ]);
                return mapArrone;
            };

            var createTableData = function () {


                var sum = { count: 0, totalDistance: 0 };

                var mapArr = that.getView().byId("tblModel").getItems().map(function (obj) {
                    sum.count += 1;
                    sum.totalDistance += Number.parseInt(obj.getCells()[4].getProperty("text"));
                    var ret = [{
                        text: obj.getCells()[0].getProperty("text"),
                        style: 'table',
                        fontSize: 8,
                        fonts: 'sans-serif'
                    },
                    {
                        text: obj.getCells()[1].getProperty("text"),
                        style: 'table',
                        fontSize: 8,
                        fonts: 'sans-serif'
                    },
                    {
                        text: obj.getCells()[2].getProperty("text"),
                        style: 'table',
                        fontSize: 8,
                        fonts: 'sans-serif'
                    },
                    {
                        text: obj.getCells()[3].getProperty("text"),
                        style: 'table',
                        fontSize: 8,
                        fonts: 'sans-serif'
                    },
                    {
                        text: obj.getCells()[4].getProperty("text"),
                        style: 'table',
                        fontSize: 8,
                        fonts: 'sans-serif'
                    }

                    ];
                    return ret;
                });

                // add a header to the pdf table
                mapArr.unshift(

                    [{
                        text: "ItemCode",
                        style: 'tableHeader'
                    },
                    {
                        text: "ItemName",
                        style: 'tableHeader'
                    },
                    {
                        text: "Quantity",
                        style: 'tableHeader'
                    },
                    {
                        text: "UnitCost",
                        style: 'tableHeader'
                    },
                    {
                        text: "ItemUnit",
                        style: 'tableHeader'
                    }

                    ]
                );
                // add a summary row at the end

                mapArr.push([

                    { text: 'sum' },
                    { text: "" },
                    { text: "" },
                    { text: "" },
                    { text: "" }

                ]);
                return mapArr;
            };

            var docDefinition = {

                info: {
                    author: 'TAMMEN IT SOLUTIONS',
                    subject: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('pdfReportSubject')
                },

                pageOrientation: 'portrait',
                pageMargins: [50, 60, -70, 60],
                style: 'border',

                footer: function (currentPage, pageCount) {
                    return { text: currentPage.toString() + ' / ' + pageCount, alignment: 'center' };
                },


                content: [

                    {
                        image: this.imagepath,
                        width: 150,
                        margin: [380, -30, 0, 0]
                    },


                    {
                        text: "LogicalDNA",
                        style: 'hone',
                        margin: [0, -60, 0, 6],
                    },
                    {
                        text: "LogicalDNA Group Of Companies",
                        style: 'htwo',

                    },
                    {
                        text: "Ground Floor, Unit 003, Pentagon 1",
                        style: 'htwo'
                    },
                    {
                        text: "Magarpatta Cyber City",
                        style: 'htwo'
                    },
                    {
                        text: "Hadpsar Pune 411028",
                        style: 'htwo'
                    },
                    {
                        text: "Maharashtra, India",
                        style: 'htwo'
                    },
                    {
                        text: "Mobile No: +91 985 097 7384 (INDIA)",
                        style: 'htwo'
                    },
                    {
                        text: "Email: hr@logicaldnacom",
                        style: 'htwo',
                        margin: [0, 0, 0, 14]
                    },
                    {

                        title: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Logical DNA'),
                        text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Bill Of Material'),

                        style: 'title',
                        margin: [0, 100, 150, 10]
                    },
                    {
                        text: "Item Name:",
                        style: 'filter',
                        bold: true
                    },
                    {

                        ul: [

                            createListData(),

                        ],
                        style: 'filter',
                        margin: [60, -10, 0, 14]

                    },

                    {
                        table: {
                            headerRows: 1,
                            widths: [120, 100, 90, 90, 90],
                            margin: [380, -30, 0, 0],
                            body: createTableData(),
                        },

                        // # Apply layout with color wise gray and white               

                        layout: {
                            fillColor: function (rowIndex, node, columnIndex) {
                                return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                            },

                        }
                    },

                    {
                        text: "Logical DNA",
                        style: 'bottom',
                        margin: [450, 30, 0, 14]

                    },
                    {
                        text: "Authorised By",
                        style: 'bottom',
                        margin: [450, 0, 0, 14]
                    },
                ],

                styles: {
                    header: {
                        fontSize: 12,
                        bold: true,
                        margin: [0, 0, 0, 0]
                    },

                    leftline: {
                        bold: true,
                        margin: [0, 0, 0, 0]
                    },

                    title: {
                        fontSize: 15,
                        fonts: 'sans-serif',
                        padding: 15,
                        bold: true,
                        alignment: 'center',
                        margin: [0, 0, 0, 0]
                    },

                    hone: {
                        fontSize: 12,
                        bold: true,
                        lineheight: 4,
                        fonts: 'sans-serif'
                    },

                    bottom: {
                        fontSize: 12,
                        bold: true,
                        fonts: 'sans-serif'
                    },

                    htwo: {
                        fontSize: 8,

                    },

                    filter: {
                        fontSize: 10,
                    },

                    tableHeader: {
                        bold: true,
                        bordercollapse: 'collapse',
                        padding: 15,
                        fonts: 'sans-serif',
                        fontsize: 25,
                        lineheight: 1,
                        width: '*',
                        columnGap: 10,
                        topmargin: 10
                    },

                    border: {
                        border: [1, 'solid', '#ccc']
                    },

                    sum: {
                        fontSize: 8,
                        italics: true
                    }
                }
            };
            pdfMake.createPdf(docDefinition).open();
        },


        // # Generate Exel File in xl 
        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var itemname = this.selectedItemname;
            var filename =itemname;

            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/


            var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ","
                }),

                // Pass in the model created above
                models: this.currentContext.getView().getModel("tblModel"),

                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content


                columns: [
                    {
                        name: "Product Name",
                        template: { content: "{productname}" }
                    },
                    {
                        name: "BOM Code",
                        template: { content: "{bomcode}" }
                    },
                    {
                        name: "BOM Date",
                        template: { content: "{bomdate}" }
                    },
                    {
                        name: "Created By",
                        template: { content: "{createdby}" }
                    },
                    {
                        name: "Item Code",
                        template: { content: "{itemcode}" }
                    },
                    {
                        name: "Item Name",
                        template: { content: "{itemname}" }
                    },
                    {
                        name: "Quantity",
                        template: { content: "{quantity}" }
                    },
                    {
                        name: "Unit Cost",
                        template: { content: "{unitcost}" }
                    },
                    {
                        name: "Unit",
                        template: { content: "{itemunitname}" }
                    }

                ]
            });

            // download exported file
            oExport.saveFile(filename)
                .catch(function (oError) {
                    MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
                })
                .then(function () {
                    oExport.destroy();
                });
        }
    });
}, true);
