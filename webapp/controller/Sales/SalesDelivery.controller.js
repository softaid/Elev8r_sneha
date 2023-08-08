sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/model/Filter',
    'sap/ui/elev8rerp/componentcontainer/services/Sales/SalesOrder.service',
    'sap/ui/elev8rerp/componentcontainer/services/Sales/SalesDelivery.service',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',
], function (JSONModel, BaseController, MessageBox, MessageToast, Filter, salesorderService, salesdeliveryService, commonFunction, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.BreederSales.SalesDelivery", {

        onInit: function () {
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.subscribe("salesdelivery", "setDetailPage", this.setDetailPage, this);
            this.bus.subscribe("salesdelivery", "handleSalesDeliveryList", this.handleSalesDeliveryList, this);
            this.bus.subscribe("salesdelivery", "onAddSalesDelivery", this.onAddSalesDelivery, this);
            this.oFlexibleColumnLayout = this.byId("fclBreederSalesDelivery");

            // set empty model to view		
            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "tblModel");

            //var emptyModel = this.getModelDefault();

            var model = new JSONModel();
            model.setData({});
            this.getView().setModel(model, "salesdeliveryModel");

            commonFunction.getNewDocSeries("SD", this);
            commonFunction.getWarehouseAddress(null, this);

            this.handleRouteMatched(null);

            // var currRouteName = this.getOwnerComponent().getModel("applicationModel").getProperty("/routeName");
            // this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            // this._oRouter.getRoute(currRouteName).attachMatched(this.handleRouteMatched, this);
            
        },

        handleRouteMatched: async function (evt) {

            // get customer List 
            var partnerroleid = 32;
            commonFunction.getAllVendor(this, partnerroleid);

            commonFunction.getReference("GSTInvTyp", "gstInvTypeList", this);
            //commonFunction.getReference("SalesDelSts", "SDstatusList", this);
            commonFunction.getReferenceFilter("SalesDelSts", ['1621', '1622'], "SDstatusList", this);

            commonFunction.getReference("ModName", "moduleList", this);

            //get common settings
			this.getAllCommonSetting();

            this.getAllSalesDelivery();
            this.getAllSalesOrder();

            this.resetModel();

            this.getView().byId("txtSalesDeliveryDate").setValue(commonFunction.setTodaysDate(new Date()));
        },

        handleSalesDeliveryList: async function(sChannel, sEvent, oData) {

            let _this = this;
            let selRow = oData.viewModel;
            
            await this.handleRouteMatched();

            if(selRow != null)  {

                let oSalesDeliveryModel = this.getView().getModel("salesdeliveryModel");
                let oDocSeriesModel = this.getView().getModel("docSeriesModel");
                
                oSalesDeliveryModel.setData(selRow);
                oSalesDeliveryModel.refresh();

                oDocSeriesModel.oData.newseries = selRow.salesdeliveryno;
                oDocSeriesModel.refresh();

                let invoicestatusid = selRow.statusid;


                commonFunction.getPartyAddress(selRow.customerid, 1402, "billtoaddressList", _this);
                commonFunction.getPartyAddress(selRow.customerid, 1404, "deliverytoaddressList", _this);

				if (selRow.action == "view") {
					this.getView().byId("btnSave").setEnabled(false);
				} else {
                    this.getView().byId("btnSave").setEnabled(true);
				}

                salesdeliveryService.getAllSalesDeliveryDetail({ salesdeliveryid: selRow.id }, function (data) {
                    var cModel = _this.getView().getModel("tblModel");
                    for (var i = 0; i < data[0].length; i++) {
                        if (invoicestatusid == 1361)
                            data[0][i].navigation = data[0][i].quantity > 0 ? 'Navigation' : 'Inactive';
                    }
                    cModel.oData.modelData = data[0];
                    cModel.refresh();
                    //currentContext.itemTotal();
                });

            }

        },

        getAllCommonSetting : function(){
			var currentContext = this;
			commonService.getAllCommonSetting(function(data){
				if(data.length && data[0].length){
                    var oModel = currentContext.getView().getModel("salesdeliveryModel");
                    oModel.oData.deliverywithoutso = data[0][0].deliverywithoutso;
                    oModel.refresh();

                    if(data[0][0].deliverywithoutso){
                        currentContext.getView().byId("salesorderEle").setVisible(false);
                        currentContext.getView().byId("addBtn").setEnabled(true);
                        currentContext.getView().byId("txtCustomer").setEnabled(true);

                        oModel.oData.navigation = "Navigation";
                        oModel.refresh();

                        // get GST invoice types
                        commonFunction.getReference("GSTInvTyp", "gstInvTypeList", currentContext);
                        currentContext.getView().byId("selGSTInvTypeEle").setVisible(true);

                    }else{
                        currentContext.getView().byId("salesorderEle").setVisible(true);
                        currentContext.getView().byId("addBtn").setEnabled(false);
                        currentContext.getView().byId("txtCustomer").setEnabled(false);
                        currentContext.getView().byId("selGSTInvTypeEle").setVisible(true);

                        oModel.oData.navigation = "Inactive";
                        oModel.refresh();

                        //get sales order
                        currentContext.getAllSalesOrder();
                    }
                }else{
                    MessageBox.error("Please fill common settings first.");
                }
			})
		},

        getAllSalesDelivery: function () {
            var currentContext = this;
            // 721 is Module Type - Breeder
            salesdeliveryService.getAllSalesDelivery(function (data) {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oModel, "salesdeliveryList");
            });
        },

        onListIconPress: function (oEvent) {
            if (!this._oDialog) {
                this._oDialog = sap.ui.xmlfragment("sap.ui.elev8rerp.componentcontainer.fragmentview.Sales.BreederSales.SalesDeliveryDialog", this);
            }

            // Multi-select if required
            var bMultiSelect = !!oEvent.getSource().data("multi");
            this._oDialog.setMultiSelect(bMultiSelect);

            // Remember selections if required
            var bRemember = !!oEvent.getSource().data("remember");
            this._oDialog.setRememberSelections(bRemember);

            this.getView().addDependent(this._oDialog);

            // toggle compact style
            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
            this._oDialog.open();
        },

        handleSalesDeliverySearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var columns = ['customer', 'name', 'postingDate', 'deliveryDate', 'documentDate'];
            var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
            }),
                false);  // false for OR condition
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        handleSalesDeliveryClose: function (oEvent) {
            var currentContext = this;
            var aContexts = oEvent.getParameter("selectedContexts");

            if (aContexts != undefined) {
				if(commonService.session("roleIds") == "1" || commonService.session("roleIds") == "10"){
                    // commonFunction.getReferenceFilter("SOSts", ['1361', '1362', '1364'], "SOStatusList", this);
                    this.getView().byId("btnClose").setVisible(true);
                }else{
                    // commonFunction.getReferenceFilter("SOSts", ['1361', '1362'], "SOStatusList", this);
                    this.getView().byId("btnClose").setVisible(false);
                }
                var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });

                salesdeliveryService.getSalesDelivery({ id: selRow[0].id }, function (data) {

                    // Sales order data
                    var oModel = currentContext.getView().getModel("salesdeliveryModel");
                    oModel.oData = data[0][0];
                    oModel.oData.navigation = oModel.oData.statusid == 1361 ? 'Navigation' : 'Inactive';
                    oModel.oData.itemtotal = oModel.oData.subtotal;
                    oModel.refresh();

                    commonFunction.getPartyAddress(oModel.oData.customerid, 1402, "billtoaddressList", currentContext);
                    commonFunction.getPartyAddress(oModel.oData.customerid, 1404, "deliverytoaddressList", currentContext);

                    // Update current series with existing series number
                    var seriesModel = currentContext.getView().getModel("docSeriesModel");
                    seriesModel.oData.newseries = data[0][0].salesorderno;
                    seriesModel.refresh();

                    salesdeliveryService.getAllSalesDeliveryDetail({ salesorderid: oModel.oData.id }, function (data) {
                        var cModel = currentContext.getView().getModel("tblModel");

                        cModel.oData.modelData = data[0];
                        cModel.refresh();
                    });
                });
            }
        },

        getAllSalesOrder: function () {
            var currentContext = this;
            salesorderService.getSalesOrderOnDelivery({ salestypeid: "721,725,723,722,726" }, function (data) {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oModel, "salesorderList");
            });
        },

        getModelDefault: function () {
            return {
                id: null,
                partycode: null,
                partyname: null,
                statusid: "521",
                salestypeid : 721,
                salesdeliverydate: commonFunction.getDateFromDB(new Date()),
                deliverydate: commonFunction.getDateFromDB(new Date()),
                discount: 0,
                remark: null,
                checkState: true,
                shipfromwarehouseid: null,
                linetotal: 0,
                freequantitypercent: 0
            }
        },


        handleSelectSalesOrderList: function (oEvent) {
            var sInputValue = oEvent.getSource().getValue();

            this.inputId = oEvent.getSource().getId();
            // create value help dialog
            // if (!this._valueHelpDialog) {
            this._valueHelpDialog = sap.ui.xmlfragment(
                "sap.ui.elev8rerp.componentcontainer.fragmentview.Sales.BreederSales.SalesOrderDialog",
                this
            );
            this.getView().addDependent(this._valueHelpDialog);
            // }
            this._valueHelpDialog.open(sInputValue);

        },

        _handleSalesOrderSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var columns = ['partycode', 'partyname', 'contactperson'];
            var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
            }),
                false);  // false for OR condition
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        handleSalesOrderClose: function (oEvent) {
            var currentContext = this;
            var aContexts = oEvent.getParameter("selectedContexts");

            if (aContexts != undefined) {
                var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
                var oModel = currentContext.getView().getModel("salesdeliveryModel");
                //update existing model to set supplier
                oModel.oData.salesorderid = selRow[0].id;
                oModel.oData.customerid = selRow[0].customerid;
                //oModel.oData.partycode = selRow[0].partnercode;
                oModel.oData.salesorderno = selRow[0].salesorderno;
                oModel.oData.salesorderdate = selRow[0].salesorderdate;
                oModel.oData.deliverytoaddressid = selRow[0].deliverytoaddressid;
                oModel.oData.deliverytoaddress = selRow[0].deliverytoaddress;
                oModel.oData.billtoaddressid = selRow[0].billtoaddressid;
                oModel.oData.billtoaddress = selRow[0].billtoaddress;
                oModel.oData.warehouseid = selRow[0].warehouseid;
                oModel.oData.warehouseaddress = selRow[0].warehouseaddress;
                oModel.oData.partyname = selRow[0].partyname;
                oModel.oData.contactperson = selRow[0].contactperson;
                oModel.oData.salestypeid = selRow[0].salestypeid;
                oModel.oData.salespersonid = selRow[0].salespersonid;
                oModel.refresh();

                // Billing To Address
                commonFunction.getPartyAddress(selRow[0].customerid, 1402, "billtoaddressList", this);
                // Delivery To Address
                commonFunction.getPartyAddress(selRow[0].customerid, 1404, "deliverytoaddressList", this);

                salesdeliveryService.getCalculatedSalesOrderDetail({ salesorderid: selRow[0].id }, function (data) {
                    var cModel = currentContext.getView().getModel("tblModel");
                    for (var i = 0; i < data[0].length; i++) {
                        data[0][i].navigation = data[0][i].quantity > 0 ? 'Navigation' : 'Inactive';
                    }
                    cModel.oData.modelData = data[0];
                    cModel.refresh();
                });
            }
        },


        handleSelectWHAddrList: function (oEvent) {
            var sInputValue = oEvent.getSource().getValue();

            this.inputId = oEvent.getSource().getId();
            // create value help dialog
            // if (!this._valueHelpDialog) {
            this._valueHelpDialog = sap.ui.xmlfragment(
                "sap.ui.elev8rerp.componentcontainer.fragmentview.Common.WarehouseAddressDialog",
                this
            );
            this.getView().addDependent(this._valueHelpDialog);
            // }
            this._valueHelpDialog.open(sInputValue);
        },

        _handleWHAddrSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var columns = ['partycode', 'partyname', 'contactperson'];
            var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
            }),
                false);  // false for OR condition
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        onWHAddrDialogClose: function (oEvent) {
            var currentContext = this;
            var aContexts = oEvent.getParameter("selectedContexts");

            if (aContexts != undefined) {
                var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
                var oModel = currentContext.getView().getModel("salesdeliveryModel");

                var addrs = selRow[0].warehousename != null ? " " + selRow[0].warehousename : "";
                addrs += " - ";
                addrs += selRow[0].address != null ? " " + selRow[0].address : "";
                addrs += selRow[0].cityname != null ? " " + selRow[0].cityname : "";
                addrs += selRow[0].statename != null ? " " + selRow[0].statename : "";
                addrs += selRow[0].countryname != null ? " " + selRow[0].countryname : "";
                addrs += selRow[0].pincode != null ? " " + selRow[0].pincode : "";

                oModel.oData.warehouseaddress = addrs;
                oModel.oData.warehouseid = selRow[0].id;
                oModel.oData.warehousestatecode = selRow[0].statecode;
                oModel.oData.warehouseisunionterritory = selRow[0].isunionterritory;
                oModel.refresh();

                this.getView().byId("txtWarehouseAddress").setValueState(sap.ui.core.ValueState.None)
            }
        },

        handleSelectBillToAddrList: function (oEvent) {
            var sInputValue = oEvent.getSource().getValue();

            this.inputId = oEvent.getSource().getId();
            // create value help dialog
            // if (!this._valueHelpDialog) {
            this._valueHelpDialog = sap.ui.xmlfragment(
                "sap.ui.elev8rerp.componentcontainer.fragmentview.Common.BillToAddressDialog",
                this
            );
            this.getView().addDependent(this._valueHelpDialog);
            // }
            this._valueHelpDialog.open(sInputValue);
        },

        _handleBillToAddrSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var columns = ['partycode', 'partyname', 'contactperson'];
            var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
            }),
                false);  // false for OR condition
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        onBillToAddrDialogClose: function (oEvent) {
            var currentContext = this;
            var aContexts = oEvent.getParameter("selectedContexts");

            if (aContexts != undefined) {
                var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
                var oModel = currentContext.getView().getModel("salesdeliveryModel");

                var addrs = selRow[0].address;
                addrs += selRow[0].cityname != null ? " " + selRow[0].cityname : "";
                addrs += selRow[0].statename != null ? " " + selRow[0].statename : "";
                addrs += selRow[0].countryname != null ? " " + selRow[0].countryname : "";
                addrs += selRow[0].pincode != null ? " " + selRow[0].pincode : "";

                oModel.oData.billtoaddress = addrs;
                oModel.oData.billtoaddressid = selRow[0].id;
                oModel.oData.billtostatecode = selRow[0].statecode;
                oModel.oData.billtoisunionterritory = selRow[0].isunionterritory;
                oModel.refresh();

                this.getView().byId("txtbilltoaddress").setValueState(sap.ui.core.ValueState.None)
            }
        },

        handleSelectDelToAddrList: function (oEvent) {
            var sInputValue = oEvent.getSource().getValue();

            this.inputId = oEvent.getSource().getId();
            // create value help dialog
            // if (!this._valueHelpDialog) {
            this._valueHelpDialog = sap.ui.xmlfragment(
                "sap.ui.elev8rerp.componentcontainer.fragmentview.Common.DeliveryToAddressDialog",
                this
            );
            this.getView().addDependent(this._valueHelpDialog);
            // }
            this._valueHelpDialog.open(sInputValue);
        },

        _handleDelToAddrSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var columns = ['partycode', 'partyname', 'contactperson'];
            var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
            }),
                false);  // false for OR condition
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        onDelToAddrDialogClose: function (oEvent) {
            var currentContext = this;
            var aContexts = oEvent.getParameter("selectedContexts");

            if (aContexts != undefined) {
                var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
                var oModel = currentContext.getView().getModel("salesdeliveryModel");

                var addrs = selRow[0].address;
                addrs += selRow[0].cityname != null ? " " + selRow[0].cityname : "";
                addrs += selRow[0].statename != null ? " " + selRow[0].statename : "";
                addrs += selRow[0].countryname != null ? " " + selRow[0].countryname : "";
                addrs += selRow[0].pincode != null ? " " + selRow[0].pincode : "";

                oModel.oData.deliverytoaddress = addrs;
                oModel.oData.deliverytoaddressid = selRow[0].id;
                oModel.oData.deliverytostatecode = selRow[0].statecode;
                oModel.oData.deliverytoisunionterritory = selRow[0].isunionterritory;
                oModel.refresh();

                this.getView().byId("txtshiptoaddress").setValueState(sap.ui.core.ValueState.None)
            }
        },



        onAddSalesDelivery: function (sChannel, sEvent, oData) {
            var jsonStr = oData.data;
            var oModel = this.getView().getModel("tblModel");
            var pModel = this.getView().getModel("salesdeliveryModel")
            pModel.oData.navigation = "Navigation";
            pModel.refresh();
            console.log("pModel",pModel);
            if (jsonStr["index"] == null) { //add new shed pen
                // push new record in object
                jsonStr["rowstatus"] = "New";
                if(oModel.oData.modelData.length){
                    for (var i = 0; i < oModel.oData.modelData.length; i++) {

                        if (oModel.oData.modelData[i].itemid == oData.data.itemid && jsonStr["rowstatus"] == "New") {
                            var saveMsg = "Item is already exist please update existing item";
                            MessageBox.error(saveMsg);
                        }else{
                            oModel.oData.modelData.push(jsonStr);
                        }
                    }
                }else
                    oModel.oData.modelData.push(jsonStr);
            }
            if (jsonStr["index"] != null) { //update existing shed pen
                var tableData = oModel.getData();

                // Replace the record in the array
                jsonStr["rowstatus"] = "Edited";
                tableData.modelData.splice(jsonStr["index"], 1, jsonStr);

            }
            this.getView().byId("btnSave").setEnabled(true);
            oModel.refresh();

            //this.itemTotal();

        },

        itemTotal: function () {
            var childModel = this.getView().getModel("tblModel").oData.modelData;
            var parentModel = this.getView().getModel("salesdeliveryModel");

            parentModel.oData.hasDiscount = false;

            var itemtotal = 0, cgsttotal = 0, sgsttotal = 0, igsttotal = 0, utgsttotal = 0, vattotal = 0;

            for (var i = 0; i < childModel.length; i++) {
                itemtotal += childModel[i].linetotal;

                if (!isNaN(childModel[i].cgstamount)) cgsttotal += childModel[i].cgstamount
                if (!isNaN(childModel[i].sgstamount)) sgsttotal += childModel[i].sgstamount
                if (!isNaN(childModel[i].igstamount)) igsttotal += childModel[i].igstamount
                if (!isNaN(childModel[i].utgstamount)) utgsttotal += childModel[i].utgstamount
                if (!isNaN(childModel[i].vatamount)) vattotal += childModel[i].vatamount

                if (childModel[i].itemdiscount != null && childModel[i].itemdiscount != "") {
                    if (parseFloat(childModel[i].itemdiscount) > 0) {
                        parentModel.oData.hasDiscount = true;
                    }
                }
            }

            parentModel.oData.itemtotal = parseFloat(itemtotal).toFixed(2);

            parentModel.oData.cgsttotal = cgsttotal;
            parentModel.oData.sgsttotal = sgsttotal;
            parentModel.oData.igsttotal = igsttotal;
            parentModel.oData.utgsttotal = utgsttotal;
            parentModel.oData.vattotal = vattotal;

            parentModel.oData.taxtotal = parseFloat(cgsttotal + sgsttotal + igsttotal + utgsttotal + vattotal).toFixed(2);

            parentModel.refresh();
            this.subTotal();
        },

        onCalcChange: function (oEvent) {

            this.itemTotal();
        },

        subTotal: function () {
            var parentModel = this.getView().getModel("salesdeliveryModel");
            var discAmtFormat = 0;
            if (parentModel.oData.hasDiscount) {
                parentModel.oData.discountpercent = 0;
                parentModel.oData.discount = 0;
                this.getView().byId("txtDiscountPercent").setEnabled(false);
                this.getView().byId("txtDiscount").setEnabled(false);
            }
            else {
                this.getView().byId("txtDiscount").setEnabled(true);
                this.getView().byId("txtDiscountPercent").setEnabled(true);

                var discPercent = parentModel.oData.discountpercent;
                var discAmt = 0;

                if (!isNaN(discPercent)) {
                    discAmt = (parentModel.oData.itemtotal * discPercent / 100);
                    discAmtFormat = discAmt.toFixed(2);
                    parentModel.oData.discount = discAmt.toFixed(2);
                }
            }

            //this.getView().byId("txtDiscount").setValue(discAmtFormat);

            var basicitemTotal = parentModel.oData.itemtotal;
            //var discount = this.getView().byId("txtDiscount").getValue();

            var DiscountCal = basicitemTotal - parseFloat(discAmtFormat);

            parentModel.oData.dicountwithitemTot = parseFloat(DiscountCal).toFixed(2);

            if (!isNaN(parentModel.oData.roundoff)) {
                parentModel.oData.dicountwithitemTot += parentModel.oData.roundoff;
            }

            var grandTotalWithDis = basicitemTotal - parseFloat(DiscountCal).toFixed(2);;
            parentModel.oData.grandtotal = parseFloat(parentModel.oData.dicountwithitemTot).toFixed(2);
            parentModel.refresh();
        },

        validateMaster: function () {

            var isValid = true;

            if (!commonFunction.isRequired(this, "txtbilltoaddress", "Bill to address is required."))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtshiptoaddress", "Delivery to address is required."))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtSalesDeliveryDate", "Sales delivery date is required."))
                isValid = false;

            return isValid;
        },

        validateForm: function () {
            var isValid = true;

            isValid = this.validateMaster();

            if (isValid) {
                var Model = this.getView().getModel("tblModel");
            }


            return isValid;
        },


        onListItemPress: function (oEvent) {

            var currentContext = this;
            var Model = oEvent.getSource().getBindingContext("tblModel");
            var spath = Model.sPath.split("/");
            var rowIndex = spath[spath.length - 1];
            var sdModel = this.getView().getModel("salesdeliveryModel");
            console.log("sdModel",sdModel);

            var Model = {
                id: Model.getProperty("id") ? Model.getProperty("id") : null,
                salesorderdetailid: Model.getProperty("salesorderdetailid"),
                itemid: Model.getProperty("itemid"),
                itemname: Model.getProperty("itemname"),
                itemcode: Model.getProperty("itemcode"),
                locationid: Model.getProperty("locationid"),
                locationname: Model.getProperty("locationname"),
                warehousebinid: Model.getProperty("warehousebinid"),
                warehouseid:sdModel.oData.warehouseid,
                towarehousecode: Model.getProperty("towarehousecode"),
                towarehousename: Model.getProperty("towarehousename"),
                towarehousebincode: Model.getProperty("towarehousebincode"),
                towarehousebinname: Model.getProperty("towarehousebinname"),
                isbird: Model.getProperty("isbird"),
                weight: Model.getProperty("weight"),
                quantity: Model.getProperty("quantity"),
                deliveryweight: Model.getProperty("deliveryweight"),
                deliveryquantity: Model.getProperty("deliveryquantity"),
                itemunitid: Model.getProperty("itemunitid"),
                rate: Model.getProperty("rate"),
                navigation: Model.getProperty("navigation"),
                index: rowIndex,
                taxid : Model.getProperty("taxid"),
                taxpercent : Model.getProperty("taxpercent"),
                taxcategoryid : Model.getProperty("taxcategoryid"),
                cgstid : Model.getProperty("cgstid"),
                cgstpercent : Model.getProperty("cgstpercent"),
                cgstamount : Model.getProperty("cgstamount"),
                sgstid : Model.getProperty("sgstid"),
                sgstpercent : Model.getProperty("sgstpercent"),
                sgstamount : Model.getProperty("sgstamount"),
                igstid : Model.getProperty("igstid"),
                igstpercent : Model.getProperty("igstpercent"),
                igstamount : Model.getProperty("igstamount"),
                utgstid : Model.getProperty("utgstid"),
                utgstpercent : Model.getProperty("utgstpercent"),
                utgstamount : Model.getProperty("utgstamount"),
                vatid : Model.getProperty("vatid"),
                vatpercent : Model.getProperty("vatpercent"),
                vatamount : Model.getProperty("vatamount"),

                discount : Model.getProperty("discount"),
                linetotal : parseFloat(Model.getProperty("linetotal"))
            };

            this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("salesdelivery", "setDetailPage", { viewName: "SalesDeliveryDetail", viewModel: Model });
        },

        clearData: function () {
            var parentModel = this.getView().getModel("salesdeliveryModel");
            parentModel.oData = {};
            parentModel.refresh();
            var childModel = this.getView().getModel("tblModel");
            childModel.oData.modelData = [];
            childModel.refresh();

            this.getView().byId("txtSalesDeliveryDate").setValue(commonFunction.setTodaysDate(new Date()));

            this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---salesdelivery--fclBreederSalesDelivery");
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
        },
		
		onClose : function(){
            var parentModel = this.getView().getModel("salesdeliveryModel");
            parentModel.oData.statusid = 1624;
            parentModel.refresh();

            this.onSave();

            this.getView().byId("btnSave").setEnabled(false);

            this.clearData();
        },

        onSave: function () {

            var currentContext = this;
            if (this.validateForm()) {
                var parentModel = this.getView().getModel("salesdeliveryModel").oData;
                var childModel = this.getView().getModel("tblModel").oData.modelData;
                parentModel["salesdeliveryno"] = this.getView().byId('txtSalesDeliveryNo').getValue();

                if (parentModel.deliverydate != null)
                    parentModel["deliverydate"] = commonFunction.getDate(parentModel.deliverydate);

                parentModel["companyid"] = commonService.session("companyId");
                parentModel["userid"] = commonService.session("userId");

                salesdeliveryService.saveSalesDelivery(parentModel, function (data) {
                    if (data.id > 0) {
                        var salesdeliveryid = data.id;
			            var cnt = 0;
                        for (var i = 0; i < childModel.length; i++) {
                            if(childModel[i]["deliveryquantity"] > 0){
                                childModel[i]["salesdeliveryid"] = salesdeliveryid;
                                childModel[i]["companyid"] = commonService.session("companyId");
                                childModel[i]["userid"] = commonService.session("userId");
                                salesdeliveryService.saveSalesDeliveryDetail(childModel[i], function (data) {
                                    if (childModel.length == i) {
                                        MessageToast.show("Sales delivery submitted!");
                                        currentContext.clearData();
                                        currentContext.getAllSalesDelivery();
                                    }
                                })
                            }
                        }
                        if (salesdeliveryid > 0 && parentModel["statusid"] == 1622) {
                            cnt++;
                            salesdeliveryService.salesDeliveryIssueItems({ salesdeliveryid : salesdeliveryid }, function (data) {
                            });

                            salesdeliveryService.saveSalesDeliveryJE({ salesdeliveryid : salesdeliveryid }, function (data) {
                            });
                        }

                    }
                });

                //this.resetModel();
                this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
            }
        },

        resourceBundle: function () {
			var oBundle = this.getModel("i18n").getResourceBundle()
			return oBundle
		},

        onDelete: function () {
			var deleteMsg = this.resourceBundle().getText("deleteMsg");
			var OKText = this.resourceBundle().getText("OKText");
			var deleteMaTrePo = this.resourceBundle().getText("MaterialReceiptFromPOMsgDelete");

			var parentModel = this.getView().getModel("salesdeliveryModel").oData;
			if (parentModel.id != null) {
				MessageBox.confirm(
					deleteMsg, {
					styleClass: "sapUiSizeCompact",
					onClose: function (sAction) {
						if (sAction == OKText) {
							salesdeliveryService.deleteSalesDelivery({id : parentModel.id}, function (data) {
								if(data[0][0].result == "Deleted"){
                                    MessageBox.error(deleteMaTrePo);
                                }
							});
						}
					}
				}
				);
			}
		},

        resetModel: function () {
            var parentModel = this.getView().getModel("salesdeliveryModel");
            parentModel.oData = {};
            parentModel.refresh();
            var childModel = this.getView().getModel("tblModel");
            childModel.oData.modelData = [];
            childModel.refresh();
        },


        onExit: function () {
            if (this._oDialog) {
                this._oDialog.destroy();
            }
        },

        checkPriorToAddEdit: function () {

            if (!commonFunction.isRequired(this, "txtVendor", "Customer selection is required."))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtSalesDeliveryDate", "Sales order date is required."))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtItemtotal", "Item total is required."))
                isValid = false;

            if (!commonFunction.isPercentage(this, "txtTaxPercent", ItemTaxMsg))
                isValid = false;
        },

        onAddNewContent: function () {
            var salesdeliveryModel = this.getView().getModel("salesdeliveryModel");

            var dataModel = {
                deliverywithoutso : salesdeliveryModel.oData.deliverywithoutso,
                isgstinvoice: this.getView().byId("selGSTInvType").getSelectedKey(),
                deliverytostatecode: salesdeliveryModel.oData.deliverytostatecode,
                deliverytoisunionterritory: salesdeliveryModel.oData.deliverytoisunionterritory,
                warehousestatecode: salesdeliveryModel.oData.warehousestatecode,
                billtoisunionterritory: salesdeliveryModel.oData.billtoisunionterritory,
                warehouseid : salesdeliveryModel.oData.warehouseid,
                batchid : null,
                salestypeid : this.getView().byId("salestype").getSelectedKey(),
                quantity : 0,
                index : null
            };


            this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("salesdelivery", "setDetailPage", { viewName: "SalesDeliveryDetail", viewModel: dataModel });
        },

        setDetailPage: function (channel, event, data) {
            this.detailView = sap.ui.view({
                viewName: "sap.ui.elev8rerp.componentcontainer.view.Sales.BreederSales." + data.viewName,
                type: "XML"
            });

            this.detailView.setModel(data.viewModel, "viewModel");
            this.oFlexibleColumnLayout.removeAllMidColumnPages();
            this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
        },

        onListIconPress: function (oEvent) {
            if (!this._oDialog) {
                this._oDialog = sap.ui.xmlfragment("sap.ui.elev8rerp.componentcontainer.fragmentview.Sales.BreederSales.SalesDeliveryDialog", this);
            }

            // Multi-select if required
            var bMultiSelect = !!oEvent.getSource().data("multi");
            this._oDialog.setMultiSelect(bMultiSelect);

            // Remember selections if required
            var bRemember = !!oEvent.getSource().data("remember");
            this._oDialog.setRememberSelections(bRemember);

            this.getView().addDependent(this._oDialog);

            // toggle compact style
            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
            this._oDialog.open();
        },

        handleSalesDeliverySearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var columns = ['customer', 'name', 'postingDate', 'deliveryDate', 'documentDate'];
            var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
            }),
                false);  // false for OR condition
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },


        handleSalesDeliveryClose: function (oEvent) {
            var currentContext = this;
            var aContexts = oEvent.getParameter("selectedContexts");

            if (aContexts != undefined) {
                var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });

                salesdeliveryService.getSalesDelivery({ id: selRow[0].id }, function (data) {

                    // Sales order data
                    var oModel = currentContext.getView().getModel("salesdeliveryModel");
                    oModel.oData = data[0][0];
                    oModel.oData.navigation = oModel.oData.statusid == 1361 ? 'Navigation' : 'Inactive';
                    oModel.oData.itemtotal = oModel.oData.subtotal;
                    oModel.refresh();

                    var invoicestatusid = oModel.oData.statusid;

                    commonFunction.getPartyAddress(oModel.oData.customerid, 1402, "billtoaddressList", currentContext);
                    commonFunction.getPartyAddress(oModel.oData.customerid, 1404, "deliverytoaddressList", currentContext);

                    // Update current series with existing series number
                    var seriesModel = currentContext.getView().getModel("docSeriesModel");
                    seriesModel.oData.newseries = data[0][0].salesdeliveryno;
                    seriesModel.refresh();

                    salesdeliveryService.getAllSalesDeliveryDetail({ salesdeliveryid: oModel.oData.id }, function (data) {
                        var cModel = currentContext.getView().getModel("tblModel");
                        for (var i = 0; i < data[0].length; i++) {
                            if (invoicestatusid == 1361)
                                data[0][i].navigation = data[0][i].quantity > 0 ? 'Navigation' : 'Inactive';
                        }
                        cModel.oData.modelData = data[0];
                        cModel.refresh();
                        //currentContext.itemTotal();
                    });
                });
            }
        },

        handleSelectVedorList: function (oEvent) {
            var sInputValue = oEvent.getSource().getValue();

            this.inputId = oEvent.getSource().getId();
            // create value help dialog
            // if (!this._valueHelpDialog) {
            this._valueHelpDialog = sap.ui.xmlfragment(
                "sap.ui.elev8rerp.componentcontainer.fragmentview.Common.vendorDialog",
                this
            );
            this.getView().addDependent(this._valueHelpDialog);
            // }
            this._valueHelpDialog.open(sInputValue);

        },

        _handleVendorSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var columns = ['partycode', 'partyname', 'contactperson'];
            var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
            }),
                false);  // false for OR condition
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        onVendorDialogClose: function (oEvent) {
            var currentContext = this;
            var aContexts = oEvent.getParameter("selectedContexts");

            if (aContexts != undefined) {
                var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
                console.log(selRow[0]);
                var oModel = currentContext.getView().getModel("salesdeliveryModel");
                //update existing model to set supplier
                oModel.oData.customerid = selRow[0].id;
                oModel.oData.partyname = selRow[0].partyname;
                oModel.oData.partyoutstanding = selRow[0].partyoutstanding;
                oModel.refresh();
            
                // Billing To Address
                commonFunction.getPartyAddress(selRow[0].id, 1402, "billtoaddressList", this);
                // Delivery To Address
                commonFunction.getPartyAddress(selRow[0].id, 1404, "deliverytoaddressList", this);
                this.getView().byId("txtCustomer").setValueState(sap.ui.core.ValueState.None)
            }
        },

    });
}, true);
