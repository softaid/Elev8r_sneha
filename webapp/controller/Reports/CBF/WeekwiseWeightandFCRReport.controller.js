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

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.CBF.WeekwiseWeightandFCRReport", {

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

        /* Start PDF functionality*/
        //  Function for  Week wise body weight and FCR Report PDF generation 
        replaceStr: function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },
        replaceTemplateData: function (template) {
            // Item table Data --------------

            var tbleModel = this.getView().getModel("tblModel").oData.modelData;

            var htmTable = "";
            for (var indx in tbleModel) {
                var model = tbleModel[indx];
                // Replace/create column sequence data table
                htmTable += "<tr>";
                htmTable += "<td align='center'>" + model["placement_date"] + "</td>"
                htmTable += "<td>" + model["farmer_name"] + "</td>"
                htmTable += "<td align='right'>" + model["farm_name"] + "</td>"
                htmTable += "<td align='right'>" + model["batch_id"] + "</td>"
                htmTable += "<td>" + model["branchname"] + "</td>"
                htmTable += "<td>" + model["linename"] + "</td>"
                htmTable += "<td>" + model["chick_qty"] + "</td>"
                htmTable += "<td>" + model["fweekbw"] + "</td>"
                htmTable += "<td>" + model["fweekfcr"] + "</td>"
                htmTable += "<td align='center'>" + model["sweekbw"] + "</td>"
                htmTable += "<td>" + model["fweekfcr"] + "</td>"
                htmTable += "<td align='right'>" + model["tweekbw"] + "</td>"
                htmTable += "<td align='right'>" + model["tweekfcr"] + "</td>"
                htmTable += "<td>" + model["forthweekbw"] + "</td>"
                htmTable += "<td>" + model["fourthfcr"] + "</td>"
                htmTable += "<td>" + model["fifththweekbw"] + "</td>"
                htmTable += "<td>" + model["fifthweekfcr"] + "</td>"
                htmTable += "<td>" + model["sixweekbw"] + "</td>"
                htmTable += "<td align='center'>" + model["sixweekfcr"] + "</td>"
                htmTable += "<td>" + model["sevenweekbw"] + "</td>"
                htmTable += "<td align='right'>" + model["sevenweekfcr"] + "</td>"
                htmTable += "<td>" + model["eightweekbw"] + "</td>"
                htmTable += "<td align='center'>" + model["eightweekfcr"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;

            var curdate = this.getView().byId("curdate").getValue();
            var branchname = this.branchname;
            var linename = this.linename;
            var farmername = this.farmername;
            var farmname = this.farmname;
            var batchname = this.batchname;
            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);
            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##Date##", curdate);
            template = this.replaceStr(template, "##BranchName##", branchname);
            template = this.replaceStr(template, "##LineName##", linename);
            template = this.replaceStr(template, "##FarmerName##", farmername);
            template = this.replaceStr(template, "##FarmName##", farmname);
            template = this.replaceStr(template, "##BatchName##", batchname);
            return template;

        },

        weekWiseBodyWeightandFCRCreatePDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("CBF", "WeekWiseBodyweightandFCRReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generateLargePDF(template, "Week Wise Body Weight And FCR Report");
            });
        },
        /*End PDF functionality*/

        // Get data for Week Wise Body Weight And FCR Report
        getWeekWiseBodyWeightandFCRReport: function () {
            if (this.validateForm()) {
                var currentContext = this;
                var batchstring = this.getView().byId("batchno").getSelectedKeys();
                var branchstring = this.getView().byId("branchList").getSelectedKeys();
                var lineString = this.getView().byId("lineList").getSelectedKeys();
                var farmerstring = this.getView().byId("farmerList").getSelectedKeys();
                var farmstring = this.getView().byId("farmList").getSelectedKeys();

                var batchStr = "";
                var branchStr = "";
                var linestr = "";
                var farmerstr = "";
                var farmstr = "";

                for (var i = 0; i < branchstring.length; i++) {
                    if (i == 0)
                        branchStr = parseInt(branchstring[i]);
                    else
                        branchStr = branchStr + "," + parseInt(branchstring[i]);
                }

                for (var i = 0; i < lineString.length; i++) {
                    if (i == 0)
                        linestr = parseInt(lineString[i]);
                    else
                        linestr = linestr + "," + parseInt(lineString[i]);
                }

                for (var i = 0; i < farmerstring.length; i++) {
                    if (i == 0)
                        farmerstr = parseInt(farmerstring[i]);
                    else
                        farmerstr = farmerstr + "," + parseInt(farmerstring[i]);
                }

                for (var i = 0; i < farmstring.length; i++) {
                    if (i == 0)
                        farmstr = parseInt(farmstring[i]);
                    else
                        farmstr = farmstr + "," + parseInt(farmstring[i]);
                }

                for (var i = 0; i < batchstring.length; i++) {
                    if (i == 0)
                        batchStr = parseInt(batchstring[i]);
                    else
                        batchStr = batchStr + "," + parseInt(batchstring[i]);
                }

                var curdate = this.getView().byId("curdate").getValue();
                cBFReportsService.getWeightFCRreport({ curdate: curdate, branchid: branchStr, lineid: linestr, farmerid: farmerstr, farmid: farmstr, batch_id: batchStr }, function async(data) {
                    var oBatchModel = currentContext.getView().getModel("tblModel");
                    oBatchModel.setData({ modelData: data[0] });

                })
            }
            this.getView().byId("txtdownload").setVisible(true);
        },


        // Function for get Branches
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

        // get Lines under branch by passing branch
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

        // get all farmers under line by passing line
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
                var oBatchModel = new sap.ui.model.json.JSONModel()
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
        // get all farm under farmer by passing farmer
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
                        MessageBox.error("farm  not availabel.")
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

            if (!commonFunction.ismultiComRequired(this, "branchList", "Branch is required"))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "lineList", "Line is required."))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "farmerList", "farmer is required."))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "farmList", "farm is required."))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "batchno", "batch is required."))
                isValid = false;

            return isValid;
        },

        weekWiseBodyWeightandFCRPDF: function (oEvent) {
            var fullHtml = "";
            var fullHtml1 = "";
            var fullHtml2 = "";
            var fullHtml3 = "";
            var createInvoice = this.getView().getModel('tblModel');
            var farmername = this.farmname;
            var batchname = this.batchnamepdf;
            var farmername = this.farmname;

            var branchname = this.branchname;
            var linename = this.linename;
            var farmername = this.farmername;
            var farmname = this.farmname;
            var batchname = this.batchname;
            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;

            var invoice = createInvoice.oData.modelData;
            var headertable1 = "<table  border='1' style='margin-top:150px;width: 1000px;' align='center'>" +
                "<caption style='color:black;font-weight: bold;font-size: large;'></caption>" +
                "<tr><th style='color:black'>Placement Date</th>" +
                "<th style='color:black'>Farmer Name</th>" +
                "<th style='color:black'>Farm Name</th>" +
                "<th style='color:black'>Batch Number</th>" +
                "<th style='color:black'>Branch Name</th>" +
                "<th style='color:black'>Line Name</th>" +
                "<th style='color:black'>Placement Quantity</th>" +
                "<th style='color:black'>1st Week Body Weight</th>" +

                "<th style='color:black'>1st Week FCR</th>" +
                "<th style='color:black'>2nd Week Body Weight</th>" +
                "<th style='color:black'>2nd Week FCR</th>" +
                "<th style='color:black'>3rd Week Body Weight</th>" +
                "<th style='color:black'>3rd Week FCR</th>" +
                "<th style='color:black'>4th Week Body Weight</th>" +
                "<th style='color:black'>4th Week FCR</th>" +

                "<th style='color:black'>5th Week Body Weight</th>" +
                "<th style='color:black'>5th Week FCR</th>" +
                "<th style='color:black'>6th Week Body Weight</th>" +
                "<th style='color:black'>6th Week FCR</th>" +
                "<th style='color:black'>7th Week Body Weight</th>" +

                "<th style='color:black'>7th Week FCR</th>" +
                "<th style='color:black'>8th Week Body Weight</th>" +
                "<th style='color:black'>8th Week FCR</th></tr>"


            var titile1 = "<table  style='margin-top:50px;width:800px;' align='center'>" +
                "<caption style='color:black;font-weight: bold;font-size: large;'>Weekwise Body Weight FCR Report</caption>"


            var batchname1 = "<table  style='margin-top:60px;width: 800px;' align='left'>" +
                "<caption style='color:black;font-weight: bold;font-size: large;'></caption>"

            var header = "<table  style='margin-top:-60px;width: 500px;' align='left'; padding: 0px;font-size: 14px;margin: 0;line-height:1;cellpadding=0px; cellspacing=0px>" +
                "<caption style='color:black;font-weight: bold;font-size: large;'></caption>"

            header += "<tr>" + "<th align='left'> CompanyName </th>" + "<td align='left'>" + companyname + "</td>" + "</tr>" +
                "<tr>" + "<th align='left'> Companycontact </th>" + "<td align='left'>" + companycontact + "</td>" + "<br>" + "</tr>" +
                "<tr>" + "<th align='left'> Email </th>" + "<td align='left'>" + companyemail + "</td>" + "<br>" + "</tr>" +
                "<tr>" + "<th align='left'> Address </th>" + "<td align='left'>" + address + "</td>" + "<br>" + "</tr>" +
                "<tr>" + "<th align='left'> PinCode </th>" + "<td align='left'>" + pincode + "</td>" + "<br>" + "</tr>";


            batchname1 += "<tr>" + "<th align='left'>Branch  Name </th>" + "<td align='left'>" + branchname + "</td>" +
                "<th align='right'>Line Name </th>" + "<td align='right'>" + linename + "</td>" + "<br>" + "</tr>";
            "<tr>" + "<th align='left'> Farmer Name </th>" + "<td align='left'>" + farmername + "</td>" +
                "<th align='right'> Farm Name </th>" + "<td align='right'>" + farmname + "</td>" + "<br>" + "</tr>" +
                "<tr>" + "<th align='Left'>Batch No </th>" + "<td align='left'>" + batchname + "</td>" + "<br>" + "</tr>";


            //Adding row dynamically to student table....

            for (var i = 0; i < invoice.length; i++) {
                headertable1 += "<tr>" +
                    "<td>" + invoice[i].placement_date + "</td>" +
                    "<td>" + invoice[i].farmer_name + "</td>" +
                    "<td>" + invoice[i].farm_name + "</td>" +
                    "<td>" + invoice[i].batch_number + "</td>" +
                    "<td>" + invoice[i].branchname + "</td>" +
                    "<td>" + invoice[i].linename + "</td>" +
                    "<td>" + invoice[i].chick_qty + "</td>" +

                    "<td>" + invoice[i].fweekbw + "</td>" +
                    "<td>" + invoice[i].fweekfcr + "</td>" +
                    "<td>" + invoice[i].sweekbw + "</td>" +
                    "<td>" + invoice[i].sweekfcr + "</td>" +
                    "<td>" + invoice[i].tweekbw + "</td>" +
                    "<td>" + invoice[i].tweekfcr + "</td>" +
                    "<td>" + invoice[i].forthweekbw + "</td>" +
                    "<td>" + invoice[i].fourthweekfcr + "</td>" +

                    "<td>" + invoice[i].fifththweekbw + "</td>" +
                    "<td>" + invoice[i].fifthweekfcr + "</td>" +
                    "<td>" + invoice[i].sixweekbw + "</td>" +
                    "<td>" + invoice[i].sixweekfcr + "</td>" +
                    "<td>" + invoice[i].sevenweekbw + "</td>" +
                    "<td>" + invoice[i].sevenweekfcr + "</td>" +
                    "<td>" + invoice[i].eightweekbw + "</td>" +
                    "<td>" + invoice[i].eightweekfcr + "</td>" +

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


        // Function for CSV file for Weekwise Body Weight FCR Report
        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var branchname = this.branchname;
            var linename = this.linename;
            var farmername = this.farmername;
            var farmname = this.farmname;
            var batchname = this.batchname;

            var filename = branchname + '_' + linename + '_' + farmername + '_' + farmname + '_' + batchname;

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
                        name: "Placement Date",
                        template: { content: "{placement_date}" }
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
                        name: "Batch No.",
                        template: { content: "{batch_number}" }
                    },
                    {
                        name: "Branch Name",
                        template: { content: "{branchname}" }
                    },
                    {
                        name: "Line Name",
                        template: { content: "{linename}" }
                    },
                    {
                        name: "Placement Quantity",
                        template: { content: "{chick_qty}" }
                    },
                    {
                        name: "1st Week Body Weight",
                        template: { content: "{fweekbw}" }
                    },
                    {
                        name: "1st Week FCR",
                        template: { content: "{fweekfcr}" }
                    },
                    {
                        name: "2nd Week Body Weight",
                        template: { content: "{sweekbw}" }
                    },

                    {
                        name: "2nd Week FCR",
                        template: { content: "{sweekfcr}" }
                    },
                    {
                        name: "3rd Week Body Weight",
                        template: { content: "{tweekbw}" }
                    },
                    {
                        name: "3rd Week FCR",
                        template: { content: "{tweekfcr}" }
                    },
                    {
                        name: "4th Week Body Weight",
                        template: { content: "{forthweekbw}" }
                    },
                    {
                        name: "4th Week FCR",
                        template: { content: "{fourthweekfcr}" }
                    },
                    {
                        name: "5th Week Body Weight",
                        template: { content: "{fifththweekbw}" }
                    },

                    {
                        name: "5th Week FCR",
                        template: { content: "{fifthweekfcr}" }
                    },
                    {
                        name: "6th Week Body Weight",
                        template: { content: "{sixweekbw}" }
                    },
                    {
                        name: "6th Week FCR",
                        template: { content: "{sixweekfcr}" }
                    },
                    {
                        name: "7th Week Body Weight",
                        template: { content: "{sevenweekbw}" }
                    },
                    {
                        name: "7th Week FCR",
                        template: { content: "{sevenweekfcr}" }
                    },
                    {
                        name: "8th Week Body Weight",
                        template: { content: "{eightweekbw}" }
                    },
                    {
                        name: "8th Week FCR",
                        template: { content: "{eightweekfcr}" }
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
