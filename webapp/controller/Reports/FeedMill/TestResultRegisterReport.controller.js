sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/FeedMillReports.service'

], function (JSONModel, BaseController, MessageToast, MessageBox, Export, ExportTypeCSV, commonFunction, feedMillReportsService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.FeedMill.TestResultRegisterReport", {
        currentContext: null,
        onInit: function () {
            this.currentContext = this;
            var currentContext = this;
            this.imagepath = null;
            this.toDataURL('../images/logical.png', function (dataUrl) {
                currentContext.imagepath = dataUrl;
            });
            var emptyModel = this.getModelDefault();
            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "tblQualityCheckParentModel");
            var omodel = new JSONModel();
            omodel.setData({ modelData: [] });
            this.getView().setModel(omodel, "tblchildModel");
            this.getView().byId("txtdownload").setVisible(false);
        },


        getModelDefault: function () {
            return {



            }
        },

        resetModel: function () {
            var tbleModel = this.getView().getModel("tblQualityCheckParentModel");
            tbleModel.setData({ modelData: [] });
            var tbleModelone = this.getView().getModel("tblchildModel");
            tbleModelone.setData({ modelData: [] });
        },

        // replaceStr: function (str, find, replace) {
        //     return str.replace(new RegExp(find, 'g'), replace);
        // },

        // replaceTemplateData: function (template) {
        //     // Item table Data -------------
        //     var tblModel = this.getView().getModel("tblModel").oData.modelData;
        //     var tbleModel = this.getView().getModel("tblchildModel");
        //     var htmTable = "";

        //     for (var indx in tblModel) {
        //         var model = tblModel[indx];
        //         htmTable += "<tr>";
        //         htmTable += "<td>" + model["testname"] + "</td>"
        //         htmTable += "<td>" + model["qualitycheckdate"] + "</td>"
        //         htmTable += "<td>" + model["itemname"] + "</td>"
        //         htmTable += "<td align='left'>" + model["startfrom"] + "</td>"
        //         htmTable += "<td align='left'>" + model["endto"] + "</td>"
        //         htmTable += "<td align='left'>" + model["finding"] + "</td>"
        //         htmTable += "<td align='left'>" + model["result"] + "</td>"
        //         htmTable += "</tr>";
        //     }

        //     var todayDate = new Date();
        //     var fromdate = commonFunction.getDate(tbleModel.oData.fromdate)
        //     var todate = commonFunction.getDate(tbleModel.oData.todate);
        //     template = this.replaceStr(template, " ##ItemList##", htmTable);
        //     template = this.replaceStr(template, "##ReportFromDate##", fromdate);
        //     template = this.replaceStr(template, "##ReporToDate##", todate);
        //     return template;
        // },

        // createPDF: function () {
        //     var currentContext = this;
        //     commonFunction.getHtmlTemplate("Feedmill", "TestResultRegisterReport.template.html", function (dataHtml) {
        //         var template = dataHtml.toString();
        //         template = currentContext.replaceTemplateData(template);
        //         commonFunction.generatePDF(template, "TestResult Ragister Report");
        //     });
        // },

        getTestResultRegisterReport: function () {
            var currentContext = this;
            var tbleModel = this.getView().getModel("tblchildModel");
            var fromdate = commonFunction.getDate(tbleModel.oData.fromdate)
            var todate = commonFunction.getDate(tbleModel.oData.todate);
            feedMillReportsService.getTestResultRegisterReport({ fromdate: fromdate, todate: todate }, function async(data) {


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
                        text: "Test Name",
                        style: 'tableHeader'
                    },
                    {
                        text: "Quality Check Date",
                        style: 'tableHeader'
                    },
                    {
                        text: "Item Name",
                        style: 'tableHeader'
                    },
                    {
                        text: "From",
                        style: 'tableHeader'
                    },
                    {
                        text: "To",
                        style: 'tableHeader'
                    },
                    {
                        text: "Finding",
                        style: 'tableHeader'
                    },
                    {
                        text: "Test Result",
                        style: 'tableHeader'
                    }

                    ]
                );
                // add a summary row at the end

                mapArr.push([

                    { text: '' },
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
                        text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Test Result Register Report'),
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
                            widths: [70, 100, 60, 60, 60, 60, 60],
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
                models: this.currentContext.getView().getModel("tblModel"),

                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content


                columns: [
                    {
                        name: "Test Name",
                        template: { content: "{testname}" }
                    },
                    {
                        name: "Quality Check Date",
                        template: { content: "{qualitycheckdate}" }
                    },
                    {
                        name: "Item Name",
                        template: { content: "{itemname}" }
                    },
                    {
                        name: "From",
                        template: { content: "{startfrom}" }
                    },
                    {
                        name: "To",
                        template: { content: "{endto}" }
                    },
                    {
                        name: "Finding",
                        template: { content: "{finding}" }
                    },
                    {
                        name: "Test Result",
                        template: { content: "{result}" }
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
