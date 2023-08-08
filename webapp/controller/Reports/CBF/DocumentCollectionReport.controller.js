sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/CBFReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/CBF/FarmerEnquiry.service',
    "sap/m/Dialog",
    "sap/m/Button",

], function (JSONModel, BaseController, MessageBox, Export, ExportTypeCSV, commonFunction, CBFReportsService, farmerEnquiryService, Dialog, Button) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.CBF.DocumentCollectionReport", {

        onInit: function () {
            this.currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");
            
            var model = new JSONModel();
            model.setData([]);
            this.getView().setModel(model, "reportModel");

            var emptyModel = this.getModelDefault();
            model.setData(emptyModel)
            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "tblModel");

            this.getAllFarmers();

            this.getView().byId("imgDiv").setVisible(false);
        },

        getModelDefault: function () {
            return {
                farmerenquiryid: null
            }
        },

        resetModel: function () {
            var tbleModel = this.getView().getModel("tblModel");
            tbleModel.setData({ modelData: [] });

            var pModel = this.getView().getModel("reportModel");
            pModel.setData([]);

        },

        getAllFarmers : function(){
            var currentContext = this;
            farmerEnquiryService.getAllFarmerEnquiry(function(data){
                if(data[0].length){
                    var selectModel = new sap.ui.model.json.JSONModel();
                    selectModel.setData({modelData : data[0]}); 
                    currentContext.getView().setModel(selectModel,"farmerEnquiryModel");
                }else{
                    MessageBox.error("No data available");
                }
            })
        },

        // Function for pdf start

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
                htmTable += "<td align='center'>" + model["farmer_name"] + "</td>"
                htmTable += "<td align='center'>" + model["farm_name"] + "</td>"
                htmTable += "<td align='right'>" + model["documentname"] + "</td>"
                htmTable += "<td align='right'>" + model["farm_name"] + "</td>";
            }

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
            template = this.replaceStr(template, "##LINENAME##", linename);
            template = this.replaceStr(template, "##BRANCHNAME##", branchname);
            template = this.replaceStr(template, "##ReportFromDate##", fromdate);
            template = this.replaceStr(template, "##ReporToDate##", todate);
            return template;
        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("CBF", "ChickPlacementReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Chick Placement Register report");
            });
        },

        // Function for pdf finish

        onSearchPress: function () {
            if (this.validateForm()) {
                var currentContext = this;

                var oModel = this.getView().getModel("reportModel");
                var oConfig = sap.ui.getCore().getModel("configModel");

                CBFReportsService.getCbfDocumentCollectionByEnquiryid({ farmerenquiryid : oModel.oData.farmerenquiryid }, function async(data) {
                    if(data.length){

                        for(var i = 0; i < data[0].length; i++){
                            data[0][i].image_url = oConfig.oData.webapi.docurl + data[0][i].image_url
                        }

                        console.log(data[0]);
                        var oBatchModel = currentContext.getView().getModel("tblModel");
                        oBatchModel.setData({ modelData: data[0] });
                    }
                })
            }
        },

        // Validation Fun
        validateForm: function () {
            var isValid = true;

            if (!commonFunction.isSelectRequired(this, "txtFarmer", "Farmer is required"))
                isValid = false;

            return isValid;
        },

        /*changeURL : function(oEvent) { 
            // console.log("in preview");
            //this.getView().byId("imgDiv").setVisible(true);
            // //var oModel = new JSONModel(sap.ui.require.toUrl(oEvent.getSource().href));
            // var imgId = oEvent.getSource().href;
            // this.getView().byId("previewImg").src = imgId;

            var modal = this.getView().byId("imgDiv");
            var modalImg = this.getView().byId("previewImg");
            var captionText = this.getView().byId("caption");
            
            // modal.style.display = "block";
            modal.addStyleClass("modalclass");
            modalImg.src = oEvent.getSource().src;
            captionText.innerHTML = oEvent.getSource().alt;

            var span = document.getElementsByClassName("close")[0];

            // When the user clicks on <span> (x), close the modal
            
        },

        closeImg : function() { 
            var modal = this.getView().byId("imgDiv");
            modal.removeStyleClass("modalclass");;
            //this.getView().byId("imgDiv").setVisible(false);
        },*/

        changeURL: function (oEvent) {
            var imgId = oEvent.getSource().getProperty("src");
            this.getView().byId("previewImg").setProperty("src",imgId);

            let _this = this,
            bmrControl = this.getView().byId("previewImg");
            _this.oResizableDialog = null;

            if (!this.oResizableDialog) {
                this.oResizableDialog = new Dialog({
                    title: oEvent.getSource().getProperty("alt"),
                    contentWidth: "120%",
                    contentHeight: "550px",
                    resizable: true,
                    content: bmrControl,
                    customHeader: new sap.m.Toolbar({
                        Design: "Auto",
                        content: [
                            new sap.m.ToolbarSpacer(),
                            new Button({
                                type: "Back",
                                text: "Close",
                                press: function () {
                                    this.oResizableDialog.close();
                                }.bind(this)
                            })
                        ]
                    })
                });

                //to get access to the controller's model
                this.getView().addDependent(this.oResizableDialog);
            }

            this.oResizableDialog.open();

        },

        handleCloseButton: function (oEvent) {
            this._oPopover.close();
        },

        onPdfExport: function (oEvent) {
            var that = this;
            //  map the bound data of the table to a pdfMake array

            var createListData = function () {

                var fromdate = that.getView().byId("txtFromdate").getValue();
                var todate = that.getView().byId("txtTodate").getValue();
                var branchname = that.branchname;
                var lineList = that.linename
                var retone = [{
                    columns: [
                        {
                            ul: [
                                fromdate,
                                todate,
                                branchname,
                                lineList
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
                            text: "Date",
                            style: 'tableHeader',
                            width: 10
                        },
                        {
                            text: "Batch Id",
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
                            text: "Place Quantity",
                            style: 'tableHeader',
                            width: 10
                        },
                        {
                            text: "TotalArea",
                            style: 'tableHeader',
                            width: 10
                        },
                        {
                            text: "Density",
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
                        text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('ChickPlacement Register  Report'),
                       
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

                        ul: [


                            createListData(),

                        ],
                        style: 'filter',
                        margin: [60, -45, 0, 14]

                    },

                    {
                        table: {
                            headerRows: 1,
                            widths: [60, 60, 40, 40, 40, 40, 60, 60, 60],
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
                        name: "Date",
                        template: { content: "{placement_date}" }
                    },
                    {
                        name: "Batch Id",
                        template: { content: "{farmer_name}" }
                    },
                    {
                        name: "Farmer Name",
                        template: { content: "{farm_name}" }
                    },
                    {
                        name: "Batch Id",
                        template: { content: "{batch_id}" }
                    },
                    {
                        name: "Branch Name",
                        template: { content: "{branchname}" }
                    },
                    {
                        name: "Place Quantity",
                        template: { content: "{chick_qty}" }
                    }
                    // {
                    //     name: "Total Area",
                    //     template: { content: "{total_area}" }
                    // },
                    // {
                    //     name: "Density",
                    //     template: { content: "{density}" }
                    // }

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
