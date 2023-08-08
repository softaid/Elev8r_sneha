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

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.CBF.ReadyBirdsForSaleReport", {


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

        // Function Used For PDF Download

        replaceTemplateData: function (template) {

            // Item table Data --------------
            var tbleModel = this.getView().getModel("tblModel").oData.modelData;
            var htmTable = "";
            for (var indx in tbleModel) {

                var model = tbleModel[indx];
                // Replace/create column sequence data table
                htmTable += "<tr>";
                htmTable += "<td>" + model["farmer_name"] + "</td>"
                htmTable += "<td align='right'>" + model["farm_name"] + "</td>"
                htmTable += "<td align='right'>" + model["cityname"] + "</td>"
                htmTable += "<td align='center'>" + model["branchname"] + "</td>"
                htmTable += "<td>" + model["linename"] + "</td>"
                htmTable += "<td>" + model["batch_number"] + "</td>"
                htmTable += "<td>" + model["itemname"] + "</td>"
                htmTable += "<td>" + model["age"] + "</td>"
                htmTable += "<td>" + model["liveqty"] + "</td>"
                htmTable += "<td align='right'>" + model["avgweight"] + "</td>"
                htmTable += "<td align='right'>" + model["totalwt"] + "</td>"
                htmTable += "<td align='center'>" + model["remaningfeedinbag"] + "</td>"
                htmTable += "<td>" + model["ptotalmortality"] + "</td>"
                htmTable += "<td>" + model["fcr"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;

            var curdate = this.getView().byId("curdate").getValue();
            var fromage = this.getView().byId("fromage").getValue();
            var toage = this.getView().byId("toage").getValue();
            var fromweight = this.getView().byId("fromweight").getValue();
            var toweight = this.getView().byId("toweight").getValue();
            var branchname = this.branchname;
            var linename = this.linename;


            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);


            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##Date##", curdate);
            template = this.replaceStr(template, "##BranchName##", branchname);
            template = this.replaceStr(template, "##LineName##", linename);
            template = this.replaceStr(template, "##FromAge##", fromage);
            template = this.replaceStr(template, "##ToAge##", toage);
            template = this.replaceStr(template, "##FromWeight##", fromweight);
            template = this.replaceStr(template, "##ToWeight##", toweight);
            return template;

        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("CBF", "ReadyBirdForSaleReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generateLargePDF(template, "Ready Bird For Sale Report");
            });
        },
        onSearchReadyBirdForSaleReport: function () {
            if (this.validateForm()) {
                var currentContext = this;
                var branchstring = this.getView().byId("branchList").getSelectedKeys();

                var batchesStr = "";
                //var lineStr = "";

                for (var i = 0; i < branchstring.length; i++) {
                    if (i == 0)
                        batchesStr = parseInt(branchstring[i]);
                    else
                        batchesStr = batchesStr + "," + parseInt(branchstring[i]);
                }

                // for (var i = 0; i < linestring.length; i++) {
                //     if (i == 0)
                //         lineStr = parseInt(linestring[i]);
                //     else
                //         lineStr = lineStr + "," + parseInt(linestring[i]);
                // }


                var curdate = this.getView().byId("curdate").getValue();
                var fromage = this.getView().byId("fromage").getValue();
                var toage = this.getView().byId("toage").getValue();
                var fromweight = this.getView().byId("fromweight").getValue();
                var toweight = this.getView().byId("toweight").getValue();

                cBFReportsService.getBirdForSaleReport({ curdate: curdate, branch_id: batchesStr, fromage: fromage, toage: toage, fromweight: fromweight, toweight: toweight }, function async(data) {
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
                        data[0].unshift({ "id": "All", "branchname": "Select All" });
                    } else {
                        MessageBox.error("Branch is not availabel.")
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
                        MessageBox.error("Line is not availabel for selected branch.")
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


        getLinewisebatches: function (branch) {
            var currentContext = this;
            //var parentModel = this.getView().getModel("reportModel");
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

        lineSelectionFinish: function (oEvt) {
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedlines = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedlines.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }

            this.linename = [];
            for (var i = 0; i < selectedlines.length; i++) {
                this.linename.push(selectedlines[i].text);
            }

            this.getView().byId("lineList").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        validateForm: function () {
            var isValid = true;

            if (!commonFunction.ismultiComRequired(this, "branchList", "Branch  is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "curdate", " Date is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "fromage", "From Age is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "toage", "To Age is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "fromweight", "From Weight is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "toweight", "To Weight is required"))
                isValid = false;


            return isValid;
        },



        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var curdate = this.getView().byId("curdate").getValue();
            var fromage = this.getView().byId("fromage").getValue();
            var toage = this.getView().byId("toage").getValue();
            var fromweight = this.getView().byId("fromweight").getValue();
            var toweight = this.getView().byId("toweight").getValue();
            var branchname = this.branchname;
            var linename = this.linename;

            var filename =curdate+'_'+fromage+'_'+toage+'_'+fromweight+'_'+toweight+'_'+branchname+'_'+linename;

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
                        name: "Farm Name",
                        template: { content: "{farm_name}" }
                    },
                    {
                        name: "City",
                        template: { content: "{cityname}" }
                    },
                    {
                        name: "Branch Name",
                        template: { content: "{branchname}" }
                    },
                    {
                        name: "Line Name",
                        template: { content: "{linename}" }
                    },
                    {
                        name: "Batch No",
                        template: { content: "{batch_number}" }
                    },
                    {
                        name: "Breed Name",
                        template: { content: "{itemname}" }
                    },
                    {
                        name: "Age",
                        template: { content: "{age}" }
                    },
                    {
                        name: "Total Bird",
                        template: { content: "{liveqty}" }
                    },
                    {
                        name: "Average Weight Of Bird",
                        template: { content: "{avgweight}" }
                    },
                    {
                        name: "Total Weight",
                        template: { content: "{totalwt}" }
                    },
                    {
                        name: "Mortality %",
                        template: { content: "{ptotalmortality}" }
                    },
                    {
                        name: "FCR",
                        template: { content: "{fcr}" }
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
