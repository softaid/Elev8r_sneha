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

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.FeedMill.StockAdjustmentReport", {

        currentContext: null,

        onInit: function () {
            this.currentContext = this;
            var currentContext = this;
            this.imagepath = null;
            this.toDataURL('../images/logical.png', function (dataUrl) {
                currentContext.imagepath = dataUrl;
            });
            this.getItemGroups(this);
            var model = new JSONModel();
            model.setData([]);
            this.getView().setModel(model, "reportModel");
            this.getAllCommonBranch(this);

            var emptyModel = this.getModelDefault();
            model.setData(emptyModel)
            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "tblModel");
            this.getView().byId("txtdownload").setVisible(false);
        },

        getModelDefault: function () {
            return {
                itemgroupid: null,
                itemid: null

            }
        },

        resetModel: function () {
            var tbleModel = this.getView().getModel("tblModel");
            tbleModel.setData({ modelData: [] });

            var pModel = this.getView().getModel("reportModel");
            pModel.setData([]);

        },

        // Function for pdf start

        replaceStr: function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },

        replaceTemplateData: function (template) {
            // Item table Data --------------
            var tblModel = this.getView().getModel("tblModel").oData.modelData;

            var htmTable = "";
            for (var indx in tblModel) {
                var model = tblModel[indx];
                // Replace/create column sequence data table
                htmTable += "<tr>";
                htmTable += "<td align='center'>" + model["placement_date"] + "</td>"
                htmTable += "<td>" + model["farmer_name"] + "</td>"
                htmTable += "<td align='right'>" + model["farm_name"] + "</td>"
                htmTable += "<td align='right'>" + model["batch_id"] + "</td>"
                htmTable += "<td>" + model["branchname"] + "</td>"
                htmTable += "<td>" + model["chick_qty"] + "</td>"
                htmTable += "<td>" + model["total_area"] + "</td>"
                htmTable += "<td>" + model["density"] + "</td>"
                htmTable += "</tr>";
            }

            var line_id = tblModel.line_id;
            var todayDate = new Date();
            var curDate = commonFunction.getDateFromDB(todayDate);
            var curTime = todayDate.getHours() + ":" + todayDate.getMinutes() + ":" + todayDate.getSeconds();
            template = this.replaceStr(template, "##ItemList##", htmTable);
            template = this.replaceStr(template, "##ReportDate##", curDate);
            template = this.replaceStr(template, "##ReporTime##", curTime);
            template = this.replaceStr(template, "##CompanyName##", commonFunction.session("companyname"));
            template = this.replaceStr(template, "##lineid##", line_id);
            return template;
        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("CBF", "ChickPlacementReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Chick Placement Register report");
            });
        },

        // Function for pdf finish

        onSearchStockAdjustmentReport: function () {
           
            //if (this.validateForm()) {
                var currentContext = this;
                var itemstring = this.getView().byId("itemList").getSelectedKeys();
                var itemStr = "";

                for (var i = 0; i < itemstring.length; i++) {
                    if (i == 0)
                        itemStr = parseInt(itemstring[i]);
                    else
                        itemStr = itemStr + "," + parseInt(itemstring[i]);
                }
                console.log("itemStr",itemStr);


                feedMillReportsService.getStockadjustmentReport({itemid: itemStr }, function async(data) {
                    console.log("data",data);
                    var oBatchModel = currentContext.getView().getModel("tblModel");
                    oBatchModel.setData({ modelData: data[0] });


                })
           // }
           this.getView().byId("txtdownload").setVisible(true);
        },

        getAllCommonBranch: function (currentContext) {
            commonService.getAllCommonBranch(function (data) {
                var oBranchModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "branchname": "Select All" });
                    } else {
                        MessageBox.error("branch not availabel.")
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
                        MessageBox.error("warehouse  not availabel.")
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
            debugger;
            var currentContext = this;
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedwarehouse = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedwarehouse.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }

            var warehouseid = [];
            // var batchs = [];
            for (var i = 0; i < selectedwarehouse.length; i++) {
                warehouseid.push(selectedwarehouse[i].key);
            }

            console.log("warehouseid",warehouseid);


            this.warehousename = [];
            for (var i = 0; i < selectedwarehouse.length; i++) {
                this.warehousename.push(selectedwarehouse[i].text);
            }

            feedMillReportsService.getWarehousebinByWarehouseid({ warehouseid: warehouseid }, function (data) {

                var oBatchModel = new sap.ui.model.json.JSONModel();

                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "binname": "Select All" });
                    } else {
                        MessageBox.error("warehouse  not availabel.")
                    }
                }

           

                currentContext.getView().setModel(oBatchModel, "WarehousebinModel");

                oBatchModel.setData({ modelData: data[0] });


            });


            this.getView().byId("warehouseList").setValueState(sap.ui.core.ValueState.None);

            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        warehousebinSelectionFinish: function (oEvt) {
            debugger;
            var currentContext = this;
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedwarehousebin = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedwarehousebin.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }

            var warehousebinid = [];
            // var batchs = [];
            for (var i = 0; i < selectedwarehousebin.length; i++) {
                warehousebinid.push(selectedwarehousebin[i].key);
            }

            console.log("warehousebinid",warehousebinid);


            this.warehousebinname = [];
            for (var i = 0; i < selectedwarehousebin.length; i++) {
                this.warehousebinname.push(selectedwarehousebin[i].text);
            }

            feedMillReportsService.getitemByWarehousebinid({ warehousebinid: warehousebinid }, function (data) {

                var oBatchModel = new sap.ui.model.json.JSONModel();

                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "itemid": "All", "itemname": "Select All" });
                    } else {
                        MessageBox.error("item  not availabel.")
                    }
                }

           

                currentContext.getView().setModel(oBatchModel, "itemModel");

                oBatchModel.setData({ modelData: data[0] });


            });


            this.getView().byId("warehouseList").setValueState(sap.ui.core.ValueState.None);

            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        getItemGroups: function (currentContext, modelName) {
            commonService.getItemGroups(function (data) {

                var oBranchModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "groupname": "Select All" });
                    } else {
                        MessageBox.error("itemgroupname not availabel.")
                    }
                }

                oBranchModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oBranchModel, "itemgroupModel");

            });
        },

        itemgroupSelectionFinish: function (oEvt) {
            var currentContext = this;
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedKeys = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedKeys.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });

            }

            var itemgroup = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                itemgroup.push(selectedKeys[i].key);
            }

            this.itemgroupname = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                itemgroupname.push(selectedKeys[i].text);
            }

            var itemgroups = itemgroup.join();
            feedMillReportsService.getFeedFormulaReportitem({ itemgroupid: itemgroups }, function (data) {

                var oBatchModel = new sap.ui.model.json.JSONModel();

                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "itemname": "Select All" });
                    } else {
                        MessageBox.error("item  not availabel.")
                    }
                }

                var itemgroupStr = "";
                for (var i = 0; i < itemgroup.length; i++) {
                    if (i == 0)
                        itemgroupStr = parseInt(itemgroup[i]);
                    else
                        itemgroupStr = itemgroupStr + "," + parseInt(itemgroup[i]);
                }

                currentContext.getView().setModel(oBatchModel, "itemModel");

                oBatchModel.setData({ modelData: data[0] });


            });

            // this.getLinewisebatches(batchesStr);
            this.getView().byId("itemgroupList").setValueState(sap.ui.core.ValueState.None);

            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        itemgroupSelectionChange: function (oEvent) {
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

        itemSelectionChange: function (oEvent) {

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


        lineSelectionChange: function (oEvent) {
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

        // Validation Fun

        validateForm: function () {
            var isValid = true;

            if (!commonFunction.ismultiComRequired(this, "itemgroupList", "Branch is required is required"))
                isValid = false;

            //    if (!commonFunction.ismultiComRequired(this, "warehouseList", "warehouse is required is required"))
            //         isValid = false;


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
            //  map the bound data of the table to a pdfMake array

            var createListData = function () {

                // var sumone = { count: 0, totalDistance: 0 };
                var fromdate = that.getView().byId("fromdate").getValue();
                var todate = that.getView().byId("todate").getValue();

                var retone = [{
                    columns: [
                        {
                            ul: [
                                fromdate,
                                todate

                            ]
                        }
                    ]
                },
                ];
                return retone;

            };

            var createTableData = function () {

                var sum = { count: 0, totalDistance: 0 };
                var mapArr = that.getView().byId("tblModel").getItems().map(function (obj) {
                    sum.count += 1;
                    sum.totalDistance += Number.parseInt(obj.getCells()[3].getProperty("text"));
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
                    }



                    ];
                    return ret;
                });

                // add a header to the pdf table
                mapArr.unshift(

                    [{
                        text: "Item Group Name",
                        style: 'tableHeader'
                    },
                    {
                        text: "Item Name",
                        style: 'tableHeader'
                    },
                    {
                        text: "Material Name",
                        style: 'tableHeader'
                    },
                    {
                        text: "Used Qty",
                        style: 'tableHeader'
                    }

                    ]
                );
                // add a summary row at the end

                mapArr.push([

                    { text: '' },
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
                        // text: "LogicalDNA",
                        title: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Logical DNA'),
                        text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Feed Formula Report'),
                        //textone: 'Bill Of Material',
                        style: 'title',
                        margin: [0, 100, 150, 10]
                    },
                    {
                        text: "From Date:",
                        style: 'filter',
                        bold: true
                    },

                    {
                        text: "To Date:",
                        style: 'filter',
                        bold: true
                    },

                    {

                        ul: [

                            // style: 'bottom',
                            createListData(),

                        ],
                        style: 'filter',
                        margin: [60, -20, 0, 14]

                    },

                    {
                        table: {
                            headerRows: 1,
                            widths: [120, 120, 120, 120],
                            // margin: [380, -30, 0, 0],

                            // widths: [100, 100, 60, 60, '*', '*', 50],
                            body: createTableData(),
                            margin: [60, -10, 0, 14]

                            // paddingLeft: function (i) {
                            //     return i === 0 ? 0 : 2;
                            //   },
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
                    }

                    // sum: {
                    //     fontSize: 8,
                    //     italics: true
                    // }
                }
            };

            // var dd = docDefinition;
            pdfMake.createPdf(docDefinition).open();
        },



        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
          
            var branchname = this.branchname
            var warehousenam = this.warehousenam
            var itemgroupname = this.itemgroupname
            var warehousebinname=this.warehousebinname
            
            var filename =branchname+'_'+warehousenam+'_'+warehousebinname+'_'+itemgroupname;

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
                        name: "Date",
                        template: { content: "{adjustmentdate}" }
                    },
                    {
                        name: "Item",
                        template: { content: "{itemname}" }
                    },
                    {
                        name: "Unit",
                        template: { content: "{unit}" }
                    },
                    {
                        name: "Warehouse",
                        template: { content: "{warehousename}" }
                    },
                    {
                        name: "WarehouseBin",
                        template: { content: "{binname}" }
                    },
                    {
                        name: "Adjustment Type",
                        template: { content: "{refnameone}" }
                    },
                    {
                        name: "Previous Qty",
                        template: { content: "{previousqty}" }
                    },
                    {
                        name: "Adjusted Qty",
                        template: { content: "{adjustedqty}" }
                    },

                    {
                        name: "Closing Qty",
                        template: { content: "{closingqty}" }
                    },
                    {
                        name: "Rate",
                        template: { content: "{unitcost}" }
                    },
                    {
                        name: "Amount",
                        template: { content: "{amount}" }
                    },
                    {
                        name: "Status",
                        template: { content: "{refname}" }
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
