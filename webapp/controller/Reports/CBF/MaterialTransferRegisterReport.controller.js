sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/CBFReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',

], function (JSONModel, BaseController, MessageToast, MessageBox, Export, ExportTypeCSV, commonFunction, cBFReportsService, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.CBF.MaterialTransferRegisterReport", {

        currentContext: null,
        onInit: function () {
            this.currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");
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
                branch_id: null,
                line_id: null,
                status_id: null

            }
        },

        resetModel: function () {
            var tbleModel = this.getView().getModel("tblModel");
            tbleModel.setData({ modelData: [] });

            var pModel = this.getView().getModel("reportModel");
            pModel.setData([]);

        },
        replaceStr: function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },

        replaceTemplateData: function (template) {
            // Item table Data --------------
            var tblModel = this.getView().getModel("tblModel").oData.modelData;
            var htmTable = "";
            for (var indx in tblModel) {
                var model = tblModel[indx];

                htmTable += "<tr>";
                htmTable += "<td align='center'>" + model["transactionid"] + "</td>"
                htmTable += "<td>" + model["transactiondate"] + "</td>"
                htmTable += "<td align='right'>" + model["itemname"] + "</td>"
                htmTable += "<td align='right'>" + model["itemunitname"] + "</td>"
                htmTable += "<td>" + model["quantity"] + "</td>"
                htmTable += "<td>" + model["unitprice"] + "</td>"
                htmTable += "<td>" + model["rate"] + "</td>"
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
            commonFunction.getHtmlTemplate("CBF", "BatchScheduleReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Bill of material report");
            });
        },

        getbatchscheduleReport: function () {
            if (this.validateForm()) {
                var currentContext = this;
                var batchstring = this.getView().byId("batchno").getSelectedKeys();
                var batchStr = "";

                for (var i = 0; i < batchstring.length; i++) {
                    if (i == 0)
                        batchStr = parseInt(batchstring[i]);
                    else
                        batchStr = batchStr + "," + parseInt(batchstring[i]);
                }

                var oModel = this.getView().getModel("reportModel");

                var fromdate = this.getView().byId("txtFromdate").getValue();
                var todate = this.getView().byId("txtTodate").getValue();

                cBFReportsService.getAllBatchOfMaterialTransfer({ fromdate: fromdate, todate: todate, batchid: batchStr }, function async(data) {
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
            for (var i = 0; i < selectedKeys.length; i++) {
                branch.push(selectedKeys[i].key);
            }

            this.branchname = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                this.branchname.push(selectedKeys[i].text);
            }


            cBFReportsService.getAllLine({ branchid: branch }, function (data) {


                var oBatchModel = new sap.ui.model.json.JSONModel();

                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "linename": "Select All" });
                    } else {
                        MessageBox.error("line  not availabel.")
                    }
                }

                currentContext.getView().setModel(oBatchModel, "lineModel");

                oBatchModel.setData({ modelData: data[0] });


            });
            this.getView().byId("branchList").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });

            commonFunction.getReference("FarmSts", "farmStatusList", this);
        },

        branchSelectionChange: function (oEvent) {
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


        lineSelectionFinish: function (oEvt) {
            var currentContext = this;
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedKeys = [];

            for (var i = 0; i < selectedItems.length; i++) {
                selectedKeys.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }

            var line = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                line.push(selectedKeys[i].key);
            }

            this.linename = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                this.linename.push(selectedKeys[i].text);
            }


            cBFReportsService.getAllFarmer({ branchlineid: line }, function (data) {

                var oBatchModel = new sap.ui.model.json.JSONModel();

                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "farmer_name": "Select All" });
                    } else {
                        MessageBox.error("farmer  not availabel.")
                    }
                }

                currentContext.getView().setModel(oBatchModel, "farmerModel");

                oBatchModel.setData({ modelData: data[0] });

            });

            this.getView().byId("lineList").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        farmerSelectionFinish: function (oEvt) {
            var currentContext = this;
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedKeys = [];


            for (var i = 0; i < selectedItems.length; i++) {
                selectedKeys.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });

            }

            var farmer = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                farmer.push(selectedKeys[i].key);
            }

            this.farmername = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                this.farmername.push(selectedKeys[i].text);
            }


            cBFReportsService.getAllFarm({ framerid: farmer }, function (data) {

                var oBatchModel = new sap.ui.model.json.JSONModel();

                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "farm_name": "Select All" });
                    } else {
                        MessageBox.error("farm  not availabel.")
                    }
                }

                currentContext.getView().setModel(oBatchModel, "farmModel");

                oBatchModel.setData({ modelData: data[0] });

            });

            this.getView().byId("farmerList").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        farmSelectionFinish: function (oEvt) {
            var currentContext = this;
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedKeys = [];

            for (var i = 0; i < selectedItems.length; i++) {
                selectedKeys.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }

            var farm = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                farm.push(selectedKeys[i].key);
            }

            this.farmname = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                this.farmname.push(selectedKeys[i].text);
            }


            cBFReportsService.getAllBatch({ farmid: farm }, function (data) {

                var oBatchModel = new sap.ui.model.json.JSONModel();

                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "batch_id": "All", "batch_number": "Select All" });
                    } else {
                        MessageBox.error("Batch  not availabel.")
                    }
                }

                currentContext.getView().setModel(oBatchModel, "batchModel");
                oBatchModel.setData({ modelData: data[0] });

            });

            this.getView().byId("farmList").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        batchSelectionFinish: function (oEvt) {
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedbatches = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedbatches.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }

            this.batchno = [];
            for (var i = 0; i < selectedbatches.length; i++) {
                this.batchno.push(selectedbatches[i].text);
            }


            this.getView().byId("batchno").setValueState(sap.ui.core.ValueState.None);

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



        validateForm: function () {
            var isValid = true;

            if (!commonFunction.ismultiComRequired(this, "branchList", "Branch is required"))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "lineList", "Line is required."))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "farmerList", "farmer is required."))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "batchno", "Batch is required."))
                isValid = false;


            if (!commonFunction.ismultiComRequired(this, "farmList", "farm is required."))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtFromdate", "From Date is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtTodate", "To Date is required"))
                isValid = false;


            return isValid;
        },

        onPdfExport: function (oEvent) {
            var that = this;
            //  map the bound data of the table to a pdfMake array

            var createListData = function () {
                var fromdate = that.getView().byId("txtFromdate").getValue();
                var todate = that.getView().byId("txtTodate").getValue();
                var branchname = that.branchname;
                var lineList = that.linename
                var farmername = that.farmername;
                var farmname = that.farmname;
                var batchno = that.batchno;
                var retone = [{
                    columns: [
                        {
                            ul: [
                                fromdate,
                                todate,
                                branchname,
                                lineList,
                                farmername,
                                farmname,
                                batchno
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

                    [
                        {
                            text: "Issue No",
                            style: 'tableHeader',
                            width: 10
                        },
                        {
                            text: "Issue Date",
                            style: 'tableHeader',
                            width: 10
                        },
                        {
                            text: "Item Name",
                            style: 'tableHeader',
                            width: 10
                        },
                        {
                            text: "Unit Name",
                            style: 'tableHeader',
                            width: 10
                        },
                        {
                            text: "Quantity",
                            style: 'tableHeader',
                            width: 10
                        },
                        {
                            text: "Rate",
                            style: 'tableHeader',
                            width: 10
                        },
                        {
                            text: "Amount",
                            style: 'tableHeader',
                            width: 10
                        }
                    ]
                );
                // add a summary row at the end

                mapArr.push([

                    { text: " " },
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
                        text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(' Material Transfer Register Report'),

                        style: 'title',
                        margin: [0, 100, 150, 10]
                    },
                    {
                        text: "From date:",
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
                        text: "Line Name:",
                        style: 'filter',
                        bold: true
                    },
                    {
                        text: "Farmer Name:",
                        style: 'filter',
                        bold: true
                    },
                    {
                        text: "Farm Name:",
                        style: 'filter',
                        bold: true
                    },
                    {
                        text: "Batch No:",
                        style: 'filter',
                        bold: true
                    },
                    {

                        ul: [

                            // style: 'bottom',
                            createListData(),

                        ],
                        style: 'filter',
                        margin: [60, -60, 0, 14]

                    },

                    {
                        table: {
                            headerRows: 1,
                            widths: [40, 40, 40, 40, 40, 40, 60, 60, 60],
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

            pdfMake.createPdf(docDefinition).open();
        },

        handlePrint: function (oEvent) {
            var fullHtml = "";
            var fullHtml1 = "";
            var fullHtml2 = "";
            var fullHtml3 = "";
            var Model = this.getView().getModel('tblModel');
            var batchname = this.batchsname;
            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;
            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var branchname = this.branchname;
            var lineList = this.linename
            var farmername = this.farmername;
            var farmname = this.farmname;
            var batchno = this.batchno;


            var oModel = Model.oData.modelData;
            var headertable1 = "<table  border='1' style='margin-top:150px;width: 1000px;' align='center'>" +
                "<caption style='color:black;font-weight: bold;font-size: large;'></caption>" +
                "<tr><th style='color:black'>Issue No</th>" +
                "<th style='color:black'>Issue Date</th>" +
                "<th style='color:black'>Item Name</th>" +
                "<th style='color:black'>Unit Name</th>" +
                "<th style='color:black'>Quantity</th>" +
                "<th style='color:black'>Rate</th>" +
                "<th style='color:black'>Amount</th>></tr>"


            var titile1 = "<table  style='margin-top:50px;width:800px;' align='center'>" +
                "<caption style='color:black;font-weight: bold;font-size: large;'>Material Transfer Register Report</caption>"


            var batchname1 = "<table  style='margin-top:60px;width: 800px;' align='left'>" +
                "<caption style='color:black;font-weight: bold;font-size: large;'></caption>"

            var header = "<table  style='margin-top:-60px;width: 500px;' align='left'; padding: 0px;font-size: 14px;margin: 0;line-height:1;cellpadding=0px; cellspacing=0px>" +
                "<caption style='color:black;font-weight: bold;font-size: large;'></caption>"

            header += "<tr>" + "<th align='left'> CompanyName </th>" + "<td align='left'>" + companyname + "</td>" + "</tr>" +
                "<tr>" + "<th align='left'> Companycontact </th>" + "<td align='left'>" + companycontact + "</td>" + "<br>" + "</tr>" +
                "<tr>" + "<th align='left'> Email </th>" + "<td align='left'>" + companyemail + "</td>" + "<br>" + "</tr>" +
                "<tr>" + "<th align='left'> Address </th>" + "<td align='left'>" + address + "</td>" + "<br>" + "</tr>" +
                "<tr>" + "<th align='left'> PinCode </th>" + "<td align='left'>" + pincode + "</td>" + "<br>" + "</tr>";

            batchname1 += "<tr>" + "<th align='left'> From Date </th>" + "<td align='left'>" + fromdate + "</td>" + "</tr>" +
                "<tr>" + "<th align='left'> To Date </th>" + "<td align='left'>" + todate + "</td>" + "<br>" + "</tr>" +
                "<tr>" + "<th align='left'> Branch Name </th>" + "<td align='left'>" + branchname + "</td>" + "<br>" + "</tr>" +
                "<tr>" + "<th align='left'> Line Name </th>" + "<td align='left'>" + lineList + "</td>" + "<br>" + "</tr>" +
                "<tr>" + "<th align='left'> Farmer Name </th>" + "<td align='left'>" + farmername + "</td>" + "<br>" + "</tr>" +
                "<tr>" + "<th align='left'> Farm Name </th>" + "<td align='left'>" + farmname + "</td>" + "<br>" + "</tr>" +
                "<tr>" + "<th align='left'> Batch No </th>" + "<td align='left'>" + batchname + "</td>" + "<br>" + "</tr>";

            //batchname1 += "<tr>"+ "<th align='right'> Batch Name </th>" +"<td align='right'>" + batchname + "</td>"+"<br>"+"</tr>";



            //Adding row dynamically to student table....

            for (var i = 0; i < oModel.length; i++) {
                headertable1 += "<tr>" +
                    "<td>" + oModel[i].transactionid + "</td>" +
                    "<td>" + oModel[i].transactiondate + "</td>" +
                    "<td>" + oModel[i].itemname + "</td>" +
                    "<td>" + oModel[i].itemunitname + "</td>" +
                    "<td>" + oModel[i].quantity + "</td>" +
                    "<td>" + oModel[i].rate + "</td>" +
                    "<td>" + oModel[i].amount + "</td>" +
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
            wind.stop();
        },





        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var branchname = this.branchname;
            var lineList = this.linename
            var farmername = this.farmername;
            var farmname = this.farmname;
            var batchno = this.batchno;



            var filename =fromdate+'_'+todate+'_'+branchname+'_'+lineList+'_'+farmername+'_'+farmname+'_'+batchno;



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
                        name: "Issue No.",
                        template: { content: "{transactionid}" }
                    },
                    {
                        name: "Issue Date",
                        template: { content: "{transactiondate}" }
                    },
                    {
                        name: "Item Name",
                        template: { content: "{itemname}" }
                    },
                    {
                        name: "Unite Name",
                        template: { content: "{itemunitname}" }
                    },
                    {
                        name: "Quantity",
                        template: { content: "{quantity}" }
                    },
                    {
                        name: "Rate",
                        template: { content: "{rate}" }
                    },
                    {
                        name: "Amount",
                        template: { content: "{amount}" }
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
