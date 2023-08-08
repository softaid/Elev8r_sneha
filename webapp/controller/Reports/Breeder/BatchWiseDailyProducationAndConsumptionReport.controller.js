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

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Breeder.BatchWiseDailyProducationAndConsumptionReport", {

        currentContext: null,

        onInit: function () {

            // Function for PDF image
            var currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");

            this.currentContext = this;
            var moduleids = 721;
            this.getLocations(this, moduleids);

            // set empty model to view 
            var emptyModel = this.getModelDefault();
            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "dailybrodGrowModel");
            this.getView().byId("txtdownload").setVisible(false);

        },

        getModelDefault: function () {
            return {
                breederbatchid: null,
                shedid: null,
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
                "sap.ui.elev8rerp.componentcontainer.fragmentview.BreederReports.BreederbatchDialog",
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

                var oModel = currentContext.getView().getModel("dailybrodGrowModel");
                //update existing model to set locationid
                oModel.oData.breederbatchid = selRow[0].id;
                oModel.oData.batchname = selRow[0].batchname
                oModel.oData.placementdate = selRow[0].placementdate

                oModel.refresh();
                this.getView().byId("textBatch").setValueState(sap.ui.core.ValueState.None);
                // get all shed by breederbatchid 
                currentContext.getbreedershed(selRow[0].id);

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
            // }
        },

        getbreedershed: function (breederbatchid) {
            var currentContext = this;
            breederReportsService.getbreedershed({ breederbatchid: breederbatchid }, function (data) {

                var oBatchModel = new sap.ui.model.json.JSONModel();
                oBatchModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oBatchModel, "shedModel");
            });
        },

        shedSelectionFinish: function (oEvt) {

            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedsheds = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedsheds.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });

            }

            this.shedname = [];
            for (var i = 0; i < selectedsheds.length; i++) {
                this.shedname.push(selectedsheds[i].text);
            }




            this.getView().byId("shedtb1").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }

            });
        },

        resetModel: function () {
            var tbleModel = this.getView().getModel("batchwisepronconReportModel");

            tbleModel.setData({ modelData: [] });

        },


        onSearchData: function () {
            if (this.validateForm()) {
                var currentContext = this;
                var oModel = this.getView().getModel("dailybrodGrowModel").oData

                var shedids = this.getView().byId("shedtb1").getSelectedKeys();



                var shedStr = "";

                for (var i = 0; i < shedids.length; i++) {
                    if (i == 0)
                        shedStr = parseInt(shedids[i]);
                    else
                        shedStr = shedStr + "," + parseInt(shedids[i]);

                }

                var fromdate = this.getView().byId("txtFromdate").getValue();
                var todate = this.getView().byId("txtTodate").getValue();


                var oModel = {

                    breederbatchid: oModel.breederbatchid,
                    shedid: shedStr,
                    fromdate: commonFunction.getDate(this.getView().byId("txtFromdate").getValue()),
                    todate: commonFunction.getDate(this.getView().byId("txtTodate").getValue()),
                    companyid: commonFunction.session("companyId")

                }



                breederReportsService.getbatchwisedailypronconReport(oModel, function (data) {



                    for (var i = 0; i < data[0].length; i++) {


                        data[0][i].commercialegg = data[0][i].itemid == 10 ? data[0][i].eddqty : "";
                        data[0][i].DoubleYolkegg = data[0][i].itemid == 11 ? data[0][i].eddqty : "";
                        data[0][i].crackedegg = data[0][i].itemid == 3 ? data[0][i].eddqty : "";
                        data[0][i].hatchingAegg = data[0][i].itemid == 199 ? data[0][i].eddqty : "";
                        data[0][i].hatchingBegg = data[0][i].itemid == 200 ? data[0][i].eddqty : "";
                        data[0][i].hatchingCegg = data[0][i].itemid == 204 ? data[0][i].eddqty : "";
                        // livedatabase items 
                        // data[0][i].liveAgrade = data[0][i].itemid == 168 ? data[0][i].eddqty : "";
                        // data[0][i].liveBgrade = data[0][i].itemid == 171 ? data[0][i].eddqty : "";
                        // data[0][i].livebrokenegg = data[0][i].itemid == 172 ? data[0][i].eddqty : "";
                        // data[0][i].livetableegg = data[0][i].itemid == 173 ? data[0][i].eddqty : "";
                        // data[0][i].livecrackedegg = data[0][i].itemid == 174 ? data[0][i].eddqty : "";
                        // data[0][i].livedamagedegg = data[0][i].itemid == 176 ? data[0][i].eddqty : "";
                        // data[0][i].livejumboegg = data[0][i].itemid == 287 ? data[0][i].eddqty : "";
                        // data[0][i].livewestageegg = data[0][i].itemid == 288 ? data[0][i].eddqty : "";
                        // localitems
                        // data[0][i].ABQuantityper = parseFloat((((data[0][i].itemid == 44 ? data[0][i].eddqty : "") + (data[0][i].itemid == 45 ? data[0][i].eddqty : "")) / (data[0][i].totalpro)) * 100).toFixed(2);
                        // data[0][i].tableeggs = data[0][i].itemid == 37 ? data[0][i].totalpro : "";
                        // data[0][i].crackedeggs = data[0][i].itemid == 3 ? data[0][i].totalpro : "";
                        // data[0][i].damagedeggs = data[0][i].itemid == 39 ? data[0][i].totalpro : "";

                    }



                    var oModel = new sap.ui.model.json.JSONModel();
                    oModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oModel, "batchwisepronconReportModel");


                });
            }
            this.getView().byId("txtdownload").setVisible(true);

        },


        validateForm: function () {
            var isValid = true;

            if (!commonFunction.ismultiComRequired(this, "locationtbl", "Location is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "textBatch", "Batch is required."))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "shedtb1", "Shed is required."))
                isValid = false;
            if (!commonFunction.isRequired(this, "txtFromdate", "From date is required"))
                isValid = false;
            if (!commonFunction.isRequired(this, "txtTodate", "To date is required"))
                isValid = false;


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

            var createListData = function () {
                var sumone = { count: 0, totalDistance: 0 };
                var Items = that.locationname;
                var shed = that.shedname;
                var batch = that.getView().byId("textBatch").getValue();
                var fromdate = that.getView().byId("txtFromdate").getValue();
                var todate = that.getView().byId("txtTodate").getValue();
                var location = that.getView().byId("locationtbl").getValue();

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
            var createTableData = function () {


                var sum = { count: 0, totalDistance: 0 };

                var mapArr = that.getView().byId("tblBatchdailypriconReport").getItems().map(function (obj) {
                    sum.count += 1;
                    sum.totalDistance += Number.parseInt(obj.getCells()[21].getProperty("text"));
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
                    },
                    {
                        text: obj.getCells()[7].getProperty("text"),
                        style: 'table',
                        fontSize: 8,
                        fonts: 'sans-serif'
                    },
                    {
                        text: obj.getCells()[8].getProperty("text"),
                        style: 'table',
                        fontSize: 8,
                        fonts: 'sans-serif'
                    },
                    {
                        text: obj.getCells()[9].getProperty("text"),
                        style: 'table',
                        fontSize: 8,
                        fonts: 'sans-serif'
                    },
                    {
                        text: obj.getCells()[10].getProperty("text"),
                        style: 'table',
                        fontSize: 8,
                        fonts: 'sans-serif'
                    },
                    {
                        text: obj.getCells()[11].getProperty("text"),
                        style: 'table',
                        fontSize: 8,
                        fonts: 'sans-serif'
                    },
                    {
                        text: obj.getCells()[12].getProperty("text"),
                        style: 'table',
                        fontSize: 8,
                        fonts: 'sans-serif'
                    },
                    {
                        text: obj.getCells()[13].getProperty("text"),
                        style: 'table',
                        fontSize: 8,
                        fonts: 'sans-serif'
                    },
                    {
                        text: obj.getCells()[14].getProperty("text"),
                        style: 'table',
                        fontSize: 8,
                        fonts: 'sans-serif'
                    },
                    {
                        text: obj.getCells()[15].getProperty("text"),
                        style: 'table',
                        fontSize: 8,
                        fonts: 'sans-serif'
                    },
                    {
                        text: obj.getCells()[16].getProperty("text"),
                        style: 'table',
                        fontSize: 8,
                        fonts: 'sans-serif'
                    },
                    {
                        text: obj.getCells()[17].getProperty("text"),
                        style: 'table',
                        fontSize: 8,
                        fonts: 'sans-serif'
                    },
                    {
                        text: obj.getCells()[18].getProperty("text"),
                        style: 'table',
                        fontSize: 8,
                        fonts: 'sans-serif'
                    },
                    {
                        text: obj.getCells()[19].getProperty("text"),
                        style: 'table',
                        fontSize: 8,
                        fonts: 'sans-serif'
                    },
                    {
                        text: obj.getCells()[20].getProperty("text"),
                        style: 'table',
                        fontSize: 8,
                        fonts: 'sans-serif'
                    },
                    {
                        text: obj.getCells()[21].getProperty("text"),
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
                        text: "age",
                        style: 'tableHeader'
                    },
                    {
                        text: "OpeniniStock F",
                        style: 'tableHeader'
                    },
                    {
                        text: "OpeniniStock M",
                        style: 'tableHeader'
                    },
                    {
                        text: "Mortality F",
                        style: 'tableHeader'
                    },
                    {
                        text: "Mortality M",
                        style: 'tableHeader'
                    },
                    {
                        text: "Closing Stock M",
                        style: 'tableHeader'
                    },
                    {
                        text: "Closing Stock F",
                        style: 'tableHeader'
                    },
                    {
                        text: "Production Egg Qty",
                        style: 'tableHeader'
                    },
                    {
                        text: "Production Eggs %",
                        style: 'tableHeader'
                    },
                    {
                        text: "STD Eggs Pro",
                        style: 'tableHeader'
                    },
                    {
                        text: "+/-",
                        style: 'tableHeader'
                    },
                    {
                        text: "Commercial Eggs",
                        style: 'tableHeader'
                    },
                    {
                        text: "Cracked Eggs",
                        style: 'tableHeader'
                    },
                    {
                        text: "Double Yolk Eggs",
                        style: 'tableHeader'
                    },
                    {
                        text: "Hatching Egg A",
                        style: 'tableHeader'
                    },
                    {
                        text: "Hatching Egg B",
                        style: 'tableHeader'
                    },
                    {
                        text: "Hatching Egg C",
                        style: 'tableHeader'
                    },
                    {
                        text: "Supervisior",
                        style: 'tableHeader'
                    },
                    {
                        text: "Total Feed Con M",
                        style: 'tableHeader'
                    },
                    {
                        text: "Total Feed Con F",
                        style: 'tableHeader'
                    },
                    {
                        text: "Feed Con Per Bird M",
                        style: 'tableHeader'
                    },
                    {
                        text: "Feed Con Per Bird F",
                        style: 'tableHeader'
                    }

                    ]
                );
                // add a summary row at the end

                mapArr.push([

                    { text: "" },
                    { text: "" },
                    { text: "" },
                    { text: "" },
                    { text: "" },
                    { text: "" },
                    { text: "" },
                    { text: "" },
                    { text: "" },
                    { text: "" },
                    { text: "" },
                    { text: "" },
                    { text: "" },
                    { text: "" },
                    { text: "" },
                    { text: "" },
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

                        title: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Logical DNA'),
                        text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Batchwise Daily Producation And Consumption Report'),

                        style: 'title',
                        margin: [0, 100, 150, 10]
                    },
                    {
                        text: "Location:",
                        style: 'filter',
                        bold: true
                    },
                    {
                        text: "Batch:",
                        style: 'filter',
                        bold: true
                    },
                    {
                        text: "Shed:",
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
                        margin: [60, -55, 0, 14]

                    },


                    {
                        table: {
                            headerRows: 1,
                            widths: [20, 20, 20, 20, 20, 20, 20, 10, 10, 10, 5, 5, 5, 5, 10, 10, 10, 20, 20, 20, 20, 20],
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

                var Items = this.locationname;
                var shed = this.shedname;
                var batch = this.getView().byId("textBatch").getValue();
                var fromdate = this.getView().byId("txtFromdate").getValue();
                var todate = this.getView().byId("txtTodate").getValue();
                var location = this.getView().byId("locationtbl").getValue();

                var filename =fromdate+'_'+todate+'_'+location+'_'+shed+'_'+batch+'_'+Items;


            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/


            var currentContext = this;
            var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ","
                }),

                // Pass in the model created above
                models: currentContext.getView().getModel("batchwisepronconReportModel"),

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
                        name: "Age In Days",
                        template: { content: "{age}" }
                    },

                    {
                        name: "Opening Balance Female",
                        template: { content: "{femaleopeningbalance}" }
                    },
		    {
                        name: "Transfer In Female",
                        template: { content: "{inqtyfemale}" }
                    },

		    {
                        name: "Opening Balance Male",
                        template: { content: "{maleopeningbalance}" }
                    },
		    {
                        name: "Transfer In Male",
                        template: { content: "{inqtymale}" }
                    },
                    {
                        name: "Male Mortality",
                        template: { content: "{malemortality}" }
                    },
		    {
                        name: "Male Culls",
                        template: { content: "{maleculls}" }
                    },

                    {
                        name: "Female Mortality",
                        template: { content: "{femalemortality}" }
                    },
		    {
                        name: "Female Culls",
                        template: { content: "{femaleculls}" }
                    },
                    {
                        name: "Closing Stock Male",
                        template: { content: "{maleclosingbalance}" }
                    },
                    {
                        name: "Closing Stock Female",
                        template: { content: "{femaleclosingbalance}" }
                    },
                    {
                        name: "Production Egg Quantity",
                        template: { content: "{production}" }
                    },
                    {
                        name: "Production Eggs %",
                        template: { content: "{productionper}" }
                    },
                    {
                        name: "Standared Eggs Production",
                        template: { content: "{Stdeggpro}" }
                    },
                    {
                        name: "Commercial Eggs",
                        template: { content: "{commercial}" }
                    },
                    {
                        name: "Cracked Eggs",
                        template: { content: "{crtacked}" }
                    },
                    {
                        name: "Double Yolk Eggs",
                        template: { content: "{doubleyolk}" }
                    },
                    {
                        name: "Hatching Egg",
                        template: { content: "{hatching}" }
                    },
                    {
                        name: "Wastage Egg",
                        template: { content: "{westageegg}" }
                    },
                    {
                        name: "Supervisor",
                        template: { content: "{username}" }
                    },
                    {
                        name: "Total Feed Consumption Male",
                        template: { content: "{malefeedconsumption}" }
                    },
                    {
                        name: "Total Feed Consumption Female",
                        template: { content: "{femalefeedconsumption}" }
                    },
		    {
                        name: "Feed Consumption Per Bird Male",
                        template: { content: "{feedconperbirdM}" }
                    },
		    {
                        name: "Feed Consumption Per Bird Female",
                        template: { content: "{feedconperbirdF}" }
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