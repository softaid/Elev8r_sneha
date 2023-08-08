sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/BreederReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service'

], function (JSONModel, BaseController, MessageBox, Export, ExportTypeCSV, commonFunction, breederReportsService, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Breeder.EggStockReport", {

        currentContext: null,

        onInit: function () {
            this.currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");

            // set empty model to view 
            var emptyModel = this.getModelDefault();
            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "eggStockModel");

            this.getLocations(this, 721);

        },

        getModelDefault : function(){
            return {
                fromdate: commonFunction.getDateFromDB(new Date()),
                todate : commonFunction.getDateFromDB(new Date())
            }
        },

        getLocations: function (currentContext, moduleids) {
            var currentContext = this;
            commonService.getLocations({ moduleids: moduleids }, function (data) {
                var oLocationModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "locationname": "Select All" });
                    } else {
                        MessageBox.error("location not availabel.")
                    }
                }

                oLocationModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oLocationModel, "locationList");
            });
        },


        handleLocationSelectionFinish: function (oEvt) {
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedKeys = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedKeys.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });

            }
            var location = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                location.push(selectedKeys[i].key);
            }

            this.locationname = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                this.locationname.push(selectedKeys[i].text);
            }

            var locationStr = "";

            for (var i = 0; i < location.length; i++) {
                if (i == 0)
                    locationStr = parseInt(location[i]);
                else
                    locationStr = locationStr + "," + parseInt(location[i]);
            }
            this.getBreederBatches(locationStr);
            this.getView().byId("locationtbl").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

	handleLocationSelectionChange: function (oEvent) {
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

        getBreederBatches: function (location) {
            var currentContext = this;
            breederReportsService.gatAllBreederBatch({ locationid: location }, function (data) {
                var oBatchModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "breederbatchid": "All", "batchname": "Select All" });
                    }
                    oBatchModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oBatchModel, "batchModel");
                } else {
                    MessageBox.error("Breeder Batch not availabel.")
                }
            });
            // }
        },

        batchBatchSelectionFinish: function (oEvt) {

            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedbatches = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedbatches.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }
            var i = selectedbatches.length - 1;

            if (selectedbatches[i].key == "ALL") {

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


            var batchesStr = "";

            for (var i = 0; i < batchs.length; i++) {
                if (i == 0)
                    batchesStr = parseInt(batchs[i]);
                else
                    batchesStr = batchesStr + "," + parseInt(batchs[i]);
            }
            this.getView().byId("batchtb").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

	batchBatchSelectionChange: function (oEvent) {
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

        resetModel: function () {

            var emptyModel = this.getModelDefault();
            var model = this.getView().getModel("eggStockModel");
            model.setData(emptyModel);

            if (this.getView().getModel("eggStockTblModel") != undefined) {
                var tbleModel = this.getView().getModel("eggStockTblModel");
                tbleModel.setData({ modelData: [] });
            }
        },

        onSearchData : function(){
            var fromdate = commonFunction.getDate(this.getView().byId("txtFromdate").getValue());
            var todate = commonFunction.getDate(this.getView().byId("txtTodate").getValue());
            var batchids = this.getView().byId("batchtb").getSelectedKeys();

            var batchesStr = "";
            for (var i = 0; i < batchids.length; i++) {
                if (i == 0)
                    batchesStr = parseInt(batchids[i]);
                else
                    batchesStr = batchesStr + "," + parseInt(batchids[i]);
            }

            var i = batchesStr.length - 1;
            if (batchesStr == "All") {
                batchesStr = batchesStr.slice(0, -1);
            }
                            
            var currentContext = this;
            breederReportsService.getEggStockReport({fromdate : fromdate,todate : todate, breederbatchids : batchesStr},function (data) {
                console.log(data);
                var oBatchModel = new sap.ui.model.json.JSONModel();
                oBatchModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oBatchModel, "eggStockTblModel");
            });
        },

        replaceStr: function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },

        // Function Used For PDF Download

        replaceTemplateData: function (template) {
            // Item table Data --------------

            var currentContext = this;
            var tbleModel = this.getView().getModel("eggStockTblModel").oData.modelData;

            var htmTable = "";
            for (var indx in tbleModel) {
                var model = tbleModel[indx];
                // Replace/create column sequence data table
                htmTable += "<tr>";
                htmTable += "<td align='center'>" + model["date"] + "</td>"
                htmTable += "<td>" + model["itemname"] + "</td>"
                htmTable += "<td align='right'>" + model["package"] + "</td>"
                htmTable += "<td align='right'>" + model["bagquantity"] + "</td>"
                htmTable += "<td>" + model["quantity"] + "</td>"
                htmTable += "<td>" + model["unitcost"] + "</td>"
                htmTable += "<td>" + model["ammount"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;
            var batchname = this.getView().byId("textBatch").getValue();
            //var batchname = currentContext.batchname;
            var location = this.locationname;


            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);

            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##LocatonName##", location);
            template = this.replaceStr(template, "##BatchName##", batchname);

            return template;

        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("Breeder", "FlochGatherReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Flock Detail Report");
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
                models: this.currentContext.getView().getModel("eggStockTblModel"),

                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content


                columns: [
                    {
                        name: "Batch",
                        template: { content: "{batchname}" }
                    },
                    {
                        name: "Production Quantity",
                        template: { content: "{productionstock}" }
                    },
                    {
                        name: "Production Rate",
                        template: { content: "{productionrate}" }
                    },
                    {
                        name: "Production Amount",
                        template: { content: "{productionamount}" }
                    },
                    {
                        name: "Transfer Quantity",
                        template: { content: "{transferstock}" }
                    },
                    {
                        name: "Transfer Rate",
                        template: { content: "{transferrate}" }
                    },
                    {
                        name: "Transfer Amount",
                        template: { content: "{transferamount}" }
                    },
                    {
                        name: "Sold Quantity",
                        template: { content: "{soldstock}" }
                    },
                    {
                        name: "Sold Rate",
                        template: { content: "{salerate}" }
                    },
                    {
                        name: "Sold Amount",
                        template: { content: "{saleamount}" }
                    },
                    {
                        name: "Closing Quantity",
                        template: { content: "{closingstock}" }
                    },
                    {
                        name: "Closing Rate",
                        template: { content: "{closingrate}" }
                    },
                    {
                        name: "Closing Amount",
                        template: { content: "{closingamount}" }
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


