sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/BreederReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',
    'sap/ui/elev8rerp/componentcontainer/services/Breeder/BreederOpeningBalance.service',


], function (JSONModel, BaseController, MessageToast, MessageBox, Export, ExportTypeCSV, commonFunction, breederReportsService, commonService, breederOpeningBalanceService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Breeder.FutureEggsCollectionReport", {

        currentContext: null,

        onInit: function () {

            // fun for PDF img
            var currentContext = this;
            // this.imagepath = null;
            // this.toDataURL('../images/logical.png', function (dataUrl) {
            //     currentContext.imagepath = dataUrl;
            // });
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");


            this.currentContext = this;
            // set location model
            var moduleids = 721;
            this.getLocations(this, moduleids);

            // set empty model to view 
            var emptyModel = this.getModelDefault();
            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "eggsCollRepModel");


        },


        getModelDefault: function () {
            return {
                breederbatchid: null,
                shedid: null,
                collectiondate: commonFunction.getDateFromDB(new Date()),

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
            
            var locationStr = "";

            for (var i = 0; i < location.length; i++) {
                if (i == 0)
                    locationStr = parseInt(location[i]);
                else
                    locationStr = locationStr + "," + parseInt(location[i]);
            }
            this.getBreederBatches(locationStr);
            this.getView().byId("locationtbl").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        getBreederBatches: function (location) {

            var currentContext = this;
            breederReportsService.gatAllBreederBatch({ locationid: location }, function (data) {

                if (data.length > 0) {
                    if (data[0].length > 0) {
                        var oBatchModel = new sap.ui.model.json.JSONModel();
                        oBatchModel.setData({ modelData: data[0] });
                        currentContext.getView().setModel(oBatchModel, "batchModel");
                                            } 
				else {
                        MessageBox.error("Brreder branch not available for this location")
                    }
                }


            });
        },
        batchChange: function () {
            var breederbatchid = this.getView().byId("batchtb1").getSelectedKey();

            this.getShedByBatchid(breederbatchid)
        },

        getShedByBatchid: function (breederbatchid) {
            var currentContext = this;
            breederReportsService.getShedByBatchid({ breederbatchid: breederbatchid }, function (data) {
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        var oBatchModel = new sap.ui.model.json.JSONModel();
                        oBatchModel.setData({ modelData: data[0] });
                        currentContext.getView().setModel(oBatchModel, "shedModel");
                    } else {
                        MessageBox.error("Breeder Shed not available for this branch.")
                    }
                }
            });
        },


        onSearchData: function () {

            if (this.validateForm()) {
                var currentContext = this;
                currentContext.batchname = this.getView().byId("batchtb1").getSelectedItem();
                currentContext.shedname = this.getView().byId("shedtb1").getSelectedItem();
               
                var batchid = this.getView().byId("batchtb1").getSelectedKey();
                var shedid = this.getView().byId("shedtb1").getSelectedKey();
                var fromdate = this.getView().byId("txtFromdate").getValue();
                var todate = this.getView().byId("txtTodate").getValue()



                var FModel = {
                    breederbatchid: batchid,
                    shedid: shedid,
                    fromdate: commonFunction.getDate(fromdate),
                    todate: commonFunction.getDate(todate),
                    companyid: commonFunction.session("companyId")
                }
                breederReportsService.getFutureEggsCollection(FModel, function (data) {
                    
                    var FModel = new sap.ui.model.json.JSONModel();
                    FModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(FModel, "eggscollectionReport");


                });

            }

        },


        onDateChange: function () {
            var fDate = this.getView().byId("txtFromdate").getValue();

            var currentContext = this;
            var batchid = this.getView().byId("batchtb1").getSelectedKey();
            var shedid = this.getView().byId("shedtb1").getSelectedKey();
            var oModel = {
                breederbatchid: batchid,
                shedid: shedid,
                collectiondate: commonFunction.getDate(fDate),
                companyid: commonFunction.session("companyId")
            }
            breederReportsService.getEggscollectiontilldate(oModel, function (data) {
                var oModel = new sap.ui.model.json.JSONModel();
                var placementdate = data[0][0].placementdate;
                var currentweek = data[0][0].weekno;
                oModel.setData(data[0][0]);
                currentContext.getView().setModel(oModel, "currentEggscollectionModel");
                currentContext.getView().byId("txtFromweek").setValue(data[0][0].weeknowithdays);

            });
        },

        onFromDateChange: function () {
            var currentContext = this;
            var toDate = this.getView().byId("txtTodate").getValue();
            var oModel = this.getView().getModel("currentEggscollectionModel").oData;
            var fromweek = null;
            var toweek = null;
            if (oModel.days > 0) {
                fromweek = parseInt(oModel.weekno) + 1;
            } else {
                fromweek = parseInt(oModel.weekno);
            }
            var toageinweek = null;
            var toageindays = null;
            if (toDate) {
                breederOpeningBalanceService.getAgeInDays({ batchplacementdate: commonFunction.getDate(oModel.placementdate), livebatchdate: commonFunction.getDate(toDate) }, function (data) {

                    var daydiff = data[0][0].ageindays + 1;
                    toageinweek = parseInt(daydiff / 7);
                    toageindays = parseInt(daydiff % 7);
                    if (toageindays > 0) {
                        toweek = toageinweek + 1;
                    } else {
                        toweek = toageinweek;
                    }
                    var toweeknowithdays = toageinweek + "-Week" + toageindays + '-days';
                        if (toweek >= fromweek) {
                        currentContext.getView().byId("txtToWeek").setValue(toweeknowithdays);
                        currentContext.getView().byId("txtTodate").setValueState(sap.ui.core.ValueState.None);
                    } else {
                        MessageBox.error("To week is always grater than from week.")
                    }
                });

            }
        },

        validateForm: function () {
            var isValid = true;

            if (!commonFunction.ismultiComRequired(this, "locationtbl", "location is required"))
                isValid = false;

            if (!commonFunction.isSelectRequired(this, "batchtb1", "batch is required"))
                isValid = false;

            if (!commonFunction.isSelectRequired(this, "shedtb1", "shed is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtFromdate", "From Date is required"))
                isValid = false;
            if (!commonFunction.isRequired(this, "txtTodate", "To Date is required"))
                isValid = false;

            // if (!this.onFromDateChange())
            //     isValid = false;

            return isValid;
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
            var companyname = that.companyname;
            //  map the bound data of the table to a pdfMake array

            var createListData = function () {


                var sumone = { count: 0, totalDistance: 0 };
                var Items = that.locationname;

                var fromdate = that.getView().byId("txtFromdate").getValue();
                var todate = that.getView().byId("txtTodate").getValue();
                var batch = that.batchname.mProperties.text;
                var shed = that.shedname.mProperties.text;

                var mapArrone = Items.map(function (objone) {


                    sumone.count += 1;
                    sumone.totalDistance += Number.parseInt(Items);

                    var retone = [{
                        columns: [
                            {
                                ul: [
                                    objone,
                                    batch,
                                    shed,
                                    fromdate,
                                    todate
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

                var mapArr = that.getView().byId("tblEggscollection").getItems().map(function (obj) {
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
                        text: "Week No",
                        style: 'tableHeader'
                    },
                    {
                        text: "Expected Eggs Collection",
                        style: 'tableHeader'
                    },
                    {
                        text: "Expected Hatching Eggs",
                        style: 'tableHeader'
                    },
                    {
                        text: "Exp Hatching Eggs %",
                        style: 'tableHeader'
                    }
                    ]
                );
                // add a summary row at the end

                mapArr.push([

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
                        text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Future Eggs Collection Report'),
                        //textone: 'Bill Of Material',
                        style: 'title',
                        margin: [0, 100, 150, 10]
                    },
                    {
                        text: "Location Name:",
                        style: 'filter',
                        bold: true
                    },
                    {
                        text: "Batch Name:",
                        style: 'filter',
                        bold: true
                    },
                    {
                        text: "Shed Name:",
                        style: 'filter',
                        bold: true
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

                            createListData(),

                        ],
                        style: 'filter',
                        margin: [70, -58, 0, 14]

                    },


                    {
                        table: {
                            headerRows: 1,
                            widths: [100, 100, 100, 100],
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
                        type: 'none',
                        ul: [

                            createCompanyName(),

                        ],
                        style: 'bottom',
                        margin: [422, 30, 0, 14]

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
                        fontSize: 10,
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

            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/


            var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ","
                }),

                // Pass in the model created above
                models: this.currentContext.getView().getModel("eggscollectionReport"),


                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content

                columns: [

                    {
                        name: "Week No",
                        template: { content: "{ageinweek}" }
                    },
                    {
                        name: "Expected Eggs Collection",
                        template: { content: "{expeggscollection}" }
                    },
                    {
                        name: "Expected Hatching Eggs",
                        template: { content: "{exphatchingeggs}" }
                    },
                    {
                        name: "Exp Hatching Eggs %",
                        template: { content: "{exphatchingeggsper}" }
                    },
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
