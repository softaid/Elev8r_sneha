sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/BreederReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service'

], function (JSONModel, BaseController, MessageBox, Export, ExportTypeCSV, commonFunction, breederReportsService, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Breeder.DailyBrodGrowReport", {

        currentContext: null,

        onInit: function () {
            this.currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");
            // set location se
            var moduleids = 721;
            this.getLocations(this, moduleids);

            // set empty model to view 
            var emptyModel = this.getModelDefault();
            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "dailybrodGrowModel");

            var frequencymodel = [{ key: "daily", value: "Daily" },
            { key: "weekly", value: "Weekly" },
            { key: "monthly", value: "Monthly" }]
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({ modelData: frequencymodel });
            this.getView().setModel(oModel, "frequemodel");
            this.getView().byId("txtdownload").setVisible(false);


        },

        getModelDefault: function () {
            return {
                breederbatchid: null,
                shedid: null,
                fromdate: null,
                todate: null
            }
        },
        getLocations: function (currentContext, moduleids) {
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
            });
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
        handleSelectionFinish: function (oEvt) {
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

            var locationStr = "";

            for (var i = 0; i < location.length; i++) {
                if (i == 0)
                    locationStr = parseInt(location[i]);
                else
                    locationStr = locationStr + "," + parseInt(location[i]);
            }
            this.getLocationwisebreederbatches(locationStr);
            this.getView().byId("locationtbl").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },


        handleBrdBatchValueHelp: function (oEvent) {
            var sInputValue = oEvent.getSource().getValue();
            this.inputId = oEvent.getSource().getId();

            // create value help dialog
            this._valueHelpDialog = sap.ui.xmlfragment(
                "sap.ui.elev8rerp.componentcontainer.fragmentview.BreederReports.BreederbatchDialog",
                this
            );
            this.getView().addDependent(this._valueHelpDialog);

            // open value help dialog filtered by the input value
            this._valueHelpDialog.open(sInputValue);
        },

        handleBreederBatchSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var columns = ['batchname', 'locationname', 'warehousename'];
            var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
            }),
                false);  // false for OR condition
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        onBreederBatchDialogClose: function (oEvent) {
            var currentContext = this;
            var aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts != undefined) {
                var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });

                var oModel = currentContext.getView().getModel("dailybrodGrowModel");
                //update existing model to set locationid
                oModel.oData.breederbatchid = selRow[0].id;
                oModel.oData.batchname = selRow[0].batchname
                oModel.oData.placementdate = selRow[0].placementdate

                oModel.refresh();
                this.getView().byId("textBatch").setValueState(sap.ui.core.ValueState.None);
                // get all shed by breederbatchid 
                currentContext.getbreedershed(selRow[0].id);
            } else {

            }
        },

        getLocationwisebreederbatches: function (location) {
            var currentContext = this;
            breederReportsService.getLocationwisebreederbatches({ locationid: location }, function (data) {
                var oBatchModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    oBatchModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oBatchModel, "breederBatchList");
                } else {
                    MessageBox.error("Breeder batch not availabel.")
                }
            });
            // }
        },


        getbreedershed: function (breederbatchid) {
            var currentContext = this;
            breederReportsService.getbreedershed({ breederbatchid: breederbatchid }, function (data) {
                if (data.length > 0) {
                    data[0].unshift({ "breedershedid": "All", "shedname": "Select All" });
                    var oBatchModel = new sap.ui.model.json.JSONModel();
                    oBatchModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oBatchModel, "shedModel");
                } else {
                    MessageBox.error("Breeder shed not availabel.")
                }
            });
        },

        shedSelectionChange: function (oEvent) {
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



        shedSelectionFinish: function (oEvt) {
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedsheds = [];

            for (var i = 0; i < selectedItems.length; i++) {
                selectedsheds.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }
            var i = selectedsheds.length - 1;
            if (selectedsheds[i].key == "ALL") {

                selectedsheds = selectedsheds.slice(0, -1);
            }

            var shedids = [];
            for (var i = 0; i < selectedsheds.length; i++) {
                shedids.push(selectedsheds[i].key);
            }

            this.shedname = [];
            for (var i = 0; i < selectedsheds.length; i++) {
                this.shedname.push(selectedsheds[i].text);
            }

            var shedStr = "";

            for (var i = 0; i < shedids.length; i++) {
                if (i == 0)
                    shedStr = parseInt(shedids[i]);
                else
                    shedStr = shedStr + "," + parseInt(shedids[i]);
            }
            this.getView().byId("shedtb1").setValueState(sap.ui.core.ValueState.None);

            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        resetModel: function () {
            var tbleModel = this.getView().getModel("dailybrodgrowReportModel");
            tbleModel.setData({ modelData: [] });

        },

        frequChange: function () {
            
            // this.resetTable();
            var oModel = this.getView().getModel("dailybrodGrowModel").oData;
            if (oModel.frequency == "daily") {
		oModel.showweekno = true;
                oModel.showweek = false;
                oModel.showdate = true;
                oModel.showmonth = false;

                oModel.showFfeed = true;
                oModel.showMfeed = true;
                oModel.showmfob = true;
                oModel.showmfcb = true;
                oModel.showffob = true;
                oModel.showffcb = true;
            }
            else if (oModel.frequency == "weekly") {
		oModel.showweekno = true;
                oModel.showweek = true;
                oModel.showdate = false;
                oModel.showmonth = false;

                oModel.showFfeed = true;
                oModel.showMfeed = true;
                oModel.showmfob = true;
                oModel.showmfcb = true;
                oModel.showffob = true;
                oModel.showffcb = true;

            } else if (oModel.frequency == "monthly") {
	        oModel.showweekno = false;
                oModel.showweek = false;
                oModel.showdate = false;
                oModel.showmonth = true;

                oModel.showFfeed = false;
                oModel.showMfeed = false;
                oModel.showmfob = false;
                oModel.showmfcb = false;
                oModel.showffob = false;
                oModel.showffcb = false;
            }
            this.getView().byId("Frequency").setValueState(sap.ui.core.ValueState.None);
        },
      
             onSearchData: function () {
            if (this.validateForm()) {
                var currentContext = this;
                var currentContext = this;
                currentContext.frquencytype = this.getView().byId("Frequency").getSelectedItem();
                var oModel = this.getView().getModel("dailybrodGrowModel").oData

                var shedids = this.getView().byId("shedtb1").getSelectedKeys();
                var shedStr = "";

                for (var i = 0; i < shedids.length; i++) {
                    if (i == 0)
                        shedStr = parseInt(shedids[i]);
                    else
                        shedStr = shedStr + "," + parseInt(shedids[i]);
                }

                var oModel = {
                    frequency: oModel.frequency,
                    breederbatchid: oModel.breederbatchid,
                    shedid: shedStr,
                    fromdate: commonFunction.getDate(this.getView().byId("txtFromdate").getValue()),
                    todate: commonFunction.getDate(this.getView().byId("txtTodate").getValue()),
                    companyid: commonFunction.session("companyId")
                }

                breederReportsService.getDailyBrodGrowReport(oModel, function (data) {
                    if (data.length > 0) {
                        for (var i = 0; i < data[1].length; i++) {
                            // data[1][i].maleopeningbalance = data[1][i].maleclosingbalance;
                            // data[1][i].femaleopeningbalance = data[1][i].femaleclosingbalance;
                            data[1][i].malestandardweight = data[0][0].malestandardweight;
                            data[1][i].femalestandardweight = data[0][0].femalestandardweight;

                          

                           // data[1][i].cumuamaleper = parseFloat((data[1][i].cumulativemalemortality / data[1][i].maleopeningbalance) * 100).toFixed(2);
                            // data[1][i].cumufemalemortalityper = parseFloat((data[1][i].cumulativefemalemortality / (data[1][i].femaleopeningbalance)) * 100).toFixed(2);
                            data[1][i].feedopeningbalance = data[1][i].totalreceivedfeed;
                            data[1][i].totalfeedconsumption = data[1][i].malefeedconsumption + data[1][i].femalefeedconsumption + data[1][i].transferedfeed;
                            data[1][i].balance = (data[1][i].totalreceivedfeed + data[1][i].receivedfeed) - data[1][i].totalfeedconsumption;
                            // data[1][i].perbirdfeedmale = parseFloat(data[1][i].malefeedconsumption / (data[1][i].maleopeningbalance)).toFixed(2);
                            // data[1][i].perbirdfeedfemale = parseFloat(data[1][i].femalefeedconsumption / (data[1][i].femaleopeningbalance)).toFixed(2);

                            if(data[1][i].maleopeningbalance != 0)
                            {
                                data[1][i].cumuamaleper = parseFloat((data[1][i].cumulativemalemortality / data[1][i].maleopeningbalance) * 100).toFixed(2);
                            }
                            else
                            {
                                data[1][i].cumuamaleper = parseFloat((data[1][i].cumulativemalemortality / ((data[1][i].maleopeningbalance)+(data[1][i].maletransferedinquantity))) * 100).toFixed(2);
                            }

                            if(data[1][i].maleopeningbalance != 0)
                            {
                                data[1][i].perbirdfeedmale = parseFloat((data[1][i].malefeedconsumption / data[1][i].maleopeningbalance) * 1000).toFixed(2);
                            }
                            else
                            {
                                data[1][i].perbirdfeedmale = parseFloat((data[1][i].malefeedconsumption / ((data[1][i].maleopeningbalance)+(data[1][i].maletransferedinquantity))) * 1000).toFixed(2);;
                            }

                            if(data[1][i].femaleopeningbalance != 0)
                            {
                                data[1][i].cumufemalemortalityper = parseFloat((data[1][i].cumulativefemalemortality / data[1][i].femaleopeningbalance) * 100).toFixed(2);
                            }
                            else
                            {
                                data[1][i].cumufemalemortalityper = parseFloat((data[1][i].cumulativefemalemortality / ((data[1][i].femaleopeningbalance)+(data[1][i].maletransferedinquantity))) * 100).toFixed(2);;
                            }


                            if(data[1][i].femaleopeningbalance != 0)
                            {
                                data[1][i].perbirdfeedfemale = data[1][i].perbirdfeedfemale = parseFloat((data[1][i].femalefeedconsumption / data[1][i].femaleopeningbalance) * 1000).toFixed(2);
                            }
                            else
                            {
                                data[1][i].perbirdfeedfemale = parseFloat((data[1][i].femalefeedconsumption / ((data[1][i].femaleopeningbalance)+(data[1][i].femaletransferedinquantity))) * 1000).toFixed(2);
                            }
                        }


                        var oModel = new sap.ui.model.json.JSONModel();
                        oModel.setData({ modelData: data[1] });
                        currentContext.getView().setModel(oModel, "dailybrodgrowReportModel");
                    }

                    
                });

            }
            this.getView().byId("txtdownload").setVisible(true);
        },

        validateForm: function () {
            var isValid = true;

            if (!commonFunction.ismultiComRequired(this, "locationtbl", "Location is required."))
                isValid = false;

            if (!commonFunction.isRequired(this, "textBatch", "Batch is required."))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "shedtb1", "Shed is required."))
                isValid = false;
            if (!commonFunction.isRequired(this, "txtFromdate", "From date is required."))
                isValid = false;
            if (!commonFunction.isRequired(this, "txtTodate", "To date is required."))
                isValid = false;


            if (!this.ongetDate())
                isValid = false;

            return isValid;
        },


        ongetDate: function () {
            // this.resetModel();
            var isValid = true
            var oModel = this.getView().getModel("dailybrodGrowModel").oData;
            var fromDate = oModel.fromdate;
            var todate = oModel.todate;
            var placementdate = commonFunction.getDate(oModel.placementdate);
            placementdate = Date.parse(placementdate);
            if (fromDate) {
                fromDate = Date.parse(fromDate);
                this.getView().byId("txtFromdate").setValueState(sap.ui.core.ValueState.None);
            }


            if (placementdate > fromDate) {
                MessageBox.error("From Date grater than placment date.");
                isValid = false;
            }
            if (todate) {
                todate = Date.parse(todate)
                this.getView().byId("txtTodate").setValueState(sap.ui.core.ValueState.None);

                if (fromDate > todate) {
                    MessageBox.error("From Date less than todate date");
                    isValid = false;
                }
            }
            return isValid
        },

        replaceStr: function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },

        // Function Used For PDF Download

        replaceTemplateData: function (template) {
            // Item table Data --------------

            var tbleModel = this.getView().getModel("dailybrodgrowReportModel").oData.modelData;
            var htmTable = "";
            for (var indx in tbleModel) {
                var model = tbleModel[indx];
                // Replace/create column sequence data table
                htmTable += "<tr>";
                htmTable += "<td align='center'>" + model["shedname"] + "</td>"
                htmTable += "<td>" + model["transactiondate"] + "</td>"
                htmTable += "<td>" + model["maleopeningbalance"] + "</td>"
                htmTable += "<td align='center'>" + model["femaleopeningbalance"] + "</td>"
                htmTable += "<td>" + model["malemortality"] + "</td>"
                htmTable += "<td align='right'>" + model["femalemortality"] + "</td>"
                htmTable += "<td align='right'>" + model["cumulativemalemortality"] + "</td>"
                htmTable += "<td>" + model["cumuamaleper"] + "</td>"
                htmTable += "<td>" + model["cumulativefemalemortality"] + "</td>"
                htmTable += "<td>" + model["cumufemalemortalityper"] + "</td>"
                htmTable += "<td>" + model["maleculls"] + "</td>"
                htmTable += "<td>" + model["femaleculls"] + "</td>"
                htmTable += "<td align='center'>" + model["cumulativemaleculls"] + "</td>"
                htmTable += "<td>" + model["cumulativefemaleculls"] + "</td>"
                htmTable += "<td align='right'>" + model["feedopeningbalance"] + "</td>"
                htmTable += "<td align='right'>" + model["receivedfeed"] + "</td>"
                htmTable += "<td>" + model["malefeedconsumption"] + "</td>"
                htmTable += "<td>" + model["femalefeedconsumption"] + "</td>"
                htmTable += "<td>" + model["cummulativefeedconsumption"] + "</td>"
                htmTable += "<td>" + model["perbirdfeedfemale"] + "</td>"
                htmTable += "<td>" + model["perbirdfeedmale"] + "</td>"
                htmTable += "<td align='center'>" + model["femalestandardweight"] + "</td>"
                htmTable += "<td>" + model["femaleactualweight"] + "</td>"
                htmTable += "<td align='right'>" + model["malestandardweight"] + "</td>"
                htmTable += "<td align='right'>" + model["maleactualweight"] + "</td>"
                htmTable += "<td>" + model["transferedfeed"] + "</td>"
                htmTable += "<td>" + model["balance"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;

            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var batchname = this.getView().byId("textBatch").getValue();
            var frquency = this.frquencytype.mProperties.text;
            var location = this.locationname;
            var shedname = this.shedname;

            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);


            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##ReportFromDate##", fromdate);
            template = this.replaceStr(template, "##ReporToDate##", todate);
            template = this.replaceStr(template, "##Frequencytype##", frquency);
            template = this.replaceStr(template, "##LocationName##", location);
            template = this.replaceStr(template, "##BatchName##", batchname);
            template = this.replaceStr(template, "##ShedName##", shedname);
            return template;

        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("Breeder", "DailyBrodGrowReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Daily Broodind And Growing Report");
            });
        },



       onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
        var fromdate = this.getView().byId("txtFromdate").getValue();
        var todate = this.getView().byId("txtTodate").getValue();
        var batchname = this.getView().byId("textBatch").getValue();
        var frquency = this.frquencytype.mProperties.text;
        var location = this.locationname;
        var shedname = this.shedname;

        var filename =fromdate+'_'+todate+'_'+batchname+'_'+frquency+'_'+location+'_'+shedname;
            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/

            var oModel = this.getView().getModel("dailybrodGrowModel").oData;
            if (oModel.frequency == "monthly") {
                var oExport = new Export({

                    // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                    exportType: new ExportTypeCSV({
                        separatorChar: ","
                    }),
    
                    // Pass in the model created above
                    models: this.getView().getModel("dailybrodgrowReportModel"),
    
                    // binding information for the rows aggregation
                    rows: {
                        path: "/modelData"
                    },
    
                    // column definitions with column name and binding info for the content
    
                    columns: [
                       
                        {
                            name: "shed",
                            template: { content: "{shedname}" }
                        },
                        {
                            name: "Month",
                            template: { content: "{monthno}" }
                        },
                        {
                            name: "Supervisior Name",
                            template: { content: "{Supervisiorname}" }
                        },
                        {
                            name: "Opening Balance Male",
                            template: { content: "{maleopeningbalance}" }
                        },
                        {
                            name: "Transfer In Male",
                            template: { content: "{maletransferedinquantity}" }
                        },
                        {
                            name: "Transfer Out Males",
                            template: { content: "{maletransferedquantity}" }
                        },
                        {
                            name: "Male Mortality",
                            template: { content: "{malemortality}" }
                        },
                        {
                            name: "Male Mortality Reason",
                            template: { content: "{Malemorreason}" }
                        },
                        {
                            name: "Cumulative Male Mortality",
                            template: { content: "{cumulativemalemortality}" }
                        },
                        {
                            name: "Cumulative  Male %",
                            template: { content: "{cumuamaleper}" }
                        },
                        {
                            name: "Male Culls",
                            template: { content: "{maleculls}" }
                        },
                        {
                            name: "Cumulative Male Culls",
                            template: { content: "{cumulativemaleculls}" }
                        },
                        {
                            name: "Cumulative Male Culls %",
                            template: { content: "{cumuamalecullsper}" }
                        },
    
                        {
                            name: "closing Balance Male",
                            template: { content: "{maleclosingbalance}" }
                        },
                        {
                            name: "Opening Balance Female",
                            template: { content: "{femaleopeningbalance}" }
                        },
                        {
                            name: "Transfer In Female",
                            template: { content: "{femaletransferedinquantity}" }
                        },
                        {
                            name: "Transfer Out Female",
                            template: { content: "{femaletransferedquantity}" }
                        },
                        {
                            name: "Female Mortality",
                            template: { content: "{femalemortality}" }
                        },
                        {
                            name: "Female Mortality Reason",
                            template: { content: "{Femalemorreasom}" }
                        },
                       
                        {
                            name: "Cumulative Female Mortality",
                            template: { content: "{cumulativefemalemortality}" }
                        },
                        {
                            name: "Cumulative Female Mortality %",
                            template: { content: "{cumufemalemortalityper}" }
                        },
                        
                        {
                            name: "Female Culls",
                            template: { content: "{femaleculls}" }
                        },
                       
                        {
                            name: "Cumulative Female Culls",
                            template: { content: "{cumulativefemaleculls}" }
                        },
                        {
                            name: "Cumulative Female Culls %",
                            template: { content: "{cumufemalecullsper}" }
                        },
    
                        {
                            name: "closing Balance Female",
                            template: { content: "{femaleclosingbalance}" }
                        },
                        {
                            name: "Recived Feed",
                            template: { content: "{receivedfeed}" }
                        },
                        {
                            name: "Male Feed Use",
                            template: { content: "{malefeedconsumption}" }
                        },
                        {
                            name: "Female Feed Use",
                            template: { content: "{femalefeedconsumption}" }
                        },
                        {
                            name: "Per Bird Feed Female",
                            template: { content: "{perbirdfeedfemale}" }
                        },
                        {
                            name: "Per Bird Feed Male",
                            template: { content: "{perbirdfeedmale}" }
                        },
                        {
                            name: "Body Weight Female Standared",
                            template: { content: "{femalestandardweight}" }
                        },
                        {
                            name: "Body Weight Femlae Actual",
                            template: { content: "{femaleactualweight}" }
                        },
                        {
                            name: "Body Weight Male Standared",
                            template: { content: "{malestandardweight}" }
                        },
                        {
                            name: "Body Weight Male Actual",
                            template: { content: "{maleactualweight}" }
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
            else
            {

            var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ","
                }),

                // Pass in the model created above
                models: this.getView().getModel("dailybrodgrowReportModel"),

                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content

                columns: [
                    {
                        name: "Date",
                        template: { content: "{transactiondate}" }
                    },
                    {
                        name: "shed",
                        template: { content: "{shedname}" }
                    },
                    {
                        name: "Month",
                        template: { content: "{monthno}" }
                    },
                    {
                        name: "Supervisior Name",
                        template: { content: "{Supervisiorname}" }
                    },
                    {
                        name: "Opening Balace Male",
                        template: { content: "{maleopeningbalance}" }
                    },
                    {
                        name: "Male Mortality",
                        template: { content: "{malemortality}" }
                    },
                    {
                        name: "Male Mortality Reason",
                        template: { content: "{Malemorreason}" }
                    },
                    {
                        name: "Cumulative Male Mortality",
                        template: { content: "{cumulativemalemortality}" }
                    },
                    {
                        name: "Cumulative % Male",
                        template: { content: "{cumuamaleper}" }
                    },
                    {
                        name: "Male Culls",
                        template: { content: "{maleculls}" }
                    },
                    {
                        name: "Cumulative Male Culls",
                        template: { content: "{cumulativemaleculls}" }
                    },
                    {
                        name: "Cumulative Male Culls %",
                        template: { content: "{cumuamalecullsper}" }
                    },

                    {
                        name: "closing Balance Male",
                        template: { content: "{maleclosingbalance}" }
                    },
                    {
                        name: "Opening Balance Female",
                        template: { content: "{femaleopeningbalance}" }
                    },
                   
                    {
                        name: "Female Mortality",
                        template: { content: "{femalemortality}" }
                    },
                    {
                        name: "Female Mortality Reason",
                        template: { content: "{Femalemorreasom}" }
                    },
                   
                    {
                        name: "Cumulative Female Mortality",
                        template: { content: "{cumulativefemalemortality}" }
                    },
                    {
                        name: "Cumulative Female Mortality %",
                        template: { content: "{cumufemalemortalityper}" }
                    },
                    
                    {
                        name: "Female Culls",
                        template: { content: "{femaleculls}" }
                    },
                   
                    {
                        name: "Cumulative Female Culls",
                        template: { content: "{cumulativefemaleculls}" }
                    },
                    {
                        name: "Cumulative Female Culls %",
                        template: { content: "{cumufemalecullsper}" }
                    },

                    {
                        name: "closing Balance Female",
                        template: { content: "{femaleclosingbalance}" }
                    },
                    {
                        name: "Recived Feed",
                        template: { content: "{receivedfeed}" }
                    },
                    {
                        name: "Male Feed Use",
                        template: { content: "{malefeedconsumption}" }
                    },
                    {
                        name: "Female Feed Use",
                        template: { content: "{femalefeedconsumption}" }
                    },
                    {
                        name: "Per Bird Feed Female",
                        template: { content: "{perbirdfeedfemale}" }
                    },
                    {
                        name: "Per Bird Feed Male",
                        template: { content: "{perbirdfeedmale}" }
                    },
                    {
                        name: "Female Feed Name",
                        template: { content: "{ffeeditem}" }
                    },
                    {
                        name: "Male Feed Name",
                        template: { content: "{mfeeditem}" }
                    },
                    {
                        name: "Male Feed Opening Balance",
                        template: { content: "{mfeedopebalance}" }
                    },
                    {
                        name: "Male Feed Closing Balance",
                        template: { content: "{mfeedclobalance}" }
                    },
                    {
                        name: "Female Feed Opening Balance",
                        template: { content: "{ffeedopebalance}" }
                    },
                    {
                        name: "Female Feed Closing Balance",
                        template: { content: "{ffeedclobalance}" }
                    },
                    {
                        name: "Body Weight Female Standared",
                        template: { content: "{femalestandardweight}" }
                    },
                    {
                        name: "Body Weight Femlae Actual",
                        template: { content: "{femaleactualweight}" }
                    },
                    {
                        name: "Body Weight Male Standared",
                        template: { content: "{malestandardweight}" }
                    },
                    {
                        name: "Body Weight Male Actual",
                        template: { content: "{maleactualweight}" }
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


                    }
    });
}, true);
