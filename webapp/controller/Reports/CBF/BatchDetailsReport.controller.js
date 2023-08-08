
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

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.CBF.BatchDetailsReport", {

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
                htmTable += "<td align='center'>" + model["transactiondate"] + "</td>"
                htmTable += "<td>" + model["itemopeningbal"] + "</td>"
                htmTable += "<td align='right'>" + model["age"] + "</td>"
                htmTable += "<td align='right'>" + model["totalmortality"] + "</td>"
                htmTable += "<td>" + model["Cumulativemortality"] + "</td>"
                htmTable += "<td>" + model["Percumulativemortality"] + "</td>"
                htmTable += "<td>" + model["totalculls"] + "</td>"
                htmTable += "<td>" + model["Cumulativeculls"] + "</td>"
                htmTable += "<td>" + model["Percumulativeculls"] + "</td>"
                htmTable += "<td align='center'>" + model["totaldeliveredqty"] + "</td>"
                htmTable += "<td>" + model["iteminventorytransferout"] + "</td>"
                htmTable += "<td align='right'>" + model["iteminventorytransferin"] + "</td>"
                htmTable += "<td align='right'>" + model["itemclosingbal"] + "</td>"
                htmTable += "<td>" + model["itemname"] + "</td>"
                htmTable += "<td>" + model["openingbal"] + "</td>"
                htmTable += "<td>" + model["actualfeedconsumption"] + "</td>"
                htmTable += "<td>" + model["feedconcost"] + "</td>"
                htmTable += "<td>" + model["stdconsumption"] + "</td>"
                htmTable += "<td>" + model["cummulativeactualfeed"] + "</td>"
                htmTable += "<td>" + model["cummulativeactualfeedcost"] + "</td>"
                htmTable += "<td align='center'>" + model["cummulativestdfeed"] + "</td>"
                htmTable += "<td>" + model["avgweight"] + "</td>"
                htmTable += "<td align='right'>" + model["fcr"] + "</td>"
                htmTable += "<td>" + model["actualfcr"] + "</td>"
                htmTable += "<td align='center'>" + model["closingbal"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;
            var branchname = this.branchnameone;
            var linename = this.linenameone;
            var farmername = this.farmernameone;
            var farmname = this.farmone;
            var batchname = this.batchnameone;

            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);
            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##BranchName##", branchname);
            template = this.replaceStr(template, "##LineName##", linename);
            template = this.replaceStr(template, "##FarmerName##", farmername);
            template = this.replaceStr(template, "##FarmName##", farmname);
            template = this.replaceStr(template, "##BatchName##", batchname);
            return template;

        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("CBF", "BatchDetailReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generateLargePDF(template, "Batch Detail Report");
            });
        },


        getbatchscheduleReport: function () {

            if (this.validateForm()) {
                var currentContext = this;
                var batchstring = this.getView().byId("batchno").getSelectedItem();
                var batchStr = batchstring.mProperties.key;

                cBFReportsService.getBatchDetailsReport({ cbf_batchid: batchStr }, function async(data) {
                    var oBatchModel = currentContext.getView().getModel("tblModel");
                    oBatchModel.setData({ modelData: data[0] });

                })
            }
            this.getView().byId("txtdownload").setVisible(true);
        },

        getAllCommonBranch: function (currentContext) {
            commonService.getAllCommonBranch(function (data) {
                var oBranchModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        //data[0].unshift({ "id": "All", "branchname": "Select All" });
                    } else {
                        MessageBox.error("branch not availabel.")
                    }
                }

                oBranchModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oBranchModel, "branchModel");
            });
        },


        BranchSelect: function () {
            var branchid = this.getView().byId("branchList").getSelectedItem().mProperties.key;
            var currentContext = this;
            currentContext.branchname = this.getView().byId("branchList").getSelectedItem();
            this.branchnameone = this.branchname.mProperties.text;
           
            cBFReportsService.getAllLine({ branchid: branchid }, function (data) {
                var oBatchModel = new sap.ui.model.json.JSONModel();

                if (data.length > 0) {
                    if (data[0].length > 0) {
                        //data[0].unshift({ "id": "All", "linename": "Select All" });
                    } else {
                        MessageBox.error("line  not availabel.")
                    }
                }

                currentContext.getView().setModel(oBatchModel, "lineModel");
                oBatchModel.setData({ modelData: data[0] });
            });

            this.getView().byId("branchList").setValueState(sap.ui.core.ValueState.None);
            commonFunction.getReference("FarmSts", "farmStatusList", this);



        },

        LineSelect: function () {
            var lineid = this.getView().byId("lineList").getSelectedItem().mProperties.key;
            var currentContext = this;
            currentContext.linename = this.getView().byId("lineList").getSelectedItem();
            this.linenameone = this.linename.mProperties.text;

            cBFReportsService.getAllFarmer({ branchlineid: lineid }, function (data) {
                var oBatchModel = new sap.ui.model.json.JSONModel();

                if (data.length > 0) {
                    if (data[0].length > 0) {
                        // data[0].unshift({ "id": "All", "farmer_name": "Select All" });
                    } else {
                        MessageBox.error("farmer  not availabel.")
                    }
                }

                currentContext.getView().setModel(oBatchModel, "farmerModel");
                oBatchModel.setData({ modelData: data[0] });
            });

            this.getView().byId("lineList").setValueState(sap.ui.core.ValueState.None);

        },

        FarmerSelect: function () {
            var farmid = this.getView().byId("farmerList").getSelectedItem().mProperties.key;
            var currentContext = this;
            currentContext.farmername = this.getView().byId("farmerList").getSelectedItem();
            this.farmernameone = this.farmername.mProperties.text;
            cBFReportsService.getAllFarm({ framerid: farmid }, function (data) {
                var oBatchModel = new sap.ui.model.json.JSONModel();

                if (data.length > 0) {
                    if (data[0].length > 0) {
                        //  data[0].unshift({ "id": "All", "farm_name": "Select All" });
                    } else {
                        MessageBox.error("farm  not availabel.")
                    }
                }

                currentContext.getView().setModel(oBatchModel, "farmModel");
                oBatchModel.setData({ modelData: data[0] });

            });

            this.getView().byId("farmerList").setValueState(sap.ui.core.ValueState.None);
        },

        FarmSelect: function () {
            var farmidone = this.getView().byId("farmList").getSelectedItem().mProperties.key;
            var currentContext = this;
            currentContext.farmname = this.getView().byId("farmList").getSelectedItem();
            this.farmone = this.farmname.mProperties.text;

            cBFReportsService.getAllBatch({ farmid: farmidone }, function (data) {
                var oBatchModel = new sap.ui.model.json.JSONModel();

                if (data.length > 0) {
                    if (data[0].length > 0) {
                        //  data[0].unshift({ "id": "All", "batch_id": "Select All" });
                    } else {
                        MessageBox.error("batch not availabel.")
                    }
                }

                currentContext.getView().setModel(oBatchModel, "batchModel");

                oBatchModel.setData({ modelData: data[0] });

            });

            this.getView().byId("farmList").setValueState(sap.ui.core.ValueState.None);

        },

        BatchSelect: function () {
            var currentContext = this;
            currentContext.batchname = this.getView().byId("batchno").getSelectedItem();
            this.batchnameone = this.batchname.mProperties.text;
        },




        validateForm: function () {
            var isValid = true;

            if (!commonFunction.isSelectRequired(this, "branchList", "Branch is required"))
                isValid = false;

            if (!commonFunction.isSelectRequired(this, "lineList", "Line is required."))
                isValid = false;

            if (!commonFunction.isSelectRequired(this, "farmerList", "farmer is required."))
                isValid = false;

            if (!commonFunction.isSelectRequired(this, "farmList", "farm is required."))
                isValid = false;

            if (!commonFunction.isSelectRequired(this, "batchno", "batch is required."))
                isValid = false;


            return isValid;
        },



        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var branchname = this.branchnameone;
            var linename = this.linenameone;
            var farmername = this.farmernameone;
            var farmname = this.farmone;
            var  batchname= this.batchnameone;

            var filename =branchname+'_'+linename+'_'+farmername+'_'+farmname+'_'+batchname;

            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d3batchname4268046cd3ea.html
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
                        name: "Transaction Date",
                        template: { content: "{transactiondate}" }
                    },
                    {
                        name: "Bird Opening Balance",
                        template: { content: "{itemopeningbal}" }
                    },
                    {
                        name: "Breed Name.",
                        template: { content: "{birditemname}" }
                    },
                    {
                        name: "Age",
                        template: { content: "{age}" }
                    },
                    {
                        name: "Mortality",
                        template: { content: "{totalmortality}" }
                    },
                    {
                        name: "Cummulative Mortality",
                        template: { content: "{Cumulativemortality}" }
                    },
                    {
                        name: "Cummulative Mortality %",
                        template: { content: "{Percumulativemortality}" }
                    },
                    {
                        name: "Culls",
                        template: { content: "{totalculls}" }
                    },
                    {
                        name: "Cummulative Culls",
                        template: { content: "{Cumulativeculls}" }
                    },
                    {
                        name: "Cummulative Culls %",
                        template: { content: "{Percumulativeculls}" }
                    },
                    {
                        name: "Bird Sold",
                        template: { content: "{totaldeliveredqty}" }
                    },
                    {
                        name: "Bird Transfer Out",
                        template: { content: "{iteminventorytransferout}" }
                    },
                    {
                        name: "Bird Transfer In",
                        template: { content: "{iteminventorytransferin}" }
                    },
                    {
                        name: "Bird Closing Balance",
                        template: { content: "{itemclosingbal}" }
                    },
                    {
                        name: "Item Name",
                        template: { content: "{itemname}" }
                    },
                    {
                        name: "Item Opening Balance",
                        template: { content: "{openingbal}" }
                    },
                    {
                        name: "Feed Inward",
                        template: { content: "{inventorytransferin}" }
                    },
                    {
                        name: "Actual Feed Consumption",
                        template: { content: "{actualfeedconsumption}" }
                    },
                    {
                        name: "Actual Feed Consumption Cost",
                        template: { content: "{feedconcost}" }
                    },
                    {
                        name: "Standared Feed Consumption",
                        template: { content: "{stdconsumption}" }
                    },
                    {
                        name: "Actual Cummulative Feed",
                        template: { content: "{cummulativeactualfeed}" }

                    },
                    {
                        name: "Actual Cummulative Feed Cost",
                        template: { content: "{cummulativeactualfeedcost}" }

                    },
                    {
                        name: "Standared Cummulative Feed",
                        template: { content: "{cummulativestdfeed}" }
                    },
                    {
                        name: "Actual Body Weight",
                        template: { content: "{avgweight}" }
                    },

                    {
                        name: "Standared FCR",
                        template: { content: "{fcr}" }
                    },
                    {
                        name: "Actual FCR",
                        template: { content: "{actualfcr}" }
                    },
                    {
                        name: "Feed Closing Stock",
                        template: { content: "{closingbal}" }
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
