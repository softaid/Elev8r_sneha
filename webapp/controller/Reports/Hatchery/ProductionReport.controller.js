sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/HatcheryReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service'

], function (JSONModel, BaseController, MessageBox, Export, ExportTypeCSV, commonFunction, hatcheryReportsService, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Hatchery.ProductionReport", {

        currentContext: null,
        onInit: function () {
            var moduleids = 722;
            // call function which get data and bind to screen at first time 
            this.getLocations(this, moduleids);
            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "tblModel");
        },

        getLocations: function (currentContext, moduleids) {
            var locationid;
            var batchids;
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
                    var locationstring = currentContext.getView().byId("locationtbl").getSelectedKeys();
                    var locationStr;
                    var completedcount = 0;
                    var totalcount = locationstring.length;
                    for (var i = 0; i < locationstring.length; i++) {
                        completedcount++;
                        if (i == 0) {
                            locationStr = parseInt(locationstring[i]);
                        }
                        else {
                            locationStr = locationStr + "," + parseInt(locationstring[i]);
                        }
                        if (completedcount == totalcount) {

                            hatcheryReportsService.getBreederBatchbyLocation({ locationid: locationStr }, function (data) {
                                var oBatchModel = new sap.ui.model.json.JSONModel();

                                if (data.length > 0) {
                                    if (data[0].length > 0) {
                                        data[0].unshift({ "breederbatchid": "All", "breederbatchid": "Select All" });
                                    } else {
                                        MessageBox.error("Breeder batch  not availabel.")
                                    }
                                }
                                currentContext.getView().setModel(oBatchModel, "breederBatchModel");
                                oBatchModel.setData({ modelData: data[0] });

                                //If it is Selected
                                if (data[0].length > 0) {
                                    for (var i = 0; i < data[0].length; i++) {
                                        if (i == 0) {
                                            batchids = data[0][i].breederbatchid;
                                        } else {
                                            batchids = batchids + ',' + data[0][i].breederbatchid;
                                        } //If i == 0									
                                    } //End of For Loop

                                    batchids = batchids.split(",");
                                    currentContext.getView().byId("breederbatchid").setSelectedKeys(batchids);

                                } else {
                                    currentContext.getView().byId("breederbatchid").setSelectedKeys(batchids);
                                }

                            });

                            hatcheryReportsService.getPartbyLocation({ locationid: locationStr }, function (partydata) {
                                var oPartyModel = new sap.ui.model.json.JSONModel();
                                if (partydata.length > 0) {
                                    if (partydata[0].length > 0) {
                                        partydata[0].unshift({ "partyid": "All", "partyid": "Select All" });
                                    } else {
                                        MessageBox.error("Prty is not availabel.")
                                    }
                                }
                                currentContext.getView().setModel(oPartyModel, "partyModel");
                                oPartyModel.setData({ modelData: partydata[0] });

                                var partyids;
                                //If it is Selected
                                if (partydata[0].length > 0) {
                                    for (var i = 0; i < partydata[0].length; i++) {
                                        if (i == 0) {
                                            partyids = partydata[0][i].partyid;
                                        } else {
                                            partyids = partyids + ',' + partydata[0][i].partyid;
                                        } //If i == 0									
                                    } //End of For Loop

                                    partyids = partyids.split(",");
                                    currentContext.getView().byId("partyid").setSelectedKeys(partyids);

                                } else {
                                    currentContext.getView().byId("partyid").setSelectedKeys(partyids);
                                }
                            });
                        }
                    }
                }, 1000);

                setTimeout(function () {
                    currentContext.onProductionReportSearchData();
                }, 2000);
            });
        },

        //chagne function for location 
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

        // function for location finish 
        handleSelectionFinish: function (oEvt) {
            var currentContext = this;
            var batchids;
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

            //get breederbatchbylocatinid for Production Report in Hatchery
            hatcheryReportsService.getBreederBatchbyLocation({ locationid: this.locationStr }, function (data) {
                var oBatchModel = new sap.ui.model.json.JSONModel();

                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "breederbatchid": "All", "breederbatchid": "Select All" });
                    } else {
                        MessageBox.error("Breeder batch  not availabel.")
                    }
                }

                currentContext.getView().setModel(oBatchModel, "breederBatchModel");
                oBatchModel.setData({ modelData: data[0] });

                //If it is Selected
                if (data[0].length > 0) {
                    for (var i = 0; i < data[0].length; i++) {
                        if (i == 0) {
                            batchids = data[0][i].id;
                        } else {
                            batchids = batchids + ',' + data[0][i].id;
                        } //If i == 0									
                    } //End of For Loop

                    batchids = batchids.split(",");
                    currentContext.getView().byId("breederbatchid").setSelectedKeys(batchids);

                } else {
                    currentContext.getView().byId("breederbatchid").setSelectedKeys(batchids);
                }
            });

            //get Partybylocatinid for Production Report in Hatchery
            hatcheryReportsService.getPartbyLocation({ locationid: this.locationStr }, function (data) {
                var oPartyModel = new sap.ui.model.json.JSONModel();

                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "partyid": "All", "partyid": "Select All" });
                    } else {
                        MessageBox.error("Prty is not availabel.")
                    }
                }

                currentContext.getView().setModel(oPartyModel, "partyModel");
                oPartyModel.setData({ modelData: data[0] });

            });
            this.getView().byId("locationtbl").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        // get parties to display data on report
        partySelectionFinish: function (oEvt) {
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedKeys = [];

            for (var i = 0; i < selectedItems.length; i++) {
                selectedKeys.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }

            this.partyname = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                this.partyname.push(selectedKeys[i].text);
            }

            this.getView().byId("partyid").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        // After batch finish get batches to display on Reports 
        breederBatchSelectionFinish: function (oEvt) {
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedKeys = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedKeys.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }
            this.breederBach = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                this.breederBach.push(selectedKeys[i].text);
            }
            this.getView().byId("breederbatchid").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        //get Production Report 
        onProductionReportSearchData: function () {
            if (this.validateForm()) {
                var currentContext = this;
                var locationstring = this.getView().byId("locationtbl").getSelectedKeys();
                var breederbatchstring = this.getView().byId("breederbatchid").getSelectedKeys();
                var partystring = this.getView().byId("partyid").getSelectedKeys();
                var locationStr = "";
                var breederbatchStr = "";
                var partyStr = "";

                for (var i = 0; i < breederbatchstring.length; i++) {
                    if (i == 0)
                        breederbatchStr = parseInt(breederbatchstring[i]);
                    else
                        breederbatchStr = breederbatchStr + "," + parseInt(breederbatchstring[i]);
                }

                for (var i = 0; i < locationstring.length; i++) {
                    if (i == 0)
                        locationStr = parseInt(locationstring[i]);
                    else
                        locationStr = locationStr + "," + parseInt(locationstring[i]);
                }

                for (var i = 0; i < partystring.length; i++) {
                    if (i == 0)
                        partyStr = parseInt(partystring[i]);
                    else
                        partyStr = partyStr + "," + parseInt(partystring[i]);
                }

                hatcheryReportsService.getHatcheryProductionReport({ locationid: locationStr, breederbatchid: breederbatchStr, partyid: partyStr }, function (data) {
                    var oProductionModel = currentContext.getView().getModel("tblModel");
                    oProductionModel.setData({ modelData: data[0] });
                });
            }
        },
        // Validation for Filters in report.
        validateForm: function () {
            var isValid = true;
            if (!commonFunction.ismultiComRequired(this, "partyid", "Party is required"))
                isValid = false;
            if (!commonFunction.ismultiComRequired(this, "breederbatchid", "Batch is required."))
                isValid = false;
            if (!commonFunction.ismultiComRequired(this, "locationtbl", "Location is required."))
                isValid = false;
            return isValid;
        },

        /* Generate PDF for Production Report by using PDFmake library*/
        onPdfExport: function () {
            var fullHtml = "";
            var headertable1 = "";
            headertable1 += "<!DOCTYPE html> <html> <head> <title>" + "Production Report" + "</title>" +
                "<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js'></script>" +
                "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.22/pdfmake.min.js'></script>" +
                "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.62/vfs_fonts.js'></script>" +
                "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js'></script>" +
                "<style type='text/css'>" +
                "table {font-family: arial, sans-serif;border-collapse: collapse;width: 100%; } td, th {border: 1px solid #000;text-align: left;padding: 5px; } th, td {width: 100px;overflow: hidden; } img { width: 180px; height: 120px; text-align: center; } </style> </head>";

            headertable1 += "<body id='tblCustomers' class='amin-logo'>";
            headertable1 += "</body>";
            headertable1 += "<script>";

            let locationname = this.locationname
            let breederBach = this.breederBach;
            /* Header data for PDF */
            let companyname = commonFunction.session("companyname");
            let companycontact = commonFunction.session("companycontact");
            let companyemail = commonFunction.session("companyemail");
            let address = commonFunction.session("address");

            let companyname1 = companyname;
            let phone1 = (companycontact === null || companycontact == undefined) ? "-" : companycontact;
            let email1 = (companyemail === null || companyemail == undefined) ? "-" : companyemail;
            let address1 = (address === null || address == undefined) ? "-" : address;

            var tbleModel = this.getView().getModel("tblModel").oData.modelData;
            headertable1 += "html2canvas($('#tblCustomers')[0], {" +
                "onrendered: function (canvas) {" +
                "var data = canvas.toDataURL();" +
                "var width = canvas.width;" +
                "var height = canvas.height;" +
                "var docDefinition = {" +
                "pageMargins: [ 5, 60, 20, 5 ]," +
                "pageOrientation: 'landscape'," +
                "pageSize: 'A4'," +
                "content: [";
            headertable1 += "{text: 'Company:-" + companyname1 + "', style: 'header'},";
            headertable1 += "{text: 'Email:-" + email1 + "', style: 'header'},";
            headertable1 += "{text: 'Phone:-" + phone1 + "', style: 'header'},";
            headertable1 += "{text: 'Address:-" + address1 + "', style: 'header'},";
            headertable1 += "{text: 'Production Report', style: 'title'},";
            headertable1 += "{columns: [{text:'Location Name:-" + locationname + "', style: 'subheader'},{text:'Breeder Batch:-" + breederBach + "', style: 'todatecss'}]},";
            headertable1 += "{ style: 'tableExample',";
            headertable1 += " table: {";
            headertable1 += " body: [";
            headertable1 += "[ {text: 'Party Name', style: 'tableHeader'}, {text: 'Batch No', style: 'tableHeader'},{text: 'Set Date', style: 'tableHeader'},{text: 'Setter Batch', style: 'tableHeader'}, {text: 'Hatch Date', style: 'tableHeader'},{text: 'Hatcher Batch', style: 'tableHeader'},{text: 'Total Hatchable Egg Received', style: 'tableHeader'},{text: 'Hatchable Egg Rate', style: 'tableHeader'},{text: 'Egg Amount', style: 'tableHeader'},{text: 'Total Chicks', style: 'tableHeader'},{text: 'Saleable Chicks (%)', style: 'tableHeader'},{text: 'Culls(%)', style: 'tableHeader'},{text: 'Hatch(%)', style: 'tableHeader'},{text: 'Breed', style: 'tableHeader'},{text: 'Gross Production Cost/Chicks', style: 'tableHeader'},{text: 'Admin Cost/Chick', style: 'tableHeader'},{text: 'Overhead Cost/Chicks', style: 'tableHeader'},{text: 'Net Cost/Chicks', style: 'tableHeader'}],";

            for (var i = 0; i < tbleModel.length; i++) {
                if (tbleModel[i].partyname == null) {
                    tbleModel[i].partyname = "-";
                }
                if (tbleModel[i].breederbatchname == null) {
                    tbleModel[i].breederbatchname = "-";
                }
                if (tbleModel[i].setterbatchdate == null) {
                    tbleModel[i].setterbatchdate = "-";
                }
                if (tbleModel[i].setterbatchid == null) {
                    tbleModel[i].setterbatchid = "-";
                }
                if (tbleModel[i].hatcherbatchdate == null) {
                    tbleModel[i].hatcherbatchdate = "-";
                }

                if (tbleModel[i].hatcherbatchid == null) {
                    tbleModel[i].hatcherbatchid = "-";
                }
                if (tbleModel[i].totalhatcheggreceived == null) {
                    tbleModel[i].totalhatcheggreceived = "-";
                }
                if (tbleModel[i].rate == null) {
                    tbleModel[i].rate = "-";
                }
                if (tbleModel[i].totalamt == null) {
                    tbleModel[i].totalamt = "-";
                }
                if (tbleModel[i].totalchicks == null) {
                    tbleModel[i].totalchicks = "-";
                }
                if (tbleModel[i].sellableper == null) {
                    tbleModel[i].sellableper = "-";
                }
                if (tbleModel[i].cullsper == null) {
                    tbleModel[i].cullsper = "-";
                }
                if (tbleModel[i].hatchper == null) {
                    tbleModel[i].hatchper = "-";
                }
                if (tbleModel[i].cpitemname == null) {
                    tbleModel[i].cpitemname = "-";
                }
                if (tbleModel[i].grosstotal == null) {
                    tbleModel[i].grosstotal = "-";
                }
                if (tbleModel[i].overheadcostperegg == null) {
                    tbleModel[i].overheadcostperegg = "-";
                }
                if (tbleModel[i].overheadcostperegg == null) {
                    tbleModel[i].overheadcostperegg = "-";
                }
                if (tbleModel[i].nettotal == null) {
                    tbleModel[i].nettotal = "-";
                }
                headertable1 += "['" + tbleModel[i].partyname + "','" + tbleModel[i].breederbatchname + "','" + tbleModel[i].setterbatchdate + "','" + tbleModel[i].setterbatchid + "','" + tbleModel[i].hatcherbatchdate + "','" + tbleModel[i].hatcherbatchid + "','" + tbleModel[i].totalhatcheggreceived + "','" + tbleModel[i].rate + "','" + tbleModel[i].totalamt + "','" + tbleModel[i].totalchicks + "','" + tbleModel[i].sellableper + "','" + tbleModel[i].cullsper + "','" + tbleModel[i].hatchper + "','" + tbleModel[i].cpitemname + "','" + tbleModel[i].grosstotal + "','" + tbleModel[i].overheadcostperegg + "','" + tbleModel[i].overheadcostperegg + "','" + tbleModel[i].nettotal + "'],"
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
                "pdfMake.createPdf(docDefinition).download('Production_report.pdf');" +
                "} });";
            headertable1 += "</script></html>";
            fullHtml += headertable1;
            var wind = window.open();
            wind.document.write(fullHtml);
            setTimeout(function () {
                wind.close();
            }, 3000);
        },

        // generate CSV file for Production Report
        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            let locationname = this.locationname;
            let partyname = this.partyname;
            let breederbatch = this.breederBach;
            let filename = locationname + '_' + partyname + '_' + breederbatch;

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
                        name: "Party Name",
                        template: { content: "{partyname}" }
                    },
                    {
                        name: "Batch No.",
                        template: { content: "{breederbatchname}" }
                    },
                    {
                        name: "Set Date",
                        template: { content: "{setterbatchdate}" }
                    },
                    {
                        name: "Setter Batch",
                        template: { content: "{setterbatchid}" }
                    },
                    {
                        name: "Hatch Date",
                        template: { content: "{hatcherbatchdate}" }
                    },
                    {
                        name: "Hatcher Batch",
                        template: { content: "{hatcherbatchid}" }
                    },
                    {
                        name: "Total Hatchable Egg Received",
                        template: { content: "{totalhatcheggreceived}" }
                    },
                    {
                        name: "Hatchable Egg Rate",
                        template: { content: "{rate}" }
                    },
                    {
                        name: "Egg Amount",
                        template: { content: "{totalamt}" }
                    },
                    {
                        name: "Total Chicks",
                        template: { content: "{totalchicks}" }
                    },
                    {
                        name: "Saleable Chicks (%)",
                        template: { content: "{sellableper}" }
                    },
                    {
                        name: "Culls(%)",
                        template: { content: "{cullsper}" }
                    },
                    {
                        name: "Hatch(%)",
                        template: { content: "{hatchper}" }
                    },
                    {
                        name: "Breed",
                        template: { content: "{cpitemname}" }
                    },
                    {
                        name: "Gross Production Cost/Chicks",
                        template: { content: "{grosstotal}" }
                    },
                    {
                        name: "Admin Cost/Chick",
                        template: { content: "{overheadcostperegg}" }
                    },
                    {
                        name: "Overhead Cost/Chicks",
                        template: { content: "{overheadcostperegg}" }
                    },
                    {
                        name: "Net Cost/Chicks",
                        template: { content: "{nettotal}" }
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
