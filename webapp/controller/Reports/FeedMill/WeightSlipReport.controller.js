sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/FeedMillReports.service',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service'

], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, MessageBox, MessageToast,Export, ExportTypeCSV, feedMillReportsService, commonFunction, CommonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.FeedMill.WeightSlipReport", {

        onInit: function () {
            var currentContext = this;
            this.imagepath = null;
            this.toDataURL('../images/logical.png', function (dataUrl) {
                currentContext.imagepath = dataUrl;
            });

            this.bus = sap.ui.getCore().getEventBus();
            this.bus.subscribe("weightslip", "weightslip", this.setDetailPage, this);
            this.oFlexibleColumnLayout = this.byId("fclWeightSlip");

            // set model for list dialog
            var oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.elev8rerp.componentcontainer.model.FeedMill.Transaction.MaterialInward", "/weightSlip.json"));
            this.getView().setModel(oModel)

            // set model for parent table
            var emptyModel = this.getModelDefault();
            var model = new JSONModel();

            model.setData(emptyModel);
            this.getView().setModel(model, "WeightSlipModel");

            model.setData(emptyModel);
            this.getView().setModel(model, "weightslipListModel");
            this.getView().byId("txtdownload").setVisible(false);


        },

        getModelDefault: function () {

            return {

                id: null,
                loadweightkg: null,
                unloadweightkg: null,
                netweightkg: null,
            }
        },

        onExit: function () {
            if (this._oDialog) {
                this._oDialog.destroy();
            }
        },


        resetModel: function () {
            // this.closeDetailPage();
            var emptyModel = this.getModelDefault();
            var model = this.getView().getModel("WeightSlipModel");
        },

        replaceStr: function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },

        replaceTemplateData: function (template) {

            var tblModel = this.getView().getModel("tblModel").oData.modelData;

            var tbleModel = this.getView().getModel("WeightSlipModel");

            var htmTable = "";

            for (var j = 0; tblModel.length > j; j++) {
                var model = [];
                model = tblModel[j];

                if (j == 0) {
                    htmTable += "<tr>";
                    htmTable += "<td align='center'>" + model["id"] + "</td>"
                    htmTable += "<td>" + model["itemname"] + "</td>"
                    htmTable += "<td>" + model["weightslipdate"] + "</td>"
                    htmTable += "<td>" + model["loadweightton"] + "</td>"
                    htmTable += "<td>" + model["unloadweightton"] + "</td>"
                    htmTable += "<td>" + model["netweightton"] + "</td>"

                    htmTable += "</tr>";
                } else {
                    if (tblModel[j - 1].purchaseorderno == tblModel[j].purchaseorderno) {
                        htmTable += "<tr>";
                        htmTable += "<td align='center'>" + model["id"] + "</td>"
                        htmTable += "<td>" + model["itemname"] + "</td>"
                        htmTable += "<td>" + model["weightslipdate"] + "</td>"
                        htmTable += "<td>" + model["loadweightton"] + "</td>"
                        htmTable += "<td>" + model["unloadweightton"] + "</td>"
                        htmTable += "<td>" + model["netweightton"] + "</td>"
                        htmTable += "</tr>";
                    } else {
                        htmTable += "<tr>";
                        htmTable += "<td align='center'>" + model["id"] + "</td>"
                        htmTable += "<td>" + model["itemname"] + "</td>"
                        htmTable += "<td>" + model["weightslipdate"] + "</td>"
                        htmTable += "<td>" + model["loadweightton"] + "</td>"
                        htmTable += "<td>" + model["unloadweightton"] + "</td>"
                        htmTable += "<td>" + model["netweightton"] + "</td>"
                        htmTable += "</tr>";
                    }
                }
            }

            // var todayDate = new Date();
            // var curDate =  commonFunction.getDateFromDB(todayDate);
            // var curTime = todayDate.getHours() + ":" + todayDate.getMinutes() + ":" + todayDate.getSeconds();
            var fromdate = commonFunction.getDate(tbleModel.oData.fromdate)
            var todate = commonFunction.getDate(tbleModel.oData.todate);

            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##ReportFromDate##", fromdate);
            template = this.replaceStr(template, "##ReporToDate##", todate);
            return template;

        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("Feedmill", "WeightSlipRagister.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Weight Slip");
            });
        },

        getWeightReport: function () {

            var currentContext = this;
            var tbleModel = this.getView().getModel("WeightSlipModel");

            var fromdate = commonFunction.getDate(tbleModel.oData.fromdate)
            var todate = commonFunction.getDate(tbleModel.oData.todate);


            feedMillReportsService.getWeightSlipRegisterReport({ fromdate: fromdate, todate: todate }, function async(data) {


                var oBatchModel = new sap.ui.model.json.JSONModel();
                oBatchModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oBatchModel, "tblModel");

            })
            this.getView().byId("txtdownload").setVisible(true);
        },


        setDetailPage: function (channel, event, data) {
            this.detailView = sap.ui.view({
                viewName: "sap.ui.elev8rerp.componentcontainer.view.FeedMill.Transaction.MaterialInward." + data.viewName,
                type: "XML"
            });
            this.detailView.setModel(data.viewModel, "viewModel");
            this.oFlexibleColumnLayout.removeAllMidColumnPages();
            this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
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
                var fromdate = that.getView().byId("txtFromDate").getValue();
                var todate = that.getView().byId("txtToDate").getValue();



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
                    sum.totalDistance += Number.parseInt(obj.getCells()[5].getProperty("text"));
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
                    }




                    ];
                    return ret;
                });

                // add a header to the pdf table
                mapArr.unshift(

                    [{
                        text: "Slip No",
                        style: 'tableHeader'
                    },
                    {
                        text: "Item Name",
                        style: 'tableHeader'
                    },
                    {
                        text: "Slip Date",
                        style: 'tableHeader'
                    },
                    {
                        text: "load Weight",
                        style: 'tableHeader'
                    },
                    {
                        text: "unload weight",
                        style: 'tableHeader'
                    },
                    {
                        text: "Net Weight",
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
                        text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('WeightSlip Report'),
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
                        margin: [60, -23, 0, 14]

                    },

                    {
                        table: {
                            headerRows: 1,
                            widths: [80, 80, 80, 80, 80, 60],
                            margin: [380, -30, 0, 0],
                            //widths: [100, 100, 60, 60, '*', '*', 50],
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

        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var fromdate = this.getView().byId("txtFromDate").getValue();
            var todate = this.getView().byId("txtToDate").getValue();

            var filename =fromdate+'_'+todate;

            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/


            var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ","
                }),

                // Pass in the model created above
                models: this.getView().getModel("tblModel"),

                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content


                columns: [
                    {
                        name: "Slip No",
                        template: { content: "{id}" }
                    },
                    {
                        name: "Item Name",
                        template: { content: "{itemname}" }
                    },
                    {
                        name: "Slip Date",
                        template: { content: "{weightslipdate}" }
                    },
                    {
                        name: "loaded Weight",
                        template: { content: "{loadweightton}" }
                    },
                    {
                        name: "Unloaded Weight",
                        template: { content: "{unloadweightton}" }
                    },
                    {
                        name: "Net Weight",
                        template: { content: "{netweightton}" }
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
