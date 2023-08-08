sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/BreederReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',


], function (JSONModel, BaseController, MessageBox, Export, ExportTypeCSV, commonFunction, breederReportsService, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Breeder.FlockWiseCostAnalysisReport", {


        onInit: function () {
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");
            this.currentContext = this;
            // set location model
            var moduleid = 721;
            this.getWarehouses(this, moduleid);

            var tblModel = new JSONModel();
            tblModel.setData({ modelData: [] });
            this.getView().setModel(tblModel, "tblModel");

            var tblModelpartone = new JSONModel();
            tblModelpartone.setData({ modelData: [] });
            this.getView().setModel(tblModelpartone, "tblModelpartone");
            //this.getView().byId("txtdownload").setVisible(false);


            // set empty model to view 
            var emptyModel = this.getModelDefault();
            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "farmperbatchModel");

        },

        getModelDefault: function () {
            return {
                breederbatchid: null,
                shedid: null,
                collectiondate: commonFunction.getDateFromDB(new Date()),

            }
        },

        getWarehouses: function (currentContext, moduleid) {
            commonService.getModuleWiseWarehouses({ moduleid: moduleid }, function (data) {
                var WarehouseModelModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "warehousename": "Select All" });
                    } else {
                        MessageBox.error("warehouse not availabel.")
                    }
                }

                WarehouseModelModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(WarehouseModelModel, "WarehouseList");
               });
        },

        handleSelectionFinish: function (oEvt) {
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedKeys = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedKeys.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });

            }
            var warehouse = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                warehouse.push(selectedKeys[i].key);
            }

            this.warehousename = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                this.warehousename.push(selectedKeys[i].text);
            }
            var warehouseStr = "";

            for (var i = 0; i < warehouse.length; i++) {
                if (i == 0)
                    warehouseStr = parseInt(warehouse[i]);
                else
                    warehouseStr = warehouseStr + "," + parseInt(warehouse[i]);
            }
            this.getBreederBatches(warehouseStr);
            this.getView().byId("warehouse").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        getBreederBatches: function (warehouse) {
            var currentContext = this;
            breederReportsService.getAllbreederbatchbywarehouse({ warehouseid: warehouse }, function (data) {

                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "breederbatchid": "All", "batchname": "Select All" });
                        var oBatchModel = new sap.ui.model.json.JSONModel();
                        oBatchModel.setData({ modelData: data[0] });
                        currentContext.getView().setModel(oBatchModel, "batchModel");
                    } else {
                        MessageBox.error("Brreder branch not available for this location")
                    }
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

        batchSelectionFinish: function (oEvt) {
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedbatches = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedbatches.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }
            var i = selectedbatches.length - 1;

            if (selectedbatches[i].key == "All") {

                selectedbatches = selectedbatches.slice(0, -1);
            }
            var batchs = [];
            for (var i = 0; i < selectedbatches.length; i++) {
                batchs.push(selectedbatches[i].key);
            }

            this.batchsname = [];
            for (var i = 0; i < selectedbatches.length; i++) {
                this.batchsname.push(selectedbatches[i].text);
            }

            this.batchesStr = "";

            for (var i = 0; i < batchs.length; i++) {
                if (i == 0)
                    this.batchesStr = parseInt(batchs[i]);
                else
                    this.batchesStr = this.batchesStr + "," + parseInt(batchs[i]);
            }
            this.getView().byId("batchtb1").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        onSearchData: function () {

            var batchid = this.batchesStr
            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue()

            var FModel = {
                batchid: batchid,
                fromdate: commonFunction.getDate(fromdate),
                todate: commonFunction.getDate(todate)
            }
            if (this.validateForm()) {
                var currentContext = this;
                breederReportsService.getFlockWiseCostAnalysisReport(FModel, function (data) {
                    var childModel = currentContext.getView().getModel("tblModel");
                    childModel.setData({ modelData: data[0] });
                });

                breederReportsService.getFlockWiseCostAnalysisReportPartOne(FModel, function (data) {
                    var childModelpartone = currentContext.getView().getModel("tblModelpartone");
                    childModelpartone.setData({ modelData: data[0] });
                });
            }
            //this.getView().byId("txtdownload").setVisible(true);
        },


        validateForm: function () {
            var isValid = true;
            if (!commonFunction.ismultiComRequired(this, "warehouse", "location is required"))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "batchtb1", "batch is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtFromdate", "From Date is required"))
                isValid = false;
            if (!commonFunction.isRequired(this, "txtTodate", "To Date is required"))
                isValid = false;
            return isValid;
        },

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
                htmTable += "<td align='center'>" + model["batchname"] + "</td>"
                htmTable += "<td>" + model["purvalue"] + "</td>"
                htmTable += "<td align='right'>" + model["beforefeedconcost"] + "</td>"
                htmTable += "<td align='right'>" + model["beforemedcost"] + "</td>"
                htmTable += "<td>" + model["beforevacccost"] + "</td>"
                htmTable += "<td>" + model["beforevitcost"] + "</td>"
                htmTable += "<td>" + model["beforesaleval"] + "</td>"
                htmTable += "<td>" + model["beforeotercost"] + "</td>"
                htmTable += "<td>" + model["afterfeedconcost"] + "</td>"
                htmTable += "<td>" + model["aftermedcost"] + "</td>"
                htmTable += "<td>" + model["aftervacccost"] + "</td>"
                htmTable += "<td>" + model["aftervitcost"] + "</td>"
                htmTable += "<td>" + model["aftersaleval"] + "</td>"
                htmTable += "<td>" + model["beforeotercost"] + "</td>"
                htmTable += "<td>" + model["afterotercost"] + "</td>"
                htmTable += "<td>" + model["amotizationvalue"] + "</td>"
                htmTable += "<td>" + model["balancevalue"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;
            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var batchname = this.batchsname;
            var warehousename = this.warehousename;

            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);

            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##ReportFromDate##", fromdate);
            template = this.replaceStr(template, "##ReporToDate##", todate);
            template = this.replaceStr(template, "##BatchName##", batchname);
            template = this.replaceStr(template, "##WarehouseName##", warehousename);
            return template;

        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("Breeder", "FlockWiseCostAnalysisReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generateLargePDF(template, "Flock Wise Cost Analysis Report");
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
                htmTable += "<td align='center'>" + model["locationname"] + "</td>"
                htmTable += "<td>" + model["batchname"] + "</td>"
                htmTable += "<td align='right'>" + model["pldate"] + "</td>"
                htmTable += "<td align='right'>" + model["aslastdate"] + "</td>"
                htmTable += "<td>" + model["itemid"] + "</td>"
                htmTable += "<td>" + model["ageindays"] + "</td>"
                htmTable += "<td>" + model["paqty"] + "</td>"
                htmTable += "<td>" + model["mor"] + "</td>"
                htmTable += "<td>" + model["liveqty"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;
            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var batchname = this.batchsname;
            var warehousename = this.warehousename;

            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);

            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##ReportFromDate##", fromdate);
            template = this.replaceStr(template, "##ReporToDate##", todate);
            template = this.replaceStr(template, "##BatchName##", batchname);
            template = this.replaceStr(template, "##WarehouseName##", warehousename);
            return template;

        },

        createPDFFirst: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("Breeder", "FlockWiseCostAnalysisPartOne.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generateLargePDF(template, "Flock Wise Cost Analysis Report");
            });
        },


        handlePrintOne: function (oEvent) {
            var fullHtml = "";
            var fullHtml1 = "";
            var fullHtml2 = "";
            var fullHtml3 = "";
            var createInvoice = this.getView().getModel('tblModelpartone');
            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var batchname = this.batchsname;
            var warehousename = this.warehousename;

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;

            var invoice = createInvoice.oData.modelData;
            var headertable1 = "<table  border='1' style='margin-top:150px;width: 1000px;' align='center'>" +
                "<caption style='color:black;font-weight: bold;font-size: large;'></caption>" +
                "<tr><th style='color:black'>Location</th>" +
                "<th style='color:black'>Flock</th>" +
                "<th style='color:black'>Place Date</th>" +
                "<th style='color:black'>Live Date</th>" +
                "<th style='color:black'>Item Type</th>" +
                "<th style='color:black'>Age In Day</th>" +
                "<th style='color:black'>Placed Qty</th>" +
                "<th style='color:black'>Mortality</th>" +
                "<th style='color:black'>Live Balance</th>></tr>" 

               
             var titile1= "<table  style='margin-top:50px;width:800px;' align='center'>" +
            "<caption style='color:black;font-weight: bold;font-size: large;'>Flock Wise Cost Analysis Report</caption>" 
   

             var batchname1= "<table  style='margin-top:60px;width: 800px;' align='left'>" +
             "<caption style='color:black;font-weight: bold;font-size: large;'></caption>" 

             var header= "<table  style='margin-top:-60px;width: 500px;' align='left'; padding: 0px;font-size: 14px;margin: 0;line-height:1;cellpadding=0px; cellspacing=0px>" +
             "<caption style='color:black;font-weight: bold;font-size: large;'></caption>"

             header +=    "<tr>" +"<th align='left'> CompanyName </th>"+"<td align='left'>" + companyname + "</td>"+"</tr>"+
                          "<tr>" +"<th align='left'> Companycontact </th>" +"<td align='left'>" + companycontact + "</td>"+"<br>"+"</tr>"+
                          "<tr>" +"<th align='left'> Email </th>"+"<td align='left'>" + companyemail + "</td>"+"<br>"+"</tr>"+
                          "<tr>" +"<th align='left'> Address </th>" +"<td align='left'>" + address + "</td>"+"<br>"+"</tr>"+
                          "<tr>" +"<th align='left'> PinCode </th>"+"<td align='left'>" + pincode + "</td>"+"<br>"+"</tr>";
         
           
             batchname1 += "<tr>" +"<th align='left'>From Date </th>"+"<td align='left'>" + fromdate + "</td>"+ 
                           "<th align='right'> To Date </th>"+"<td align='right'>" + todate + "</td>"+"<br>"+"</tr>"+
                           "<tr>" +"<th align='left'> Item Name </th>" +"<td align='left'>" + warehousename + "</td>"+ 
                           "<th align='right'> Batch Name </th>" +"<td align='right'>" + batchname + "</td>"+"<br>"+"</tr>";
                         
       
               
            //Adding row dynamically to student table....

            for (var i = 0; i < invoice.length; i++) {
                headertable1 += "<tr>" +
                    "<td>" + invoice[i].locationname + "</td>" +
                    "<td>" + invoice[i].batchname + "</td>" +
                    "<td>" + invoice[i].pldate + "</td>" +
                    "<td>" + invoice[i].aslastdate + "</td>" +
                    "<td>" + invoice[i].itemid + "</td>" +
                    "<td>" + invoice[i].ageindays + "</td>" +
                    "<td>" + invoice[i].paqty + "</td>" +
                    "<td>" + invoice[i].mor + "</td>" +
                    "<td>" + invoice[i].liveqty + "</td>" +
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
            win.stop();
        },

        handlePrint: function (oEvent) {
            var fullHtml = "";
            var fullHtml1 = "";
            var fullHtml2 = "";
            var fullHtml3 = "";
            var createInvoice = this.getView().getModel('tblModel');
            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var batchname = this.batchsname;
            var warehousename = this.warehousename;

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;

            var invoice = createInvoice.oData.modelData;
            var headertable1 = "<table  border='1' style='margin-top:150px;width: 1000px;' align='center'>" +
                "<caption style='color:black;font-weight: bold;font-size: large;'></caption>" +
                "<tr><th style='color:black'>Flock Name</th>" +
                "<th style='color:black'>Chick Cost</th>" +
                "<th style='color:black'>Before 24 Week Feed Cost</th>" +
                "<th style='color:black'>Before 24 Week Medicine Cost</th>" +
                "<th style='color:black'>Before 24 Week Vaccine Cost</th>" +
                "<th style='color:black'>Before 24 Week Vitmin Cost</th>" +
                "<th style='color:black'>Before 24 Week Salary Cost</th>" +
                "<th style='color:black'>Before 24 Week Other Cost</th>" +
                "<th style='color:black'>After 24 Week Feed Cost</th>" +
                "<th style='color:black'>After 24 Week Medicine Cost</th>" +
                "<th style='color:black'>After 24 Week Vaccine Cost</th>" +

                "<th style='color:black'>After 24 Week Vitmin  Cost</th>" +
                "<th style='color:black'>After 24 Week Salary Cost</th>" +
                "<th style='color:black'>After 24 Week Farm OH</th>" +
                "<th style='color:black'>After 24 Week Mortality Cost</th>" +
                "<th style='color:black'>Amortization</th>" +
                "<th style='color:black'>Balance Cost</th>></tr>" 

               
             var titile1= "<table  style='margin-top:50px;width:800px;' align='center'>" +
            "<caption style='color:black;font-weight: bold;font-size: large;'>Flock Wise Cost Analysis Report</caption>" 
   

             var batchname1= "<table  style='margin-top:60px;width: 800px;' align='left'>" +
             "<caption style='color:black;font-weight: bold;font-size: large;'></caption>" 

             var header= "<table  style='margin-top:-60px;width: 500px;' align='left'; padding: 0px;font-size: 14px;margin: 0;line-height:1;cellpadding=0px; cellspacing=0px>" +
             "<caption style='color:black;font-weight: bold;font-size: large;'></caption>"

             header +=    "<tr>" +"<th align='left'> CompanyName </th>"+"<td align='left'>" + companyname + "</td>"+"</tr>"+
                          "<tr>" +"<th align='left'> Companycontact </th>" +"<td align='left'>" + companycontact + "</td>"+"<br>"+"</tr>"+
                          "<tr>" +"<th align='left'> Email </th>"+"<td align='left'>" + companyemail + "</td>"+"<br>"+"</tr>"+
                          "<tr>" +"<th align='left'> Address </th>" +"<td align='left'>" + address + "</td>"+"<br>"+"</tr>"+
                          "<tr>" +"<th align='left'> PinCode </th>"+"<td align='left'>" + pincode + "</td>"+"<br>"+"</tr>";
         
           
             batchname1 += "<tr>" +"<th align='left'>From Date </th>"+"<td align='left'>" + fromdate + "</td>"+ 
                           "<th align='right'> To Date </th>"+"<td align='right'>" + todate + "</td>"+"<br>"+"</tr>"+
                           "<tr>" +"<th align='left'> Item Name </th>" +"<td align='left'>" + warehousename + "</td>"+ 
                           "<th align='right'> Batch Name </th>" +"<td align='right'>" + batchname + "</td>"+"<br>"+"</tr>";
                         
       
               
            //Adding row dynamically to student table....

            for (var i = 0; i < invoice.length; i++) {
                headertable1 += "<tr>" +
                    "<td>" + invoice[i].batchname + "</td>" +
                    "<td>" + invoice[i].purvalue + "</td>" +
                    "<td>" + invoice[i].beforefeedconcost + "</td>" +
                    "<td>" + invoice[i].beforemedcost + "</td>" +
                    "<td>" + invoice[i].beforevacccost + "</td>" +
                    "<td>" + invoice[i].beforevitcost + "</td>" +
                    "<td>" + invoice[i].beforesaleval + "</td>" +
                    "<td>" + invoice[i].beforeotercost + "</td>" +
                    "<td>" + invoice[i].afterfeedconcost + "</td>" +
                    "<td>" + invoice[i].aftermedcost + "</td>" +
                    "<td>" + invoice[i].aftervacccost + "</td>" +
                    "<td>" + invoice[i].aftervitcost + "</td>" +
                    "<td>" + invoice[i].aftersaleval + "</td>" +
                    "<td>" + invoice[i].afterotercost + "</td>" +
                    "<td>" + invoice[i].afterotercost + "</td>" +
                    "<td>" + invoice[i].amotizationvalue + "</td>" +
                    "<td>" + invoice[i].balancevalue + "</td>" +
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
            win.stop();
        },



        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var batchname = this.batchsname;
            var warehousename = this.warehousename;

            var filename =fromdate+'_'+todate+'_'+warehousename+'_'+batchname;

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
                        name: "Flock Name",
                        template: { content: "{batchname}" }
                    },
                    {
                        name: "Chick Cost",
                        template: { content: "{purvalue}" }
                    },
                    {
                        name: "Before 24 Week Feed Cost",
                        template: { content: "{beforefeedconcost}" }
                    },
                    {
                        name: "Before 24 Week Medicine Cos",
                        template: { content: "{beforemedcost}" }
                    },
                    {
                        name: "Before 24 Week Vaccine Cost",
                        template: { content: "{beforevacccost}" }
                    },
                    {
                        name: "Before 24 Week Vitmin Cost",
                        template: { content: "{beforevitcost}" }
                    },
                    {
                        name: "Before 24 Week Salary Cost",
                        template: { content: "{beforesaleval}" }
                    },
                    {
                        name: "Before 24 Week Other Cost",
                        template: { content: "{beforeotercost}" }
                    },
                    {
                        name: "After 24 Week Feed Cost",
                        template: { content: "{afterfeedconcost}" }
                    },
                    {
                        name: "After 24 Week Medicine Cos",
                        template: { content: "{aftermedcost}" }
                    },
                    {
                        name: "After 24 Week Vaccine Cost",
                        template: { content: "{aftervacccost}" }
                    },
                    {
                        name: "After 24 Week Vitmin Cost",
                        template: { content: "{aftervitcost}" }
                    },
                    {
                        name: "After 24 Week Salary Cost",
                        template: { content: "{aftersaleval}" }
                    },
                    {
                        name: "After 24 Week Other Cost",
                        template: { content: "{afterotercost}" }
                    },
                    {
                        name: "After 24 Week Mortality Cost",
                        template: { content: "{afterotercost}" }
                    },
                    {
                        name: "Amortization",
                        template: { content: "{amotizationvalue}" }
                    },
                    {
                        name: "Balance Cost",
                        template: { content: "{balancevalue}" }
                    },
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
            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var batchname = this.batchsname;
            var warehousename = this.warehousename;

            var filename =fromdate+'_'+todate+'_'+warehousename+'_'+batchname;

            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/


            var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ","
                }),

                // Pass in the model created above
                models: this.currentContext.getView().getModel("tblModelpartone"),


                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content

                columns: [

                    {
                        name: "Location",
                        template: { content: "{locationname}" }
                    },
                    {
                        name: "Flock",
                        template: { content: "{batchname}" }
                    },
                    {
                        name: "Place Date",
                        template: { content: "{pldate}" }
                    },
                    {
                        name: "Live Date",
                        template: { content: "{aslastdate}" }
                    },
                    {
                        name: "Item Type",
                        template: { content: "{itemid}" }
                    },
                    {
                        name: "Age In Day",
                        template: { content: "{ageindays}" }
                    },
                    {
                        name: "Placed Quantity",
                        template: { content: "{paqty}" }
                    },
                    {
                        name: "Mortality",
                        template: { content: "{mor}" }
                    },
                    {
                        name: "Live Balance",
                        template: { content: "{liveqty}" }
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
