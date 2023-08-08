sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/CBFReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',

], function (JSONModel, BaseController, MessageBox, Export, ExportTypeCSV, commonFunction, cBFReportsService, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.CBF.Growingchargereport", {


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

        // get Growing Charge Report
        getcbfGrowingchargeReport: function () {
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

                cBFReportsService.getGrowingchargesReport({ batchid: batchStr }, function async(data) {
                    var oBatchModel = currentContext.getView().getModel("tblModel");
                    oBatchModel.setData({ modelData: data[0] });
                })
            }
            this.getView().byId("txtdownload").setVisible(true);
        },

        // function for get all farmer
        getAllFarmerEnquiry: function (currentContext) {
            commonService.getAllFarmerEnquiry(function (data) {
                var oBranchModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "farm_name": "Select All" });
                    } else {
                        MessageBox.error("farm not availabel.")
                    }
                }

                oBranchModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oBranchModel, "farmModel");
            });
        },

        // get all batches under farm
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
                        MessageBox.error("farm  not availabel.")
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

        // select all functionality for farm
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
        // select all functionality for batch
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

        // validation function for report filters
        validateForm: function () {
            var isValid = true;

            if (!commonFunction.ismultiComRequired(this, "allFarmList", "Farm is required"))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "batchno", "batch is required."))
                isValid = false;
            return isValid;
        },


        // Generate PDf for Growing Charge Report
        getGrowingchargesReportPDF: function (oEvent) {
            var fullHtml = "";
            var fullHtml1 = "";
            var fullHtml2 = "";
            var fullHtml3 = "";
            var createInvoice = this.getView().getModel('tblModel');
            var farmername = this.farmname;
            var batchname = this.batchnamepdf;
            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;

            var invoice = createInvoice.oData.modelData;
            var headertable1 = "<table  border='1' style='margin-top:150px;width: 1000px;' align='center'>" +
                "<caption style='color:black;font-weight: bold;font-size: large;'></caption>" +

                "<tr><th style='color:black'>Farm Name</th>" +
                "<th style='color:black'>Batch No</th>" +
                "<th style='color:black'>Shed Name</th>" +
                "<th style='color:black'>scheme</th>" +
                "<th style='color:black'>Placed Bird</th>" +
                "<th style='color:black'>Total Mortality</th>" +
                "<th style='color:black'>Total Feed Consumed</th>" +
                "<th style='color:black'>Feed Cost</th>" +
                "<th style='color:black'>Medicine Cost</th>" +
                "<th style='color:black'>Vaccine Cost</th>" +
                "<th style='color:black'>Vitamine Cost</th>" +
                "<th style='color:black'>Administration Cost</th>" +

                "<th style='color:black'>Actual Production Cost</th>" +
                "<th style='color:black'>Production Cost/Kg</th>" +
                "<th style='color:black'>Production Cost/Bird</th>" +
                "<th style='color:black'>Total Sold Bird</th>" +
                "<th style='color:black'>Sold Weight</th>" +
                "<th style='color:black'>Average Size</th>" +
                "<th style='color:black'>Average Lifting Age</th>" +


                "<th style='color:black'>Average Sale Rate</th>" +
                "<th style='color:black'>FCR</th>" +
                "<th style='color:black'>CFCR</th>" +
                "<th style='color:black'>Additional Incentive</th>" +
                "<th style='color:black'>Mortality Incentive</th>" +
                "<th style='color:black'>Mortality Deduction</th>" +
                "<th style='color:black'>Excees Bird</th>" +


                "<th style='color:black'>Excees Bird Incentive</th>" +
                "<th style='color:black'>EEF/BPI</th>" +
                "<th style='color:black'>FCR Deduction</th>" +
                // "<th style='color:black'>FCR Incentive</th>" +
                "<th style='color:black'>Bird Shortage</th>" +
                "<th style='color:black'>Compensate Amount</th>" +
                "<th style='color:black'>Rearing Charges Payable</th>" +

                "<th style='color:black'>Down Payment</th>" +
                "<th style='color:black'>Freight Amount</th>" +
                "<th style='color:black'>TDS</th>" +
                "<th style='color:black'>Net payable Amount</th></tr>"


            var titile1 = "<table  style='margin-top:50px;width:800px;' align='center'>" +
                "<caption style='color:black;font-weight: bold;font-size: large;'>Growing Charge Report</caption>"


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
                    "<td>" + invoice[i].batch_number + "</td>" +
                    "<td>" + invoice[i].shed_name + "</td>" +
                    "<td>" + invoice[i].name + "</td>" +
                    "<td>" + invoice[i].batchplaceqty + "</td>" +
                    "<td>" + invoice[i].totalmortality + "</td>" +
                    "<td>" + invoice[i].totalfeedconsumed + "</td>" +

                    "<td>" + invoice[i].totalfeedcost + "</td>" +
                    "<td>" + invoice[i].totalmedicinecost + "</td>" +
                    "<td>" + invoice[i].totalvaccinecost + "</td>" +
                    "<td>" + invoice[i].vitmineconcost + "</td>" +
                    "<td>" + invoice[i].administrationcost + "</td>" +
                    "<td>" + invoice[i].actualproductioncost + "</td>" +
                    "<td>" + invoice[i].productioncostperkg + "</td>" +
                    "<td>" + invoice[i].productioncostperbird + "</td>" +

                    "<td>" + invoice[i].totalsaleqty + "</td>" +
                    "<td>" + invoice[i].totalsaleweight + "</td>" +
                    "<td>" + invoice[i].avgweightofbird + "</td>" +
                    "<td>" + invoice[i].avgweightofbird + "</td>" +
                    "<td>" + invoice[i].avgsellingrate + "</td>" +
                    "<td>" + invoice[i].fcr + "</td>" +

                    "<td>" + invoice[i].cfcr + "</td>" +
                    "<td>" + invoice[i].additionalincentive + "</td>" +
                    "<td>" + invoice[i].mortalityincentive + "</td>" +
                    "<td>" + invoice[i].totalmortalitydeduction + "</td>" +
                    "<td>" + invoice[i].excessbirds + "</td>" +
                    "<td>" + invoice[i].excessbirdincentive + "</td>" +
                    "<td>" + invoice[i].eefvalue + "</td>" +
                    "<td>" + invoice[i].fcrdeduction + "</td>" +

                    "<td>" + invoice[i].birdshortage + "</td>" +
                    "<td>" + invoice[i].compensateamt + "</td>" +
                    "<td>" + invoice[i].rearingchargepayable + "</td>" +
                    "<td>" + invoice[i].totaldownpayment + "</td>" +
                    "<td>" + invoice[i].freightamt + "</td>" +
                    "<td>" + invoice[i].tds + "</td>" +
                    "<td>" + invoice[i].netpayableamt + "</td>" +
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

        // Function for CSV file  for Broiler Bird Balance Report
        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var farmername = this.farmname;
            var batchname = this.batchnamepdf;


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
                        name: "Batch No",
                        template: { content: "{batch_number}" }
                    },
                    {
                        name: "Shed Name",
                        template: { content: "{shed_name}" }
                    },
                    {
                        name: "Scheme",
                        template: { content: "{name}" }
                    },
                    {
                        name: "Placed Bird",
                        template: { content: "{batchplaceqty}" }
                    },
                    {
                        name: "Total Mortality",
                        template: { content: "{totalmortality}" }
                    },
                    {
                        name: "Total Feed Consumed",
                        template: { content: "{totalfeedconsumed}" }
                    },
                    {
                        name: "Feed Cost",
                        template: { content: "{totalfeedcost}" }
                    },
                    {
                        name: "Medicine Cost",
                        template: { content: "{totalmedicinecost}" }
                    },
                    {
                        name: "Vaccine Cost",
                        template: { content: "{totalvaccinecost}" }
                    },
                    {
                        name: "Vitamin Cost",
                        template: { content: "{vitmineconcost}" }
                    },
                    {
                        name: "Administration Cost",
                        template: { content: "{administrationcost}" }
                    },
                    {
                        name: "Actual Production Cost",
                        template: { content: "{actualproductioncost}" }
                    },
                    {
                        name: "Production Cost/Kg",
                        template: { content: "{productioncostperkg}" }
                    },
                    {
                        name: "Production Cost/Bird",
                        template: { content: "{productioncostperbird}" }
                    },
                    {
                        name: "Total Sold Bird",
                        template: { content: "{totalsaleqty}" }
                    },
                    {
                        name: "Sold Weight",
                        template: { content: "{totalsaleweight}" }
                    },
                    {
                        name: "Average Size",
                        template: { content: "{avgweightofbird}" }
                    },
                    {
                        name: "Average Lifting Age",
                        template: { content: "{avgliftingage}" }
                    },
                    {
                        name: "Average Sale Rate",
                        template: { content: "{avgsellingrate}" }
                    },
                    {
                        name: "FCR",
                        template: { content: "{fcr}" }
                    },
                    {
                        name: "CFCR",
                        template: { content: "{cfcr}" }
                    },
                    {
                        name: "Additional Incentive",
                        template: { content: "{additionalincentive}" }
                    },
                    {
                        name: "Mortality Incentive",
                        template: { content: "{mortalityincentive}" }
                    },
                    {
                        name: "Mortality Deduction",
                        template: { content: "{totalmortalitydeduction}" }
                    },
                    {
                        name: "Excees Bird",
                        template: { content: "{excessbirds}" }
                    },
                    {
                        name: "Excees Bird Incentive",
                        template: { content: "{excessbirdincentive}" }
                    },
                    {
                        name: "EEF/BPI",
                        template: { content: "{eefvalue}" }
                    },
                    {
                        name: "FCR Deduction",
                        template: { content: "{fcrdeduction}" }
                    },
                    {
                        name: "Bird Shortage",
                        template: { content: "{birdshortage}" }
                    },
                    {
                        name: "compensate Amount",
                        template: { content: "{compensateamt}" }
                    },
                    {
                        name: "Rearing Charges Payable",
                        template: { content: "{rearingchargepayable}" }
                    },
                    {
                        name: "Down Payment",
                        template: { content: "{totaldownpayment}" }
                    },
                    {
                        name: "Freight Amount",
                        template: { content: "{freightamt}" }
                    },
                    {
                        name: "TDS",
                        template: { content: "{tds}" }
                    },
                    {
                        name: "Net payable Amount",
                        template: { content: "{netpayableamt}" }
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
