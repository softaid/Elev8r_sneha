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

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.CBF.BatchWiseBirdCostReport", {

        currentContext: null,

        onInit: function () {
            this.currentContext = this;
            this.getAllCommonBranch(this);
            // commonFunction.getAllCommonBranch(this);
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
                branch_id: null,
                line_id: null
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
            var tblModel = this.getView().getModel("tblModel").oData.modelData;
            var htmTable = "";
            for (var indx in tblModel) {
                var model = tblModel[indx];
                // Replace/create column sequence data table
                htmTable += "<tr>";
                htmTable += "<td align='center'>" + model["placement_date"] + "</td>"
                htmTable += "<td>" + model["batch_place_qty"] + "</td>"
                htmTable += "<td align='right'>" + model["live_batch_qty"] + "</td>"
                htmTable += "<td align='right'>" + model["culls"] + "</td>"
                htmTable += "<td>" + model["total_mortality"] + "</td>"
                htmTable += "<td>" + model["saleqty"] + "</td>"
                htmTable += "<td>" + model["quantity"] + "</td>"
                htmTable += "<td>" + model["amount"] + "</td>"
                htmTable += "<td align='center'>" + model["cummufeedconsumption"] + "</td>"
                htmTable += "<td>" + model["cummufeedamount"] + "</td>"
                htmTable += "<td align='right'>" + model["feedamount"] + "</td>"
                htmTable += "<td align='right'>" + model["cummulativeamt"] + "</td>"
                htmTable += "<td>" + model["totalamt"] + "</td>"
                htmTable += "<td>" + model["fcr"] + "</td>"
                htmTable += "<td>" + model["closingstock"] + "</td>"
                htmTable += "<td>" + model["chickcost"] + "</td>"
                htmTable += "<td>" + model["actualcost"] + "</td>"
                htmTable += "</tr>";
            }

            var line_id = tblModel.line_id;
            var placementdate = this.getView().byId("plcementdate").getValue();
            template = this.replaceStr(template, "##ItemList##", htmTable);
            template = this.replaceStr(template, "##ReportDate##", placementdate);
            template = this.replaceStr(template, "##CompanyName##", commonFunction.session("companyname"));
            template = this.replaceStr(template, "##lineid##", line_id);
            return template;
        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("CBF", "BatchWiseBirdCostReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Batch Wise Bird Cost report");
            });
        },

        getBatchwiseBirdCostReport: function () {
                var currentContext = this;
                var batchstring = this.getView().byId("batchList1").getSelectedKeys();
                var placementdate = this.getView().byId("plcementdate").getValue();
                var batchStr = "";

                for (var i = 0; i < batchstring.length; i++) {
                    if (i == 0)
                    batchStr = parseInt(batchstring[i]);
                    else
                    batchStr = batchStr + "," + parseInt(batchstring[i]);
                }

                cBFReportsService.getBatchWiseBirdCostReport({placementdate: placementdate,cbf_batchid: batchStr }, function async(data) {
                    var oBatchModel = currentContext.getView().getModel("tblModel");
                    oBatchModel.setData({ modelData: data[0] });


                })
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

            cBFReportsService.getAllFarmerByBranchname({ branch_id: branch }, function (data) {
                var oBatchModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "farmer_name": "Select All" });
                    } else {
                        MessageBox.error("line  not availabel.")
                    }
                }

                currentContext.getView().setModel(oBatchModel, "FarmerModel");
                oBatchModel.setData({ modelData: data[0] });
            });

            this.getView().byId("branchList").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();


                }

            })

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

            cBFReportsService.getAllFarm({ framerid: farmer }, function (data) {
                var oBatchModel = new sap.ui.model.json.JSONModel();

                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "farm_name": "Select All" });
                    } else {
                        MessageBox.error("line  not availabel.")
                    }
                }

                currentContext.getView().setModel(oBatchModel, "FarmModel");
                oBatchModel.setData({ modelData: data[0] });
            });

            this.getView().byId("farmerList").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();


                }

            })

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

            cBFReportsService.getAllBatch({ farmid: farm }, function (data) {
                var oBatchModel = new sap.ui.model.json.JSONModel();
              
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "batch_id": "Select All" });
                    } else {
                        MessageBox.error("line  not availabel.")
                    }
                }

                currentContext.getView().setModel(oBatchModel, "BatchModel");
                oBatchModel.setData({ modelData: data[0] });
            });

            this.getView().byId("farmList").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();


                }

            })

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
                        name: "Branch Name",
                        template: { content: "{branchname}" }
                    },
                    {
                        name: "Farmer Code",
                        template: { content: "{itemname}" }
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
                        name: "Batch id",
                        template: { content: "{batch_number}" }
                    },
                    {
                        name: "Total Area",
                        template: { content: "{total_area}" }
                    },
                    {
                        name: "Density",
                        template: { content: "{density}" }
                    },
                    {
                        name: "Batch Quantity",
                        template: { content: "{live_batch_qty}" }
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
