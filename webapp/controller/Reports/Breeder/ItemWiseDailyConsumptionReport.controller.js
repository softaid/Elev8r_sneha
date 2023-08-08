sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/BreederReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service'

], function (JSONModel, BaseController, MessageToast, MessageBox, Export, ExportTypeCSV, commonFunction, breederReportsService, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Breeder.ItemWiseDailyConsumptionReport", {

        currentContext: null,
        onInit: function () {

            // fun for PDF img
            var currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");
            // set location model
            var moduleids = 721;
            commonFunction.getLocations(this, moduleids);

            // set empty model to view 
            var emptyModel = this.getModelDefault();

            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "dailyconsumptionModel");
            this.getAllBreederSettingData();
            this.getView().byId("txtdownload").setVisible(false);


        },

        getModelDefault: function () {
            return {
                breederbatchid: null,
                fromdate: null,
                todate: null,
                itemid: null
            }
        },

        getAllBreederSettingData: function () {
            var currentContext = this;
            var itemgropIDS = [];

            commonService.getBreederSetting(function (data) {
                if (data[0].length > 0) {
                    var feeditemgroupids = data[0][0].feeditemgroupids;
                    var medicineitemgroupids = data[0][0].medicineitemgroupids;
                    var vaccineitemgroupids = data[0][0].vaccineitemgroupids;
                    var vitaminitemgroupids = data[0][0].vitaminitemgroupids;
                    itemgropIDS = [feeditemgroupids, medicineitemgroupids, vaccineitemgroupids, vitaminitemgroupids]

                    commonFunction.getItemsByItemGroups(itemgropIDS, currentContext, "itemList");

                }
            })
        },



        handleSelectionFinish: function (oEvt) {
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedKeys = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedKeys.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });

            }
            var location = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                location.push(selectedKeys[i].key);
            }

            this.locationname = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                this.locationname.push(selectedKeys[i].text);
            }
            this.getView().byId("locationtbl").setValueState(sap.ui.core.ValueState.None);
            this.getLocationwisebreederbatches(location);
        },


        handleBrdBatchValueHelp: function (oEvent) {
            var sInputValue = oEvent.getSource().getValue();
            this.inputId = oEvent.getSource().getId();

            // create value help dialog
            this._valueHelpDialog = sap.ui.xmlfragment(
                "sap.ui.elev8rerp.componentcontainer.fragmentview.Common.BreederBatchDialog",
                this
            );
            this.getView().addDependent(this._valueHelpDialog);

            // open value help dialog filtered by the input value
            this._valueHelpDialog.open(sInputValue);
        },

        handleBreederBatchSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var columns = ['batchname', 'locationname', 'warehousename'];
            var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
            }),
                false);  // false for OR condition
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        onBreederBatchDialogClose: function (oEvent) {
            var currentContext = this;
            var aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts != undefined) {
                var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });

                var oModel = currentContext.getView().getModel("dailyconsumptionModel");
                //update existing model to set locationid
                oModel.oData.breederbatchid = selRow[0].id;
                oModel.oData.batchname = selRow[0].batchname;
                oModel.oData.placementdate = selRow[0].placementdate;
                oModel.oData.fromdate = selRow[0].placementdate;


                oModel.refresh();
                this.getView().byId("batchtb1").setValueState(sap.ui.core.ValueState.None);


            } else {

            }
        },

        getLocationwisebreederbatches: function (location) {
            var currentContext = this;
            breederReportsService.getLocationwisebreederbatches({ locationid: location }, function (data) {

                var oBatchModel = new sap.ui.model.json.JSONModel();
                oBatchModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oBatchModel, "breederBatchList");
            });
        },

        resetModel: function () {
            var tbleModel = this.getView().getModel("dailyconsumptionModel");
            tbleModel.setData({ modelData: [] });

        },
        ongetDate: function () {

            var isValid = true
            var oModel = this.getView().getModel("dailyconsumptionModel").oData

            var fromDate = oModel.fromdate;
            var todate = oModel.todate;
            var placementdate = oModel.placementdate;


            if (fromDate) {
                // var parts1 = fromDate.split('-');

                // fromDate = Date.parse(new Date(parts1[2], parts1[1], parts1[0]));
                var date1 = Date.parse(fromDate);
                this.getView().byId("txtFromdate").setValueState(sap.ui.core.ValueState.None);
            }
            if (placementdate) {
                // var parts3 = placementdate.split('-');

                // placementdate = Date.parse(new Date(parts3[2], parts3[1], parts3[0]));
                var date2 = Date.parse(placementdate);

            }
            if (date2 > date1) {
                MessageBox.error("From Dtae grater than placment date.");
                isValid = false;
            }
            if (todate) {

                // var parts2 = todate.split('-');

                // todate = Date.parse(new Date(parts2[2], parts2[1], parts2[0]));
                var date3 = Date.parse(todate);
                this.getView().byId("txtTodate").setValueState(sap.ui.core.ValueState.None);
            }


            if (date3 < date1) {
                MessageBox.error("From Date less than todate date");
                isValid = false;
            }
            return isValid
        },

        onSearchData: function () {
            if (this.validateForm()) {
                var currentContext = this;
                currentContext.itemname = this.getView().byId("txtitemName").getSelectedItem();

                var oModel = this.getView().getModel("dailyconsumptionModel").oData;
                var itemid = this.getView().byId("txtitemName").getSelectedKey();
                if (!itemid) {
                    itemid = null;
                }
               
                var oModel = {
                    itemid: itemid,
                    batchid: oModel.breederbatchid,
                    fromdate: commonFunction.getDate(this.getView().byId("txtFromdate").getValue()),
                    todate: commonFunction.getDate(this.getView().byId("txtTodate").getValue()),
                    companyid: commonFunction.session("companyId")
                }

                breederReportsService.getItemWisedailyconsumptionReport(oModel, function (data) {
                    if (data.length > 0) {
                        var oModel = new sap.ui.model.json.JSONModel();
                        oModel.setData({ modelData: data[0] });
                        currentContext.getView().setModel(oModel, "itemWiseDailyconsumpReportModel");

                    }
                });
            }
            this.getView().byId("txtdownload").setVisible(true);

        },

         validateForm: function () {
            var isValid = true;

            if (!commonFunction.ismultiComRequired(this, "locationtbl", "Location is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "batchtb1", "batch is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtFromdate", "From Date is required"))
                isValid = false;
            if (!commonFunction.isRequired(this, "txtTodate", "To Date is required"))
                isValid = false;
            // if (!this.ongetDate())
            //     isValid = false;
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

        //     var createListData = function () {



        //         var sumone = { count: 0, totalDistance: 0 };
        //         var Items = that.locationname;

        //         var fromdate = that.getView().byId("txtFromdate").getValue();
        //         var todate = that.getView().byId("txtTodate").getValue();
        //         var batch = that.getView().byId("batchtb1").getValue();
        //         var item = that.itemname.mProperties.text;
        //         // var shed =that.shedname.mProperties.text;

        //         var mapArrone = Items.map(function (objone) {


        //             sumone.count += 1;
        //             sumone.totalDistance += Number.parseInt(Items);

        //             var retone = [{
        //                 columns: [
        //                     {
        //                         ul: [
        //                             objone,
        //                             batch,
        //                             item,
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



        //     var createTableData = function () {

        //         var sum = { count: 0, totalDistance: 0 };

        //         var mapArr = that.getView().byId("tblDailyConsumption").getItems().map(function (obj) {
        //             sum.count += 1;
        //             sum.totalDistance += Number.parseInt(obj.getCells()[7].getProperty("text"));
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
        //                 text: "Week No",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Daily Transaction ID",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Item Code",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Item Name",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Isse Quantity",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Rate",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Issue Amount",
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

        //             // {
        //             //     image: this.imagepath,
        //             //     width: 150,
        //             //     margin: [380, -30, 0, 0]
        //             // },



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
        //                 // text: "LogicalDNA",
        //                 title: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Logical DNA'),
        //                 text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Item wise Daily Consumption Report'),
        //                 //textone: 'Bill Of Material',
        //                 style: 'title',
        //                 margin: [0, 100, 150, 10]
        //             },
        //             {
        //                 text: "Location Name:",
        //                 style: 'filter',
        //                 bold: true
        //             },
        //             {
        //                 text: "Batch Name:",
        //                 style: 'filter',
        //                 bold: true
        //             },
        //             {
        //                 text: "Shed Name:",
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
        //                 margin: [70, -58, 0, 14]

        //             },


        //             {
        //                 table: {
        //                     headerRows: 1,
        //                     widths: [60, 40, 40, 40, 60, 60, 60, 60],
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


        handlePrint: function (oEvent) {
            var fullHtml = "";
            var fullHtml1 = "";
            var fullHtml2 = "";
            var fullHtml3 = "";
            var createInvoice = this.getView().getModel('itemWiseDailyconsumpReportModel');
            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var batchname = this.getView().byId("batchtb1").getValue();
            var itemname = this.itemname.mProperties.text;
            var location = this.locationname;

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;

            var invoice = createInvoice.oData.modelData;
            var headertable1 = "<table  border='1' style='margin-top:150px;width: 1000px;' align='center'>" +
                "<caption style='color:black;font-weight: bold;font-size: large;'></caption>" +
                "<tr><th style='color:black'>Date</th>" +
                "<th style='color:black'>Week No</th>" +
                "<th style='color:black'>Daily Transaction ID</th>" +
                "<th style='color:black'>Opening Balance Female</th>" +
                "<th style='color:black'>Item Code</th>" +
                "<th style='color:black'>Item Name</th>" +
                "<th style='color:black'>Isse Quantity</th>" +
                "<th style='color:black'>Rate</th>" +
                "<th style='color:black'>Issue Amount</th>></tr>" 

               
             var titile1= "<table  style='margin-top:50px;width:800px;' align='center'>" +
            "<caption style='color:black;font-weight: bold;font-size: large;'>Item Wise Daily Consumption Report</caption>" 
   

             var batchname1= "<table  style='margin-top:60px;width: 800px;' align='left'>" +
             "<caption style='color:black;font-weight: bold;font-size: large;'></caption>" 

             var header= "<table  style='margin-top:-60px;width: 500px;' align='left'; padding: 0px;font-size: 14px;margin: 0;line-height:1;cellpadding=0px; cellspacing=0px>" +
             "<caption style='color:black;font-weight: bold;font-size: large;'></caption>"

             header +=    "<tr>" +"<th align='left'> CompanyName </th>"+"<td align='left'>" + companyname + "</td>"+"</tr>"+
                          "<tr>" +"<th align='left'> Companycontact </th>" +"<td align='left'>" + companycontact + "</td>"+"<br>"+"</tr>"+
                          "<tr>" +"<th align='left'> Email </th>"+"<td align='left'>" + companyemail + "</td>"+"<br>"+"</tr>"+
                          "<tr>" +"<th align='left'> Address </th>" +"<td align='left'>" + address + "</td>"+"<br>"+"</tr>"+
                          "<tr>" +"<th align='left'> PinCode </th>"+"<td align='left'>" + pincode + "</td>"+"<br>"+"</tr>";
         
           
             batchname1 += "<tr>" +"<th align='left'>From Date </th>"+"<td align='left'>" + fromdate + "</td>"+ 
                           "<th align='right'> To Date </th>"+"<td align='right'>" + todate + "</td>"+"<br>"+"</tr>"+
                           "<tr>" +"<th align='left'> Item Name </th>" +"<td align='left'>" + itemname + "</td>"+ 
                           "<th align='right'> Batch Name </th>" +"<td align='right'>" + batchname + "</td>"+"<br>"+"</tr>"+
                           "<tr>"+"<th align='Left'>Location Name </th>" +"<td align='left'>" + location + "</td>"+"<br>"+"</tr>";
       
               
            //Adding row dynamically to student table....

            for (var i = 0; i < invoice.length; i++) {
                headertable1 += "<tr>" +
                    "<td>" + invoice[i].transactiondate + "</td>" +
                    "<td>" + invoice[i].weekno + "</td>" +
                    "<td>" + invoice[i].dailytransactionno + "</td>" +
                    "<td>" + invoice[i].itemcode + "</td>" +
                    "<td>" + invoice[i].itemname + "</td>" +
                    "<td>" + invoice[i].issueqty + "</td>" +
                    "<td>" + invoice[i].rate + "</td>" +
                    "<td>" + invoice[i].issueamount + "</td>" +
                    "</tr>";
            }

            header += "</table>";
            fullHtml3 += header;
           
            titile1 += "</table>";
            fullHtml2 += titile1;

            batchname1 += "</table>";
            fullHtml1 += batchname1;

            headertable1 += "</table>";
            fullHtml += headertable1;
           
            var wind = window.open("", "prntExample");
            wind.document.write(fullHtml3);
            wind.document.write(fullHtml2);
            wind.document.write(fullHtml1);
            wind.document.write(fullHtml);
            
            wind.print();
            wind.close();
            win.stop();
        },



        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var batchname = this.getView().byId("batchtb1").getValue();
            var itemname = this.itemname.mProperties.text;
            var location = this.locationname;

    
            var filename =fromdate+'_'+todate+'_'+location+'_'+batchname+'_'+itemname;

            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/



            var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ","
                }),

                // Pass in the model created above
                models: this.getView().getModel("itemWiseDailyconsumpReportModel"),

                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content

                columns: [
                    {
                        name: "Week No",
                        template: { content: "{weekno}" }
                    },
                    {
                        name: "Date",
                        template: { content: "{transactiondate}" }
                    },
                    {
                        name: "Daily Transaction ID",
                        template: { content: "{dailytransactionno}" }
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
                        name: "Issue Quantity",
                        template: { content: "{issueqty}" }
                    },
                    {
                        name: "Rate",
                        template: { content: "{rate}" }
                    },
                    {
                        name: "Issue Amount",
                        template: { content: "{issueamount}" }
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
