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

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.CBF.DailySupervisorReport", {

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
        },

        getModelDefault: function () {
            return {

                curdate: null,
                fromage: null,
                toage: null,
                fromweight: null,
                toweight: null,
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

        replaceTemplateData: function (template) {
            // Item table Data --------------
            var tblModel = this.getView().getModel("reportModel").oData.modelData;
            var htmTable = "";
            for (var indx in tblModel) {
                var model = tblModel[indx];
                // Replace/create column sequence data table
                htmTable += "<tr>";

                htmTable += "<td>" + model["farmer_name"] + "</td>"
                htmTable += "<td align='right'>" + model["farm_name"] + "</td>"
                htmTable += "<td align='right'>" + model["batch_id"] + "</td>"
                htmTable += "<td align='center'>" + model["placement_date"] + "</td>"
                htmTable += "<td>" + model["age"] + "</td>"
                htmTable += "<td>" + model["chick_qty"] + "</td>"
                htmTable += "<td>" + model["total_area"] + "</td>"
                htmTable += "<td>" + model["density"] + "</td>"
                htmTable += "</tr>";
            }


            var fromdate = commonFunction.getDate(tblModel.oData.fromdate)
            var todate = commonFunction.getDate(tblModel.oData.todate);
            template = this.replaceStr(template, "##ItemList##", htmTable);
            template = this.replaceStr(template, "##ReportFromDate##", fromdate);
            template = this.replaceStr(template, " ##ReporToDate##", todate);
            template = this.replaceStr(template, "##CompanyName##", commonFunction.session("companyname"));
            template = this.replaceStr(template, "##lineid##", line_id);
            return template;
        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("CBF", "DensityRegisterReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Density Register report");
            });
        },

        onSearchReadyBirdForSaleReport: function () {
            if (this.validateForm()) {

                var currentContext = this;
                var branchstring = this.getView().byId("branchList").getSelectedKeys();
                var linestring = this.getView().byId("lineList").getSelectedKeys();
                var empstring = this.getView().byId("supervisorList").getSelectedKeys();



                var batchesStr = "";
                var lineStr = "";
                var empStr = "";

                for (var i = 0; i < branchstring.length; i++) {
                    if (i == 0)
                        batchesStr = parseInt(branchstring[i]);
                    else
                        batchesStr = batchesStr + "," + parseInt(branchstring[i]);
                }

                for (var i = 0; i < linestring.length; i++) {
                    if (i == 0)
                        lineStr = parseInt(linestring[i]);
                    else
                        lineStr = lineStr + "," + parseInt(linestring[i]);
                }

                for (var i = 0; i < empstring.length; i++) {
                    if (i == 0)
                        empStr = parseInt(empstring[i]);
                    else
                        empStr = empStr + "," + parseInt(empstring[i]);
                }



                var oModel = this.getView().getModel("reportModel");

                var curdate = commonFunction.getDate(oModel.oData.curdate);



                cBFReportsService.getDailySupervisiorReport({ curdate: curdate, branch_id: batchesStr, line_id: lineStr, empid: empStr }, function async(data) {
                    var oBatchModel = currentContext.getView().getModel("tblModel");
                    oBatchModel.setData({ modelData: data[0] });


                })
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
            cBFReportsService.getAllLineWithStatus({ branchid: branch }, function (data) {


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

            cBFReportsService.getAllSupervisor({ branchlineid: line }, function (data) {

                var oBatchModel = new sap.ui.model.json.JSONModel();

                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "employeename": "Select All" });
                    } else {
                        MessageBox.error("supervisior  not availabel.")
                    }
                }

                currentContext.getView().setModel(oBatchModel, "supervisiorModel");

                oBatchModel.setData({ modelData: data[0] });

            });

            this.getView().byId("lineList").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },



        getLinewisebatches: function (branch) {

            var currentContext = this;
            var parentModel = this.getView().getModel("reportModel");


            cBFReportsService.getAllLineChickPlacement({ branchid: branch }, function (data) {


                var oBatchModel = new sap.ui.model.json.JSONModel();
                currentContext.getView().setModel(oBatchModel, "lineModel");
                oBatchModel.setData({ modelData: data[0] });

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

        validateForm: function () {
            var isValid = true;

            if (!commonFunction.ismultiComRequired(this, "branchList", "Branch is required"))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "lineList", "Line is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "curdate", " Date is required"))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "supervisorList", "Supervisior is required"))
                isValid = false;


            return isValid;
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
                        name: "Farmer Name",
                        template: { content: "{farmer_name}" }
                    },
                    {
                        name: "City Name",
                        template: { content: "{cityname}" }
                    },
                    {
                        name: "Employee Name",
                        template: { content: "{employeename}" }
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
                        name: "Add Qty",
                        template: { content: "{addqty}" }
                    },
                    {
                        name: "Quantity",
                        template: { content: "{quantity}" }
                    },
                    {
                        name: "Total Feed Consumption",
                        template: { content: "{totalfeedconsumption}" }
                    },
                    {
                        name: "Balance",
                        template: { content: "{Bal}" }
                    },
                    {
                        name: "Daily Consumption Per Bird",
                        template: { content: "{dailyconperbird}" }
                    },
                    {
                        name: "Daily Mortality",
                        template: { content: "{dailymortality}" }
                    },
                    {
                        name: "Daily Culls",
                        template: { content: "{daailyculls}" }
                    },

                    {
                        name: "Total Mortality",
                        template: { content: "{totalmortality}" }
                    },
                    {
                        name: "Mortality(%)",
                        template: { content: "{ptotalmortality}" }
                    },
                    {
                        name: "Sale",
                        template: { content: "{Sale}" }
                    },
                    {
                        name: "closing Balance",
                        template: { content: "{aaa}" }
                    },
                    {
                        name: "Avg Weight",
                        template: { content: "{avgweight}" }
                    },
                    {
                        name: "FCR",
                        template: { content: "{fcr}" }
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
