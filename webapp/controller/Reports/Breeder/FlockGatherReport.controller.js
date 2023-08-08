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

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Breeder.FlockGatherReport", {

        currentContext: null,

        onInit: function () {
            this.currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");

            // set location model
            var moduleids = 721;
            this.getLocations(this, moduleids);

            // set empty model to view 
            var emptyModel = this.getModelDefault();
            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "floackModel");
            this.getView().byId("txtdownload").setVisible(false);
            
            // set  model for each  Detail
            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "chicksDetail");

            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "feedDetail");

            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "medicineDetail");

            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "itemDetail");

            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "saleDetail");

        },

        // Default Model
        getModelDefault: function () {
            return {
                breederbatchid: null,
            }
        },

        // get All location modulewise
        getLocations: function (currentContext, moduleids) {
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

        // Selected All Functionality
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

        // Reset all Models
        resetModel: function () {
            var emptyModel = this.getModelDefault();
            var model = this.getView().getModel("floackModel");
            model.setData(emptyModel);

            if (this.getView().getModel("flockgatherReportModel") != undefined) {
                var tbleModel = this.getView().getModel("flockgatherReportModel");
                tbleModel.setData({ modelData: [] });
            }

        },

        // get location wise breeder batches
        handleSelectionFinish: function (oEvt) {
            this.resetModel();
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
            this.getLocationwisebreederbatches(locationStr);
            this.getView().byId("locationtbl").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

        handleBrdBatchValueHelp: function (oEvent) {
            var sInputValue = oEvent.getSource().getValue();
            this.inputId = oEvent.getSource().getId();

            // create value help dialog
            this._valueHelpDialog = sap.ui.xmlfragment(
                "sap.ui.elev8rerp.componentcontainer.fragmentview.Common.BreederBatchDialog",
                this
            );
            this.getView().addDependent(this._valueHelpDialog);

            // open value help dialog filtered by the input value
            this._valueHelpDialog.open(sInputValue);
        },

        // Search Functionality for Breeder Batch
        handleBreederBatchSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var columns = ['batchname', 'locationname', 'warehousename'];
            var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
            }),
                false);  // false for OR condition
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        onBreederBatchDialogClose: function (oEvent) {
            var currentContext = this;
            var aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts != undefined) {
                if (this.getView().getModel("flockgatherReportModel") != undefined) {
                    var tbleModel = this.getView().getModel("flockgatherReportModel");
                    tbleModel.setData({ modelData: [] });
                }
                var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });

                var oModel = currentContext.getView().getModel("floackModel");
                //update existing model to set locationid
                oModel.oData.breederbatchid = selRow[0].id;
                oModel.oData.batchname = selRow[0].batchname

                oModel.refresh();
                this.getView().byId("textBatch").setValueState(sap.ui.core.ValueState.None);

            } else {

            }
        },

         // get location wise breeder batches
        getLocationwisebreederbatches: function (location) {
            var currentContext = this;
            breederReportsService.getLocationwisebreederbatches({ locationid: location }, function (data) {

                var oBatchModel = new sap.ui.model.json.JSONModel();
                oBatchModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oBatchModel, "breederBatchList");
            });
        },

         // get flock Gather Report
        getflockReport: function () {
            if (this.validateForm()) {
                var oModel = this.getView().getModel("floackModel");   
                var batchid = oModel.oData.breederbatchid;
                var currentContext = this;
                breederReportsService.getflockgatherReport({ batchid: batchid, companyid: commonFunction.session("companyId") }, function (data) {
		

                    var oBatchModel = currentContext.getView().getModel("chicksDetail");
                    oBatchModel.setData({ modelData: data[0] });
                    console.log("chicksDetail",oBatchModel);


                    var oFeedModel = currentContext.getView().getModel("feedDetail");
                    oFeedModel.setData({ modelData: data[1] });
                    console.log("feedDetail",oFeedModel);

                    var oMedicineModel = currentContext.getView().getModel("medicineDetail");
                    oMedicineModel.setData({ modelData: data[2] });
                    console.log("feedDmedicineDetailetail",oMedicineModel);

                    var oItemModel = currentContext.getView().getModel("itemDetail");
                    oItemModel.setData({ modelData: data[3] });
                    console.log("itemDetail",oItemModel);

                    var osaleModel = currentContext.getView().getModel("saleDetail");
                    osaleModel.setData({ modelData: data[4] });
                    console.log("saleDetail",osaleModel);


                });
            }
            this.getView().byId("txtdownload").setVisible(true);
        },

         // Validation function for all filters

        validateForm: function () {
            var isValid = true;
            var BatchMsg = "Batch name is required.";

            if (!commonFunction.ismultiComRequired(this, "locationtbl", "Location is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "textBatch", BatchMsg))
                isValid = false;
            return isValid;
        },

         // PDF code start
        replaceStr: function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },

        // Function Used For PDF Download

        replaceTemplateData: function (template) {
            // Item table Data --------------

            var currentContext = this;
            var tbleModel = this.getView().getModel("flockgatherReportModel").oData.modelData;

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

         // PDF code end


         // Gererate CSV for  flock Gather Report
        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var batchname = this.getView().byId("textBatch").getValue();
            var location = this.locationname;
    
            var filename =location+'_'+batchname;

            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/



            var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ","
                }),

                // Pass in the model created above
                models: this.currentContext.getView().getModel("flockgatherReportModel"),

                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content


                columns: [
                   
                    {
                        name: "Date",
                        template: { content: "{date}" }
                    },
                    {
                        name: "Description",
                        template: { content: "{itemname}" }
                    },
                    {
                        name: "Total Quantity",
                        template: { content: "{quantity}" }
                    },
                    {
                        name: "Rate",
                        template: { content: "{unitcost}" }
                    },
                    {
                        name: "Amount",
                        template: { content: "{ammount}" }
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
