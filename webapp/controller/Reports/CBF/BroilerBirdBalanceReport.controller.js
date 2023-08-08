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

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.CBF.BroilerBirdBalanceReport", {


        onInit: function () {
            this.currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");

            this.getAllFarmerEnquiry(this);
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
                farmer_id: null,
            }
        },
        // Function for get Broiler Bird Balance Report
        getCBFBroilerBirdBalanceReport: function () {
            if (this.validateForm()) {
                var currentContext = this;
                var farmstring = this.getView().byId("allFarmList").getSelectedKeys();
                var batchstring = this.getView().byId("batchno").getSelectedKeys();
                var farmStr = "";
                var batchStr = "";

                for (var i = 0; i < farmstring.length; i++) {
                    if (i == 0)
                        farmStr = parseInt(farmstring[i]);
                    else
                        farmStr = farmStr + "," + parseInt(farmstring[i]);
                }

                for (var i = 0; i < batchstring.length; i++) {
                    if (i == 0)
                        batchStr = parseInt(batchstring[i]);
                    else
                        batchStr = batchStr + "," + parseInt(batchstring[i]);
                }

                var curdate = this.getView().byId("curdate").getValue();
                cBFReportsService.getBroilerBirdBalanceReport({ todate: curdate, farm_id: farmStr, batchid: batchStr }, function async(data) {

                    var oBatchModel = currentContext.getView().getModel("tblModel");
                    oBatchModel.setData({ modelData: data[0] });

                })
            }
            this.getView().byId("txtdownload").setVisible(true);
        },

        //Function for get all farmers
        getAllFarmerEnquiry: function (currentContext) {
            commonService.getAllFarmerEnquiry(function (data) {
                var oBranchModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "farm_name": "Select All" });
                    } else {
                        MessageBox.error("Farm not available.")
                    }
                }

                oBranchModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oBranchModel, "farmModel");
            });
        },

        // get all batches under farm by passing farm
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
                        MessageBox.error("Farm  not available.")
                    }
                }

                currentContext.getView().setModel(oBatchModel, "batchModel");
                oBatchModel.setData({ modelData: data[0] });

            });

            this.getView().byId("allFarmList").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        farmSelectionChange: function (oEvent) {
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

        // select all functionality for Batches
        batchSelectionFinish: function (oEvt) {
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedbatch = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedbatch.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }

            this.batchname = [];
            for (var i = 0; i < selectedbatch.length; i++) {
                this.batchname.push(selectedbatch[i].key);
            }
            this.batchnamepdf = [];
            for (var i = 0; i < selectedbatch.length; i++) {
                this.batchnamepdf.push(selectedbatch[i].text);
            }

            this.getView().byId("batchno").setValueState(sap.ui.core.ValueState.None);

            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },


        replaceStr: function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },

        // Function Used For PDF Download

        replaceTemplateData: function (template) {
            // Item table Data --------------

            var tbleModel = this.getView().getModel("tblModel").oData.modelData;
            var htmTable = "";
            for (var indx in tbleModel) {

                var model = tbleModel[indx];
                // Replace/create column sequence data table
                htmTable += "<tr>";
                htmTable += "<td align='center'>" + model["farm_name"] + "</td>"
                htmTable += "<td>" + model["farmer_name"] + "</td>"
                htmTable += "<td>" + model["batch_number"] + "</td>"
                htmTable += "<td align='right'>" + model["placementdate"] + "</td>"
                htmTable += "<td align='right'>" + model["batch_place_qty"] + "</td>"
                htmTable += "<td>" + model["totalmortality"] + "</td>"
                htmTable += "<td>" + model["totalbirdsold"] + "</td>"
                htmTable += "<td>" + model["live_batch_date"] + "</td>"
                htmTable += "<td>" + model["birdliveqty"] + "</td>"
                htmTable += "<td>" + model["totalchickcost"] + "</td>"
                htmTable += "<td align='center'>" + model["administrationcost"] + "</td>"
                htmTable += "<td>" + model["feedconcost"] + "</td>"
                htmTable += "<td align='right'>" + model["medconcost"] + "</td>"
                htmTable += "<td align='right'>" + model["vaccineconcost"] + "</td>"
                htmTable += "<td>" + model["vitaminconcost"] + "</td>"
                htmTable += "<td>" + model["totalcost"] + "</td>"
                htmTable += "<td>" + model["totalbirdsold"] + "</td>"
                htmTable += "<td>" + model["lastliftimgdate"] + "</td>"
                htmTable += "<td>" + model["actfeedcon"] + "</td>"
                htmTable += "<td align='center'>" + model["batchstatus"] + "</td>"
                htmTable += "<td>" + model["costperbird"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;
            var reportdate = this.getView().byId("curdate").getValue();
            var farmername = this.farmname;
            var batchno = this.batchnamepdf;

            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);
            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##ReportFromDate##", reportdate);
            template = this.replaceStr(template, "##FarmerName##", farmername);
            template = this.replaceStr(template, "##BatchNo##", batchno);
            return template;

        },

        broilerBirdBalanceReportCreatePDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("CBF", "BroilerBatchFinancePerformance.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generateLargePDF(template, "Broiler Bird Balance Report");
            });
        },

        // Get PDF for Week Wise Body Weight And FCR Report
        broilerBirdBalanceReportPDF: function (oEvent) {
            var fullHtml = "";
            var fullHtml1 = "";
            var fullHtml2 = "";
            var fullHtml3 = "";
            var createInvoice = this.getView().getModel('tblModel');
            var farmername = this.farmname;
            var batchname = this.batchnamepdf;
            var farmername = this.farmname;
            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;

            var invoice = createInvoice.oData.modelData;
            var headertable1 = "<table  border='1' style='margin-top:150px;width: 1000px;' align='center'>" +
                "<caption style='color:black;font-weight: bold;font-size: large;'></caption>" +
                "<tr><th style='color:black'>Farm Name</th>" +
                "<th style='color:black'>Farmer Name</th>" +
                "<th style='color:black'>Batch</th>" +
                "<th style='color:black'>Placedate</th>" +
                "<th style='color:black'>Place Quantity</th>" +
                "<th style='color:black'>Mortality Quantity</th>" +
                "<th style='color:black'>Sale quantity</th>" +
                "<th style='color:black'>Live Batch Date</th>" +
                "<th style='color:black'>Live Bird Quantity</th>" +
                "<th style='color:black'>Total Chick Cost</th>" +
                "<th style='color:black'>Administration Cost</th>" +
                "<th style='color:black'>Feed Cost</th>" +
                "<th style='color:black'>Medicine Cost</th>" +
                "<th style='color:black'>Vaccine Cost</th>" +
                "<th style='color:black'>Vitmine Cost</th>" +
                "<th style='color:black'>Total Cost</th>" +
                "<th style='color:black'>Live Age</th>" +
                "<th style='color:black'>Last Sale Date</th>" +
                "<th style='color:black'>Feed Consumed</th>" +
                "<th style='color:black'>Batch Status</th>" +
                "<th style='color:black'>Cost/Bird</th></tr>"


            var titile1 = "<table  style='margin-top:50px;width:800px;' align='center'>" +
                "<caption style='color:black;font-weight: bold;font-size: large;'>Broiler Bird Balance Report</caption>"

            var batchname1 = "<table  style='margin-top:60px;width: 800px;' align='left'>" +
                "<caption style='color:black;font-weight: bold;font-size: large;'></caption>"

            var header = "<table  style='margin-top:-60px;width: 500px;' align='left'; padding: 0px;font-size: 14px;margin: 0;line-height:1;cellpadding=0px; cellspacing=0px>" +
                "<caption style='color:black;font-weight: bold;font-size: large;'></caption>"

            header += "<tr>" + "<th align='left'> CompanyName </th>" + "<td align='left'>" + companyname + "</td>" + "</tr>" +
                "<tr>" + "<th align='left'> Companycontact </th>" + "<td align='left'>" + companycontact + "</td>" + "<br>" + "</tr>" +
                "<tr>" + "<th align='left'> Email </th>" + "<td align='left'>" + companyemail + "</td>" + "<br>" + "</tr>" +
                "<tr>" + "<th align='left'> Address </th>" + "<td align='left'>" + address + "</td>" + "<br>" + "</tr>" +
                "<tr>" + "<th align='left'> PinCode </th>" + "<td align='left'>" + pincode + "</td>" + "<br>" + "</tr>";


            batchname1 += "<tr>" + "<th align='left'>Batch Name </th>" + "<td align='left'>" + batchname + "</td>" +
                "<th align='right'>Farmer Name </th>" + "<td align='right'>" + farmername + "</td>" + "<br>" + "</tr>";

            //Adding row dynamically to student table....

            for (var i = 0; i < invoice.length; i++) {
                headertable1 += "<tr>" +
                    "<td>" + invoice[i].farm_name + "</td>" +
                    "<td>" + invoice[i].farmer_name + "</td>" +
                    "<td>" + invoice[i].batch_number + "</td>" +
                    "<td>" + invoice[i].placementdate + "</td>" +
                    "<td>" + invoice[i].batch_place_qty + "</td>" +
                    "<td>" + invoice[i].totalmortality + "</td>" +
                    "<td>" + invoice[i].totalbirdsold + "</td>" +
                    "<td>" + invoice[i].live_batch_date + "</td>" +
                    "<td>" + invoice[i].birdliveqty + "</td>" +
                    "<td>" + invoice[i].totalchickcost + "</td>" +
                    "<td>" + invoice[i].administrationcost + "</td>" +
                    "<td>" + invoice[i].feedconcost + "</td>" +
                    "<td>" + invoice[i].medconcost + "</td>" +
                    "<td>" + invoice[i].vaccineconcost + "</td>" +
                    "<td>" + invoice[i].vitaminconcost + "</td>" +
                    "<td>" + invoice[i].totalcost + "</td>" +
                    "<td>" + invoice[i].ageindays + "</td>" +
                    "<td>" + invoice[i].lastliftimgdate + "</td>" +
                    "<td>" + invoice[i].actfeedcon + "</td>" +
                    "<td>" + invoice[i].batchstatus + "</td>" +
                    "<td>" + invoice[i].costperbird + "</td>" +

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

            //setTimeout(function() {


            wind.print();
            wind.close();
            wind.stop();
            //},1000);
        },

        // validation function for report filters
        validateForm: function () {
            var isValid = true;

            if (!commonFunction.ismultiComRequired(this, "allFarmList", "Farm is required"))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "batchno", "batch is required."))
                isValid = false;
            return isValid;
        },

        // Function for CSV file  for Broiler Bird Balance Report
        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var farmername = this.farmname;
            var batchname = this.batchnamepdf;
            var farmername = this.farmname;

            var filename = farmername + '_' + batchname;

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
                        name: "Farm Name",
                        template: { content: "{farm_name}" }
                    },
                    {
                        name: "Farmer Name",
                        template: { content: "{farmer_name}" }
                    },
                    {
                        name: "Batch No.",
                        template: { content: "{batch_number}" }
                    },
                    {
                        name: "Place Date",
                        template: { content: "{placementdate}" }
                    },
                    {
                        name: "Place Quantity",
                        template: { content: "{batch_place_qty}" }
                    },
                    {
                        name: "Mortality Quantity",
                        template: { content: "{totalmortality}" }
                    },
                    {
                        name: "Sales Quantity",
                        template: { content: "{totalbirdsold}" }
                    },
                    {
                        name: "Live Batch Date",
                        template: { content: "{live_batch_date}" }
                    },
                    {
                        name: "Live Bird Quantity",
                        template: { content: "{birdliveqty}" }
                    },
                    {
                        name: "Total Chick Cost",
                        template: { content: "{totalchickcost}" }
                    },
                    {
                        name: "Administration Cost",
                        template: { content: "{administrationcost}" }
                    },
                    {
                        name: "Feed Cost",
                        template: { content: "{feedconcost}" }
                    },
                    {
                        name: "Medicine Cost",
                        template: { content: "{medconcost}" }
                    },
                    {
                        name: "Vaccine Cost",
                        template: { content: "{vaccineconcost}" }
                    },
                    {
                        name: "Vitamin Cost",
                        template: { content: "{vitaminconcost}" }
                    },
                    {
                        name: "Total Cost",
                        template: { content: "{totalcost}" }
                    },
                    {
                        name: "Live Age",
                        template: { content: "{ageindays}" }
                    },
                    {
                        name: "Sale Last Date",
                        template: { content: "{lastliftimgdate}" }
                    },
                    {
                        name: "Feed Consumed",
                        template: { content: "{actfeedcon}" }
                    },
                    {
                        name: "Batch Status",
                        template: { content: "{batchstatus}" }
                    },
                    {
                        name: "Cost/Bird",
                        template: { content: "{costperbird}" }
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
