sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/BreederReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Breeder/BreederBatch.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',

], function (JSONModel, BaseController, MessageToast, MessageBox, Export, ExportTypeCSV, commonFunction, breederReportsService, breederBatchService, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Breeder.FloxkDetailReport", {

        currentContext: null,

        onInit: function () {
            // set location model

            //     var currentContext = this;
            //     this.imagepath = null;
            //    this.toDataURL('../images/logical.png', function (dataUrl) {
            //        currentContext.imagepath = dataUrl;
            //    });

            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");
            var emptyModel = this.getModelDefault();

            var flockDetailModel = new JSONModel();
            flockDetailModel.setData(emptyModel);
            this.getView().setModel(flockDetailModel, "flockDetailModel");

            var tblModel = new JSONModel();
            tblModel.setData({ modelData: [] });
            this.getView().setModel(tblModel, "tblModel");

            // breederBatchService

            this.handleRouteMatched(null);

            var currRouteName = this.getOwnerComponent().getModel("applicationModel").getProperty("/routeName");
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this._oRouter.getRoute(currRouteName).attachMatched(this.handleRouteMatched, this);
            this.getView().byId("txtdownload").setVisible(false);
        },

        getModelDefault: function () {
            return {
                breederbatchid: null,
                fromdate: commonFunction.setTodaysDate(new Date()),
                todate: commonFunction.setTodaysDate(new Date()),
            }
        },

        handleRouteMatched: function () {
            //Breeder batch help box
            this.getAllBreederBatches(status);
        },



        getAllBreederBatches: function () {
            var currentContext = this;

            breederBatchService.getAllBatchesForFlockDetail(function (data) {
	        console.log("data",data);
                if (data[0].length > 0) {
                    var oBatchModel = new sap.ui.model.json.JSONModel();
                    oBatchModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oBatchModel, "batchModel");
                } else {
                    MessageBox.error("Breeder batch not availabel!");
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
        batchSelectionFinish: function (oEvt) {

            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedbatches = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedbatches.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }
            var i = selectedbatches.length - 1;

            if (selectedbatches[i].key == "ALL") {

                selectedbatches = selectedbatches.slice(0, -1);
            }
            var batchs = [];
            for (var i = 0; i < selectedbatches.length; i++) {
                batchs.push(selectedbatches[i].key);
            }

            this.batchsname = [];
            for (var i = 0; i < selectedbatches.length; i++) {
                this.batchsname.push(selectedbatches[i].text);
            }
             var batchesStr = "";

            for (var i = 0; i < batchs.length; i++) {
                if (i == 0)
                    batchesStr = parseInt(batchs[i]);
                else
                    batchesStr = batchesStr + "," + parseInt(batchs[i]);
            }
            var oModel = this.getView().getModel("flockDetailModel");
	    var batchid = this.getView().byId("txtBreederToBatch").getSelectedItem().mProperties.key;
            oModel.oData.breederbatchid = batchid 
	    this.getView().byId("txtBreederToBatch").setValueState(sap.ui.core.ValueState.None);
            oModel.refresh();
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },


        resetModel: function () {
            var tbleModel = this.getView().getModel("tblModel");
            tbleModel.setData({ modelData: [] });

        },

        ongetDate: function () {
            var isValid = true
            var oModel = this.getView().getModel("flockDetailModel").oData

            var fromDate = oModel.fromdate;
            var todate = oModel.todate;

            if (fromDate) {
                // var parts1 = fromDate.split('-');

                // fromDate = Date.parse(new Date(parts1[2], parts1[1], parts1[0]));
                var date1 = Date.parse(fromDate);
                this.getView().byId("txtFromDate").setValueState(sap.ui.core.ValueState.None);
            }
            if (todate) {

                // var parts2 = todate.split('-');

                // todate = Date.parse(new Date(parts2[2], parts2[1], parts2[0]));
                var date3 = Date.parse(todate);
                this.getView().byId("txtToDate").setValueState(sap.ui.core.ValueState.None);
            }


            if (date3 < date1) {
                MessageBox.error("From Date less thsn todate date");
                isValid = false;
            }
            return isValid
        },

        validateForm: function () {
            var isValid = true;

            if (!commonFunction.isRequired(this, "txtFromDate", "From Date is required"))
                isValid = false;
            if (!commonFunction.isRequired(this, "txtToDate", "To Date is required"))
                isValid = false;
            if (!this.ongetDate())
                isValid = false;
            return isValid;
        },

        onSearchData: function () {
	    //debugger;
	    var oModel = this.getView().getModel("flockDetailModel");
	    var batchid = this.getView().byId("txtBreederToBatch").getSelectedItem().mProperties.key;
	    //console.log("batchid ", batchid );
            oModel.oData.breederbatchid = batchid; 

            if (this.validateForm()) {
                var currentContext = this;
                var oModel = this.getView().getModel("flockDetailModel").oData;
                oModel["fromdate"] = commonFunction.getDate(oModel["fromdate"]);
                oModel["todate"] = commonFunction.getDate(oModel["todate"]);

                breederReportsService.getFlockDetailReport(oModel, function async(data) {
                    //console.log("getFlockDetailReport", data);
		    
		    //console.log("getFlockDetailReport", data);


                    if (data) {
                        for (var i = 0; i < data[0].length; i++) {
			    //debugger;
			    //console.log("maletransferedquantity", data[0][i].maletransferedquantity);
                           // data[0][i].maleclosingbalance = data[0][i].maleopeningbalance - (data[0][i].maletransferedquantity + data[0][i].maleculls + data[0][i].malemortality);
                           // data[0][i].femaleclosingbalance = data[0][i].femaleopeningbalance - (data[0][i].femaletransferedquantity + data[0][i].femaleculls + data[0][i].femalemortality);

                            if (i == (data[0].length - 1)) {

                                var childModel = currentContext.getView().getModel("tblModel");
                                childModel.setData({ modelData: data[0] });
                                childModel.refresh();
                            }
                        }
                    }

                });
            }
            this.getView().byId("txtdownload").setVisible(true);
        },

        replaceStr: function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },

        // Function Used For PDF Download

        replaceTemplateData: function (template) {
            // debugger;
            // Item table Data --------------


            var tbleModel = this.getView().getModel("tblModel").oData.modelData;
          


            var htmTable = "";
            for (var indx in tbleModel) {
                var model = tbleModel[indx];
                // Replace/create column sequence data table
                htmTable += "<tr>";
                htmTable += "<td align='center'>" + model["date"] + "</td>"
                htmTable += "<td>" + model["shedname"] + "</td>"
                htmTable += "<td align='right'>" + model["maleopeningbalance"] + "</td>"
                htmTable += "<td align='right'>" + model["femaleopeningbalance"] + "</td>"
                htmTable += "<td>" + model["maletransferedquantity"] + "</td>"
                htmTable += "<td>" + model["femaletransferedquantity"] + "</td>"
                htmTable += "<td>" + model["maleculls"] + "</td>"
                htmTable += "<td>" + model["femaleculls"] + "</td>"
                htmTable += "<td>" + model["cummalefemaleculls"] + "</td>"
                htmTable += "<td>" + model["malemortality"] + "</td>"
                htmTable += "<td>" + model["femalemortality"] + "</td>"
                htmTable += "<td>" + model["cummalefemalemortality"] + "</td>"
                htmTable += "<td>" + model["maleclosingbalance"] + "</td>"
                htmTable += "<td>" + model["femaleclosingbalance"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;
            var fromdate = this.getView().byId("txtFromDate").getValue();
            var todate = this.getView().byId("txtToDate").getValue();
            var batchname = this.batchsname;

            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);

            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##ReportFromDate##", fromdate);
            template = this.replaceStr(template, "##ReporToDate##", todate);
            template = this.replaceStr(template, "##BatchName##", batchname);
            return template;

        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("Breeder", "FlockDetailReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Flock Detail Report");
            });
        },


        // toDataURL: function (url, callback) {
        //     var xhr = new XMLHttpRequest();
        //     xhr.onload = function () {
        //         var reader = new FileReader();
        //         reader.onloadend = function () {
        //              callback(reader.result);
        //         }
        //         reader.readAsDataURL(xhr.response);
        //     };
        //     xhr.open('GET', url);
        //     xhr.responseType = 'blob';
        //     xhr.send();
        //     //}
        // },


        // onPdfExport: function (oEvent) {
        //     debugger;

        //     var that = this;
        //     //  map the bound data of the table to a pdfMake array

        //     var createListData = function () {

        //         var sumone = { count: 0, totalDistance: 0 };
        //         var fromdate = that.getView().byId("txtFromDate").getValue();
        //         var todate = that.getView().byId("txtToDate").getValue();

        //         var retone = [{
        //             columns: [
        //                 {
        //                     ul: [
        //                         fromdate,
        //                         todate
        //                     ]
        //                 }
        //             ]
        //         },
        //         ];
        //         return retone;
        //     };

        //     var createTableData = function () 
        //     {

        //         debugger;
        //         var sum = { count: 0, totalDistance: 0 };

        //         var mapArr = that.getView().byId("tblFlockReport").getItems().map(function (obj) {
        //             sum.count += 1;
        //             sum.totalDistance += Number.parseInt(obj.getCells()[13].getProperty("text"));
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
        //             }


        //             ];
        //             return ret;
        //         });

        //         // add a header to the pdf table
        //         mapArr.unshift(

        //             [{
        //                 text: "Date",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Shed Name   ",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Male Opening Balance",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Female Opening Balance",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Male Transfer Quantity",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Female Transfer Quantity",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Male Culls",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Female Culls",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Cumulative Male/Female Culls",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Male Mortality",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Female Mortality",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Cumulative Male/Female Mortality",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Male Closing Balance",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Female Closing Balance",
        //                 style: 'tableHeader'
        //             }

        //             ]
        //         );
        //         // add a summary row at the end

        //         mapArr.push([

        //             { text: ""},
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
        //                 image: this.imagepath,
        //                 width: 150,
        //                 margin: [380, -30, 0, 0]
        //             },


        //             {
        //                 text: "LogicalDNA",
        //                 style: 'hone',
        //                 margin: [0, -60, 0, 6],
        //             },
        //             {
        //                 text: "LogicalDNA Group Of Companies",
        //                 style: 'htwo',

        //             },
        //             {
        //                 text: "Ground Floor, Unit 003, Pentagon 1",
        //                 style: 'htwo'
        //             },
        //             {
        //                 text: "Magarpatta Cyber City",
        //                 style: 'htwo'
        //             },
        //             {
        //                 text: "Hadpsar Pune 411028",
        //                 style: 'htwo'
        //             },
        //             {
        //                 text: "Maharashtra, India",
        //                 style: 'htwo'
        //             },
        //             {
        //                 text: "Mobile No: +91 985 097 7384 (INDIA)",
        //                 style: 'htwo'
        //             },
        //             {
        //                 text: "Email: hr@logicaldnacom",
        //                 style: 'htwo',
        //                 margin: [0, 0, 0, 14]
        //             },
        //             {
        //                 // text: "LogicalDNA",
        //                 title: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Logical DNA'),
        //                 text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Flock Detail Report'),
        //                 //textone: 'Bill Of Material',
        //                 style: 'title',
        //                 margin: [0, 100, 150, 10]
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
        //                 margin: [60, -23, 0, 14]

        //             },


        //             {
        //                 table: {
        //                     headerRows: 1,
        //                     widths: [30,30,30,30,20,20,20,20,30,30,30,30,30,30],
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
        //                 fontSize: 12,
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

            var fromdate = this.getView().byId("txtFromDate").getValue();
            var todate = this.getView().byId("txtToDate").getValue();
            var batchname = this.batchsname;
            var filename =fromdate+'_'+todate+'_'+batchname;
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
                        name: "Date",
                        template: { content: "{date}" }
                    },
                    {
                        name: "Age In Week",
                        template: { content: "{weekno}" }
                    },
                    {
                        name: "Shed Name",
                        template: { content: "{shedname}" }
                    },
                    {
                        name: "Male Opening Balance",
                        template: { content: "{maleopeningbalance}" }
                    },
                    {
                        name: "Female Opening Balance",
                        template: { content: "{femaleopeningbalance}" }
                    },
                   
                    {
                        name: "Male Transfer In Quantity",
                        template: { content: "{maletransferedinquantity}" }
                    },
                    {
                        name: "Male Transfer Quantity",
                        template: { content: "{maletransferedquantity}" }
                    },
                    {
                        name: "Female Transfer In  Quantity",
                        template: { content: "{femaletransferedinquantity}" }
                    },
                    {
                        name: "Female Transfer  Quantity",
                        template: { content: "{femaletransferedquantity}" }
                    },
                   
                    {
                        name: "Male Culls",
                        template: { content: "{maleculls}" }
                    },
                    {
                        name: "Female Culls",
                        template: { content: "{femaleculls}" }
                    },
                    {
                        name: "Cumulative Male/Female Culls",
                        template: { content: "{cummalefemaleculls}" }
                    },

                    {
                        name: "Male Mortality",
                        template: { content: "{malemortality}" }
                    },
                    {
                        name: "Female Mortality",
                        template: { content: "{femalemortality}" }
                    },
                    {
                        name: "Cumulative Male/Female Mortality",
                        template: { content: "{cummalefemalemortality}" }
                    },

                    {
                        name: "Male Closing Balance",
                        template: { content: "{maleclosingbalance}" }
                    },
                    {
                        name: "Female Closing Balance",
                        template: { content: "{femaleclosingbalance}" }
                    },]


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
