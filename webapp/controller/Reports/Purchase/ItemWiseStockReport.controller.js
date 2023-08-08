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

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Purchase.ItemWiseStockReport", {
        onInit: function () {
            // set location model
            this.currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");
            var emptyModel = this.getModelDefault();
            var stockModel = new JSONModel();
            stockModel.setData(emptyModel);
            this.getView().setModel(stockModel, "stockModel");

            // get the path to the JSON file
            // var sPath = jQuery.sap.getModulePath("sap.ui.elev8rerp.componentcontainer.model.FeedMill.Master", "/TestMaster.json");
            // initialize the model with the JSON file
            // var oModel = new JSONModel(sPath);
            // set the model to the view
            // this.getView().setModel(oModel, "jsonFile"); 
            var tblModel = new JSONModel();
            tblModel.setData({ modelData: [] });
            this.getView().setModel(tblModel, "tblModel");


            // breederBatchService 
            this.handleRouteMatched(null);
            var currRouteName = this.getOwnerComponent().getModel("applicationModel").getProperty("/routeName");
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this._oRouter.getRoute(currRouteName).attachMatched(this.handleRouteMatched, this);
            this.getView().byId("txtdownload").setVisible(false);
        },

        getModelDefault: function () {
            return {
                itemgrpoid: null,
                itemid: null,
                warehouseids: null,
                fromdate: commonFunction.setTodaysDate(new Date()),
                todate: commonFunction.setTodaysDate(new Date()),
            }
        },

        handleRouteMatched: function () {
            //get All item Group
            this.getItemGroups(this, "itemGroupList");

            //get All Location
            commonFunction.getLocationList(this);
            // commonFunction.getWarehouseList(this);
        },

        getItemGroups: function (currentContext) {
            commonService.getItemGroups(function (data) {
                var oBranchModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "groupname": "Select All" });
                    } else {
                        MessageBox.error("group not availabel.")
                    }
                }
                oBranchModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oBranchModel, "itemGroupList");
            });
        },

        groupSelectionFinish: function (oEvt) {
            var currentContext = this;
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedKeys = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedKeys.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });

            }

            var itemgroupid = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                itemgroupid.push(selectedKeys[i].key);
            }

            this.groupname = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                this.groupname.push(selectedKeys[i].text);
            }


            if (itemgroupid[i] == "NaN") {

                itemgroupid.shift();

            }
            else {
                itemgroupid;

            }

            commonService.getItemsByItemGroups({ itemgroupid: itemgroupid }, function (data) {
                var oBranchModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "itemname": "Select All" });
                    } else {
                        MessageBox.error("group not availabel.")
                    }
                }
                oBranchModel.setData({ modelData: data[0] });
                oBranchModel.setSizeLimit(data[0].length);
                currentContext.getView().setModel(oBranchModel, "itemList");
            });
            this.getView().byId("txtitemgroup").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            })
        },

        itemSelectionFinish: function (oEvt) {
            var currentContext = this;
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedsheds = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedsheds.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }
            this.itemStr = [];
            for (var i = 0; selectedsheds.length > i; i++) {
                if (selectedsheds[i].text != "Select All")
                    this.itemStr.push(selectedsheds[i].key);
            }

            this.itemname = [];
            for (var i = 0; i < selectedsheds.length; i++) {
                this.itemname.push(selectedsheds[i].text);
            }

            commonService.getLocationList(function (data) {
                var oBranchModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "locationname": "Select All" });
                    } else {
                        MessageBox.error("location  not availabel.")
                    }
                }

                oBranchModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oBranchModel, "locationList");
            });
            this.getView().byId("txtitemname").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            })
        },


        locationSelectionFinish: function (oEvt) {
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedKeys = [];
            var location = [];
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
            this.getView().byId("txtLocation").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();

                }
            })
            this.getwarehousebylocation(locationStr)
        },

        getwarehousebylocation: function (locationStr) {
            var currentContext = this;
            purchaseReportsService.getwarehousebylocation({ locationid: locationStr }, function (data) {

                if (data[0].length > 0) {
                    if (data[0].length > 0) {
                        data[0].push({ "id": "All", "warehousename": "Select All" });
                    }
                    var warehouseModel = new sap.ui.model.json.JSONModel();
                    warehouseModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(warehouseModel, "warehouseList");
                } else {
                    MessageBox.error("Warehouse not availabel!");
                }
            });
        },

        warehouseSelectionFinish: function (oEvt) {

            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedsheds = [];
            this.multilewarehousestr = [];

            for (var i = 0; i < selectedItems.length; i++) {
                selectedsheds.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }
            this.warehouseStr = [];
            for (var i = 0; selectedsheds.length > i; i++) {
                if (selectedsheds[i].text != "Select All")
                    this.warehouseStr.push(selectedsheds[i].key);
            }
            this.warehousename = [];
            for (var i = 0; i < selectedsheds.length; i++) {
                this.warehousename.push(selectedsheds[i].text);
            }

            this.getView().byId("warehousetbl").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();

                }
            })
        },

        handleselectionChangeWarehouse: function (oEvent) {
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

            else if (changedItem.mProperties.key != "All") {
                var oName, res;
                if (changedItem.mProperties.key != null) {
                    oName = changedItem.mProperties.key;
                    res = oName;
                    oEvent.oSource.setSelectedKeys(res);
                }
            }
        },

        handleselectionChange: function (oEvent) {
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

        getLocationWiseWarehouse: function (locationid) {
            var currentContext = this;
            commonService.getLocationWiseWarehouse({ locationid: locationid }, function (data) {

                if (data[0].length > 0) {
                    if (data[0].length > 0) {
                        data[0].push({ "id": "All", "warehousename": "Select All" });
                    }
                    var warehouseModel = new sap.ui.model.json.JSONModel();
                    warehouseModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(warehouseModel, "warehouseList");
                } else {
                    MessageBox.error("Warehouse not availabel!");
                }

            });
        },

        WarehouseSelectionFinish: function (oEvt) {
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectdware = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectdware.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }
            var i = selectdware.length - 1;

            if (selectdware[i].key == "ALL") {

                selectdware = selectdware.slice(0, -1);
            }
            var warehouses = [];
            for (var i = 0; i < selectdware.length; i++) {
                warehouses.push(selectdware[i].key);
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

            var pModel = this.getView().getModel("stockModel");
            pModel.oData.warehouseids = warehousetrg
            pModel.refresh();
        },

        onDateChange: function (oEvent) {
            var tDate = this.getView().byId("txtToDate").getValue();
            var toDate = new Date(commonFunction.parseDate(tDate));
            var fDate = this.getView().byId("txtFromDate").getValue();
            var frDate = new Date(commonFunction.parseDate(fDate));
            var todayDate = new Date();
            var pModel = this.getView().getModel("stockModel");
            if (frDate > toDate) {
                MessageBox.error("To date should be equal or greater than from date.");
                //pModel.oData.todate = commonFunction.setTodaysDate(frDate);
            }

            pModel.refresh();
        },

        // onSearchData: function (){
        //     debugger;
        //     var smodel = this.getView().getModel("jsonFile")
        //     console.log("smodel",smodel);
        // },

        onSearchData: function () {
            if (this.validateForm()) {
                if (this.warehouseStr != undefined && this.warehouseStr.length > 0) {
                    var currentContext = this;
                    purchaseReportsService.getItemWiseStockReport({ fromdate: commonFunction.getDate(this.getView().byId("txtFromDate").getValue()), todate: commonFunction.getDate(this.getView().byId("txtToDate").getValue()), itemid: this.itemStr, warehouseids: this.warehouseStr }, function async(data) {
                        console.log("data",data);
                        var dataArray = [];
                        if (data.length > 0) {
                            for (var i = 0; data[0].length > i; i++) {
                              
                                 let balancedetail = data[1].filter(element=>{
                                    
                                    return parseInt(element.itemid) == data[0][i].itemidone
                                })

                                console.log("balancedetail",balancedetail);
                                dataArray.push({
                                    itemid: data[0][i].itemidone,
                                    itemname: data[0][i].itemname,
                                    groupname: data[0][i].groupname,
                                    locationname: data[0][i].locationname,
                                    warehousename: data[0][i].warehousename,
                                    openingbal: balancedetail[0].openingbal,
                                    closingbal: balancedetail[0].closingbal,
                                    transferinstock: balancedetail[0].transferinstock,
                                    transferoutstock: balancedetail[0].transferoutstock,
                                    receipt: balancedetail[0].receipt,
				    issue : balancedetail[0].issue
                                });

                            }
                        }
                        var tblModel = currentContext.getView().getModel("tblModel");
                        tblModel.setData({ modelData: dataArray });
                    
                    });

                }
                else if (this.warehouseStr == undefined || this.warehouseStr.length == 0) {
                    var currentContext = this;
                    purchaseReportsService.getItemWiseStockReportOne({ fromdate: commonFunction.getDate(this.getView().byId("txtFromDate").getValue()), todate: commonFunction.getDate(this.getView().byId("txtToDate").getValue()), itemid: this.itemStr }, function async(data) {

                        var dataArray = [];
                        if (data.length > 0) {
                            for (var i = 0; data[0].length > i; i++) {
                                if(data[0][i].itemidone == data[1][i].itemid)
                               {
                                dataArray.push({
                                    itemid: data[0][i].itemidone,
                                    itemname: data[0][i].itemname,
                                    groupname: data[0][i].groupname,
                                    locationname: data[0][i].locationname,
                                    warehousename: data[0][i].warehousename,
                                    openingbal: data[1][i].openingbal, 
                                    closingbal: data[1][i].closingbal,
                                    transferinstock: data[1][i].transferinstock,
                                    transferoutstock: data[1][i].transferoutstock,
                                    receipt: data[1][i].receipt,
				                    issue : data[1][i].issue                               
                                 });
                            }
                        }

                        var tblModel = currentContext.getView().getModel("tblModel");
                        tblModel.setData({ modelData: dataArray });
                    }
                    });

                }
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
                htmTable += "<td align='right'>" + model["locationname"] + "</td>"
                htmTable += "<td align='right'>" + model["warehousename"] + "</td>"
                htmTable += "<td align='center'>" + model["groupname"] + "</td>"
                htmTable += "<td>" + model["itemname"] + "</td>"
                htmTable += "<td>" + model["openingstock"] + "</td>"
                htmTable += "<td>" + model["receipt"] + "</td>"
                htmTable += "<td>" + model["transferinstock"] + "</td>"
                htmTable += "<td>" + model["transferoutstock"] + "</td>"
                htmTable += "<td>" + model["issue"] + "</td>"
                htmTable += "<td>" + model["closingbal"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;
            var fromdate = this.getView().byId("txtFromDate").getValue();
            var todate = this.getView().byId("txtToDate").getValue();
            var warehousename = this.warehousename;
            var groupname = this.groupname;
            var locationname = this.locationname;
            var itemname = this.itemname;


            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);
            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##FromDate##", fromdate);
            template = this.replaceStr(template, "##ToDate##", todate);
            template = this.replaceStr(template, "##Itemgroup##", groupname);
            template = this.replaceStr(template, "##ItemName##", itemname);
            template = this.replaceStr(template, "##Location##", locationname);
            template = this.replaceStr(template, "##WarehouseName##", warehousename);
            return template;

        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("Purchase", "ItemWiseStockReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Item Wise Stock Report");
            });
        },

        // Validation Fun

        validateForm: function () {
            var isValid = true;

            if (!commonFunction.ismultiComRequired(this, "txtitemgroup", "itemgroup is required"))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "txtitemname", "itemname  is required"))
                isValid = false;
            return isValid;
        },

        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var fromdate = this.getView().byId("txtFromDate").getValue();
            var todate = this.getView().byId("txtToDate").getValue();
            var warehousename = this.warehousename;
            var groupname = this.groupname;
            var locationname = this.locationname;
            var itemname = this.itemname;
            var filename = fromdate+'_'+todate+'_'+warehousename+'_'+groupname+'_'+locationname+'_'+itemname;

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
                        name: "Location Name",
                        template: { content: "{locationname}" }
                    },
                    {
                        name: "Warehouse Name",
                        template: { content: "{warehousename}" }
                    },
                    {
                        name: "Item Group Name",
                        template: { content: "{groupname}" }
                    },
                    {
                        name: "Item Name",
                        template: { content: "{itemname}" }
                    },
                    {
                        name: "Opening Balance",
                        template: { content: "{openingbal}" }
                    },

                    {
                        name: "Receipt Quantity",
                        template: { content: "{receipt}" }
                    },
                    {
                        name: "Transfer In Quantity",
                        template: { content: "{transferinstock}" }
                    },
                    {
                        name: "Transfer Out Quantity",
                        template: { content: "{transferoutstock}" }
                    },
                    {
                        name: "Issue Quantity",
                        template: { content: "{issue}" }
                    },
                    {
                        name: "Closing Balance",
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
