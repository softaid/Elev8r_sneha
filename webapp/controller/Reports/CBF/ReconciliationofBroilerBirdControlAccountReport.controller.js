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

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.CBF.ReconciliationofBroilerBirdControlAccountReport", {

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
        // function for get all farmers
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

        // get all batches from farm
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
                        MessageBox.error("Batch  not availabel.")
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

        // get all batch name
        batchSelectionFinish: function (oEvt) {
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedbatch = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedbatch.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }

            this.batchnamepdf = [];
            for (var i = 0; i < selectedbatch.length; i++) {
                this.batchnamepdf.push(selectedbatch[i].key);
            }

            this.getView().byId("txtbatch").setValueState(sap.ui.core.ValueState.None);

            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        // Function for get Reconciliation of Broiler Bird Control Account Report
        getRecncilationOFBroilerBirdControAccountReport: function () {
            if (this.validateForm()) {
                var currentContext = this;
                var farmstring = this.getView().byId("allFarmList").getSelectedKeys();
                var farmStr = "";
                this.farm = "";

                for (var i = 0; i < farmstring.length; i++) {
                    if (i == 0)
                        farmStr = parseInt(farmstring[i]);
                    else
                        farmStr = farmStr + "," + parseInt(farmstring[i]);
                }

                this.farm = farmStr;
                var batchstring = this.getView().byId("txtbatch").getSelectedKeys();
                var batchStr = "";

                for (var i = 0; i < batchstring.length; i++) {
                    if (i == 0)
                        batchStr = parseInt(batchstring[i]);
                    else
                        batchStr = batchStr + "," + parseInt(batchstring[i]);
                }

                var curdate = this.getView().byId("curdate").getValue();
                var todate = this.getView().byId("todate").getValue();

                cBFReportsService.BroilerBatchReconcilationPerformanceReport({ farmid: farmStr, batchid: batchStr, fromdate: curdate, todate: todate }, function async(data) {
                    var oBatchModel = currentContext.getView().getModel("tblModel");
                    oBatchModel.setData({ modelData: data[0] });
                })
            }
            this.getView().byId("txtdownload").setVisible(true);
        },

        // validation function for report filters
        validateForm: function () {
            var isValid = true;
            if (!commonFunction.ismultiComRequired(this, "allFarmList", "Farm is required"))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "txtbatch", "batch is required."))
                isValid = false;

            if (!commonFunction.isRequired(this, "curdate", "From Date is required"))
                isValid = false;
            if (!commonFunction.isRequired(this, "todate", "To Date is required"))
                isValid = false;

            return isValid;
        },

        replaceStr: function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },

        //Start Function Used For PDF Download

        replaceTemplateData: function (template) {
            // Item table Data --------------

            var tbleModel = this.getView().getModel("tblModel").oData.modelData;
            var htmTable = "";
            for (var indx in tbleModel) {

                var model = tbleModel[indx];
                // Replace/create column sequence data table
                htmTable += "<tr>";
                htmTable += "<td align='center'>" + model["locationname"] + "</td>"
                htmTable += "<td>" + model["farm_name"] + "</td>"
                htmTable += "<td align='right'>" + model["farmer_name"] + "</td>"
                htmTable += "<td align='right'>" + model["batch_number"] + "</td>"
                htmTable += "<td>" + model["placementdate"] + "</td>"
                htmTable += "<td>" + model["live_batch_date"] + "</td>"
                htmTable += "<td>" + model["ageindays"] + "</td>"
                htmTable += "<td>" + model["batchstatus"] + "</td>"
                htmTable += "<td>" + model["purvalue"] + "</td>"
                htmTable += "<td>" + model["totalbirdsoldcost"] + "</td>"
                htmTable += "<td align='center'>" + model["feedconcost"] + "</td>"
                htmTable += "<td>" + model["medconcost"] + "</td>"
                htmTable += "<td align='right'>" + model["vaccconcost"] + "</td>"
                htmTable += "<td align='right'>" + model["vitconcost"] + "</td>"
                htmTable += "<td>" + model["administrationcost"] + "</td>"
                htmTable += "<td>" + model["totalcost"] + "</td>"
                htmTable += "<td>" + model["costperbird"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;
            var fromdate = this.getView().byId("curdate").getValue();
            var todate = this.getView().byId("todate").getValue();
            var batchsname = this.batchsname

            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);
            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##ReportFromDate##", fromdate);
            template = this.replaceStr(template, "##TODATE##", todate);
            template = this.replaceStr(template, "##FarmName##", batchsname);
            //template = this.replaceStr(template, "##BatchNo##", batchno);
            return template;

        },

        reconcilationOFBroilerBircontrolAccountcreatePDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("CBF", "ReconciliationofBroilerBirdControlAccountReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generateLargePDF(template, "Reconciliation of Broiler Bird Control Account Report");
            });
        },
        //End Function Used For PDF Download

        // Function for CSV file  for Broiler Bird Balance Report
        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var fromdate = this.getView().byId("curdate").getValue();
            var todate = this.getView().byId("todate").getValue();
            var batchsname = this.batchsname
            var filename = fromdate + '_' + todate + '_' + batchsname;

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
                        name: "Location Name",
                        template: { content: "{locationname}" }
                    },
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
                        name: "Batch Place Date",
                        template: { content: "{placementdate}" }
                    },
                    {
                        name: "Live Date",
                        template: { content: "{live_batch_date}" }
                    },
                    {
                        name: "Age",
                        template: { content: "{ageindays}" }
                    },
                    {
                        name: "Batch Status",
                        template: { content: "{batchstatus}" }
                    },
                    {
                        name: "Placed Chicks",
                        template: { content: "{batch_place_qty}" }
                    },
                    {
                        name: "Chick Cost",
                        template: { content: "{purvalue}" }
                    },
                    {
                        name: "Feed Consumed",
                        template: { content: "{actfeedcon}" }
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
                        template: { content: "{vaccconcost}" }
                    },
                    {
                        name: "Vitamin Cost",
                        template: { content: "{vitconcost}" }
                    },
                    {
                        name: "Administration Cost",
                        template: { content: "{administrationcost}" }
                    },
                    {
                        name: "Total Cost",
                        template: { content: "{totalcost}" }
                    },
                    {
                        name: "Growing charges",
                        template: { content: "{rearingchargepayable}" }
                    },

                    {
                        name: "Sale Quantity",
                        template: { content: "{ageindays}" }
                    },
                    {
                        name: "Sale Weight",
                        template: { content: "{batchstatus}" }
                    },
                    {
                        name: "Average Size",
                        template: { content: "{batch_place_qty}" }
                    },
                    {
                        name: "Bird Sold Cost",
                        template: { content: "{purvalue}" }
                    },
                    {
                        name: "FCR",
                        template: { content: "{actfeedcon}" }
                    },
                    {
                        name: "BPI/EEF",
                        template: { content: "{feedconcost}" }
                    },
                    {
                        name: "Cost/Kg",
                        template: { content: "{medconcost}" }
                    },
                    {
                        name: "Cost/Bird",
                        template: { content: "{costperbird}" }
                    },
                    {
                        name: "Profit/Loss",
                        template: { content: "{profitloss}" }
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
