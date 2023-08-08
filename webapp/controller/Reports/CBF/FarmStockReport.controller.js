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

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.CBF.FarmStockReport", {

        currentContext: null,

        onInit: function () {
            this.currentContext = this;
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
                htmTable += "<td align='center'>" + model["branchname"] + "</td>"
                htmTable += "<td>" + model["farm_type_id"] + "</td>"
                htmTable += "<td align='right'>" + model["farmer_name"] + "</td>"
                htmTable += "<td align='right'>" + model["farm_name"] + "</td>"
                htmTable += "<td>" + model["batch_number"] + "</td>"
                htmTable += "<td>" + model["total_area"] + "</td>"
                htmTable += "<td>" + model["density"] + "</td>"
                htmTable += "<td>" + model["batch_qty"] + "</td>"
                htmTable += "</tr>";
            }

            var line_id = tblModel.line_id;
            var todayDate = new Date();
            var curDate = commonFunction.getDateFromDB(todayDate);
            var curTime = todayDate.getHours() + ":" + todayDate.getMinutes() + ":" + todayDate.getSeconds();
            template = this.replaceStr(template, "##ItemList##", htmTable);
            template = this.replaceStr(template, "##ReportDate##", curDate);
            template = this.replaceStr(template, "##ReporTime##", curTime);
            template = this.replaceStr(template, "##CompanyName##", commonFunction.session("companyname"));
            template = this.replaceStr(template, "##lineid##", line_id);
            return template;
        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("CBF", "BatchScheduleReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Bill of material report");
            });
        },

        getBatchwiseBirdCostReport: function () {
            debugger;
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
                this.getView().byId("txtdownload").setVisible(true);
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

            this.farmname = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                this.farmname.push(selectedKeys[i].text);
            }

            cBFReportsService.getAllShedByFarmer({ farmid: farm }, function (data) {
                console.log("data",data);
                var oBatchModel = new sap.ui.model.json.JSONModel();
              
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "shedid": "All", "shed_name": "Select All" });
                    } else {
                        MessageBox.error("Shed is not availabel.")
                    }
                }

                currentContext.getView().setModel(oBatchModel, "ShedModel");
                oBatchModel.setData({ modelData: data[0] });
            });

            this.getView().byId("farmList").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            })
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
            var currentContext = this;
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedKeys = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedKeys.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });

            }
            var shedid = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                shedid.push(selectedKeys[i].key);
            }

            this.shedname = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                this.shedname.push(selectedKeys[i].text);
            }

            cBFReportsService.getAllBatchByShed({ shedid: shedid }, function (data) {
                console.log("data",data);
                var oBatchModel = new sap.ui.model.json.JSONModel();
              
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "cbfbatchid": "All", "batch_number": "Select All" });
                    } else {
                        MessageBox.error("Batch is not availabel.")
                    }
                }

                currentContext.getView().setModel(oBatchModel, "BatchModel");
                oBatchModel.setData({ modelData: data[0] });
            });

            this.getView().byId("txtshed").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            })
        },
	
	   onSearchFarmerstockReport: function () {
           // if (this.validateForm()) {


                var currentContext = this;
                var batch = this.getView().byId("txtbatch").getSelectedKeys();
                var batchStr = "";
             


                for (var i = 0; i < batch.length; i++) {
                    if (i == 0)
                    batchStr = parseInt(batch[i]);
                    else
                    batchStr = batchStr + "," + parseInt(batch[i]);
                }
               

                cBFReportsService.getFarmerstockReport({ batchid: batchStr}, function async(data) {
                    console.log("data",data);
                    var oBatchModel = currentContext.getView().getModel("tblModel");
                    oBatchModel.setData({ modelData: data[0] });


                })
                this.getView().byId("txtdownload").setVisible(true);
           // }
        },

       onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
        var farmername = this.farmname;
        var batchname = this.batchnamepdf;
        var farmename = this.farmname;

        var filename =farmername+'_'+farmename+'_'+batchname;


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
                        name: "Farmer Name",
                        template: { content: "{farmer_name}" }
                    },
                    {
                        name: "Shed Name",
                        template: { content: "{shed_name}" }
                    },
                    {
                        name: "Warehousebin Name",
                        template: { content: "{binname}" }
                    },
                    {
                        name: "Item Name",
                        template: { content: "{itemname}" }
                    },
                    {
                        name: "Unit",
                        template: { content: "{itemunitname}" }
                    },
                    {
                        name: "Opening",
                        template: { content: "{openingstock}" }
                    },
                    {
                        name: "Rate/Unit",
                        template: { content: "{opeavgrate}" }
                    },
                    {
                        name: "Total Amount",
                        template: { content: "{openingrate}" }
                    },
                    {
                        name: "Inward",
                        template: { content: "{inventorytransferin}" }
                    },
                    {
                        name: "Rate/Unit",
                        template: { content: "{inwardavgrate}" }
                    },
                    {
                        name: "Total Amount",
                        template: { content: "{inwardrate}" }
                    },
                    {
                        name: "Outward",
                        template: { content: "{inventorytransferout}" }
                    },

		            {
                        name: "Cummulative Outward",
                        template: { content: "{cuminventorytransferout}" }
                    },

                    {
                        name: "Rate/Unit",
                        template: { content: "{outwardavgrate}" }
                    },
                    {
                        name: "Total Amount",
                        template: { content: "{outwardrate}" }
                    },
                    {
                        name: "Closing",
                        template: { content: "{closingbal}" }
                    },
                    {
                        name: "Rate/Unit",
                        template: { content: "{closavgrate}" }
                    },
                    {
                        name: "Total Amount",
                        template: { content: "{cloamt}" }
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
