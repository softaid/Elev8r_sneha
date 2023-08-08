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

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.CBF.FarmerListReport", {

        currentContext: null,

        onInit: function () {
            this.currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");
            this.getAllCommonBranch(this);
            this.getAllCommonBranch(this);
            var model = new JSONModel();
            model.setData([]);
            this.getView().setModel(model, "reportModel");

            var emptyModel = this.getModelDefault();
            model.setData(emptyModel)
            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "tblModel");

            this.getReference();
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


        getbatchscheduleReport: function () {
            if (this.validateForm()) {
                var currentContext = this;
                cBFReportsService.getAllBatchFarmerListReport({ branch_id: this.branchname, line_id: this.linename, status_id: this.statusname }, function async(data) {

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
                if (selectedKeys[i].text != "Select All")
                    this.branchname.push(selectedKeys[i].key);
            }

            this.branchnameone = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                this.branchnameone.push(selectedKeys[i].text);
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

        // function for get all status with select all option from common service

        getReference: function () {
            var currentContext = this;
            var FarmSts = "FarmSts";
            commonService.getReference({ typecode: FarmSts }, function (data) {
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "refname": "Select All" });
                    } else {
                        MessageBox.error("role not availabel.")
                    }
                }

                var oBranchModel = new sap.ui.model.json.JSONModel();
                oBranchModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oBranchModel, "farmStatusList");
            });

            this.getView().byId("statusList").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        lineSelectionFinish: function (oEvt) {
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedlines = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedlines.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }

            this.linename = [];
            for (var i = 0; i < selectedlines.length; i++) {
                if (selectedlines[i].text != "Select All")
                    this.linename.push(selectedlines[i].key);
            }

            this.linenameone = [];
            for (var i = 0; i < selectedlines.length; i++) {
                this.linenameone.push(selectedlines[i].text);
            }

            this.getView().byId("lineList").setValueState(sap.ui.core.ValueState.None);

            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });

        },

        statusSelectionFinish: function (oEvt) {

            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedstatus = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedstatus.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }

            this.statusname = [];
            for (var i = 0; i < selectedstatus.length; i++) {
                if (selectedstatus[i].text != "Select All")
                    this.statusname.push(selectedstatus[i].key);
            }

            this.statusnameone = [];
            for (var i = 0; i < selectedstatus.length; i++) {
                this.statusnameone.push(selectedstatus[i].text);
            }


            this.getView().byId("statusList").setValueState(sap.ui.core.ValueState.None);

            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        validateForm: function () {
            var isValid = true;

            if (!commonFunction.ismultiComRequired(this, "branchList", "Branch is required"))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "lineList", "Line is required."))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "statusList", "Status is required."))
                isValid = false;


            return isValid;
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
                // Replace/create column sequence data table
                htmTable += "<tr>";
                htmTable += "<td align='center'>" + model["branchname"] + "</td>"
                htmTable += "<td align='center'>" + model["linename"] + "</td>"
                htmTable += "<td align='right'>" + model["farmer_name"] + "</td>"
                htmTable += "<td align='right'>" + model["farm_name"] + "</td>"
                htmTable += "<td>" + model["address"] + "</td>"
                htmTable += "<td align='right'>" + model["mobile_no"] + "</td>"
                htmTable += "<td>" + model["pan_number"] + "</td>"
                htmTable += "<td>" + model["total_area"] + "</td>"
                htmTable += "<td align='right'>" + model["statusname"] + "</td>"
                htmTable += "</tr>";
            }

            var branchname = this.branchnameone;
            var lineList = this.linenameone;
            var statusname = this.statusnameone;
            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;
           
            
            
            template = this.replaceStr(template, "##ItemList##", htmTable);
            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);
            template = this.replaceStr(template, "##STATUSNAME##", statusname);
            template = this.replaceStr(template, "##LINENAME##", lineList);
            template = this.replaceStr(template, "##BRANCHNAME##", branchname);
            return template;
        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("CBF", "FarmerListReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Farm List report");
            });
        },


        onPdfExport: function (oEvent) {


            var that = this;
            //  map the bound data of the table to a pdfMake array

            var createListData = function () {
                var branchname = that.branchname;
                var lineList = that.linename;
                var statusname = that.statusname
                var retone = [{
                    columns: [
                        {
                            ul: [
                                branchname,
                                lineList,
                                statusname
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
                    sum.totalDistance += Number.parseInt(obj.getCells()[8].getProperty("text"));
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
                    }
                    ];
                    return ret;
                });

                // add a header to the pdf table
                mapArr.unshift(

                    [

                        {
                            text: "Branch Name",
                            style: 'tableHeader',
                            width: 10
                        },
                        {
                            text: "Line Name",
                            style: 'tableHeader',
                            width: 10
                        },
                        {
                            text: "Farmer Name",
                            style: 'tableHeader',
                            width: 10
                        },
                        {
                            text: "Farm Name",
                            style: 'tableHeader',
                            width: 10
                        },
                        {
                            text: "Address",
                            style: 'tableHeader',
                            width: 10
                        },
                        {
                            text: "Mobile No",
                            style: 'tableHeader',
                            width: 10
                        },
                        {
                            text: "Pan No",
                            style: 'tableHeader',
                            width: 10
                        },
                        {
                            text: "Area",
                            style: 'tableHeader',
                            width: 10
                        },
                        {
                            text: "Status",
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
                        text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Farm List Report'),

                        style: 'title',
                        margin: [0, 100, 150, 10]
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
                        text: "Status Name:",
                        style: 'filter',
                        bold: true
                    },
                    {

                        ul: [


                            createListData(),

                        ],
                        style: 'filter',
                        margin: [60, -35, 0, 14]

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




        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var branchname = this.branchnameone;
            var lineList = this.linenameone;
            var statusname = this.statusnameone;
       
            var filename =branchname+'_'+lineList+'_'+statusname;

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
                        name: "Branch Name",
                        template: { content: "{branchname}" }
                    },
                    {
                        name: "Line  Name",
                        template: { content: "{linename}" }
                    },
                    {
                        name: "Farmer Name",
                        template: { content: "{farmer_name}" }
                    },
                    {
                        name: "Farm  Name",
                        template: { content: "{farm_name}" }
                    },
                    {
                        name: "Supervisor",
                        template: { content: "{employeename}" }
                    },
                    {
                        name: "Address",
                        template: { content: "{address}" }
                    },
                    {
                        name: "Mobile No",
                        template: { content: "{mobile_no}" }
                    },
                    {
                        name: "PAN No",
                        template: { content: "{pan_number}" }
                    },
                    {
                        name: "Area",
                        template: { content: "{total_area}" }
                    },
                    {
                        name: "Status",
                        template: { content: "{statusname}" }
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
