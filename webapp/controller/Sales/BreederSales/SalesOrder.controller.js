sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/model/Filter',
    'sap/ui/elev8rerp/componentcontainer/services/Sales/SalesOrder.service',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',
], function (JSONModel, BaseController, MessageBox, MessageToast, Filter, salesorderService, commonFunction, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.BreederSales.SalesOrder", {

        onInit: function () {
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.subscribe("salesorder", "setDetailPage", this.setDetailPage, this);
            this.bus.subscribe("salesorder", "handleSalesOrderList", this.handleSalesOrderList, this);
            this.bus.subscribe("salesorder", "onAddSalesOrder", this.onAddSalesOrder, this);
            this.oFlexibleColumnLayout = this.byId("fclBreederSalesOrder");

            // set empty model to view		
            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "tblModel");

            var emptyModel = this.getModelDefault();

            var docSeriesModel = new JSONModel();
            docSeriesModel.setData(emptyModel);
            this.getView().setModel(docSeriesModel, "docSeriesModel");

            var model = new JSONModel();
            model.setData({});
            this.getView().setModel(model, "salesorderModel");

            commonFunction.getNewDocSeries("SO", this);
            // commonFunction.getWarehouseAddress(null, this);
            // commonFunction.getWarehouseAddress('721,725', this);

            commonFunction.getEmployeeList(1, this);

            this.getView().byId("txtItemtotal").setTextAlign(sap.ui.core.TextAlign.End);
            this.getView().byId("txtDiscount").setTextAlign(sap.ui.core.TextAlign.End);
            this.getView().byId("txtGrosstotal").setTextAlign(sap.ui.core.TextAlign.End);
            this.getView().byId("txtRoundTotal").setTextAlign(sap.ui.core.TextAlign.End);
            this.getView().byId("txtTotal").setTextAlign(sap.ui.core.TextAlign.End);
            this.getView().byId("txtTotalDiscount").setTextAlign(sap.ui.core.TextAlign.End);

            this.getView().byId("txtSalesOrderDate").setValue(commonFunction.setTodaysDate(new Date()));
            this.getView().byId("txtDeliveryDate").setValue(commonFunction.setTodaysDate(new Date()));

            this.getAllSalesOrder();
            this.handleRouteMatched(null);

            // var currRouteName = this.getOwnerComponent().getModel("applicationModel").getProperty("/routeName");
            // this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            // this._oRouter.getRoute(currRouteName).attachMatched(this.handleRouteMatched, this);
        },

        handleRouteMatched: function (evt) {

            // get customer List 
            // var partnerroleid = 32;
            // commonFunction.getAllVendor(this, partnerroleid);
            // commonFunction.getReference("SOSts", "SOStatusList", this);
            commonFunction.getReferenceFilter("SOSts", ['1361', '1362'], "SOStatusList", this);
            commonFunction.getReference("GSTInvTyp", "gstInvTypeList", this);

            commonFunction.getReference("ModName", "moduleList", this);
        },

        handleSalesOrderList: function(sChannel, sEvent, oData) {

            let _this = this;
            let selRow = oData.viewModel;
            if(selRow != null)  {

                commonFunction.getReference("ModName", "moduleModel", _this);

                let oVendors = ({
                    roleid: 31,
                    moduleid: parseInt(selRow.moduleid)
                });

                commonFunction.getPartyModulewise(oVendors, _this, "vendorModel");

                commonFunction.getPartyAddress(selRow.vendorid, 1403, "deliveryfromaddressList", _this);

                commonFunction.getWarehouseAddress(selRow.moduleid, _this);

                let oSalesOrderModel = _this.getView().getModel("salesorderModel");
                let oDocSeriesModel = _this.getView().getModel("docSeriesModel");
                
                oSalesOrderModel.setData(selRow);
                oSalesOrderModel.refresh();

                oDocSeriesModel.oData.newseries = selRow.salesorderno;
                oDocSeriesModel.refresh();

                if (selRow.action == "view") {
		    _this.getView().byId("btnSave").setEnabled(false);
		    _this.getView().byId("btnClose").setVisible(false);
                    selRow.navigation = 'Inactive';
		} else {
		    _this.getView().byId("btnSave").setEnabled(true);
		    _this.getView().byId("btnClose").setVisible(true);
                    selRow.navigation = selRow.statusid == 1361 ? 'Navigation' : 'Inactive';
		}
                salesorderService.getAllSalesOrderDetail({ salesorderid: selRow.id }, function (data) {
                    var cModel = _this.getView().getModel("tblModel");
                    cModel.oData.modelData = data[0];
                    cModel.refresh();

                    _this.itemTotal();
                    //_this.subTotal();
                });

            } else {
                _this.handleRouteMatched();
            }

        },

        getAllSalesOrder: function () {
            var currentContext = this;
            salesorderService.getAllSalesOrder(function (data) {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oModel, "salesorderList");
            });
        },

        moduleChange:function(){
            var moduleid = this.getView().byId("salesType").getSelectedKey();
            commonFunction.getWarehouseAddress(moduleid, this);
            var partdata = ({
                roleid: 32,
                moduleid: parseInt(moduleid)
            })
            commonFunction.getPartyModulewise(partdata, this, "vendorModel");
        },

        getModelDefault: function () {
            return {
                id: null,
                partycode: null,
                partyname: null,
                statusid: 521,
                salesorderdate: commonFunction.getDateFromDB(new Date()),
                deliverydate: commonFunction.getDateFromDB(new Date()),
                discount: 0,
                remark: null,
                checkState: true,
                shipfromwarehouseid: null,
                linetotal: 0,
                freequantitypercent: 0,
                salestypeid : null
            }
        },


        handleSelectVedorList: function (oEvent) {
            var sInputValue = oEvent.getSource().getValue();

            this.inputId = oEvent.getSource().getId();

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
                var oModel = currentContext.getView().getModel("salesorderModel");
                    
                //update existing model to set supplier
                oModel.oData.customerid = selRow[0].id;
                oModel.oData.partyname = selRow[0].partyname;
                console.log(oModel.oData.partyname);
                oModel.oData.partyoutstanding = selRow[0].partyoutstanding;
                oModel.oData.contactperson = selRow[0].contactperson;
                oModel.refresh();
                this.getView().byId("txtVendor").setValueState(sap.ui.core.ValueState.None)

                // Billing To Address
                commonFunction.getPartyAddress(selRow[0].id, 1402, "billtoaddressList", this);
                // Delivery To Address
                commonFunction.getPartyAddress(selRow[0].id, 1404, "deliverytoaddressList", this);
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
                var oModel = currentContext.getView().getModel("salesorderModel");

                var addrs = selRow[0].address;
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
                var oModel = currentContext.getView().getModel("salesorderModel");

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
                var oModel = currentContext.getView().getModel("salesorderModel");

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


        onAddSalesOrder: function (sChannel, sEvent, oData) {
            var jsonStr = oData.data;
            var oModel = this.getView().getModel("tblModel");
            var pModel = this.getView().getModel("salesorderModel")
            pModel.oData.navigation = "Navigation";
            pModel.refresh();
            if (jsonStr["index"] == null) { //add new shed pen
                // push new record in object
                jsonStr["rowstatus"] = "New";
                oModel.oData.modelData.push(jsonStr);

            }
            if (jsonStr["index"] != null) { //update existing shed pen
                var tableData = oModel.getData();

                // Replace the record in the array
                jsonStr["rowstatus"] = "Edited";
                tableData.modelData.splice(jsonStr["index"], 1, jsonStr);

            }
            this.getView().byId("btnSave").setEnabled(true);
            this.getView().byId("btnNewOrderItem").setEnabled(true);
            oModel.refresh();

            this.itemTotal();

        },

        itemTotal: function () {
            var childModel = this.getView().getModel("tblModel").oData.modelData;
            var parentModel = this.getView().getModel("salesorderModel");
            parentModel.oData.hasDiscount = false;

            var itemtotal = 0;
            let grosstotal = 0;

            for (var i = 0; i < childModel.length; i++) {

                childModel[i].linetotal = (!Number(childModel[i].linetotal) ? 0 : parseFloat(childModel[i].linetotal));
                itemtotal += childModel[i].linetotal;

                grosstotal += parseFloat(childModel[i].quantity)*parseFloat(childModel[i].unitprice);

            }

            parentModel.oData.grosstotal = grosstotal.toFixed(2);
            parentModel.oData.itemtotal = (itemtotal).toFixed(2);
            
            parentModel.refresh();

            if (!Number(parentModel.oData.roundoff))
                parentModel.oData.roundoff = 0;

            if (!Number(parentModel.oData.discount))
                parentModel.oData.discount = 0;
            
            var dscAmt = parseFloat(parentModel.oData.itemtotal) - ((parseFloat(parentModel.oData.itemtotal)*parseFloat(parentModel.oData.discount))/100);
            
            parentModel.oData.grandtotal = dscAmt;
            
            var orderDiscount = this.getView().byId("txtDiscountPercent").getValue();
            
            parentModel.refresh();
            this.subTotal();
        },

        onCalcChange: function (oEvent) {

            this.itemTotal();
        },

        onRoundOffChange : function(oEvent){
            var parentModel = this.getView().getModel("salesorderModel");
            if(Number(parentModel.oData.roundoff)){
                var rndOffval = parentModel.oData.roundoff;
                var roundOffCalc = parseFloat(parseFloat(parentModel.oData.grandtotal) + parseFloat(rndOffval)).toFixed(2);
                parentModel.oData.grandtotal = roundOffCalc;
                parentModel.refresh();
            }else{
                parentModel.oData.roundoff = 0;
                parentModel.refresh();
            }
        },

        subTotal: function () {
            //debugger;
            var parentModel = this.getView().getModel("salesorderModel");
            parentModel.oData.discountedamount = (parseFloat(parentModel.oData.grosstotal) - parseFloat(parentModel.oData.itemtotal)).toFixed(2);  
            parentModel.refresh();
            

            var discAmtFormat = 0;
            this.getView().byId("txtDiscount").setEnabled(true);
            this.getView().byId("txtDiscountPercent").setEnabled(true);

            var discPercent = (isNaN(parentModel.oData.discountpercent) ? 0 : parseFloat(parentModel.oData.discountpercent));
            var discAmt = 0;

            if (Number(discPercent)) {
                discAmt = (parentModel.oData.itemtotal * discPercent / 100);
                discAmtFormat = discAmt.toFixed(2);
                parentModel.oData.discount = discAmt.toFixed(2);
                parentModel.oData.discountedamount = (parseFloat(parentModel.oData.discountedamount) + parseFloat(discAmt)).toFixed(2);
            }
            else {
                discAmtFormat = 0;
                parentModel.oData.discount = 0;
            }
            

            //this.getView().byId("txtDiscount").setValue(discAmtFormat);

            var basicitemTotal = parseFloat(parentModel.oData.itemtotal);
            //var discount = this.getView().byId("txtDiscount").getValue();

            var DiscountCal = parseFloat(basicitemTotal) - parseFloat(discAmtFormat);

            parentModel.oData.dicountwithitemTot = (DiscountCal + parseFloat(parentModel.oData.roundoff));

            parentModel.oData.grandtotal = parseFloat(parentModel.oData.dicountwithitemTot).toFixed(2);
            parentModel.refresh();
        },

        validateMaster: function () {

            var isValid = true;

            if (!commonFunction.isRequired(this, "txtVendor", "Customer selection is required."))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtbilltoaddress", "Bill to address is required."))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtshiptoaddress", "Delivery to address is required."))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtWarehouseAddress", "Delivery from warehouse is required."))
                isValid = false;

            if (!commonFunction.isSelectRequired(this, "selGSTInvType", "Transaction type is required."))
                isValid = false;

            if (!commonFunction.isSelectRequired(this, "selSOStatus", "Sales order status is required."))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtSalesOrderDate", "Sales order date is required."))
                isValid = false;
                
            if (!commonFunction.isRequired(this, "txtCustomerRefNo", "Refrence number is required."))
                isValid = false;

                if (isValid) {
                    if (!commonFunction.isNumber(this, "txtCustomerRefNo"))
                        isValid = false;
                }
                

            if (isValid) {

                var salesorderModel = this.getView().getModel("salesorderModel");
                var dataModel = {
                    deliverytostatecode: salesorderModel.oData.deliverytostatecode,
                    warehousestatecode: salesorderModel.oData.warehousestatecode,
                };

                if (dataModel.deliverytostatecode == null || dataModel.warehousestatecode == null) {
                    MessageBox.error("Please select Delivery address and Warehouse address with valid state code!");
                    isValid = false;
                }
            }

            return isValid;
        },

        validateForm: function () {
            var isValid = true;

            isValid = this.validateMaster();

            if (!commonFunction.isRequired(this, "txtItemtotal", "Item total is required."))
                isValid = false;

            return isValid;
        },


        onListItemPress: function (oEvent) {
            
            var currentContext = this;
            var Model = oEvent.getSource().getBindingContext("tblModel");
            var spath = Model.sPath.split("/");
            var rowIndex = spath[spath.length - 1];
            var Model = {
                id: Model.getProperty("id") ? Model.getProperty("id") : null,
                itemgroupid: Model.getProperty("itemgroupid"),
                groupname: Model.getProperty("groupname"),
                itemid: Model.getProperty("itemid"),
                itemname: Model.getProperty("itemname"),
                itemcode: Model.getProperty("itemcode"),
                itembatch: Model.getProperty("itembatch"),
                taxcategoryid: Model.getProperty("taxcategoryid"),
                taxcategoryname: Model.getProperty("taxcategoryname"),
                isgstinvoice: this.getView().byId("selGSTInvType").getSelectedKey(),
                deliverytostatecode: Model.getProperty("deliverytostatecode"),
                deliverytoisunionterritory: Model.getProperty("deliverytoisunionterritory"),
                warehousestatecode: Model.getProperty("warehousestatecode"),
                billtoisunionterritory: Model.getProperty("billtoisunionterritory"),
                utgstid: Model.getProperty("utgstid"),
                utgstpercent: Model.getProperty("utgstpercent"),
                utgstamount: Model.getProperty("utgstamount"),
                cgstid: Model.getProperty("cgstid"),
                cgstpercent: Model.getProperty("cgstpercent"),
                cgstamount: Model.getProperty("cgstamount"),
                sgstid: Model.getProperty("sgstid"),
                sgstpercent: Model.getProperty("sgstpercent"),
                sgstamount: Model.getProperty("sgstamount"),
                igstid: Model.getProperty("igstid"),
                igstpercent: Model.getProperty("igstpercent"),
                igstamount: Model.getProperty("igstamount"),
		vatid: Model.getProperty("vatid"),
                vatpercent: Model.getProperty("vatpercent"),
                vatamount: Model.getProperty("vatamount"),
                unitprice: Model.getProperty("unitprice"),
                isbird: Model.getProperty("isbird"),
                avgweight: Model.getProperty("avgweight"),
                weight: Model.getProperty("weight"),
                iscalcweight: Model.getProperty("iscalcweight"),
                quantity: Model.getProperty("quantity"),
                linetotal: Model.getProperty("linetotal"),
                discount: Model.getProperty("discount"),
                taxid: Model.getProperty("taxid"),
                taxpercent: Model.getProperty("taxpercent"),
                taxcode: Model.getProperty("taxcode"),
                index: rowIndex,
                salestypeid:this.getView().byId("salesType").getSelectedKey()


            };
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("salesorder", "setDetailPage", { viewName: "SalesOrderDetail", viewModel: Model });
        },

        clearData: function () {
            var parentModel = this.getView().getModel("salesorderModel");
            parentModel.oData = {};
            parentModel.refresh();
            var childModel = this.getView().getModel("tblModel");
            childModel.oData.modelData = [];
            childModel.refresh();

            this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---breedersalesorder--fclBreederSalesOrder");
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);

            this.getView().byId("txtVendor").setValueState(sap.ui.core.ValueState.None);
            this.getView().byId("txtbilltoaddress").setValueState(sap.ui.core.ValueState.None);
            this.getView().byId("txtSalesOrderDate").setValueState(sap.ui.core.ValueState.None);
            this.getView().byId("txtDeliveryDate").setValueState(sap.ui.core.ValueState.None);
            this.getView().byId("txtshiptoaddress").setValueState(sap.ui.core.ValueState.None);
            this.getView().byId("txtWarehouseAddress").setValueState(sap.ui.core.ValueState.None);
        },
		
		onClose : function(){
            var parentModel = this.getView().getModel("salesorderModel");
            parentModel.oData.statusid = 1364;
            parentModel.refresh();

            this.onSave();

            this.getView().byId("btnSave").setEnabled(false);

            this.clearData();
        },

        onSave: function () {
            var currentContext = this;
            if (this.validateForm()) {
                var parentModel = this.getView().getModel("salesorderModel").oData;
                console.log(parentModel)
                var childModel = this.getView().getModel("tblModel").oData.modelData;

                // parentModel["salestypeid"] = 721;
                parentModel["subject"] = null;
                //parentModel["salespersonid"] = 1;
                parentModel["salesorderno"] = this.getView().byId('txtSalesOrderNo').getValue();
                if (parentModel.salesorderdate != null)
                    parentModel["salesorderdate"] = commonFunction.getDate(parentModel.salesorderdate);
                if (parentModel.deliverydate != null)
                    parentModel["deliverydate"] = commonFunction.getDate(parentModel.deliverydate);
                if (parentModel.referencedate != null)
                    parentModel["referencedate"] = commonFunction.getDate(parentModel.referencedate);

                parentModel["companyid"] = commonService.session("companyId");
                parentModel["userid"] = commonService.session("userId");
                salesorderService.saveSalesOrder(parentModel, function (data) {
                    if (data.id > 0) {
                        var salesorderid = data.id;
                        for (var i = 0; i < childModel.length; i++) {

                            childModel[i]["salesorderid"] = salesorderid;
                            childModel[i]["isbird"] = childModel[i]["isbird"] ? 1 : 0;
                            childModel[i]["companyid"] = commonService.session("companyId");
                            childModel[i]["userid"] = commonService.session("userId");

                            salesorderService.saveSalesOrderDetail(childModel[i], function (data) {
                                if (childModel.length == i) {
                                    MessageToast.show("Sales order detail submitted");
                                    currentContext.clearData();
                                    currentContext.getAllSalesOrder();
                                }
                            })
                        }
                    }

                });




                //this.resetModel();
                this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
            }
        },



        onExit: function () {
            if (this._oDialog) {
                this._oDialog.destroy();
            }
        },

        checkPriorToAddEdit: function () {

            if (!commonFunction.isRequired(this, "txtVendor", "Customer selection is required."))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtSalesOrderDate", "Sales order date is required."))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtItemtotal", "Item total is required."))
                isValid = false;

            if (!commonFunction.isPercentage(this, "txtTaxPercent", ItemTaxMsg))
                isValid = false;

        },


        onAddNewContent: function () {
            if (this.validateMaster()) {

                var salesorderModel = this.getView().getModel("salesorderModel");

                var dataModel = {
                    salestypeid :salesorderModel.oData.salestypeid,
                    isgstinvoice: this.getView().byId("selGSTInvType").getSelectedKey(),
                    deliverytostatecode: salesorderModel.oData.deliverytostatecode,
                    deliverytoisunionterritory: salesorderModel.oData.deliverytoisunionterritory,
                    warehousestatecode: salesorderModel.oData.warehousestatecode,
                    billtoisunionterritory: salesorderModel.oData.billtoisunionterritory
                };

                this.bus = sap.ui.getCore().getEventBus();
                this.bus.publish("salesorder", "setDetailPage", { viewName: "SalesOrderDetail", viewModel: dataModel });
            }
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
                this._oDialog = sap.ui.xmlfragment("sap.ui.elev8rerp.componentcontainer.fragmentview.Sales.BreederSales.SalesOrderDialog", this);
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

        handleSalesOrderSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var columns = ['customer', 'name', 'postingDate', 'deliveryDate', 'documentDate'];
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
				if(commonService.session("roleIds") == "1" || commonService.session("roleIds") == "10"){
                    // commonFunction.getReferenceFilter("SOSts", ['1361', '1362', '1364'], "SOStatusList", this);
                    this.getView().byId("btnClose").setVisible(true);
                }else{
                    // commonFunction.getReferenceFilter("SOSts", ['1361', '1362'], "SOStatusList", this);
                    this.getView().byId("btnClose").setVisible(false);
                }
                var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });

                salesorderService.getSalesOrder({ id: selRow[0].id }, function (data) {

                    // Sales order data
                    var oModel = currentContext.getView().getModel("salesorderModel");
                    oModel.oData = data[0][0];
                    oModel.oData.navigation = oModel.oData.statusid == 1361 ? 'Navigation' : 'Inactive';
                    oModel.oData.itemtotal = oModel.oData.subtotal;
                    oModel.refresh();

                    currentContext.getView().byId("btnSave").setEnabled(oModel.oData.statusid == 1361 ? true : false);
                    currentContext.getView().byId("btnNewOrderItem").setEnabled(oModel.oData.statusid == 1361 ? true : false);

                    commonFunction.getPartyAddress(oModel.oData.customerid, 1402, "billtoaddressList", currentContext);
                    commonFunction.getPartyAddress(oModel.oData.customerid, 1404, "deliverytoaddressList", currentContext);

                    // Update current series with existing series number
                    var seriesModel = currentContext.getView().getModel("docSeriesModel");
                    seriesModel.oData.newseries = data[0][0].salesorderno;
                    seriesModel.refresh();

                    salesorderService.getAllSalesOrderDetail({ salesorderid: oModel.oData.id }, function (data) {
                        var cModel = currentContext.getView().getModel("tblModel");
                        cModel.oData.modelData = data[0];
                        cModel.refresh();

                        currentContext.itemTotal();
                    });


                });
            }
        },

        clearData: function () {
            var parentModel = this.getView().getModel("salesorderModel");
            parentModel.oData = {};
            parentModel.refresh();
            var childModel = this.getView().getModel("tblModel");
            childModel.oData.modelData = [];
            childModel.refresh();

            //commonFunction.getNewDocSeries("SO", this);

            this.getView().byId("btnSave").setEnabled(true);
            this.getView().byId("btnNewOrderItem").setEnabled(true);

            this.getView().byId("txtSalesOrderDate").setValue(commonFunction.setTodaysDate(new Date()));
            this.getView().byId("txtDeliveryDate").setValue(commonFunction.setTodaysDate(new Date()));
        },

    });
}, true);
