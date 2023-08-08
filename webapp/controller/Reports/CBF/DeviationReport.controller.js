sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/CBFReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service'

], function (JSONModel, BaseController, MessageBox, Export, ExportTypeCSV, commonFunction, cbfReportService, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.CBF.Transaction.DeviationReport", {

        onInit: function () {

            this.currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");
            this.getAllCommonBranch(this);
            // set empty model to view 
            var emptyModel = this.getModelDefault();
            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "cbfdeviationModel");
            this.getView().byId("txtdownload").setVisible(false);

        },

        getModelDefault: function () {
            return {
                branchid: null,
                fromdate: null,
                todate: null
            }
        },

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


            cbfReportService.getAllLine({ branchid: branch }, function (data) {
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

        // Push Data in Array Using forloop
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


            cbfReportService.getAllFarmer({ branchlineid: line }, function (data) {
                var oBatchModel = new sap.ui.model.json.JSONModel();
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


            cbfReportService.getAllFarm({ framerid: farmer }, function (data) {
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


            cbfReportService.getAllBatch({ farmid: farm }, function (data) {
                var oBatchModel = new sap.ui.model.json.JSONModel();

                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "batch_id": "All", "batch_number": "Select All" });
                    } else {
                        MessageBox.error("Batch  not availabel.")
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

        onSearchData: function () {

            // if(this.validateForm()){

            var currentContext = this;
            var batchstring = this.getView().byId("batchno").getSelectedKeys();
            var batchStr = "";

            for (var i = 0; i < batchstring.length; i++) {
                if (i == 0)
                    batchStr = parseInt(batchstring[i]);
                else
                    batchStr = batchStr + "," + parseInt(batchstring[i]);
            }

            var oModel = {
                batch_id: batchStr,
                fromdate: commonFunction.getDate(this.getView().byId("txtFromdate").getValue()),
                todate: commonFunction.getDate(this.getView().byId("txtTodate").getValue()),
                companyid: commonFunction.session("companyId")
            }

            cbfReportService.getDeviationReport(oModel, function (data) {

                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oModel, "cbfdeviationReport");
            });
            this.getView().byId("txtdownload").setVisible(true);

        },


        validateForm: function () {
            var isValid = true;

            if (!commonFunction.ismultiComRequired(this, "branchList", "Branch is required"))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "lineList", "Line is required."))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "farmerList", "Farmer is required."))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "farmList", "Farm is required."))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "batchno", "Batch is required."))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtFromdate", "From Date is required"))
                isValid = false;
            if (!commonFunction.isRequired(this, "txtTodate", "To Date is required"))
                isValid = false;


            if (!this.onDateChange())
                isValid = false;

            return isValid;
        },





        onDateChange: function () {
            var oModel = this.getView().getModel("cbfdeviationModel").oData

            var fromDate = commonFunction.getDateFromDB(oModel.fromdate);

            var todate = commonFunction.getDateFromDB(oModel.todate);
            var parts = fromDate.split('/');

            fromDate = Date.parse(new Date(parts[2], parts[1], parts[0]));
            var parts = todate.split('/');
            todate = Date.parse(new Date(parts[2], parts[1], parts[0]));

            var date1 = new Date(fromDate);
            var date2 = new Date(todate);

            if (date2 < date1) {
                MessageBox.error("From Date less then to date");
                return false;
            }
            else {
                return true;
            }
        },

        replaceStr: function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },

        // Function Used For PDF Download

        replaceTemplateData: function (template) {
            // Item table Data --------------

            var tbleModel = this.getView().getModel("cbfdeviationReport").oData.modelData;

            var htmTable = "";
            for (var indx in tbleModel) {

                var model = tbleModel[indx];
                // Replace/create column sequence data table
                htmTable += "<tr>";
                htmTable += "<td align='center'>" + model["'cbf_batchid', "] + "</td>"
                htmTable += "<td align='center'>" + model["transactiondate"] + "</td>"
                htmTable += "<td>" + model["farmer_name"] + "</td>"
                htmTable += "<td align='right'>" + model["farm_name"] + "</td>"
                htmTable += "<td align='right'>" + model["ageindays"] + "</td>"
                htmTable += "<td>" + model["itemname"] + "</td>"
                htmTable += "<td>" + model["quantity"] + "</td>"
                htmTable += "<td>" + model["expitemname"] + "</td>"
                htmTable += "<td>" + model["expfeedconsumption"] + "</td>"
                htmTable += "<td align='center'>" + model["deviation"] + "</td>"
                htmTable += "<td>" + model["deviationper"] + "</td>"
                htmTable += "<td>" + model["employeename"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;
            var Fromdate = this.getView().byId("txtFromdate").getValue();
            var Todate = this.getView().byId("txtTodate").getValue();
            var branchname = this.branchname;


            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);
            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##ReportFromDate##", Fromdate);
            template = this.replaceStr(template, "##ReportToDate##", Todate);
            template = this.replaceStr(template, "##BranchList##", branchname);
            return template;

        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("CBF", "DeviationReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Deviation Report");
            });
        },



        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var Fromdate = this.getView().byId("txtFromdate").getValue();
            var Todate = this.getView().byId("txtTodate").getValue();
            var branchname = this.branchname;

            var filename =Fromdate+'_'+Todate+'_'+branchname;


            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/



            var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ","
                }),

                // Pass in the model created above
                models: this.getView().getModel("cbfdeviationReport"),

                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content

                columns: [
                    {
                        name: "Batch No",
                        template: { content: "{cbf_batchid}" }
                    },
                    {
                        name: "Date",
                        template: { content: "{transactiondate}" }
                    },
                    {
                        name: "Farmer Name",
                        template: { content: "{farmer_name}" }
                    },
                    {
                        name: "Farm Name",
                        template: { content: "{farm_name}" }
                    },

                    {
                        name: "Age",
                        template: { content: "{ageindays}" }
                    },

                    {
                        name: "Actual Item Name",
                        template: { content: "{itemname}" }
                    },

                    {
                        name: "Actual Consumed Quantity",
                        template: { content: "{quantity}" }
                    },
                    {
                        name: "Standared Item Name",
                        template: { content: "{expitemname}" }
                    },
                    {
                        name: "Standared Consumed Quantity",
                        template: { content: "{expfeedconsumption}" }
                    },
                    {
                        name: "Deviation",
                        template: { content: "{deviation}" }
                    },
                    {
                        name: "Deviation %",
                        template: { content: "{deviationper}" }
                    },
                    {
                        name: "supervisor Name",
                        template: { content: "{employeename}" }
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
        }

    });
}, true);
