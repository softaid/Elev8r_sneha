
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

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.CBF.FarmPerformanceReport", {

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
        },

        getModelDefault: function () {
            return {


            }
        },

        resetModel: function () {
            var tbleModel = this.getView().getModel("tblModel");
            tbleModel.setData({ modelData: [] });

            var pModel = this.getView().getModel("reportModel");
            pModel.setData([]);

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
                htmTable += "<td align='center'>" + model["farmer_name"] + "</td>"
                htmTable += "<td>" + model["farm_name"] + "</td>"
                htmTable += "<td align='right'>" + model["batch_id"] + "</td>"
                htmTable += "<td align='right'>" + model["branchname"] + "</td>"
                htmTable += "<td>" + model["placement_date"] + "</td>"
                htmTable += "<td>" + model["liftingdate"] + "</td>"
                htmTable += "<td>" + model["Percumulativemortality"] + "</td>"
                htmTable += "<td>" + model["liftingdate"] + "</td>"
                htmTable += "<td>" + model["chick_qty"] + "</td>"
                htmTable += "<td align='center'>" + model["chickcost"] + "</td>"
                htmTable += "<td>" + model["chickamt"] + "</td>"
                htmTable += "<td align='right'>" + model["cummulativeactualfeed"] + "</td>"
                htmTable += "<td align='right'>" + model["totalmortality"] + "</td>"
                htmTable += "<td>" + model["ptotalmortality"] + "</td>"
                htmTable += "<td>" + model["totalculls"] + "</td>"
                htmTable += "<td>" + model["Percentageculls"] + "</td>"
                htmTable += "<td>" + model["itemname"] + "</td>"
                htmTable += "<td>" + model["inventorytransferin"] + "</td>"
                htmTable += "<td align='center'>" + model["totaldeliveredqty"] + "</td>"
                htmTable += "<td>" + model["quantity"] + "</td>"
                htmTable += "<td align='right'>" + model["totalwt"] + "</td>"

                htmTable += "<td align='center'>" + model["branchname"] + "</td>"
                htmTable += "<td>" + model["placement_date"] + "</td>"
                htmTable += "<td align='right'>" + model["Cumulativemortality"] + "</td>"
                htmTable += "<td align='right'>" + model["Percumulativemortality"] + "</td>"
                htmTable += "<td>" + model["fcr"] + "</td>"
                htmTable += "<td>" + model["chick_qty"] + "</td>"
                htmTable += "<td>" + model["actualfeedconsumption"] + "</td>"
                htmTable += "<td>" + model["cummulativestdfeed"] + "</td>"
                htmTable += "<td>" + model["cummulativeactualfeed"] + "</td>"
                htmTable += "<td align='center'>" + model["totalmortality"] + "</td>"
                htmTable += "<td>" + model["ptotalmortality"] + "</td>"
                htmTable += "<td align='right'>" + model["totalculls"] + "</td>"
                htmTable += "<td align='right'>" + model["Percentageculls"] + "</td>"
                htmTable += "<td>" + model["medicinecost"] + "</td>"
                htmTable += "<td>" + model["administrationcost"] + "</td>"
                htmTable += "<td>" + model["totaldeliveredqty"] + "</td>"
                htmTable += "<td>" + model["quantity"] + "</td>"
                htmTable += "<td>" + model["totalwt"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;

            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var branchname = this.branchname;
            var linename = this.linename;
            var farmername = this.farmername;
            var farmname = this.farmname;


            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);


            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##FromDate##", fromdate);
            template = this.replaceStr(template, "##ToDate##", todate);

            template = this.replaceStr(template, "##BranchName##", branchname);
            template = this.replaceStr(template, "##LineName##", linename);
            template = this.replaceStr(template, "##FarmerName##", farmername);
            template = this.replaceStr(template, "##FarmName##", farmname);

            return template;

        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("CBF", "FarmPerformanceReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Farm Performance Report");
            });
        },

        getFarmPerFormanceReport: function () {
            // if (this.validateForm()) {
            var currentContext = this;
            var farmstring = this.getView().byId("farmList").getSelectedKeys();

            var farmStr = "";

            for (var i = 0; i < farmstring.length; i++) {
                if (i == 0)
                    farmStr = parseInt(farmstring[i]);
                else
                    farmStr = farmStr + "," + parseInt(farmstring[i]);
            }

            var oModel = this.getView().getModel("reportModel");
            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();

            cBFReportsService.getFarmperformanceReport({ fromdate: fromdate, todate: todate, farm_id: farmStr }, function async(data) {
                var oBatchModel = currentContext.getView().getModel("tblModel");
                oBatchModel.setData({ modelData: data[0] });

            })
            // }
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





        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {

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
                        name: "transaction Date",
                        template: { content: "{transactiondate}" }
                    },
                    {
                        name: "Age",
                        template: { content: "{age}" }
                    },
                    {
                        name: "Opening Balance",
                        template: { content: "{openingbal}" }
                    },
                    {
                        name: "total culls",
                        template: { content: "{totalculls}" }
                    },
                    {
                        name: "Total Mortality",
                        template: { content: "{totalmortality}" }
                    },
                    {
                        name: "Cummulative Mortality",
                        template: { content: "{Cumulativemortality}" }
                    },
                    {
                        name: "Per Cummulative Mortality ",
                        template: { content: "{Percumulativemortality}" }
                    },
                    {
                        name: "Total Delivered Quantity",
                        template: { content: "{totaldeliveredqty}" }
                    },
                    {
                        name: "Standered consumption",
                        template: { content: "{stdconsumption}" }
                    },
                    {
                        name: "Actual Feed consumption",
                        template: { content: "{actualfeedconsumption}" }
                    },
                    {
                        name: "Cummulative standered feed",
                        template: { content: "{cummulativestdfeed}" }
                    },
                    {
                        name: "Cummulative Actual Feed",
                        template: { content: "{cummulativeactualfeed}" }
                    },
                    {
                        name: "Avg Weight",
                        template: { content: "{avgweight}" }
                    },
                    {
                        name: "Actual Body Weight",
                        template: { content: "{actualbodyweight}" }
                    },
                    {
                        name: "FCR",
                        template: { content: "{fcr}" }
                    },
                    {
                        name: "Item Name",
                        template: { content: "{itemname}" }
                    },
                    {
                        name: "Inventory Transfer In",
                        template: { content: "{inventorytransferin}" }
                    },
                    {
                        name: "Inventory Transfer Out",
                        template: { content: "{inventorytransferout}" }
                    },
                    {
                        name: "Quantity",
                        template: { content: "{quantity}" }
                    },
                    {
                        name: "Closing Balance",
                        template: { content: "{closingbal}" }
                    }





                ]
            });

            // download exported file
            oExport.saveFile()
                .catch(function (oError) {
                    MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
                })
                .then(function () {

                    oExport.destroy();
                });
        }




    });
}, true);
