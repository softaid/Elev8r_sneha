sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/CommercialLayerReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/CommercialLayer/LayerBatch.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',


], function (JSONModel, BaseController, MessageBox, Export, ExportTypeCSV, commonFunction, CommercialLayerReports, LayerBatch, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.CommercialLayer.FlockWiseCostAnalysisReport", {


        onInit: function () {
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");
            this.currentContext = this;
            // set location model
            var moduleid = 725;
            this.getWarehouses(this, moduleid);

            var tblModel = new JSONModel();
            tblModel.setData({ modelData: [] });
            this.getView().setModel(tblModel, "tblModel");

            var tblModelpartone = new JSONModel();
            tblModelpartone.setData({ modelData: [] });
            this.getView().setModel(tblModelpartone, "tblModelpartone");


            // set empty model to view 
            var emptyModel = this.getModelDefault();
            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "farmperbatchModel");

        },

        getModelDefault: function () {
            return {
                breederbatchid: null,
                shedid: null,
                collectiondate: commonFunction.getDateFromDB(new Date()),

            }
        },

        getWarehouses: function (currentContext, moduleid) {
            commonService.getModuleWiseWarehouses({ moduleid: moduleid }, function (data) {
                var WarehouseModelModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "warehousename": "Select All" });
                    } else {
                        MessageBox.error("Warehouse not available.")
                    }
                }

                WarehouseModelModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(WarehouseModelModel, "WarehouseList");
            });
        },

        handleSelectionFinish: function (oEvt) {
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedKeys = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedKeys.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });

            }
            var warehouse = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                warehouse.push(selectedKeys[i].key);
            }

            this.warehousename = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                this.warehousename.push(selectedKeys[i].text);
            }
            var warehouseStr = "";

            for (var i = 0; i < warehouse.length; i++) {
                if (i == 0)
                    warehouseStr = parseInt(warehouse[i]);
                else
                    warehouseStr = warehouseStr + "," + parseInt(warehouse[i]);
            }
            this.getLayerBatches(warehouseStr);
            this.getView().byId("warehouse").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        getLayerBatches: function (warehouse) {
            var currentContext = this;
            CommercialLayerReports.getAlllayerbatchbywarehouse({ warehouseid: warehouse }, function (data) {
                console.log("getAlllayerbatchbywarehouse",data);
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "layerbatchid": "All", "batchname": "Select All" });
                        var oBatchModel = new sap.ui.model.json.JSONModel();
                        oBatchModel.setData({ modelData: data[0] });
                        currentContext.getView().setModel(oBatchModel, "batchModel");
                    } else {
                        MessageBox.error("Layer branch not available for this location.")
                    }
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

        batchSelectionFinish: function (oEvt) {
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedbatches = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedbatches.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }
            var i = selectedbatches.length - 1;

            if (selectedbatches[i].key == "All") {

                selectedbatches = selectedbatches.slice(0, -1);
            }
            var batchs = [];
            for (var i = 0; i < selectedbatches.length; i++) {
                batchs.push(selectedbatches[i].key);
            }

            this.batchsname = [];
            for (var i = 0; i < selectedbatches.length; i++) {
                this.batchsname.push(selectedbatches[i].text);
            }

            this.batchesStr = "";

            for (var i = 0; i < batchs.length; i++) {
                if (i == 0)
                    this.batchesStr = parseInt(batchs[i]);
                else
                    this.batchesStr = this.batchesStr + "," + parseInt(batchs[i]);
            }
            this.getView().byId("batchtb1").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        onSearchData: function () {
            var batchid = this.batchesStr
            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue()

            var FModel = {
                batchid: batchid,
                fromdate: commonFunction.getDate(fromdate),
                todate: commonFunction.getDate(todate)
            }
            if (this.validateForm()) {
                var currentContext = this;
                CommercialLayerReports.getFlockWisecostanalysisReport(FModel, function (data) {
                    console.log("getFlockWisecostanalysisReport",data);
                    var childModel = currentContext.getView().getModel("tblModel");
                    childModel.setData({ modelData: data[0] });
                });

                CommercialLayerReports.getFlockWisecostanalysispartoneReport(FModel, function (data) {
                    console.log("getFlockWisecostanalysispartoneReport",data);
                    var childModelpartone = currentContext.getView().getModel("tblModelpartone");
                    childModelpartone.setData({ modelData: data[0] });
                });
            }
        },


        validateForm: function () {
            var isValid = true;
            if (!commonFunction.ismultiComRequired(this, "warehouse", "Warehouse is required"))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "batchtb1", "Batch is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtFromdate", "From date is required"))
                isValid = false;
            if (!commonFunction.isRequired(this, "txtTodate", "To date is required"))
                isValid = false;
            return isValid;
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
                htmTable += "<td align='center'>" + model["batchname"] + "</td>"
                htmTable += "<td>" + model["purvalue"] + "</td>"
                htmTable += "<td align='right'>" + model["beforefeedconcost"] + "</td>"
                htmTable += "<td align='right'>" + model["beforemedcost"] + "</td>"
                htmTable += "<td>" + model["beforevacccost"] + "</td>"
                htmTable += "<td>" + model["beforevitcost"] + "</td>"
                htmTable += "<td>" + model["beforesaleval"] + "</td>"
                htmTable += "<td>" + model["beforeotercost"] + "</td>"
                htmTable += "<td>" + model["afterfeedconcost"] + "</td>"
                htmTable += "<td>" + model["aftermedcost"] + "</td>"
                htmTable += "<td>" + model["aftervacccost"] + "</td>"
                htmTable += "<td>" + model["aftervitcost"] + "</td>"
                htmTable += "<td>" + model["aftersaleval"] + "</td>"
                htmTable += "<td>" + model["beforeotercost"] + "</td>"
                htmTable += "<td>" + model["afterotercost"] + "</td>"
                htmTable += "<td>" + model["amotizationvalue"] + "</td>"
                htmTable += "<td>" + model["balancevalue"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;
            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var batchname = this.batchsname;
            var warehousename = this.warehousename;

            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);

            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##ReportFromDate##", fromdate);
            template = this.replaceStr(template, "##ReporToDate##", todate);
            template = this.replaceStr(template, "##BatchName##", batchname);
            template = this.replaceStr(template, "##WarehouseName##", warehousename);
            return template;

        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("Layer", "FlockWiseCostAnalysisReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generateLargePDF(template, "Flock Wise Cost Analysis Report");
            });
        },

        replaceStrOne: function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },

        // Function Used For PDF Download

        replaceTemplateDataOne: function (template) {
            // Item table Data --------------
            var tbleModel = this.getView().getModel("tblModelpartone").oData.modelData;
           

            var htmTable = "";
            for (var indx in tbleModel) {
                var model = tbleModel[indx];
                // Replace/create column sequence data table
                htmTable += "<tr>";
                htmTable += "<td align='center'>" + model["locationname"] + "</td>"
                htmTable += "<td>" + model["batchname"] + "</td>"
                htmTable += "<td align='right'>" + model["pldate"] + "</td>"
                htmTable += "<td align='right'>" + model["aslastdate"] + "</td>"
                htmTable += "<td>" + model["itemid"] + "</td>"
                htmTable += "<td>" + model["ageindays"] + "</td>"
                htmTable += "<td>" + model["paqty"] + "</td>"
                htmTable += "<td>" + model["mor"] + "</td>"
                htmTable += "<td>" + model["liveqty"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;
            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var batchname = this.batchsname;
            var warehousename = this.warehousename;

            template = this.replaceStrOne(template, "##CompanyName##", companyname);
            template = this.replaceStrOne(template, "##CompanyContact##", companycontact);
            template = this.replaceStrOne(template, "##CompanyEmail##", companyemail);
            template = this.replaceStrOne(template, "##Address##", address);
            template = this.replaceStrOne(template, "##PinCode##", pincode);

            template = this.replaceStrOne(template, " ##ItemList##", htmTable);
            template = this.replaceStrOne(template, "##ReportFromDate##", fromdate);
            template = this.replaceStrOne(template, "##ReporToDate##", todate);
            template = this.replaceStrOne(template, "##BatchName##", batchname);
            template = this.replaceStrOne(template, "##WarehouseName##", warehousename);
            return template;

        },

        createPDFFirst: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("Layer", "FlockWiseCostAnalysisPartOne.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateDataOne(template);
                commonFunction.generateLargePDF(template, "Flock Wise Cost Analysis Report");
            });
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
                        name: "Flock Name",
                        template: { content: "{batchname}" }
                    },
                    {
                        name: "Chick Cost",
                        template: { content: "{purvalue}" }
                    },
                    {
                        name: "Before 24 Week Feed Cost",
                        template: { content: "{beforefeedconcost}" }
                    },
                    {
                        name: "Before 24 Week Medicine Cos",
                        template: { content: "{beforemedcost}" }
                    },
                    {
                        name: "Before 24 Week Vaccine Cost",
                        template: { content: "{beforevacccost}" }
                    },
                    {
                        name: "Before 24 Week Vitmin Cost",
                        template: { content: "{beforevitcost}" }
                    },
                    {
                        name: "Before 24 Week Salary Cost",
                        template: { content: "{beforesaleval}" }
                    },
                    {
                        name: "Before 24 Week Other Cost",
                        template: { content: "{beforeotercost}" }
                    },
                    {
                        name: "After 24 Week Feed Cost",
                        template: { content: "{afterfeedconcost}" }
                    },
                    {
                        name: "After 24 Week Medicine Cos",
                        template: { content: "{aftermedcost}" }
                    },
                    {
                        name: "After 24 Week Vaccine Cost",
                        template: { content: "{aftervacccost}" }
                    },
                    {
                        name: "After 24 Week Vitmin Cost",
                        template: { content: "{aftervitcost}" }
                    },
                    {
                        name: "After 24 Week Salary Cost",
                        template: { content: "{aftersaleval}" }
                    },
                    {
                        name: "After 24 Week Other Cost",
                        template: { content: "{afterotercost}" }
                    },
                    {
                        name: "After 24 Week Mortality Cost",
                        template: { content: "{afterotercost}" }
                    },
                    {
                        name: "Amortization",
                        template: { content: "{amotizationvalue}" }
                    },
                    {
                        name: "Balance Cost",
                        template: { content: "{balancevalue}" }
                    },
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
        },

        onDataExportone: sap.m.Table.prototype.exportData || function (oEvent) {

            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/


            var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ","
                }),

                // Pass in the model created above
                models: this.currentContext.getView().getModel("tblModelpartone"),


                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content

                columns: [

                    {
                        name: "Location",
                        template: { content: "{locationname}" }
                    },
                    {
                        name: "Flock",
                        template: { content: "{batchname}" }
                    },
                    {
                        name: "Place Date",
                        template: { content: "{pldate}" }
                    },
                    {
                        name: "Live Date",
                        template: { content: "{aslastdate}" }
                    },
                    {
                        name: "Item Type",
                        template: { content: "{itemid}" }
                    },
                    {
                        name: "Age In Day",
                        template: { content: "{ageindays}" }
                    },
                    {
                        name: "Placed Qty",
                        template: { content: "{paqty}" }
                    },
                    {
                        name: "Mortality",
                        template: { content: "{mor}" }
                    },
                    {
                        name: "Live Balance",
                        template: { content: "{liveqty}" }
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
