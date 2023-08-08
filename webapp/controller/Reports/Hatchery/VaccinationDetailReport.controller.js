sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/HatcheryReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service'

], function (BaseController, MessageBox, Export, ExportTypeCSV, commonFunction, hatcheryReportsService, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Hatchery.VaccinationDetailReport", {

        currentContext: null,
        onInit: function () {
            this.currentContext = this;
            var moduleids = 722;
            // call function which get data and bind to screen at first time 
            this.getLocations(this, moduleids);
        },

        //get all location under hatchery module
        getLocations: function (currentContext, moduleids) {
            let locationid;
            let batchids;
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

                //If it is Selected
                if (data[0].length > 0) {
                    for (var i = 0; i < data[0].length; i++) {
                        if (i == 0) {
                            locationid = data[0][i].id;
                        } else {
                            locationid = locationid + ',' + data[0][i].id;
                        } //If i == 0									
                    } //End of For Loop

                    locationid = locationid.split(",");
                    currentContext.getView().byId("locationtbl").setSelectedKeys(locationid);
                } else {
                    currentContext.getView().byId("locationtbl").setSelectedKeys(locationid);
                }

                setTimeout(function () {
                    let locationstring = currentContext.getView().byId("locationtbl").getSelectedKeys();
                    console.log("locationstring", locationstring);
                    let locationStr;
                    let completedcount = 0;
                    let totalcount = locationstring.length;
                    for (var i = 0; i < locationstring.length; i++) {
                        completedcount++;
                        if (i == 0) {
                            locationStr = parseInt(locationstring[i]);
                        }
                        else {
                            locationStr = locationStr + "," + parseInt(locationstring[i]);
                        }
                        if (completedcount == totalcount) {
                            //get all hatcherbatch  by location
                            hatcheryReportsService.getAllhtacherbatch({ locationid: locationStr }, function (data) {
                                var oBatchModel = new sap.ui.model.json.JSONModel();
                                if (data.length > 0) {
                                    if (data[0].length > 0) {
                                        data[0].unshift({ "hatchbatchid": "Select All", "hatchbatchid": "Select All" });
                                    } else {
                                        MessageBox.error("hatchbatch  not availabel.")
                                    }
                                }

                                currentContext.getView().setModel(oBatchModel, "hatcherbatchModel");
                                oBatchModel.setData({ modelData: data[0] });

                                //If it is Selected
                                if (data[0].length > 0) {
                                    for (var i = 0; i < data[0].length; i++) {
                                        if (i == 0) {
                                            batchids = data[0][i].hatchbatchid;
                                        } else {
                                            batchids = batchids + ',' + data[0][i].hatchbatchid;
                                        } //If i == 0									
                                    } //End of For Loop

                                    batchids = batchids.split(",");
                                    currentContext.getView().byId("batchid").setSelectedKeys(batchids);
                                } else {
                                    currentContext.getView().byId("batchid").setSelectedKeys(batchids);
                                }

                            });

                        }
                    }
                }, 1000);
                //load data first time and bind on screen
                setTimeout(function () {
                    currentContext.onVaccinationSearchData();
                }, 3000);
            });
        },

        // get all hatcher batch by locationid
        handleSelectionFinish: function (oEvt) {
            var currentContext = this;
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

            this.locationStr = "";
            for (var i = 0; i < location.length; i++) {
                if (i == 0)
                    this.locationStr = parseInt(location[i]);
                else
                    this.locationStr = this.locationStr + "," + parseInt(location[i]);
            }
            //get all hatcherbatch  by location
            hatcheryReportsService.getAllhtacherbatch({ locationid: this.locationStr }, function (data) {
                var oBatchModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "hatchbatchid": "Select All", "hatchbatchid": "Select All" });
                    } else {
                        MessageBox.error("hatchbatch  not availabel.")
                    }
                }
                currentContext.getView().setModel(oBatchModel, "hatcherbatchModel");
                oBatchModel.setData({ modelData: data[0] });

            });
            this.getView().byId("locationtbl").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        //get comma seprated batchids
        hatcherbatchSelectionFinish: function (oEvt) {
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedKeys = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedKeys.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }
            var batch = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                batch.push(selectedKeys[i].key);
            }

            this.batchstr = "";
            for (var i = 0; i < batch.length; i++) {
                if (i == 0)
                    this.batchstr = parseInt(batch[i]);
                else
                    this.batchstr = this.batchstr + "," + parseInt(batch[i]);
            }

            this.getView().byId("batchid").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        //select all functionality 
        handleSelectionChange: function (oEvent) {
            var changedItem = oEvent.getParameter("changedItem");
            var isSelected = oEvent.getParameter("selected");
            var state = "Selected";

            if (!isSelected) {
                state = "Deselected"
            }

            //Check if "Selected All is selected
            if (changedItem.mProperties.key == "Select All") {
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

        // functionality for select all
        handleSelectionChangebranch: function (oEvent) {
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
        // get all data for Vaccination report
        onVaccinationSearchData: function () {
            if (this.validateForm()) {
                var currentContext = this;
                var currentContext = this;
                var locationstring = this.getView().byId("locationtbl").getSelectedKeys();
                var batchstring = this.getView().byId("batchid").getSelectedKeys();
                var locationStr = "";
                var batchStr = "";

                for (var i = 0; i < batchstring.length; i++) {
                    if (i == 0)
                        batchStr = parseInt(batchstring[i]);
                    else
                        batchStr = batchStr + "," + parseInt(batchstring[i]);
                }

                for (var i = 0; i < locationstring.length; i++) {
                    if (i == 0)
                        locationStr = parseInt(locationstring[i]);
                    else
                        locationStr = locationStr + "," + parseInt(locationstring[i]);
                }

                hatcheryReportsService.getHatcheryvaccinationReport({ locationid: locationStr, hatcherbatchid: batchStr }, function (data) {
                    var oModel = new sap.ui.model.json.JSONModel();
                    oModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oModel, "vaccineModel");
                });
            }
        },

        // Validation function for report filters 
        validateForm: function () {
            var isValid = true;
            if (!commonFunction.ismultiComRequired(this, "locationtbl", "Location is required"))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "batchid", "Batch is required"))
                isValid = false;
            return isValid;
        },

        /* Generate PDF for Vaccination Report by using PDFmake library*/
        onPdfExport: function () {
            var fullHtml = "";
            var headertable1 = "";
            headertable1 += "<!DOCTYPE html> <html> <head> <title>" + "Vaccination Report" + "</title>" +
                "<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js'></script>" +
                "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.22/pdfmake.min.js'></script>" +
                "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.62/vfs_fonts.js'></script>" +
                "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js'></script>" +
                "<style type='text/css'>" +
                "table {font-family: arial, sans-serif;border-collapse: collapse;width: 100%; } td, th {border: 1px solid #000;text-align: left;padding: 5px; } th, td {width: 100px;overflow: hidden; } img { width: 180px; height: 120px; text-align: center; } </style> </head>";

            headertable1 += "<body id='tblCustomers' class='amin-logo'>";
            headertable1 += "</body>";
            headertable1 += "<script>";

            var locationname = this.locationname
            var Batch = this.batchstr;
            /* Header data for PDF */
            let companyname = commonFunction.session("companyname");
            let companycontact = commonFunction.session("companycontact");
            let companyemail = commonFunction.session("companyemail");
            let address = commonFunction.session("address");

            let companyname1 = companyname;
            let phone1 = (companycontact === null || companycontact == undefined) ? "-" : companycontact;
            let email1 = (companyemail === null || companyemail == undefined) ? "-" : companyemail;
            let address1 = (address === null || address == undefined) ? "-" : address;
            var tbleModel = this.getView().getModel("vaccineModel").oData.modelData;
            headertable1 += "html2canvas($('#tblCustomers')[0], {" +
                "onrendered: function (canvas) {" +
                "var data = canvas.toDataURL();" +
                "var width = canvas.width;" +
                "var height = canvas.height;" +
                "var docDefinition = {" +
                "pageMargins: [ 40, 60, 40, 60 ]," +
                "content: [";
            headertable1 += "{text: 'Company:-" + companyname1 + "', style: 'header'},";
            headertable1 += "{text: 'Email:-" + email1 + "', style: 'header'},";
            headertable1 += "{text: 'Phone:-" + phone1 + "', style: 'header'},";
            headertable1 += "{text: 'Address:-" + address1 + "', style: 'header'},";
            headertable1 += "{text: 'Vaccination Report', style: 'title'},";
            headertable1 += "{columns: [{text:'Location:-" + locationname + "', style: 'subheader'},{text:'Batch:-" + Batch + "', style: 'todatecss'}]},";
            headertable1 += "{ style: 'tableExample',";
            headertable1 += " table: {";
            headertable1 += " body: [";
            headertable1 += "[ {text: 'Vaccination Date', style: 'tableHeader'}, {text: 'Location', style: 'tableHeader'},{text: 'Hatcher Batch No', style: 'tableHeader'},{text: 'Hatch Date', style: 'tableHeader'}, {text: 'Breeder Batch', style: 'tableHeader'},{text: 'Bird Name', style: 'tableHeader'},{text: 'Total chicks', style: 'tableHeader'},{text: 'Vaccine Name', style: 'tableHeader'},{text: 'Unit', style: 'tableHeader'},{text: 'Used Quantity', style: 'tableHeader'}],";

            for (var i = 0; i < tbleModel.length; i++) {
                if (tbleModel[i].issuedate == null) {
                    tbleModel[i].issuedate = "-";
                }
                if (tbleModel[i].locationname == null) {
                    tbleModel[i].locationname = "-";
                }
                if (tbleModel[i].hatchbatchid == null) {
                    tbleModel[i].hatchbatchid = "-";
                }
                if (tbleModel[i].pulloutdate == null) {
                    tbleModel[i].pulloutdate = "-";
                }
                if (tbleModel[i].breederbatchid == null) {
                    tbleModel[i].breederbatchid = "-";
                }

                if (tbleModel[i].itemname == null) {
                    tbleModel[i].itemname = "-";
                }
                if (tbleModel[i].totalhatch == null) {
                    tbleModel[i].totalhatch = "-";
                }
                if (tbleModel[i].vaccineitemname == null) {
                    tbleModel[i].vaccineitemname = "-";
                }
                if (tbleModel[i].refname == null) {
                    tbleModel[i].refname = "-";
                }
                if (tbleModel[i].issuequantity == null) {
                    tbleModel[i].issuequantity = "-";
                }

                headertable1 += "['" + tbleModel[i].issuedate + "','" + tbleModel[i].locationname + "','" + tbleModel[i].hatchbatchid + "','" + tbleModel[i].pulloutdate + "','" + tbleModel[i].breederbatchid + "','" + tbleModel[i].itemname + "','" + tbleModel[i].totalhatch + "','" + tbleModel[i].vaccineitemname + "','" + tbleModel[i].refname + "','" + tbleModel[i].issuequantity + "'],"
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
                "pdfMake.createPdf(docDefinition).download('Vaccination_report.pdf');" +
                "} });";
            headertable1 += "</script></html>";
            fullHtml += headertable1;
            var wind = window.open();
            wind.document.write(fullHtml);
            setTimeout(function () {
                wind.close();
            }, 3000);
        },

        // generate CSV file for Vaccination Report
        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            let branchname = this.locationStr;
            let batchname = this.batchstr;
            let filename = branchname + '_' + batchname;

            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/

            var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ","
                }),

                // Pass in the model created above
                models: this.currentContext.getView().getModel("vaccineModel"),

                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content

                columns: [
                    {
                        name: "Vaccination Date",
                        template: { content: "{issuedate}" }
                    },
                    {
                        name: "Location",
                        template: { content: "{locationname}" }
                    },
                    {
                        name: "Hatcher Batch No",
                        template: { content: "{hatchbatchid}" }
                    },
                    {
                        name: "Hatch Date",
                        template: { content: "{pulloutdate}" }
                    },
                    {
                        name: "Breeder Batch",
                        template: { content: "{breederbatchid}" }
                    },
                    {
                        name: "Bird Name",
                        template: { content: "{itemname}" }
                    },
                    {
                        name: "Total chicks",
                        template: { content: "{totalhatch}" }
                    },
                    {
                        name: "Vaccine Name",
                        template: { content: "{vaccineitemname}" }
                    },
                    {
                        name: "Unit",
                        template: { content: "{refname}" }
                    },
                    {
                        name: "Used Quantity",
                        template: { content: "{issuequantity}" }
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
