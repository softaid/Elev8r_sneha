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

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.CBF.PendingGCReport", {


        onInit: function () {
            this.currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");

            //get AllCommonBranches for CBF
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
                branchid: null,
            }
        },

        // ge All common Branch
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

        // get all commanbrchname and id which is selected
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

            this.getView().byId("branchList").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();

                }
            })
        },

        // get only selected branches and bind this branches
        branchselectionChange: function (oEvent) {
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

        // get all pendinc Gc report by passing branchid
        pendingGCReport: function () {

            if (this.validateForm()) {
                var currentContext = this;
                var branchstring = this.getView().byId("branchList").getSelectedKeys();

                var branchStr = "";

                for (var i = 0; i < branchstring.length; i++) {
                    if (i == 0)
                        branchStr = parseInt(branchstring[i]);
                    else
                        branchStr = branchStr + "," + parseInt(branchstring[i]);
                }

                cBFReportsService.getPendingGCReport({ branchid: branchStr }, function async(data) {

                    var oBatchModel = currentContext.getView().getModel("tblModel");
                    oBatchModel.setData({ modelData: data[0] });

                })
            }
            this.getView().byId("txtdownload").setVisible(true);
        },

        // generate PDF for Pending GC Report
        onPdfExport: function () {
            var fullHtml = "";
            var headertable1 = "";
            headertable1 += "<!DOCTYPE html> <html> <head> <title>" + "Pending GC Report" + "</title>" +
                "<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js'></script>" +
                "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.22/pdfmake.min.js'></script>" +
                "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.62/vfs_fonts.js'></script>" +
                "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js'></script>" +
                "<style type='text/css'>" +
                "table {font-family: arial, sans-serif;border-collapse: collapse;width: 100%; } td, th {border: 1px solid #000;text-align: left;padding: 5px; } th, td {width: 100px;overflow: hidden; } img { width: 180px; height: 120px; text-align: center; } </style> </head>";

            headertable1 += "<body id='tblCustomers' class='amin-logo'>";
            headertable1 += "</body>";
            headertable1 += "<script>";

            let branchname = this.branchname;
            let companyname = this.companyname;
            let phone = (this.companycontact === null || this.companycontact == undefined) ? "-" : this.companycontact;
            let email = (this.companyemail === null || this.companyemail == undefined) ? "-" : this.companyemail;
            let address = (this.address === null || this.address == undefined) ? "-" : this.address;
            let pincode = (this.pincode === null || this.pincode == undefined) ? "-" : this.pincode;

            var tbleModel = this.getView().getModel("tblModel").oData.modelData;
            headertable1 += "html2canvas($('#tblCustomers')[0], {" +
                "onrendered: function (canvas) {" +
                "var data = canvas.toDataURL();" +
                "var width = canvas.width;" +
                "var height = canvas.height;" +
                "var docDefinition = {" +
                "pageMargins: [ 20, 60, 20, 60 ]," +
                "pageSize: 'A4'," +
                "content: [";
            headertable1 += "{text: 'Company:-" + companyname + "', style: 'header'},";
            headertable1 += "{text: 'Email:-" + email + "', style: 'header'},";
            headertable1 += "{text: 'Phone:-" + phone + "', style: 'header'},";
            headertable1 += "{text: 'Address:-" + address + "', style: 'header'},";
            headertable1 += "{text: 'Pending GC Report', style: 'title'},";
            headertable1 += "{columns: [{text:'Branch Name:-" + branchname + "', style: 'subheader'}]},";
            headertable1 += "{ style: 'tableExample',";
            headertable1 += " table: {";
            // headertable1 += "widths: ['*','*','*','*','*'],";
            headertable1 += " body: [";
            headertable1 += "[ {text: 'Farmer Name', style: 'tableHeader'}, {text: 'Farm Name', style: 'tableHeader'},{text: 'Farm Code', style: 'tableHeader'},{text: 'Supervisor Name', style: 'tableHeader'},{text: 'Placement Date', style: 'tableHeader'},{text: 'Batch Number', style: 'tableHeader'},{text: 'Liq Date', style: 'tableHeader'},{text: 'Days Since Liq', style: 'tableHeader'}],";

            for (var i = 0; i < tbleModel.length; i++) {
                if (tbleModel[i].farmer_name == null) {
                    tbleModel[i].farmer_name = "-";
                }
                if (tbleModel[i].farm_name == null) {
                    tbleModel[i].farm_name = "-";
                }
                if (tbleModel[i].batch_number == null) {
                    tbleModel[i].batch_number = "-";
                }
                if (tbleModel[i].employeename == null) {
                    tbleModel[i].employeename = "-";
                }
                if (tbleModel[i].batch_place_date == null) {
                    tbleModel[i].batch_place_date = "-";
                }
                if (tbleModel[i].batch_number == null) {
                    tbleModel[i].batch_number = "-";
                }
                if (tbleModel[i].liftingdate == null) {
                    tbleModel[i].liftingdate = "-";
                }
                if (tbleModel[i].Dayssinceliq == null) {
                    tbleModel[i].Dayssinceliq = "-";
                }

                headertable1 += "['" + tbleModel[i].farmer_name + "','" + tbleModel[i].farm_name + "','" + tbleModel[i].batch_number + "','" + tbleModel[i].employeename + "','" + tbleModel[i].batch_place_date + "','" + tbleModel[i].batch_number + "','" + tbleModel[i].liftingdate + "','" + tbleModel[i].Dayssinceliq + "'],"
            }
            headertable1 += "]";
            headertable1 += "}";
            headertable1 += "}";
            headertable1 += "]," +
                "footer: function (currentPage, pageCount) {" +
                "return {" +
                "style: 'Footer'," +
                "table: {" +
                "widths: ['*', 100]," +
                "body: [" +
                "[" +
                "{ text: 'Page ' + currentPage.toString() + ' of ' + pageCount, alignment: 'center', style: 'normalText' }" +
                "]," +
                "]" +
                "}," +
                "layout: 'noBorders'" +
                "};" +
                "}," +
                "styles: {" +
                "header: {" +
                "fontSize:10," +
                "bold: true," +
                "margin: [0, 0, 0, 8]" +
                "}," +
                "title: {" +
                "fontSize:12," +
                "bold: true," +
                "alignment: 'center'" +
                "}," +
                "Footer: {" +
                "fontSize: 7," +
                "margin: [5, 5, 5, 5]," +
                "}," +
                "subheader: {" +
                "fontSize:9," +
                "bold: true," +
                "margin: [0, 10, 0, 4]" +
                "}," +
                "todatecss: {" +
                "fontSize:9," +
                "bold: true," +
                "alignment:'right'" +
                "}," +
                "tableExample: {" +
                "margin: [0, 15, 0, 0]," +
                "fontSize: 8" +
                "}," +
                "tableHeader: {" +
                "bold: true," +
                "fontSize: 8," +
                "color: 'black'" +
                "}" +
                "}," +
                "defaultStyle: {" +
                "fontSize: 8" +
                "}" +
                "};" +
                "pdfMake.createPdf(docDefinition).download('Pending_GC_Report.pdf');" +
                "} });";
            headertable1 += "</script></html>";
            fullHtml += headertable1;
            var wind = window.open();
            wind.document.write(fullHtml);
            setTimeout(function () {
                wind.close();
            }, 3000);

        },

        // validation function for report filters
        validateForm: function () {
            var isValid = true;
            if (!commonFunction.ismultiComRequired(this, "branchList", "Branch is required"))
                isValid = false;

            return isValid;
        },

        // Function for CSV file  for Broiler Bird Balance Report
        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var branchname = this.branchname;
            var filename = branchname;

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
                        name: "Farmer Name",
                        template: { content: "{farmer_name}" }
                    },
                    {
                        name: "Farm Name",
                        template: { content: "{farm_name}" }
                    },
                    {
                        name: "Farm Code",
                        template: { content: "{farm_name}" }
                    },
                    {
                        name: "Supervisor Name",
                        template: { content: "{employeename}" }
                    },
                    {
                        name: "Placement Date",
                        template: { content: "{batch_place_date}" }
                    },
                    {
                        name: "Batch Number",
                        template: { content: "{batch_number}" }
                    },
                    {
                        name: "Liq Date",
                        template: { content: "{liftingdate}" }
                    },
                    {
                        name: "Days Since Liq",
                        template: { content: "{Dayssinceliq}" }
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
