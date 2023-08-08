sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/PurchaseReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',

], function (JSONModel, BaseController, MessageToast, MessageBox, Export, ExportTypeCSV, commonFunction, purchaseReportsService, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Purchase.ItemWiseSubgroupReport", {

        onInit: function () {
            // set location model
            this.currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");
            var emptyModel = this.getModelDefault();
            this.warehouseid = [];

            var subgroupStockModel = new JSONModel();
            subgroupStockModel.setData(emptyModel);
            this.getView().setModel(subgroupStockModel, "subgroupStockModel");

            var tblModel = new JSONModel();
            tblModel.setData({ modelData: [] });
            this.getView().setModel(tblModel, "tblModel");
            this.handleRouteMatched(null);
            var currRouteName = this.getOwnerComponent().getModel("applicationModel").getProperty("/routeName");
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this._oRouter.getRoute(currRouteName).attachMatched(this.handleRouteMatched, this);
            this.getView().byId("txtdownload").setVisible(false);

        },

        getModelDefault: function () {
            return {
                warehouseids: null,
                fromdate: commonFunction.setTodaysDate(new Date()),
                todate: commonFunction.setTodaysDate(new Date()),
            }
        },

        handleRouteMatched: function () {
            //get All Location
            this.getLocationList(this, "LocationList");
        },

        getLocationList: function (currentContext) {
            commonService.getLocationList(function (data) {
                var oBranchModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "locationname": "Select All" });
                    } else {
                        MessageBox.error("location not availabel.")
                    }
                }
                oBranchModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oBranchModel, "LocationList");
            });
        },

        locationSelectionFinish: function (oEvt) {
            var currentContext = this;
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedKeys = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedKeys.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });

            }
            this.locationname = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                this.locationname.push(selectedKeys[i].text);
            }

            this.location = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                this.location.push(selectedKeys[i].key);

                if (this.location[i] == "All") {

                    this.location.shift();
                }
                else {
                    this.location;
                }
            }

            commonService.getLocationWiseWarehouse({ locationid: this.location }, function (data) {
                if (data[0].length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "warehousename": "Select All" });
                    }
                    var warehouseModel = new sap.ui.model.json.JSONModel();
                    warehouseModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(warehouseModel, "warehouseList");
                } else {
                    MessageBox.error("Warehouse not availabel!");
                }
            });

            this.getView().byId("txtLocation").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            })
        },

        WarehouseSelectionChange: function (oEvent) {
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

        WarehouseSelectionFinish: function (oEvt) {
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectdware = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectdware.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }
            var i = selectdware.length - 1;
            if (selectdware[i].key == "NAN") {

                selectdware = selectdware.slice(0, -1);
            }

            var warehouses = [];
            for (var i = 0; i < selectdware.length; i++) {
                warehouses.push(selectdware[i].key);
                if (warehouses[i] == "All") {
                    warehouses.shift();
                }
                else {
                    warehouses;
                }
            }
            this.warehousename = [];
            for (var i = 0; i < selectdware.length; i++) {
                this.warehousename.push(selectdware[i].text);
            }

            var warehousetrg = "";
            for (var i = 0; i < warehouses.length; i++) {
                if (i == 0)
                    warehousetrg = parseInt(warehouses[i]);
                else
                    warehousetrg = warehousetrg + "," + parseInt(warehouses[i]);
            }

            var pModel = this.getView().getModel("subgroupStockModel");
            pModel.oData.warehouseids = warehousetrg
            pModel.refresh();
        },

        onDateChange: function () {
            var tDate = this.getView().byId("txtToDate").getValue();
            var toDate = new Date(commonFunction.parseDate(tDate));
            var fDate = this.getView().byId("txtFromDate").getValue();
            var frDate = new Date(commonFunction.parseDate(fDate));
            var pModel = this.getView().getModel("subgroupStockModel");
            if (frDate > toDate) {
                MessageBox.error("To date should be equal or greater than from date.");
                pModel.oData.todate = commonFunction.setTodaysDate(frDate);
            }

            pModel.refresh();
        },

        onSearchData: function () {
            if (this.validateForm()) {
                var currentContext = this;
                currentContext.location = this.getView().byId("txtLocation");
                var oModel = this.getView().getModel("subgroupStockModel").oData;
                oModel["fromdate"] = commonFunction.getDate(oModel["fromdate"]);
                oModel["todate"] = commonFunction.getDate(oModel["todate"]);
                oModel["companyid"] = commonFunction.session("companyId");

                purchaseReportsService.getItemSubgroupReport(oModel, function async(data) {
                    if (data[0].length > 0) {
                        for (var i = 0; data[0].length > i; i++) {
                            data[0][i].cummulativecost = data[0][i].closingstock * data[0][i].unitcost;

                            var tblModel = currentContext.getView().getModel("tblModel");
                            tblModel.setData({ modelData: data[0] });
                            tblModel.setSizeLimit(data[0].length);
                            console.log("tblModel",tblModel);
                           
                        }
                    }
                });
            }
            this.getView().byId("txtdownload").setVisible(true);

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
                htmTable += "<td align='center'>" + model["groupname"] + "</td>"
                htmTable += "<td>" + model["itemcode"] + "</td>"
                htmTable += "<td align='right'>" + model["itemname"] + "</td>"
                htmTable += "<td align='right'>" + model["manufacturer"] + "</td>"
                htmTable += "<td>" + model["batchno"] + "</td>"
                htmTable += "<td>" + model["closingstock"] + "</td>"
                htmTable += "<td>" + model["unitcost"] + "</td>"
                htmTable += "<td>" + model["cummulativecost"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;
            var fromdate = this.getView().byId("txtFromDate").getValue();
            var todate = this.getView().byId("txtToDate").getValue();
            var location = this.location.mProperties.text;
            var warehousename = this.warehousename;


            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);
            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##FromDate##", fromdate);
            template = this.replaceStr(template, "##ToDate##", todate);
            template = this.replaceStr(template, "##Location##", location);
            template = this.replaceStr(template, "##WarehouseName##", warehousename);
            return template;

        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("Purchase", "ItemWiseSubgroup.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Item Wise Subgroup Stock Report");
            });
        },

        validateForm: function () {
            var isValid = true;

            if (!commonFunction.ismultiComRequired(this, "txtLocation", "Location is required"))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "warehousetbl", "Warehouse  is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtFromDate", "From Date is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtToDate", "To Date is required"))
                isValid = false;

            return isValid;
        },


        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
          
            var fromdate = this.getView().byId("txtFromDate").getValue();
            var todate = this.getView().byId("txtToDate").getValue();
            var location = this.location.mProperties.text;
            var warehousename = this.warehousename;
            var filename = fromdate+'_'+todate+'_'+location+'_'+warehousename;



            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/



            var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ","
                }),

                // Pass in the model created above
                models: this.getView().getModel("tblModel"),

                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content

                columns: [
                    {
                        name: "Item Group Name",
                        template: { content: "{groupname}" }
                    },
                    {
                        name: "Item Code",
                        template: { content: "{itemcode}" }
                    },
                    {
                        name: "Item Name",
                        template: { content: "{itemname}" }
                    },
                    {
                        name: "Manufacturer Company Name",
                        template: { content: "{manufacturer}" }
                    },
                    {
                        name: "Batch No",
                        template: { content: "{batchno}" }
                    },

                    {
                        name: "Qunatity",
                        template: { content: "{closingstock}" }
                    },
                    {
                        name: "Purchase Price",
                        template: { content: "{unitcost}" }
                    },
                    {
                        name: "Total Amount",
                        template: { content: "{cummulativecost}" }
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
