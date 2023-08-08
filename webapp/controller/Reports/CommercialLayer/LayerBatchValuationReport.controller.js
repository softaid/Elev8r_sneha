sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/CommercialLayerReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service'

], function (JSONModel, BaseController, MessageBox, Export, ExportTypeCSV, commonFunction, layerReportsService, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Breeder.BatchValuationReport", {

        currentContext: null,

        onInit: function () {

            // Function for PDF image
            var currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");

            // set empty model to view 
            var emptyModel = this.getModelDefault();
            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "layerbatchvaluationModel");

            var currentContext = this;
            commonService.getAllLayerBatchesByStatusid({statusid : 982},function(data){
                var oBatchModel = new sap.ui.model.json.JSONModel();
                oBatchModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oBatchModel, "layerBatchList");
            })

            this.csvdata = [];
        },

        getModelDefault: function () {
            return {
                layerbatchid: null
            }
        },

        handleLayerBatchValueHelp: function (oEvent) {
            var sInputValue = oEvent.getSource().getValue();
            this.inputId = oEvent.getSource().getId();

            // create value help dialog
            this._valueHelpDialog = sap.ui.xmlfragment(
                "sap.ui.elev8rerp.componentcontainer.fragmentview.Reports.LayerBatchDialog",
                this
            );
            this.getView().addDependent(this._valueHelpDialog);

            // open value help dialog filtered by the input value
            this._valueHelpDialog.open(sInputValue);
        },

        handleLayerBatchSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var columns = ['batchname', 'locationname', 'warehousename'];
            var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
            }),
                false);  // false for OR condition
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        onLayerBatchDialogClose: function (oEvent) {
            console.log("HI");
            var currentContext = this;
            var aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts != undefined) {
                var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
                console.log(selRow[0]);
                var oModel = currentContext.getView().getModel("layerbatchvaluationModel");
                //update existing model to set locationid
                oModel.oData.layerbatchid = selRow[0].id;
                oModel.oData.batchname = selRow[0].batchname
                oModel.oData.placementdate = selRow[0].placementdate

                oModel.refresh();
                this.getView().byId("textBatch").setValueState(sap.ui.core.ValueState.None);

            } else {

            }
        },

        resetModel: function () {
            var tbleModel = this.getView().getModel("layerbatchvaluationtblModel");
            tbleModel.setData({ modelData: [] });

        },

        onSearchData: function () {
            if (this.validateForm()) {
                var currentContext = this;
                var oModel = this.getView().getModel("layerbatchvaluationModel").oData

                var oModel = {
                    layerbatchid: oModel.layerbatchid,
                }

                layerReportsService.getLayerBatchValuationReport(oModel, function (data) {

                    var eModel = new sap.ui.model.json.JSONModel();
                    eModel.setData({ modelData: data[0]});
                    currentContext.getView().setModel(eModel, "layerbatchvaluationtblModel");
                                       
                });
            }
        },


        validateForm: function () {
            var isValid = true;

            if (!commonFunction.isRequired(this, "textBatch", "Batch is required."))
                isValid = false;

            return isValid;
        },


        // toDataURL: function (url, callback) {
        //     var xhr = new XMLHttpRequest();
        //     xhr.onload = function () {
        //         var reader = new FileReader();
        //         reader.onloadend = function () {
        //             callback(reader.result);
        //         }
        //         reader.readAsDataURL(xhr.response);
        //     };
        //     xhr.open('GET', url);
        //     xhr.responseType = 'blob';
        //     xhr.send();
        //     //}
        // },


        // onPdfExport: function (oEvent) {

        //     var that = this;
        //     //  map the bound data of the table to a pdfMake array
        //     var createCompanyName = function () {
        //         var companyname = that.companyname;
        //         var retthree = [{
        //             columns: [
        //                 {
        //                     type: 'none',
        //                     ul: [
        //                         companyname

        //                     ]
        //                 }
        //             ]
        //         },
        //         ];
        //         return retthree
        //     };


        //     var createListDataHeader = function () {
        //         var sumtwo = { count: 0, totalDistance: 0 };

        //         var companycontact = that.companycontact;
        //         var companyemail = that.companyemail;
        //         var address = that.address;
        //         var pincode = that.pincode;


        //         var rettwo = [{
        //             columns: [

        //                 {
        //                     type: 'none',
        //                     ul: [
        //                         address,
        //                         pincode,
        //                         companycontact,
        //                         companyemail,


        //                     ]
        //                 }
        //             ]
        //         },
        //         ];
        //         return rettwo;

        //     };

        //     var createCompanyName = function () {
        //         var companyname = that.companyname;
        //         var retthree = [{
        //             columns: [
        //                 {
        //                     type: 'none',
        //                     ul: [
        //                         companyname

        //                     ]
        //                 }
        //             ]
        //         },
        //         ];
        //         return retthree
        //     };

        //     var createListDataHeader = function () {
        //         var sumtwo = { count: 0, totalDistance: 0 };

        //         var companycontact = that.companycontact;
        //         var companyemail = that.companyemail;
        //         var address = that.address;
        //         var pincode = that.pincode;


        //         var rettwo = [{
        //             columns: [

        //                 {
        //                     type: 'none',
        //                     ul: [
        //                         address,
        //                         pincode,
        //                         companycontact,
        //                         companyemail,


        //                     ]
        //                 }
        //             ]
        //         },
        //         ];
        //         return rettwo;

        //     };

        //     var createListData = function () {
        //         var sumone = { count: 0, totalDistance: 0 };
        //         var Items = that.locationname;
        //         var shed = that.shedname;
        //         var batch = that.getView().byId("textBatch").getValue();
        //         var fromdate = that.getView().byId("txtFromdate").getValue();
        //         var todate = that.getView().byId("txtTodate").getValue();
        //         var location = that.getView().byId("locationtbl").getValue();

        //         var mapArrone = Items.map(function (objone) {


        //             sumone.count += 1;
        //             sumone.totalDistance += Number.parseInt(Items);

        //             var retone = [{
        //                 columns: [
        //                     {
        //                         ul: [
        //                             objone,
        //                             batch,
        //                             shed,
        //                             fromdate,
        //                             todate
        //                         ]
        //                     }
        //                 ]
        //             },
        //             ];
        //             return retone;
        //         });

        //         mapArrone.push([
        //         ]);
        //         return mapArrone;
        //     };
        //     var createTableData = function () {


        //         var sum = { count: 0, totalDistance: 0 };

        //         var mapArr = that.getView().byId("tblBatchdailypriconReport").getItems().map(function (obj) {
        //             sum.count += 1;
        //             sum.totalDistance += Number.parseInt(obj.getCells()[21].getProperty("text"));
        //             var ret = [{
        //                 text: obj.getCells()[0].getProperty("text"),
        //                 style: 'table',
        //                 fontSize: 8,
        //                 fonts: 'sans-serif'
        //             },
        //             {
        //                 text: obj.getCells()[1].getProperty("text"),
        //                 style: 'table',
        //                 fontSize: 8,
        //                 fonts: 'sans-serif'
        //             },
        //             {
        //                 text: obj.getCells()[2].getProperty("text"),
        //                 style: 'table',
        //                 fontSize: 8,
        //                 fonts: 'sans-serif'
        //             },
        //             {
        //                 text: obj.getCells()[3].getProperty("text"),
        //                 style: 'table',
        //                 fontSize: 8,
        //                 fonts: 'sans-serif'
        //             },
        //             {
        //                 text: obj.getCells()[4].getProperty("text"),
        //                 style: 'table',
        //                 fontSize: 8,
        //                 fonts: 'sans-serif'
        //             },
        //             {
        //                 text: obj.getCells()[5].getProperty("text"),
        //                 style: 'table',
        //                 fontSize: 8,
        //                 fonts: 'sans-serif'
        //             },
        //             {
        //                 text: obj.getCells()[6].getProperty("text"),
        //                 style: 'table',
        //                 fontSize: 8,
        //                 fonts: 'sans-serif'
        //             },
        //             {
        //                 text: obj.getCells()[7].getProperty("text"),
        //                 style: 'table',
        //                 fontSize: 8,
        //                 fonts: 'sans-serif'
        //             },
        //             {
        //                 text: obj.getCells()[8].getProperty("text"),
        //                 style: 'table',
        //                 fontSize: 8,
        //                 fonts: 'sans-serif'
        //             },
        //             {
        //                 text: obj.getCells()[9].getProperty("text"),
        //                 style: 'table',
        //                 fontSize: 8,
        //                 fonts: 'sans-serif'
        //             },
        //             {
        //                 text: obj.getCells()[10].getProperty("text"),
        //                 style: 'table',
        //                 fontSize: 8,
        //                 fonts: 'sans-serif'
        //             },
        //             {
        //                 text: obj.getCells()[11].getProperty("text"),
        //                 style: 'table',
        //                 fontSize: 8,
        //                 fonts: 'sans-serif'
        //             },
        //             {
        //                 text: obj.getCells()[12].getProperty("text"),
        //                 style: 'table',
        //                 fontSize: 8,
        //                 fonts: 'sans-serif'
        //             },
        //             {
        //                 text: obj.getCells()[13].getProperty("text"),
        //                 style: 'table',
        //                 fontSize: 8,
        //                 fonts: 'sans-serif'
        //             },
        //             {
        //                 text: obj.getCells()[14].getProperty("text"),
        //                 style: 'table',
        //                 fontSize: 8,
        //                 fonts: 'sans-serif'
        //             },
        //             {
        //                 text: obj.getCells()[15].getProperty("text"),
        //                 style: 'table',
        //                 fontSize: 8,
        //                 fonts: 'sans-serif'
        //             },
        //             {
        //                 text: obj.getCells()[16].getProperty("text"),
        //                 style: 'table',
        //                 fontSize: 8,
        //                 fonts: 'sans-serif'
        //             },
        //             {
        //                 text: obj.getCells()[17].getProperty("text"),
        //                 style: 'table',
        //                 fontSize: 8,
        //                 fonts: 'sans-serif'
        //             },
        //             {
        //                 text: obj.getCells()[18].getProperty("text"),
        //                 style: 'table',
        //                 fontSize: 8,
        //                 fonts: 'sans-serif'
        //             },
        //             {
        //                 text: obj.getCells()[19].getProperty("text"),
        //                 style: 'table',
        //                 fontSize: 8,
        //                 fonts: 'sans-serif'
        //             },
        //             {
        //                 text: obj.getCells()[20].getProperty("text"),
        //                 style: 'table',
        //                 fontSize: 8,
        //                 fonts: 'sans-serif'
        //             },
        //             {
        //                 text: obj.getCells()[21].getProperty("text"),
        //                 style: 'table',
        //                 fontSize: 8,
        //                 fonts: 'sans-serif'
        //             }


        //             ];
        //             return ret;
        //         });

        //         // add a header to the pdf table
        //         mapArr.unshift(

        //             [{
        //                 text: "age",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "OpeniniStock F",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "OpeniniStock M",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Mortality F",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Mortality M",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Closing Stock M",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Closing Stock F",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Production Egg Qty",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Production Eggs %",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "STD Eggs Pro",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "+/-",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Commercial Eggs",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Cracked Eggs",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Double Yolk Eggs",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Hatching Egg A",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Hatching Egg B",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Hatching Egg C",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Supervisior",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Total Feed Con M",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Total Feed Con F",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Feed Con Per Bird M",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Feed Con Per Bird F",
        //                 style: 'tableHeader'
        //             }

        //             ]
        //         );
        //         // add a summary row at the end

        //         mapArr.push([

        //             { text: "" },
        //             { text: "" },
        //             { text: "" },
        //             { text: "" },
        //             { text: "" },
        //             { text: "" },
        //             { text: "" },
        //             { text: "" },
        //             { text: "" },
        //             { text: "" },
        //             { text: "" },
        //             { text: "" },
        //             { text: "" },
        //             { text: "" },
        //             { text: "" },
        //             { text: "" },
        //             { text: "" },
        //             { text: "" },
        //             { text: "" },
        //             { text: "" },
        //             { text: "" },
        //             { text: "" }
        //         ]);
        //         return mapArr;
        //     };

        //     var docDefinition = {

        //         info: {
        //             author: 'TAMMEN IT SOLUTIONS',
        //             subject: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('pdfReportSubject')
        //         },

        //         pageOrientation: 'portrait',
        //         pageMargins: [50, 60, -70, 60],
        //         style: 'border',

        //         footer: function (currentPage, pageCount) {
        //             return { text: currentPage.toString() + ' / ' + pageCount, alignment: 'center' };
        //         },


        //         content: [


        //             {
        //                 type: 'none',
        //                 ul: [

        //                     createCompanyName(),

        //                 ],
        //                 style: 'hone',
        //                 margin: [-60, -40, 0, 6],

        //             },
        //             {
        //                 type: 'none',
        //                 ul: [

        //                     createListDataHeader(),

        //                 ],
        //                 style: 'htwo',
        //                 margin: [-20, -7, 0, 6],

        //             },
        //             {
        //                 text: "Address:",
        //                 style: 'htwo',
        //                 margin: [-40, -45, 0, 6],
        //                 bold: true
        //             },
        //             {
        //                 text: "PinCode:",
        //                 style: 'htwo',
        //                 margin: [-40, -8, 0, 6],
        //                 bold: true
        //             },

        //             {
        //                 text: "Mobileno:",
        //                 style: 'htwo',
        //                 margin: [-40, -5, 0, 6],
        //                 bold: true
        //             },
        //             {
        //                 text: "EmailId:",
        //                 style: 'htwo',
        //                 margin: [-40, -5, 0, 6],
        //                 bold: true
        //             },

        //             {

        //                 title: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Logical DNA'),
        //                 text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Batchwise Daily Producation And Consumption Report'),

        //                 style: 'title',
        //                 margin: [0, 100, 150, 10]
        //             },
        //             {
        //                 text: "Location:",
        //                 style: 'filter',
        //                 bold: true
        //             },
        //             {
        //                 text: "Batch:",
        //                 style: 'filter',
        //                 bold: true
        //             },
        //             {
        //                 text: "Shed:",
        //                 style: 'filter',
        //                 bold: true
        //             },
        //             {
        //                 text: "From Date:",
        //                 style: 'filter',
        //                 bold: true
        //             },

        //             {
        //                 text: "To Date:",
        //                 style: 'filter',
        //                 bold: true
        //             },

        //             {

        //                 ul: [

        //                     createListData(),

        //                 ],
        //                 style: 'filter',
        //                 margin: [60, -55, 0, 14]

        //             },


        //             {
        //                 table: {
        //                     headerRows: 1,
        //                     widths: [20, 20, 20, 20, 20, 20, 20, 10, 10, 10, 5, 5, 5, 5, 10, 10, 10, 20, 20, 20, 20, 20],
        //                     margin: [380, -30, 0, 0],
        //                     body: createTableData(),
        //                 },

        //                 // # Apply layout with color wise gray and white               

        //                 layout: {
        //                     fillColor: function (rowIndex, node, columnIndex) {
        //                         return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
        //                     },

        //                 }
        //             },

        //             {
        //                 text: "Logical DNA",
        //                 style: 'bottom',
        //                 margin: [450, 30, 0, 14]

        //             },
        //             {
        //                 text: "Authorised By",
        //                 style: 'bottom',
        //                 margin: [450, 0, 0, 14]
        //             },
        //         ],

        //         styles: {
        //             header: {
        //                 fontSize: 12,
        //                 bold: true,
        //                 margin: [0, 0, 0, 0]
        //             },

        //             leftline: {
        //                 bold: true,
        //                 margin: [0, 0, 0, 0]
        //             },

        //             title: {
        //                 fontSize: 15,
        //                 fonts: 'sans-serif',
        //                 padding: 15,
        //                 bold: true,
        //                 alignment: 'center',
        //                 margin: [0, 0, 0, 0]
        //             },

        //             hone: {
        //                 fontSize: 10,
        //                 bold: true,
        //                 lineheight: 4,
        //                 fonts: 'sans-serif'
        //             },

        //             bottom: {
        //                 fontSize: 12,
        //                 bold: true,
        //                 fonts: 'sans-serif'
        //             },

        //             htwo: {
        //                 fontSize: 8,

        //             },

        //             filter: {
        //                 fontSize: 10,
        //             },

        //             tableHeader: {
        //                 bold: true,
        //                 bordercollapse: 'collapse',
        //                 padding: 15,
        //                 fonts: 'sans-serif',
        //                 fontsize: 25,
        //                 lineheight: 1,
        //                 width: '*',
        //                 columnGap: 10,
        //                 topmargin: 10
        //             },

        //             border: {
        //                 border: [1, 'solid', '#ccc']
        //             },

        //             sum: {
        //                 fontSize: 8,
        //                 italics: true
        //             }
        //         }
        //     };
        //     pdfMake.createPdf(docDefinition).open();
        // },


        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {

            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/


            var currentContext = this;
            var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ","
                }),

                // Pass in the model created above
                models: currentContext.getView().getModel("layerbatchvaluationtblModel"),

                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content

                columns: [
                    {
                        name: "Date",
                        template: { content: "{transactiondate}" }
                    },
                    {
                        name: "Age In Week",
                        template: { content: "{ageinweek}" }
                    },
                    {
                        name: "Age In Days",
                        template: { content: "{ageindays}" }
                    },
                    {
                        name: "Bird Op.",
                        template: { content: "{femaleopeningbalance}" }
                    },
                    {
                        name: "Feed Cost",
                        template: { content: "{feedcost}" }
                    },
                    {
                        name: "Medicine Cost",
                        template: { content: "{medicinecost}" }
                    },
                    {
                        name: "Admin Cost",
                        template: { content: "{overheadexp}" }
                    },
                    {
                        name: "Op Valuation",
                        template: { content: "{openingvaluation}" }
                    },
                    {
                        name: "Todays Valuation",
                        template: { content: "{todaysvaluation}" }
                    },
                    {
                        name: "Total Collected HE",
                        template: { content: "{totalcollectedhe}" }
                    },
                    {
                        name: "Cost/Eggs",
                        template: { content: "{costperegg}" }
                    },
                    {
                        name: "Amortization Cost/Eggs",
                        template: { content: "{amortizationcostperegg}" }
                    },
                    {
                        name: "Production Cost/Eggs",
                        template: { content: "{productioncostperegg}" }
                    },
                    {
                        name: "Eggs Valuation",
                        template: { content: "{eggsvaluation}" }
                    },
                    {
                        name: "Current Valuation",
                        template: { content: "{currentvaluation}" }
                    },
                    {
                        name: "Cost/Bird",
                        template: { content: "{birdsold}" }
                    },
                    {
                        name: "Bird Sold",
                        template: { content: "{birdsold}" }
                    },
                    {
                        name: "Bird Sold Amount",
                        template: { content: "{birdsoldamount}" }
                    },
                    {
                        name: "Final Flock Valuation",
                        template: { content: "{finalflockvaluation}" }
                    }
                 ]
            });

            // download exported file
            oExport.saveFile()
                .catch(function (oError) {
                    MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
                })
                .then(function () {
                    oExport.destroy();
                });
        }
    });
}, true);