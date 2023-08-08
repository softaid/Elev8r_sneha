sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/BreederReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service'

], function (JSONModel, BaseController, MessageBox, Export, ExportTypeCSV, commonFunction, breederReportsService, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Breeder.DailyConsumptionReport", {

        currentContext: null,

        onInit: function () {

            // this.currentContext = this;

            var currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");

            //     this.imagepath = null;
            //    this.toDataURL('../images/logical.png', function (dataUrl) {
            //        currentContext.imagepath = dataUrl;
            //    });

            // set location model
            var moduleids = 721;
            this.getLocations(this, moduleids);

            // set empty model to view 
            var emptyModel = this.getModelDefault();

            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "dailyconsumptionModel");

            var cmblocation = this.getView().byId("locationtbl");
            cmblocation.onAfterRenderingPicker = function () {
                if (sap.m.MultiComboBox.prototype.onAfterRenderingPicker) {
                    sap.m.MultiComboBox.prototype.onAfterRenderingPicker.apply(this);
                }
            }
            this.getView().byId("txtdownload").setVisible(false);
        },

        getModelDefault: function () {
            return {
                breederbatchid: null,
                fromdate: null,
                todate: null
            }
        },
        getLocations: function (currentContext, moduleids) {
            commonService.getLocations({ moduleids: moduleids }, function (data) {
                var oLocationModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "locationname": "Select All" });
                    } else {
                        MessageBox.error("location not availabel.")
                    }
                }

                oLocationModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oLocationModel, "locationList");
            });
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
            console.log("this.locationname", this.locationname);

            var locationStr = "";

            for (var i = 0; i < location.length; i++) {
                if (i == 0)
                    locationStr = parseInt(location[i]);
                else
                    locationStr = locationStr + "," + parseInt(location[i]);
            }
            this.getLocationwisebreederbatches(locationStr);
            this.getView().byId("locationtbl").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
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






        getLocationwisebreederbatches: function (location) {
            var currentContext = this;
            breederReportsService.getLocationwisebreederbatches({ locationid: location }, function (data) {
                if (data[0].length > 0) {
                    data[0].unshift({ "id": "All", "batchname": "Select All" });
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

            console.log("selectedbatches",selectedbatches);

            if (selectedbatches[i].key == "ALL") {

                selectedbatches = selectedbatches.slice(0, -1);
            }
            console.log("selectedbatches",selectedbatches);

            var batchs = [];
            for (var i = 0; i < selectedbatches.length; i++) {
                batchs.push(selectedbatches[i].key);
            }

            this.batchsname = [];
            for (var i = 0; i < selectedbatches.length; i++) {
                this.batchsname.push(selectedbatches[i].text);
            }
            console.log("this.batchsname:", this.batchsname);

            var batchesStr = "";

            for (var i = 0; i < batchs.length; i++) {
                if (i == 0)
                    batchesStr = parseInt(batchs[i]);
                else
                    batchesStr = batchesStr + "," + parseInt(batchs[i]);
            }

            var oModel = this.getView().getModel("dailyconsumptionModel");
            //update existing model to set locationid
            oModel.oData.breederbatchid = batchesStr

            oModel.refresh();
            this.getView().byId("batchtb1").setValueState(sap.ui.core.ValueState.None);

            oModel.refresh();
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        resetModel: function () {
            var tbleModel = this.getView().getModel("dailyconsumpReportModel");
            tbleModel.setData({ modelData: [] });

        },
        ongetDate: function () {
            var isValid = true
            var oModel = this.getView().getModel("dailyconsumptionModel").oData

            var fromDate = oModel.fromdate;
            var todate = oModel.todate;

            if (fromDate) {
                // var parts1 = fromDate.split('-');

                // fromDate = Date.parse(new Date(parts1[2], parts1[1], parts1[0]));
                var date1 = Date.parse(fromDate);
                this.getView().byId("txtFromdate").setValueState(sap.ui.core.ValueState.None);
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
                var oModel = this.getView().getModel("dailyconsumptionModel").oData


                var oModel = {
                    batchid: oModel.breederbatchid,
                    fromdate: commonFunction.getDate(this.getView().byId("txtFromdate").getValue()),
                    todate: commonFunction.getDate(this.getView().byId("txtTodate").getValue()),
                    companyid: commonFunction.session("companyId")
                }

                breederReportsService.getdailyconsumptionReport(oModel, function (data) {
                    console.log("getdailyconsumptionReport", data);
                    if (data.length > 0) {

                        for (var i = 0; i < data[0].length; i++) {

                            data[0][i]["closingbalance"] = (data[0][i]["openingbalance"] + data[0][i].receivedquantity) - (data[0][i].outquantity + data[0][i].consumedquantity);

                            if (i == data[0].length - 1) {
                                var oModel = new sap.ui.model.json.JSONModel();
                                oModel.setData({ modelData: data[0] });
                                currentContext.getView().setModel(oModel, "dailyconsumpReportModel");
                            }
                        }
                    }
                });
            }
            this.getView().byId("txtdownload").setVisible(true);
        },

        validateForm: function () {
            var isValid = true;

            if (!commonFunction.ismultiComRequired(this, "locationtbl", "Location is required"))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "batchtb1", "batch is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtFromdate", "From Date is required"))
                isValid = false;
            if (!commonFunction.isRequired(this, "txtTodate", "To Date is required"))
                isValid = false;
            if (!this.ongetDate())
                isValid = false;
            return isValid;
        },

        replaceStr: function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },

        // Function Used For PDF Download

        replaceTemplateData: function (template) {
            // Item table Data --------------

            var tbleModel = this.getView().getModel("dailyconsumpReportModel").oData.modelData;
            console.log("tbleModel", tbleModel);


            var htmTable = "";
            for (var indx in tbleModel) {
                var model = tbleModel[indx];
                // Replace/create column sequence data table
                htmTable += "<tr>";
                htmTable += "<td align='center'>" + model["groupname"] + "</td>"
                htmTable += "<td>" + model["itemname"] + "</td>"
                htmTable += "<td align='right'>" + model["date"] + "</td>"
                htmTable += "<td align='right'>" + model["openingbalance"] + "</td>"
                htmTable += "<td>" + model["receivedquantity"] + "</td>"
                htmTable += "<td>" + model["outquantity"] + "</td>"
                htmTable += "<td>" + model["consumedquantity"] + "</td>"
                htmTable += "<td>" + model["cumconsumedquantity"] + "</td>"
                htmTable += "<td>" + model["closingbalance"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;

            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var location = this.locationname;
            var batchname = this.batchsname;


            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);


            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##ReportFromDate##", fromdate);
            template = this.replaceStr(template, "##ReporToDate##", todate);
            template = this.replaceStr(template, "##LocationName##", location);
            template = this.replaceStr(template, "##BatchName##", batchname);

            return template;

        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("Breeder", "DailyConsumptionReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Daily Consumption Report");
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
        //     // debugger;

        //     var that = this;
        //     //  map the bound data of the table to a pdfMake array


        //     var createListData = function () {
        //         // debugger;


        //         var sumone = { count: 0, totalDistance: 0 };
        //         var Items = that.locationname;

        //         var fromdate = that.getView().byId("txtFromdate").getValue();
        //         var todate = that.getView().byId("txtTodate").getValue();
        //         var batchname = that.batchsname;


        //         var mapArrone = Items.map(function (objone) {


        //             sumone.count += 1;
        //             sumone.totalDistance += Number.parseInt(Items);

        //             var retone = [{
        //                 columns: [
        //                     {
        //                         ul: [
        //                             objone,
        //                             batchname,
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
        //                  columns: [
        //                      {   
        //                          type: 'none',
        //                          ul: [
        //                              companyname

        //                          ]
        //                      }
        //                  ]
        //              },
        //          ];
        //          return retthree
        //      };


        //        var createListDataHeader = function () {
        //              var sumtwo = { count: 0, totalDistance: 0 };

        //             var companycontact = that.companycontact;
        //             var companyemail = that.companyemail;
        //             var address = that.address;
        //             var pincode = that.pincode;


        //                  var rettwo = [{
        //                      columns: [

        //                          {   
        //                              type: 'none',
        //                              ul: [
        //                                  address,
        //                                  pincode,
        //                                  companycontact,
        //                                  companyemail,


        //                              ]
        //                          }
        //                      ]
        //                  },
        //                  ];
        //                  return rettwo;

        //          };


        //     var createTableData = function () 
        //     {

        //         // debugger;
        //         var sum = { count: 0, totalDistance: 0 };

        //         var mapArr = that.getView().byId("tblDailyConsumption").getItems().map(function (obj) {
        //             sum.count += 1;
        //             sum.totalDistance += Number.parseInt(obj.getCells()[8].getProperty("text"));
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
        //             }

        //             ];
        //             return ret;
        //         });

        //         // add a header to the pdf table
        //         mapArr.unshift(

        //             [{
        //                 text: "Group Name",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Item Name",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Date",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Opening Balance",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Recived Quantity",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Out Quantity",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Consume Quantity",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Cumulative Consumption",
        //                 style: 'tableHeader'
        //             },
        //             {
        //                 text: "Closing Balance",
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
        //                 text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Daily Consumption Report'),
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
        //                     widths: [60,60,60,60,40,40,40,40,40],
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
            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var location = this.locationname;
            var batchname = this.batchsname;

            var filename =fromdate+'_'+todate+'_'+location+'_'+batchname;



            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/


                var currentContext = this;
            var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ","
                }),

                // Pass in the model created above
                models: currentContext.getView().getModel("dailyconsumpReportModel"),

                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content

                columns: [
                    {
                        name: "Group Name",
                        template: { content: "{groupname}" }
                    },
                    {
                        name: "Item Name",
                        template: { content: "{itemname}" }
                    },
                    {
                        name: "Date",
                        template: { content: "{date}" }
                    },
                    {
                        name: "Opening Balance",
                        template: { content: "{openingbalance}" }
                    },
                    {
                        name: "Recived Quantity",
                        template: { content: "{receivedquantity}" }
                    },
                    {
                        name: "Out Quantity",
                        template: { content: "{Out Quantity}" }
                    },
                    {
                        name: "Consume Quantity",
                        template: { content: "{consumedquantity}" }
                    },
                    {
                        name: "Cummulative Consumption",
                        template: { content: "{cumconsumedquantity}" }
                    },
                    {
                        name: "Closing Balance",
                        template: { content: "{closingbalance}" }
                    },
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
