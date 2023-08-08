sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/CBFReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/FeedMillReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',

], function (JSONModel, BaseController, MessageBox, Export, ExportTypeCSV, commonFunction, cBFReportsService, feedMillReportsService, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.FeedMill.DailyGodownStockReport", {

        currentContext: null,

        onInit: function () {
            this.currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");
            // Function for PDF IMAGE  
            var currentContext = this;
            this.imagepath = null;
            this.toDataURL('../images/logical.png', function (dataUrl) {
                currentContext.imagepath = dataUrl;
            });

            this.getAllCommonBranch(this);
            var model = new JSONModel();
            model.setData([]);
            this.getView().setModel(model, "reportModel");

            var emptyModel = this.getModelDefault();
            model.setData(emptyModel)
            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "tblModel");
            this.getView().byId("txtdownload").setVisible(false);
        },

        getModelDefault: function () {
            return {
                branchid: null,

            }
        },

        resetModel: function () {
            var tbleModel = this.getView().getModel("tblModel");
            tbleModel.setData({ modelData: [] });

            var pModel = this.getView().getModel("reportModel");
            pModel.setData([]);

        },

        
        // Function for pdf finish

        onSearchDailyGodownstockReport: function () {
            if (this.validateForm()) {


                var currentContext = this;
                var branchstring = this.getView().byId("branchList").getSelectedKeys();
                var warehousestring = this.getView().byId("warehouseList").getSelectedKeys();



                var batchesStr = "";
                var warehouseStr = "";


                for (var i = 0; i < branchstring.length; i++) {
                    if (i == 0)
                        batchesStr = parseInt(branchstring[i]);
                    else
                        batchesStr = batchesStr + "," + parseInt(branchstring[i]);
                }

                for (var i = 0; i < warehousestring.length; i++) {
                    if (i == 0)
                        warehouseStr = parseInt(warehousestring[i]);
                    else
                        warehouseStr = warehouseStr + "," + parseInt(warehousestring[i]);
                }


                var oModel = this.getView().getModel("reportModel");
                var fromdate = this.getView().byId("fromdate").getValue();
                var todate = this.getView().byId("todate").getValue();


                feedMillReportsService.getDataForDailyGodownStockReport({ fromdate: fromdate, todate: todate, warehouseid: warehouseStr }, function async(data) {

                    var oBatchModel = currentContext.getView().getModel("tblModel");

                    oBatchModel.setData({ modelData: data[0] });


                })
            }
            this.getView().byId("txtdownload").setVisible(true);

        },

        getAllCommonBranch: function (currentContext) {
            commonService.getAllCommonBranch(function (data) {

                var oBranchModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "branchname": "Select All" });
                    } else {
                        MessageBox.error("Branch is not availabel.")
                    }
                }

                oBranchModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oBranchModel, "branchModel");
            });
        },

        branchSelectionFinish: function (oEvt) {
            var currentContext = this;
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedKeys = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedKeys.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });

            }
            var branch = [];
            // var batchs = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                branch.push(selectedKeys[i].key);
            }

            this.branchname = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                this.branchname.push(selectedKeys[i].text);
            }

            feedMillReportsService.getWarehouseByBranchnameReport({ branchid: branch }, function (data) {

                var oBatchModel = new sap.ui.model.json.JSONModel();

                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "warehousename": "Select All" });
                    } else {
                        MessageBox.error("Warehouse is not availabel.")
                    }
                }

                var batchesStr = "";
                for (var i = 0; i < branch.length; i++) {
                    if (i == 0)
                        batchesStr = parseInt(branch[i]);
                    else
                        batchesStr = batchesStr + "," + parseInt(branch[i]);
                }


                currentContext.getView().setModel(oBatchModel, "WarehouseModel");

                oBatchModel.setData({ modelData: data[0] });


            });

            // this.getLinewisebatches(batchesStr);
            this.getView().byId("branchList").setValueState(sap.ui.core.ValueState.None);

            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });

        },

        batchSelectionChange: function (oEvent) {
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

        warehouseSelectionFinish: function (oEvt) {


            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedwarehouse = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedwarehouse.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }

            this.warehousename = [];
            for (var i = 0; i < selectedwarehouse.length; i++) {
                this.warehousename.push(selectedwarehouse[i].text);
            }

            this.getView().byId("warehouseList").setValueState(sap.ui.core.ValueState.None);

            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },
        // Validation Fun

        validateForm: function () {
            var isValid = true;

            if (!commonFunction.ismultiComRequired(this, "branchList", "Branch is required is required"))
                isValid = false;

            //    if (!commonFunction.ismultiComRequired(this, "warehouseList", "warehouse is required is required"))
            //         isValid = false;




            // if (!commonFunction.isRequired(this, "line", "line is required"))
            //     isValid = false;

            return isValid;
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

            var createListData = function () {

                var sumone = { count: 0, totalDistance: 0 };
                var Items = that.branch;


                var fromdate = that.getView().byId("fromdate").getValue();
                var todate = that.getView().byId("todate").getValue();
                var branchname = that.branchname;
                var warehousename = that.warehousename;
                var retone = [{
                    columns: [
                        {
                            ul: [
                                fromdate,
                                todate,
                                branchname,
                                warehousename

                            ]
                        }
                    ]
                },
                ];
                return retone;



            };
            var createCompanyName = function () {
                var companyname = that.companyname;
                var retthree = [{
                    columns: [
                        {
                            type: 'none',
                            ul: [
                                companyname

                            ]
                        }
                    ]
                },
                ];
                return retthree
            };

            var createListDataHeader = function () {
                var sumtwo = { count: 0, totalDistance: 0 };

                var companycontact = that.companycontact;
                var companyemail = that.companyemail;
                var address = that.address;
                var pincode = that.pincode;


                var rettwo = [{
                    columns: [

                        {
                            type: 'none',
                            ul: [
                                address,
                                pincode,
                                companycontact,
                                companyemail,


                            ]
                        }
                    ]
                },
                ];
                return rettwo;

            };


            var createTableData = function () {


                var sum = { count: 0, totalDistance: 0 };
                var mapArr = that.getView().byId("tblModel").getItems().map(function (obj) {
                    sum.count += 1;
                    sum.totalDistance += Number.parseInt(obj.getCells()[6].getProperty("text"));
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
                    },
                    {
                        text: obj.getCells()[5].getProperty("text"),
                        style: 'table',
                        fontSize: 8,
                        fonts: 'sans-serif'
                    },
                    {
                        text: obj.getCells()[6].getProperty("text"),
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
                        text: "Warehouse Name",
                        style: 'tableHeader'
                    },

                    {
                        text: "Warehousebin Name",
                        style: 'tableHeader'
                    },
                    {
                        text: "Item Name",
                        style: 'tableHeader'
                    },
                    {
                        text: "Opening Stock",
                        style: 'tableHeader'
                    },
                    {
                        text: "Received Stock",
                        style: 'tableHeader'
                    },
                    {
                        text: "Issued Stock",
                        style: 'tableHeader'
                    },
                    {
                        text: "Total Stock",
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

                    // {
                    //     image: this.imagepath,
                    //     width: 150,
                    //     margin: [380, -30, 0, 0]
                    // },


                    {
                        type: 'none',
                        ul: [

                            createCompanyName(),

                        ],
                        style: 'hone',
                        margin: [-60, -40, 0, 6],

                    },
                    {
                        type: 'none',
                        ul: [

                            createListDataHeader(),

                        ],
                        style: 'htwo',
                        margin: [-20, -7, 0, 6],

                    },
                    {
                        text: "Address:",
                        style: 'htwo',
                        margin: [-40, -45, 0, 6],
                        bold: true
                    },
                    {
                        text: "PinCode:",
                        style: 'htwo',
                        margin: [-40, -8, 0, 6],
                        bold: true
                    },

                    {
                        text: "Mobileno:",
                        style: 'htwo',
                        margin: [-40, -5, 0, 6],
                        bold: true
                    },
                    {
                        text: "EmailId:",
                        style: 'htwo',
                        margin: [-40, -5, 0, 6],
                        bold: true
                    },

                    {
                        // text: "LogicalDNA",
                        title: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Logical DNA'),
                        text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Daily Godown Stock Report'),
                        //textone: 'Bill Of Material',
                        style: 'title',
                        margin: [0, 100, 150, 10]
                    },
                    {
                        text: "From Date :",
                        style: 'filter',
                        bold: true
                    },
                    {
                        text: "To Date:",
                        style: 'filter',
                        bold: true
                    },
                    {
                        text: "Branch Name:",
                        style: 'filter',
                        bold: true
                    },
                    {
                        text: "warehouse Name:",
                        style: 'filter',
                        bold: true
                    },
                    {

                        ul: [

                            // style: 'bottom',
                            createListData(),

                        ],
                        style: 'filter',
                        margin: [60, -45, 0, 14]


                    },

                    {
                        table: {
                            headerRows: 1,
                            widths: [60, 60, 60, 60, 60, 60, 60],
                            body: createTableData(),
                            margin: [60, -10, 0, 14]


                        },

                        // # Apply layout with color wise gray and white               

                        layout: {
                            fillColor: function (rowIndex, node, columnIndex) {
                                return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                            },

                        }
                    },

                    {
                        type: 'none',
                        ul: [

                            createCompanyName(),

                        ],
                        style: 'bottom',
                        margin: [418, 30, 0, 14]

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
                    }
                }
            };

            // var dd = docDefinition;
            pdfMake.createPdf(docDefinition).open();
        },



        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var fromdate = this.getView().byId("fromdate").getValue();
            var todate = this.getView().byId("todate").getValue();
            var branchname = this.branchname;
            var warehousename = this.warehousename;
            var filename =fromdate+'_'+todate+'_'+branchname+'_'+warehousename;


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
                        name: "Warehouse Name",
                        template: { content: "{warehousename}" }
                    },
                    {
                        name: "Warehousebin Name",
                        template: { content: "{binname}" }
                    },
                    {
                        name: "Item Name",
                        template: { content: "{itemname}" }
                    },
                    {
                        name: "Opening Stock",
                        template: { content: "{openingbal}" }
                    },
                    {
                        name: "Received Stock",
                        template: { content: "{receivedstock}" }
                    },

                    {
                        name: "Issued Stock",
                        template: { content: "{issuestock}" }
                    },
                    {
                        name: "Total Stock",
                        template: { content: "{totalstock}" }
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
