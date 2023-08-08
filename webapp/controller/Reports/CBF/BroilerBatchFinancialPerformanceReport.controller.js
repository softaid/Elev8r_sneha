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

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.CBF.BroilerBatchFinancialPerformanceReport", {


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

        // Function for get Broiler Batch Financial Performance Report
        getCBFBroilerBatchFinancialPerformanceReport: function () {
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
                var curdate = this.getView().byId("curdate").getValue();
                var todate = this.getView().byId("todate").getValue();

                cBFReportsService.BroilerBatchFinancialPerformanceReport({ farmid: farmStr, fromdate: curdate, todate: todate }, function async(data) {
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
                        MessageBox.error("farm not availabel.")
                    }
                }

                oBranchModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oBranchModel, "farmModel");
            });
        },

        // select all functionality for farmers
        farmSelectionFinish: function (oEvt) {
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

        // validation function for report filters
        validateForm: function () {
            var isValid = true;
            if (!commonFunction.isRequired(this, "curdate", "From Date is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "todate", "To Date is required"))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "allFarmList", "Farm is required"))
                isValid = false;

            return isValid;
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
                htmTable += "<td align='right'>" + model["batch_number"] + "</td>"
                htmTable += "<td align='right'>" + model["placementdate"] + "</td>"
                htmTable += "<td>" + model["lastliftimgdate"] + "</td>"
                htmTable += "<td>" + model["age"] + "</td>"
                htmTable += "<td>" + model["actfeedconperbird"] + "</td>"
                htmTable += "<td>" + model["stdfeedconperbird"] + "</td>"
                htmTable += "<td>" + model["actfcr"] + "</td>"

                htmTable += "<td align='center'>" + model["stdfcr"] + "</td>"
                htmTable += "<td>" + model["totalmortality"] + "</td>"
                htmTable += "<td align='right'>" + model["morper"] + "</td>"
                htmTable += "<td align='right'>" + model["totalbirdsold"] + "</td>"
                htmTable += "<td>" + model["totalbirdweight"] + "</td>"
                htmTable += "<td>" + model["weight"] + "</td>"
                htmTable += "<td>" + model["weight"] + "</td>"
                htmTable += "<td>" + model["feedconcost"] + "</td>"
                htmTable += "<td>" + model["medconcost"] + "</td>"

                htmTable += "<td align='center'>" + model["vitconcost"] + "</td>"
                htmTable += "<td>" + model["vaccconcost"] + "</td>"
                htmTable += "<td align='right'>" + model["othercost"] + "</td>"
                htmTable += "<td align='right'>" + model["totalcost"] + "</td>"
                htmTable += "<td align='right'>" + model["costperbird"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;
            var fromdate = this.getView().byId("curdate").getValue();
            var todate = this.getView().byId("todate").getValue();
            var farmname = this.farm

            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);
            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##ReportFromDate##", fromdate);
            template = this.replaceStr(template, "##TODATE##", todate);
            template = this.replaceStr(template, "##FarmName##", farmname);
            //template = this.replaceStr(template, "##BatchNo##", batchno);
            return template;

        },

        getBroilerBatchFinancialPerformancecreatePDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("CBF", "BroilerBatchFinancePerformance.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generateLargePDF(template, " Broiler Batch Financial Performance Report");
            });
        },

        // Function for CSV file  for Broiler Batch Financial Performance Report
        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var fromdate = this.getView().byId("curdate").getValue();
            var todate = this.getView().byId("todate").getValue();
            var farmname = this.farm

            var filename = fromdate + '_' + todate + '_' + farmname;

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
                        name: "Batch Place Date",
                        template: { content: "{placementdate}" }
                    },
                    {
                        name: "Batch Close Date",
                        template: { content: "{lastliftimgdate}" }
                    },
                    {
                        name: "Age At Last Pullout",
                        template: { content: "{age}" }
                    },
                    {
                        name: "Actual Feed Consumption/Bird",
                        template: { content: "{actfeedconperbird}" }
                    },
                    {
                        name: "Standared Feed Consumption/Bird",
                        template: { content: "{stdfeedconperbird}" }
                    },
                    {
                        name: "Actual FCR",
                        template: { content: "{actfcr}" }
                    },
                    {
                        name: "Standared FCR",
                        template: { content: "{stdfcr}" }
                    },
                    {
                        name: "Total Mortality",
                        template: { content: "{totalmortality}" }
                    },
                    {
                        name: "Total Mortality %",
                        template: { content: "{morper}" }
                    },
                    {
                        name: "Total Bird Sold",
                        template: { content: "{totalbirdsold}" }
                    },
                    {
                        name: "Total Sold Weight",
                        template: { content: "{deliveredwt}" }
                    },
                    {
                        name: "Average Size",
                        template: { content: "{weight}" }
                    },
                    {
                        name: "Standared Bird Weight",
                        template: { content: "{weight}" }
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
                        name: "Other Cost",
                        template: { content: "{othercost}" }
                    },
                    {
                        name: "Total Cost",
                        template: { content: "{totalcost}" }
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
