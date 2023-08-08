sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/ProcessingReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Processing/ProcessingSettings.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',
    'sap/ui/model/Sorter',


], function (JSONModel, BaseController, MessageBox, Export, ExportTypeCSV, commonFunction, ProcessingReport, processingSettingService, commonService, Sorter) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Processing.ItemStockReport", {

        currentContext: null,

        onInit: function () {
            var currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");
            this.getModuleWiseWarehouses('724', currentContext);

            var model = new JSONModel();
            model.setData([]);
            this.getView().setModel(model, "reportModel");

            var emptyModel = this.getModelDefault();
            model.setData(emptyModel)
            var model = new JSONModel();
            model.setData({ modelData: [] });

            this.getView().setModel(model, "tblModel");
            this.getView().byId("txtdownload").setVisible(false);

            this.handleRouteMatched(null);
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
        },

        // get processing module wise warehouses
        getModuleWiseWarehouses: function (moduleId, currentContext) {
            commonService.getModuleWiseWarehouses({ moduleid: moduleId }, function (data) {
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
            let selectedItems = oEvt.getParameter("selectedItems");
            let selectedsheds = [];
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
            let changedItem = oEvent.getParameter("changedItem");
            let isSelected = oEvent.getParameter("selected");
            let state = "Selected";

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


        getItemGroups: function (currentContext) {
            commonService.getItemGroups(function (data) {
                let oBranchModel = new sap.ui.model.json.JSONModel();
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

        handleselectionChange: function (oEvent) {
            let changedItem = oEvent.getParameter("changedItem");
            let isSelected = oEvent.getParameter("selected");
            let state = "Selected";

            if (!isSelected) {
                state = "Deselected"
            }

            //Check if "Selected All is selected
            if (changedItem.mProperties.key == "All") {
                let oName, res;

                //If it is Selected
                if (state == "Selected") {

                    let oItems = oEvent.oSource.mAggregations.items;
                    for (let i = 0; i < oItems.length; i++) {
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


        groupSelectionFinish: function (oEvt) {
            let currentContext = this;
            let selectedItems = oEvt.getParameter("selectedItems");
            let selectedKeys = [];
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
                let oBranchModel = new sap.ui.model.json.JSONModel();
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
            let currentContext = this;
            let selectedItems = oEvt.getParameter("selectedItems");
            let selectedsheds = [];
            for (let i = 0; i < selectedItems.length; i++) {
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
                let oBranchModel = new sap.ui.model.json.JSONModel();
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

        resetModel: function () {
            let tbleModel = this.getView().getModel("tblModel");
            tbleModel.setData({ modelData: [] });

            let pModel = this.getView().getModel("reportModel");
            pModel.setData([]);
        },

        onSearchData: function () {
            if (this.validateForm()) {
                if (this.warehouseStr != undefined && this.warehouseStr.length > 0) {
                    let currentContext = this;
                    ProcessingReport.getItemWiseStockReport({ fromdate: commonFunction.getDate(this.getView().byId("txtFromDate").getValue()), todate: commonFunction.getDate(this.getView().byId("txtToDate").getValue()), itemid: this.itemStr, warehouseids: this.warehouseStr }, function async(data) {
                        console.log("data",data);
                        let dataArray = [];
                        if (data.length > 0) {
                            for (let i = 0; data[0].length > i; i++) {
                              
                                 let balancedetail = data[1].filter(element=>{
                                    
                                    return parseInt(element.itemid) == data[0][i].itemidone
                                })

                                console.log("balancedetail",balancedetail);
                                dataArray.push({
                                    itemid: data[0][i].itemidone,
                                    transactiondate: data[0][i].transactiondate,
                                    itemname: data[0][i].itemname,
                                    groupname: data[0][i].groupname,
                                    locationname: data[0][i].locationname,
                                    warehousename: data[0][i].warehousename,
                                    openingbal: balancedetail[0].openingbal,
                                    closingbal: balancedetail[0].closingbal,
                                    transferinstock: balancedetail[0].transferinstock,
                                    transferoutstock: balancedetail[0].transferoutstock,
                                    receipt: balancedetail[0].receipt,
				                    issue : balancedetail[0].issue,

                                    openingbalqty: balancedetail[0].openingbalqty,
                                    closingbalqty: balancedetail[0].closingbalqty,
                                    transferinstockqty: balancedetail[0].transferinstockqty,
                                    transferoutstockqty: balancedetail[0].transferoutstockqty,
                                    receiptqty: balancedetail[0].receiptqty,
                                    issueqty : balancedetail[0].issueqty,

                                    openingbalrate: balancedetail[0].openingbalrate,
                                    closingbalrate: balancedetail[0].closingbalrate,
                                    transferinstockrate: balancedetail[0].transferinstockrate,
                                    transferoutstockrate: balancedetail[0].transferoutstockrate,
                                    receiptrate: balancedetail[0].receiptrate,
                                    issuerate : balancedetail[0].issuerate,
                                    openingbalamount: balancedetail[0].openingbalamount,
                                    closingbalamount: balancedetail[0].closingbalamount,
                                    transferinstockamount: balancedetail[0].transferinstockamount,
                                    transferoutstockamount: balancedetail[0].transferoutstockamount,
                                    receiptamount: balancedetail[0].receiptamount,
                                    issueamount : balancedetail[0].issueamount   
                                });

                            }
                        }
                        let tblModel = currentContext.getView().getModel("tblModel");
                        tblModel.setData({ modelData: dataArray });
                    
                    });

                }
            
            }
            this.getView().byId("txtdownload").setVisible(true);
        },

        // Report Validation
        validateForm: function () {
            let isValid = true;
            if (!commonFunction.isRequired(this, "txtFromDate", "Please Select Fromdate"))
                isValid = false;
            if (!commonFunction.isRequired(this, "txtToDate", "Please Select Todate"))
                isValid = false;
            return isValid;
        },

        // Change Done By Pooja For PDF Functionality
        onPdfExport: function () {
            var fullHtml = "";
            var headertable1 = "";
            headertable1 += "<!DOCTYPE html> <html> <head> <title>" + "Item Wise Stock Report" + "</title>" +
                "<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js'></script>" +
                "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.22/pdfmake.min.js'></script>" +
                "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.62/vfs_fonts.js'></script>" +
                "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js'></script>" +
                "<style type='text/css'>" +
                "table {font-family: arial, sans-serif;border-collapse: collapse;width: 100%; } td, th {border: 1px solid #000;text-align: left;padding: 5px; } th, td {width: 100px;overflow: hidden; } img { width: 180px; height: 120px; text-align: center; } </style> </head>";

            headertable1 += "<body id='tblCustomers' class='amin-logo'>";
            headertable1 += "</body>";
            headertable1 += "<script>";



            let groupname = this.groupname ;
            let itemname = this.itemname;
            let warehousename = this.warehousename;
            let fromdate = this.getView().byId("txtFromDate").getValue();
            let todate = this.getView().byId("txtToDate").getValue();

            var companyname = this.companyname;
            var phone = (this.companycontact === null || this.companycontact == undefined) ? "-" : this.companycontact;
            var email = (this.companyemail === null || this.companyemail == undefined) ? "-" : this.companyemail;
            var address = (this.address === null || this.address == undefined) ? "-" : this.address;
            var pincode = (this.pincode === null || this.pincode == undefined) ? "-" : this.pincode;

            var tbleModel = this.getView().getModel("tblModel").oData.modelData;
            headertable1 += "html2canvas($('#tblCustomers')[0], {" +
                "onrendered: function (canvas) {" +
                "var data = canvas.toDataURL();" +
                "var width = canvas.width;" +
                "var height = canvas.height;" +
                "var docDefinition = {" +
                "pageMargins: [ 20, 60, 20, 60 ]," +
                "pageOrientation: 'landscape'," +
                "pageSize: 'A4'," +
                "content: [";
            headertable1 += "{text: 'Company:-" + companyname + "', style: 'header'},";
            headertable1 += "{text: 'Email:-" + email + "', style: 'header'},";
            headertable1 += "{text: 'Phone:-" + phone + "', style: 'header'},";
            headertable1 += "{text: 'Address:-" + address + "', style: 'header'},";
            headertable1 += "{text: 'Item Wise Stock Report', style: 'title'},";
            headertable1 += "{columns: [{text:'Group:-" + groupname + "', style: 'subheader'},{text:'Item:-" + itemname + "', style: 'todatecss'}]},";
            headertable1 += "{columns: [{text:'Warehouse:-" + warehousename + "', style: 'subheader'},{text:'Item:-" + itemname + "', style: 'todatecss'}]},";
            headertable1 += "{ style: 'tableExample',";
            headertable1 += " table: {";
            // headertable1 += "widths: ['*','*','*','*','*'],";
            headertable1 += " body: [";
            headertable1 += "[ {text: 'Date', style: 'tableHeader'}, {text: 'Opening Quantity', style: 'tableHeader'},{text: 'Opening Weight', style: 'tableHeader'},{text: 'Rate/Kg', style: 'tableHeader'},{text: 'Amount', style: 'tableHeader'},{text: 'Receipt Quantity', style: 'tableHeader'},{text: 'Receipt Weight', style: 'tableHeader'},{text: 'Rate/Kg', style: 'tableHeader'},{text: 'Amount', style: 'tableHeader'},{text: 'TransferIn Quantity', style: 'tableHeader'},{text: 'TransferIn Weight', style: 'tableHeader'},{text: 'Rate/Kg', style: 'tableHeader'},{text: 'Amount', style: 'tableHeader'},{text: 'TransferOut Quantity', style: 'tableHeader'},{text: 'TransferOut Weight', style: 'tableHeader'},{text: 'Rate/Kg', style: 'tableHeader'},{text: 'Amount', style: 'tableHeader'},{text: 'Issue Quantity', style: 'tableHeader'},{text: 'Issue Weight', style: 'tableHeader'},{text: 'Rate/Kg', style: 'tableHeader'},{text: 'Amount', style: 'tableHeader'},{text: 'Closing Quantity', style: 'tableHeader'},{text: 'Closing Weight', style: 'tableHeader'},{text: 'Rate/Kg', style: 'tableHeader'},{text: 'Amount', style: 'tableHeader'}],";

            for (var i = 0; i < tbleModel.length; i++) {
                if (tbleModel[i].transactiondate == null) {
                    tbleModel[i].transactiondate = "-";
                }
                if (tbleModel[i].openingbalqty == null) {
                    tbleModel[i].openingbalqty = "-";
                }
                if (tbleModel[i].openingbal == null) {
                    tbleModel[i].openingbal = "-";
                }
                if (tbleModel[i].openingbalrate == null) {
                    tbleModel[i].openingbalrate = "-";
                }
                if (tbleModel[i].openingbalamount == null) {
                    tbleModel[i].openingbalamount = "-";
                }
                if (tbleModel[i].receiptqty == null) {
                    tbleModel[i].receiptqty = "-";
                }
                if (tbleModel[i].receipt == null) {
                    tbleModel[i].receipt = "-";
                }
                if (tbleModel[i].receiptrate == null) {
                    tbleModel[i].receiptrate = "-";
                }
                if (tbleModel[i].receiptamount == null) {
                    tbleModel[i].receiptamount = "-";
                }

                if (tbleModel[i].transferinstockqty == null) {
                    tbleModel[i].transferinstockqty = "-";
                }
                if (tbleModel[i].transferinstock == null) {
                    tbleModel[i].transferinstock = "-";
                }
                if (tbleModel[i].transferinstockrate == null) {
                    tbleModel[i].transferinstockrate = "-";
                }
                if (tbleModel[i].transferinstockamount == null) {
                    tbleModel[i].transferinstockamount = "-";
                }

                if (tbleModel[i].transferoutstockqty == null) {
                    tbleModel[i].transferoutstockqty = "-";
                }
                if (tbleModel[i].transferoutstock == null) {
                    tbleModel[i].transferoutstock = "-";
                }
                if (tbleModel[i].transferoutstockrate == null) {
                    tbleModel[i].transferoutstockrate = "-";
                }

                if (tbleModel[i].transferoutstockamount == null) {
                    tbleModel[i].transferoutstockamount = "-";
                }
                if (tbleModel[i].issueqty == null) {
                    tbleModel[i].issueqty = "-";
                }
                if (tbleModel[i].issue == null) {
                    tbleModel[i].issue = "-";
                }
                if (tbleModel[i].issuerate == null) {
                    tbleModel[i].issuerate = "-";
                }
                if (tbleModel[i].issueamount == null) {
                    tbleModel[i].issueamount = "-";
                }

                if (tbleModel[i].closingbalqty == null) {
                    tbleModel[i].closingbalqty = "-";
                }
                if (tbleModel[i].closingbal == null) {
                    tbleModel[i].closingbal = "-";
                }
                if (tbleModel[i].closingbalrate == null) {
                    tbleModel[i].closingbalrate = "-";
                }
                if (tbleModel[i].closingbalamount == null) {
                    tbleModel[i].closingbalamount = "-";
                }

                headertable1 += "['" + tbleModel[i].transactiondate + "','" + tbleModel[i].openingbalqty + "','" + tbleModel[i].openingbal + "','" + tbleModel[i].openingbalrate + "','" + tbleModel[i].openingbalamount + "','" + tbleModel[i].receiptqty + "','" + tbleModel[i].receipt + "','" + tbleModel[i].receiptrate + "','" + tbleModel[i].receiptamount + "','" + tbleModel[i].transferinstockqty + "','" + tbleModel[i].transferinstock + "','" + tbleModel[i].transferinstockrate + "','" + tbleModel[i].transferinstockamount + "','" + tbleModel[i].transferoutstockqty + "','" + tbleModel[i].transferoutstock + "','" + tbleModel[i].transferoutstockrate + "','" + tbleModel[i].transferoutstockamount + "','" + tbleModel[i].issueqty + "','" + tbleModel[i].issue + "','" + tbleModel[i].issuerate + "','" +  tbleModel[i].issueamount + "','" + tbleModel[i].closingbalqty + "','" + tbleModel[i].closingbal + "','" + tbleModel[i].closingbalrate + "','"  + tbleModel[i].closingbalamount + "'],"
            }
            headertable1 += "]";
            headertable1 += "}";
            headertable1 += "}";
            headertable1 += "]," +
                "footer: function (currentPage, pageCount) {" +
                "return {" +
                "style: 'Footer'," +
                "table: {" +
                "widths: ['*', 100]," +
                "body: [" +
                "[" +
                "{ text: 'Page ' + currentPage.toString() + ' of ' + pageCount, alignment: 'center', style: 'normalText' }" +
                "]," +
                "]" +
                "}," +
                "layout: 'noBorders'" +
                "};" +
                "}," +
                "styles: {" +
                "header: {" +
                "fontSize:10," +
                "bold: true," +
                "margin: [0, 0, 0, 8]" +
                "}," +
                "title: {" +
                "fontSize:12," +
                "bold: true," +
                "alignment: 'center'" +
                "}," +
                "Footer: {" +
                "fontSize: 7," +
                "margin: [5, 5, 5, 5]," +
                "}," +
                "subheader: {" +
                "fontSize:9," +
                "bold: true," +
                "margin: [0, 10, 0, 4]" +
                "}," +
                "todatecss: {" +
                "fontSize:9," +
                "bold: true," +
                "alignment:'right'" +
                "}," +
                "tableExample: {" +
                "margin: [0, 15, 0, 0]," +
                "fontSize: 8" +
                "}," +
                "tableHeader: {" +
                "bold: true," +
                "fontSize: 8," +
                "color: 'black'" +
                "}" +
                "}," +
                "defaultStyle: {" +
                "fontSize: 8" +
                "}" +
                "};" +
                "pdfMake.createPdf(docDefinition).download('Item_Wise_Stock_Report.pdf');" +
                "} });";
            headertable1 += "</script></html>";
            fullHtml += headertable1;
            var wind = window.open();
            wind.document.write(fullHtml);
            setTimeout(function () {
                wind.close();
            }, 3000);

        },


        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {

            let groupname = this.groupname ;
            let itemname = this.itemname;
            let warehousename = this.warehousename;
            let filename = groupname + '_' + itemname + '_' + warehousename;



            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/

            let oExport = new Export({

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
                        name: "Date.",
                        template: { content: "{transactiondate}" }
                    },
                    {
                        name: "Opening Quantity",
                        template: { content: "{openingbalqty}" }
                    },
                    {
                        name: "Opening Weight",
                        template: { content: "{openingbal}" }
                    },
                    {
                        name: "Rate/Kg",
                        template: { content: "{openingbalrate}" }
                    },
                    {
                        name: "Amount",
                        template: { content: "{openingbalamount}" }
                    },
                    {
                        name: "Receipt Quantity",
                        template: { content: "{receiptqty}" }
                    },
                    {
                        name: "Receipt Weight",
                        template: { content: "{receipt}" }
                    },
                    {
                        name: "Rate/Kg",
                        template: { content: "{receiptrate}" }
                    },
                    {
                        name: "Amount",
                        template: { content: "{receiptamount}" }
                    },
                    {
                        name: "TransferIn Quantity",
                        template: { content: "{transferinstockqty}" }
                    },
                    {
                        name: "TransferIn Weight",
                        template: { content: "{transferinstock}" }
                    },
                    {
                        name: "Rate/Kg",
                        template: { content: "{transferinstockrate}" }
                    },
                    {
                        name: "Amount",
                        template: { content: "{transferinstockamount}" }
                    },
                    {
                        name: "TransferOut Quantity",
                        template: { content: "{transferoutstockqty}" }
                    },
                    {
                        name: "TransferOut Weight",
                        template: { content: "{transferoutstock}" }
                    },
                    {
                        name: "Rate/Kg",
                        template: { content: "{transferoutstockrate}" }
                    },
                    {
                        name: "Amount",
                        template: { content: "{transferoutstockamount}" }
                    },
                    {
                        name: "Issue Quantity",
                        template: { content: "{issueqty}" }
                    },
                    {
                        name: "Issue Weight",
                        template: { content: "{issue}" }
                    },
                    {
                        name: "Rate/Kg",
                        template: { content: "{issuerate}" }
                    },
                    {
                        name: "Amount",
                        template: { content: "{issueamount}" }
                    },
                    {
                        name: "Closing Quantity",
                        template: { content: "{closingbalqty}" }
                    },
                    {
                        name: "Closing Weight",
                        template: { content: "{closingbal}" }
                    },
                    {
                        name: "Rate/Kg",
                        template: { content: "{closingbalrate}" }
                    },
                    {
                        name: "Amount",
                        template: { content: "{closingbalamount}" }
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
