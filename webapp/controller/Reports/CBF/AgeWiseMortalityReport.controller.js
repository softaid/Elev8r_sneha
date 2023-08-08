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

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.CBF.AgeWiseMortalityReport", {


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


        getAgewiseMortalityReport: function () {

            if (this.validateForm()) {

                var currentContext = this;
                var branchstring = this.getView().byId("branchList").getSelectedKeys();
                var linestring = this.getView().byId("lineList").getSelectedKeys();
                var farmerstring = this.getView().byId("farmerList").getSelectedKeys();
                var farmstring = this.getView().byId("farmList").getSelectedKeys();
                var batchstring = this.getView().byId("batchno").getSelectedKeys();
                var branchStr = "";
                var lineStr = "";
                var farmerStr = "";
                var farmStr = "";
                var batchStr = "";


                for (var i = 0; i < branchstring.length; i++) {
                    if (i == 0)
                        branchStr = parseInt(branchstring[i]);
                    else
                        branchStr = branchStr + "," + parseInt(branchstring[i]);
                }

                for (var i = 0; i < linestring.length; i++) {
                    if (i == 0)
                        lineStr = parseInt(linestring[i]);
                    else
                        lineStr = lineStr + "," + parseInt(linestring[i]);
                }
                //----------------new-------------------

                for (var i = 0; i < farmerstring.length; i++) {
                    if (i == 0)
                        farmerStr = parseInt(farmerstring[i]);
                    else
                        farmerStr = farmerStr + "," + parseInt(farmerstring[i]);
                }
                //------------------

                for (var i = 0; i < farmstring.length; i++) {
                    if (i == 0)
                        farmStr = parseInt(farmstring[i]);
                    else
                        farmStr = farmStr + "," + parseInt(farmstring[i]);
                }

                //------------------------

                for (var i = 0; i < batchstring.length; i++) {
                    if (i == 0)
                        batchStr = parseInt(batchstring[i]);
                    else
                        batchStr = batchStr + "," + parseInt(batchstring[i]);
                }



                var curdate = this.getView().byId("curdate").getValue();
                cBFReportsService.getAllBatchAgeMortalityReport({batch_id: batchStr }, function async(data) {

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

            // if (!commonFunction.isDate(this, "curdate", "Date is required."))
            //     isValid = false;    


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
                htmTable += "<td align='center'>" + model["placement_date"] + "</td>"
                htmTable += "<td>" + model["farmer_name"] + "</td>"
                htmTable += "<td align='right'>" + model["farm_name"] + "</td>"
                htmTable += "<td align='right'>" + model["batch_id"] + "</td>"
                htmTable += "<td>" + model["linename"] + "</td>"
                htmTable += "<td>" + model["placeqty"] + "</td>"
                htmTable += "<td>" + model["fwmortality"] + "</td>"
                htmTable += "<td>" + model["fweekmorper"] + "</td>"

                htmTable += "<td align='center'>" + model["swmortality"] + "</td>"
                htmTable += "<td>" + model["sweekmorper"] + "</td>"
                htmTable += "<td align='right'>" + model["twmortality"] + "</td>"
                htmTable += "<td align='right'>" + model["tweekmorper"] + "</td>"
                htmTable += "<td>" + model["fourthwmortality"] + "</td>"
                htmTable += "<td>" + model["fourthweekmorper"] + "</td>"
                htmTable += "<td>" + model["fifthwmortality"] + "</td>"
                htmTable += "<td>" + model["fifthweekmorper"] + "</td>"
                htmTable += "<td>" + model["sixwmortality"] + "</td>"

                htmTable += "<td align='center'>" + model["sixweekmorper"] + "</td>"
                htmTable += "<td>" + model["sevenwmortality"] + "</td>"
                htmTable += "<td align='right'>" + model["sevenweekmorper"] + "</td>"
                htmTable += "<td>" + model["eightwmortality"] + "</td>"
                htmTable += "<td align='right'>" + model["eightweekmorper"] + "</td>"
                htmTable += "<td align='right'>" + model["totalmortalitydata"] + "</td>"
               
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;
            var reportdate = this.getView().byId("curdate").getValue();
            var branchname = this.branchname;
            var lineList = this.linename
            var farmername = this.farmername;
            var farmname = this.farmname;
            var batchno = this.batchno;

            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);
            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##ReportFromDate##", reportdate);
            template = this.replaceStr(template, "##BranchName##", branchname);
            template = this.replaceStr(template, "##LineList##", lineList);
            template = this.replaceStr(template, "##FarmerName##", farmername);
            template = this.replaceStr(template, "##FarmName##", farmname);
            template = this.replaceStr(template, "##BatchNo##", batchno);
            return template;

        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("CBF", "AgewiseMortalityReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generateLargePDF(template, "AgeWiseMortality Report");
            });
        },

        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var branchname = this.branchname;
            var lineList = this.linename
            var farmername = this.farmername;
            var farmname = this.farmname;
            var batchno = this.batchno;
      
            var filename =branchname+'_'+lineList+'_'+farmername+'_'+farmname+'_'+batchno;

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
                        name: "Chick Placement Date",
                        template: { content: "{placement_date}" }
                    },
                    {
                        name: "Farmer Name",
                        template: { content: "{farmer_name}" }
                    },
                    {
                        name: "Farm  Name",
                        template: { content: "{farm_name}" }
                    },
                    {
                        name: "Batch No.",
                        template: { content: "{batch_number}" }
                    },
                    {
                        name: "Line Name",
                        template: { content: "{linename}" }
                    },
                    {
                        name: "Placement Quantity",
                        template: { content: "{placeqty}" }
                    },
                  
                    {
                        name: "1st Week Mortality.",
                        template: { content: "{fwmortality}" }
                    },
                    {
                        name: "1st Week Mortality %",
                        template: { content: "{fweekmorper}" }
                    },
                    {
                        name: "2nd Week Mortality.",
                        template: { content: "{swmortality}" }
                    },
                    {
                        name: "2nd Week Mortality %",
                        template: { content: "{sweekmorper}" }
                    },
                    {
                        name: "3rd Week Mortality",
                        template: { content: "{twmortality}" }
                    },
                    {
                        name: "3rd Week Mortality %",
                        template: { content: "{tweekmorper}" }
                    },
                    {
                        name: "4th Week Mortality.",
                        template: { content: "{fourthwmortality}" }
                    },
                    {
                        name: "4th Week Mortality. %",
                        template: { content: "{fourthweekmorper}" }
                    },
                    {
                        name: "5th Week Mortality.",
                        template: { content: "{Fifthfifthwmortalitywm}" }
                    },
                    {
                        name: "5th Week Mortality %",
                        template: { content: "{fifthweekmorper}" }
                    },
                    {
                        name: "6th Week Mortality",
                        template: { content: "{sixwmortality}" }
                    },
                    {
                        name: "6th Week Mortality %",
                        template: { content: "{sixweekmorper}" }
                    },
                    {
                        name: "7th Week Mortality",
                        template: { content: "{sevenwmortality}" }
                    },
                    {
                        name: "7th Week Mortality %",
                        template: { content: "{sevenweekmorper}" }
                    },
                    {
                        name: "8th Week Mortality",
                        template: { content: "{eightwmortality}" }
                    },
                    {
                        name: "8th Week  Mortality %",
                        template: { content: "{eightweekmorper}" }
                    },
                    {
                        name: "Total Mortality",
                        template: { content: "{totalmortalitydata}" }
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
