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

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.CBF.BirdSalesregisterReport", {

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
            this.getAllFarmerEnquiry(this);

            var emptyModel = this.getModelDefault();
            model.setData(emptyModel)
            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "tblModel");

            var modelone = new JSONModel();
            modelone.setData({ modelData: [] });
            this.getView().setModel(modelone, "tblModelone");

            this.getAllFarmer();
            this.handleRouteMatched(null);
            this.getView().byId("txtdownload").setVisible(false);
        },

        getModelDefault: function () {
            return {
                customerid: null,
                batchid: null,
                shedid: null,
                farmerid: null,
                fromdate: null,
                todate: null
            }
        },

        // handleRouteMatched: function (evt) {
        //     this.getView().byId("singlesupplier").setVisible(true);
        //     this.getView().byId("multiplesupplier").setVisible(false);
        // },

        handleRouteMatched: function (evt) {            
            commonFunction.getAllCommonBranch(this);
            this.getView().byId("singlesupplier").setVisible(false);
        },

        resetModel: function () {
            var tbleModel = this.getView().getModel("tblModel");
            tbleModel.setData({ modelData: [] });

            var pModel = this.getView().getModel("reportModel");
            pModel.setData([]);
        },

        // get All Farmer
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
                        data[0].unshift({ "id": "All", "batch_number": "Select All" });
                    } else {
                        MessageBox.error("Batch  not available.")
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

        batchSelectionChange: function (oEvent) {
            var changedItem = oEvent.getParameter("changedItem");
            var isSelected = oEvent.getParameter("selected");
            var state = "Selected";

            if (!isSelected) {
                state = "Deselected"
            }

            //Check if "Selected All is selected
            if (changedItem.mProperties.text == "Select All") {
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
            var currentContext = this;
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedbatch = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedbatch.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }

            var batchid = [];
            for (var i = 0; i < selectedbatch.length; i++) {
                batchid.push(selectedbatch[i].key);
            }

            // var farm = [];
            // for (var i = 0; i < selectedKeys.length; i++) {
            //     farm.push(selectedKeys[i].key);
            // }

            this.batchid = batchid;

            this.batchnamepdf = [];
            for (var i = 0; i < selectedbatch.length; i++) {
                this.batchnamepdf.push(selectedbatch[i].text);
            }

           
            cBFReportsService.getAllShedid({ batchid: batchid }, function (data) {
                console.log("data",data);
                var oShedModel = new sap.ui.model.json.JSONModel();

                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "cbfshedid": "All", "shed_name": "Select All" });
                    } else {
                        MessageBox.error("Shed not available.")
                    }
                }

                currentContext.getView().setModel(oShedModel, "shedModel");
                oShedModel.setData({ modelData: data[0] });

            });
            this.getView().byId("batchno").setValueState(sap.ui.core.ValueState.None);


            // cBFReportsService.getAllBatch({ farmid: farm }, function (data) {
              
            //     var oBatchModel = new sap.ui.model.json.JSONModel();

            //     if (data.length > 0) {
            //         if (data[0].length > 0) {
            //             data[0].unshift({ "batch_id": "All", "batch_number": "Select All" });
            //         } else {
            //             MessageBox.error("Batch not available.")
            //         }
            //     }

            //     currentContext.getView().setModel(oBatchModel, "batchModel");
            //     oBatchModel.setData({ modelData: data[0] });

            // });


           
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        ShedSelectionFinish: function (oEvt) {
            var currentContext = this;
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedshed = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedshed.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }

            this.shedid = [];
            for (var i = 0; i < selectedshed.length; i++) {
                this.shedid.push(selectedshed[i].key);
            }
            this.shedname = [];
            for (var i = 0; i < selectedshed.length; i++) {
                this.shedname.push(selectedshed[i].text);
            }

            this.getView().byId("shedid").setValueState(sap.ui.core.ValueState.None);

            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        // Function for pdf start

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
                htmTable += "<td align='center'>" + model["salesinvoiceno"] + "</td>"
                htmTable += "<td>" + model["salesinvoicedate"] + "</td>"
                htmTable += "<td align='right'>" + model["partyname"] + "</td>"
                htmTable += "<td align='right'>" + model["farmer_name"] + "</td>"
                htmTable += "<td>" + model["quantity"] + "</td>"
                htmTable += "<td>" + model["weight"] + "</td>"
                htmTable += "<td>" + model["unitprice"] + "</td>"
                htmTable += "<td>" + model["AvgWeight"] + "</td>"
                htmTable += "<td>" + model["Amount"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;

            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var partyname = this.partyname;
           

            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);
            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##ReportFromDate##", fromdate);
            template = this.replaceStr(template, "##ReporToDate##", todate);
            template = this.replaceStr(template, "##TraderName##", partyname);
            template = this.replaceStr(template, "##FarmerName##", farmername);
            return template;

        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("CBF", "BirdsalesRegisterReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generateLargePDF(template, "Bird sales Register Report");
            });
        },


        replaceStr: function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },

        // Function Used For PDF Download

        replaceTemplateData: function (template) {
            // Item table Data --------------

            var tbleModel = this.getView().getModel("tblModelone").oData.modelData;

            var htmTable = "";
            for (var indx in tbleModel) {
                var model = tbleModel[indx];
                // Replace/create column sequence data table
                htmTable += "<tr>";
                htmTable += "<td align='center'>" + model["farmer_name"] + "</td>"
                htmTable += "<td>" + model["shed_name"] + "</td>"
                htmTable += "<td align='right'>" + model["batch_number"] + "</td>"
                htmTable += "<td align='center'>" + model["salesinvoiceno"] + "</td>"
                htmTable += "<td>" + model["salesinvoicedate"] + "</td>"
                htmTable += "<td align='right'>" + model["partyname"] + "</td>"
                htmTable += "<td align='right'>" + model["farmer_name"] + "</td>"
                htmTable += "<td>" + model["quantity"] + "</td>"
                htmTable += "<td>" + model["weight"] + "</td>"
                htmTable += "<td>" + model["unitprice"] + "</td>"
                htmTable += "<td>" + model["AvgWeight"] + "</td>"
                htmTable += "<td>" + model["Amount"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;

            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var partyname = this.partyname;
            var farmername = this.farmername;
            var shedname = this.shedname;
            var batchname = this.batchnamepdf;

            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);
            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##ReportFromDate##", fromdate);
            template = this.replaceStr(template, "##ReporToDate##", todate);
            template = this.replaceStr(template, "##TraderName##", partyname);
            template = this.replaceStr(template, "##ReportFarmer##", farmername);
            template = this.replaceStr(template, "##ReporBatch##", batchname);
            template = this.replaceStr(template, "##ReporShed##", shedname);
            return template;

        },

        createPDFOne: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("CBF", "BirdsalesRegisterReportone.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generateLargePDF(template, "Bird sales Register Report");
            });
        },





        // Function for pdf finish

        onSearchBirdSalesRegisterReport: function () {
            if (this.validateForm()) {

                var currentContext = this;
                var partystring = this.getView().byId("partyList").getSelectedKeys();
                var partyStr = "";

                for (var i = 0; i < partystring.length; i++) {
                    if (i == 0)
                        partyStr = parseInt(partystring[i]);
                    else
                        partyStr = partyStr + "," + parseInt(partystring[i]);
                }


                var fromdate = this.getView().byId("txtFromdate").getValue();
                var todate = this.getView().byId("txtTodate").getValue();

                cBFReportsService.getBirdSalesRegisterReport({ fromdate: fromdate, todate: todate, customerid: partyStr }, function async(data) {
                    var oBatchModel = currentContext.getView().getModel("tblModel");
                    oBatchModel.setData({ modelData: data[0] });

                })
            }
            this.getView().byId("txtdownload").setVisible(true);
        },

        onSearchBirdSalesRegisterReportone: function () {
           
           // if (this.validateForm()) {

                var currentContext = this;
                var partystring = this.getView().byId("partyList").getSelectedKeys();
                var partyStr = "";

                for (var i = 0; i < partystring.length; i++) {
                    if (i == 0)
                        partyStr = parseInt(partystring[i]);
                    else
                        partyStr = partyStr + "," + parseInt(partystring[i]);
                }


                var fromdate = this.getView().byId("txtFromdate").getValue();
                var todate = this.getView().byId("txtTodate").getValue();

                cBFReportsService.getBirdSalesRegisterReportBatchwise({ fromdate: fromdate,todate: todate,  batchid: this.batchid, shedid: this.shedid, customerid: partyStr}, function async(data) {
                    var oBatchModel = currentContext.getView().getModel("tblModelone");
                    oBatchModel.setData({ modelData: data[0] });

                })
                this.getView().byId("txtdownload").setVisible(true);
            //}
        },


        //get vendor according to partner role purcahseorder 
        getAllFarmer: function () {
            var currentContext = this;
            var partnerroleid = 32;
            commonService.getRolewiseParties({ roleid: partnerroleid }, function (data) {

                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "partyname": "Select All" });
                    } else {
                        MessageBox.error("Party is not available.")
                    }
                }
                var rolewisePartyListModel = new sap.ui.model.json.JSONModel();
                rolewisePartyListModel.setData({ modelData: data[0] });
		        rolewisePartyListModel.setSizeLimit(data[0].length);
                currentContext.getView().setModel(rolewisePartyListModel, "partyModel");
            });
        },


        partySelectionFinish: function (oEvt) {
            var currentContext = this;
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedKeys = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedKeys.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });

            }
            var party = [];

            for (var i = 0; i < selectedKeys.length; i++) {
                party.push(selectedKeys[i].key);
            }

            this.partyname = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                this.partyname.push(selectedKeys[i].text);
            }





            this.getView().byId("partyList").setValueState(sap.ui.core.ValueState.None);

            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });

        },

        partySelectionChange: function (oEvent) {
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
            

            // var farmstring = this.getView().byId("batchno").getSelectedKeys();
            // if (farmstring.length >= 1) {
            //     /*this.getView().byId("txtFromdate").setVisible(true);
            //     this.getView().byId("allFarmList1").setVisible(true);
            //     this.getView().byId("batchno1").setVisible(true);
            //     this.getView().byId("txtTodate").setVisible(true);
            //     this.getView().byId("shedid1").setVisible(true);
            //     this.getView().byId("partyList").setVisible(true);*/
            //     this.getView().byId("multiplesupplier").setVisible(false);
            //     this.getView().byId("singlesupplier").setVisible(true);

            // } else if (farmstring.length < 1) {
            //     /*this.getView().byId("txtFromdate").setVisible(true);
            //     this.getView().byId("allFarmList1").setVisible(true);
            //     this.getView().byId("batchno1").setVisible(false);
            //     this.getView().byId("txtTodate").setVisible(true);
            //     this.getView().byId("shedid1").setVisible(false);
            //     this.getView().byId("partyList").setVisible(true);*/
            //     this.getView().byId("multiplesupplier").setVisible(true);
            //     this.getView().byId("singlesupplier").setVisible(false);




            // }

            var farmstring = this.getView().byId("batchno").getSelectedKeys();
           if (farmstring.length >= 1) {
                // this.getView().byId("txtFromDate").setVisible(true);
                // this.getView().byId("txtToDate").setVisible(true);
                // this.getView().byId("serchbtn").setVisible(true);
                  this.getView().byId("multiplesupplier").setVisible(true);
                this.getView().byId("singlesupplier").setVisible(false);
                // this.getView().byId("secondContainer").setVisible(true);

            } else if (farmstring.length < 1) {
                // this.getView().byId("txtFromDate").setVisible(true);
                // this.getView().byId("txtToDate").setVisible(true);
                this.getView().byId("multiplesupplier").setVisible(false);
                this.getView().byId("singlesupplier").setVisible(true);
               
            }
        },

        handlePrint: function (oEvent) {
            var fullHtml = "";
            var fullHtml1 = "";
            var fullHtml2 = "";
            var fullHtml3 = "";
            var createInvoice = this.getView().getModel('tblModel');
            var farmername = this.farmname;
            //var batchno = this.batchnamepdf;
            //var fromdate = this.getView().byId("txtFromdate").getValue();
            //var todate = this.getView().byId("txtTodate").getValue();
            var batchname = this.batchnamepdf;
            var farmername = this.farmname;

            var branchname = this.branchname;
            var linename = this.linename;
            var farmername = this.farmername;
            var farmname = this.farmname;
            var batchname = this.batchname;
            //var location = this.locationname;

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;

            var invoice = createInvoice.oData.modelData;
            var headertable1 = "<table  border='1' style='margin-top:150px;width: 1000px;' align='center'>" +
                "<caption style='color:black;font-weight: bold;font-size: large;'></caption>" +
                "<tr><th style='color:black'>Placementdate</th>" +
                "<th style='color:black'>Farmer Name</th>" +
                "<th style='color:black'>Farm Name</th>" +
                "<th style='color:black'>Batch_Number</th>" +
                "<th style='color:black'>Branch Name</th>" +
                "<th style='color:black'>Line Name</th>" +
                "<th style='color:black'>Place Qty</th>" +
                "<th style='color:black'>FW BW</th>" +

                "<th style='color:black'>FW FCR</th>" +
                "<th style='color:black'>SW BW</th>" +
                "<th style='color:black'>SW FCR</th>" +
                "<th style='color:black'>TW BW</th>" +
                "<th style='color:black'>TW FCR</th>" +
                "<th style='color:black'>Fourth W BW</th>" +
                "<th style='color:black'>Fourth W FCR</th>" +

                "<th style='color:black'>Fifth W BW</th>" +
                "<th style='color:black'>Fifth W FCR</th>" +
                "<th style='color:black'>Six W BW</th>" +
                "<th style='color:black'>Six W FCR</th>" +
                "<th style='color:black'>Seven W BW</th>" +

                "<th style='color:black'>Seven W FCR</th>" +
                "<th style='color:black'>Eight W BW</th>" +
                "<th style='color:black'>Eight W FCR</th></tr>" 

               
             var titile1= "<table  style='margin-top:50px;width:800px;' align='center'>" +
            "<caption style='color:black;font-weight: bold;font-size: large;'>Weekwise Body Weight FCR Report</caption>" 
   

             var batchname1= "<table  style='margin-top:60px;width: 800px;' align='left'>" +
             "<caption style='color:black;font-weight: bold;font-size: large;'></caption>" 

             var header= "<table  style='margin-top:-60px;width: 500px;' align='left'; padding: 0px;font-size: 14px;margin: 0;line-height:1;cellpadding=0px; cellspacing=0px>" +
            "<caption style='color:black;font-weight: bold;font-size: large;'></caption>"

             header +=    "<tr>" +"<th align='left'> CompanyName </th>"+"<td align='left'>" + companyname + "</td>"+"</tr>"+
                          "<tr>" +"<th align='left'> Companycontact </th>" +"<td align='left'>" + companycontact + "</td>"+"<br>"+"</tr>"+
                          "<tr>" +"<th align='left'> Email </th>"+"<td align='left'>" + companyemail + "</td>"+"<br>"+"</tr>"+
                          "<tr>" +"<th align='left'> Address </th>" +"<td align='left'>" + address + "</td>"+"<br>"+"</tr>"+
                          "<tr>" +"<th align='left'> PinCode </th>"+"<td align='left'>" + pincode + "</td>"+"<br>"+"</tr>";
         
           
             batchname1 += "<tr>" +"<th align='left'>Branch  Name </th>"+"<td align='left'>" + branchname + "</td>"+ 
                           "<th align='right'>Line Name </th>"+"<td align='right'>" + linename + "</td>"+"<br>"+"</tr>";
                           "<tr>" +"<th align='left'> Farmer Name </th>" +"<td align='left'>" + farmername + "</td>"+ 
                           "<th align='right'> Farm Name </th>" +"<td align='right'>" + farmname + "</td>"+"<br>"+"</tr>"+
                           "<tr>"+"<th align='Left'>Batch No </th>" +"<td align='left'>" + batchname + "</td>"+"<br>"+"</tr>";
       
               
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

        validateForm: function () {
            var isValid = true;

            if (!commonFunction.ismultiComRequired(this, "partyList", "Party is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtFromdate", "From Date is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtTodate", "To Date is required"))
                isValid = false;

            return isValid;
        },


        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var  fromdate= this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var farmname = this.farmname;
            var batchname = this.batchname;
            var filename =fromdate+'_'+todate+'_'+farmname+'_'+batchname;


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
                        name: "Sales Invoice No",
                        template: { content: "{salesinvoiceno}" }
                    },
                    {
                        name: "Sales Invoice Date",
                        template: { content: "{salesinvoicedate}" }
                    },
                    {
                        name: "Party Name",
                        template: { content: "{partyname}" }
                    },
                    {
                        name: "Quantity",
                        template: { content: "{quantity}" }
                    },
                    {
                        name: "Weight",
                        template: { content: "{weight}" }
                    },
                    {
                        name: "Rate",
                        template: { content: "{unitprice}" }
                    },
                    {
                        name: "Avg Weight",
                        template: { content: "{AvgWeight}" }
                    },
                    {
                        name: "Amount",
                        template: { content: "{Amount}" }
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
        },

        onDataExportone: sap.m.Table.prototype.exportData || function (oEvent) {
            var  fromdate= this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var farmname = this.farmname;
            var batchname = this.batchname;
            var filename =fromdate+'_'+todate+'_'+farmname+'_'+batchname;

            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/



            var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ","
                }),

                // Pass in the model created above
                models: this.currentContext.getView().getModel("tblModelone"),

                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content


                columns: [
                    {
                        name: "Invoice No",
                        template: { content: "{salesinvoiceno}" }
                    },
                    {
                        name: "Invoice Date",
                        template: { content: "{salesinvoicedate}" }
                    },
                    {
                        name: "Party Name",
                        template: { content: "{partyname}" }
                    },
                    {
                        name: "Farmer Name",
                        template: { content: "{farmer_name}" }
                    },
                    {
                        name: "Shed Name",
                        template: { content: "{shed_name}" }
                    },
                    {
                        name: "Batch No",
                        template: { content: "{batch_number}" }
                    },
                    {
                        name: "No of Birds",
                        template: { content: "{quantity}" }
                    },
                    {
                        name: "Weight",
                        template: { content: "{weight}" }
                    },
                    {
                        name: "Rate",
                        template: { content: "{unitprice}" }
                    },
                    {
                        name: "Avg Weight",
                        template: { content: "{AvgWeight}" }
                    },
                    {
                        name: "Amount",
                        template: { content: "{Amount}" }
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
