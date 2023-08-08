sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/model/Filter',
    'sap/ui/elev8rerp/componentcontainer/services/Sales/SalesInvoice.service',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',
    'sap/ui/elev8rerp/componentcontainer/services/Sales/SalesDelivery.service',
], function (JSONModel, BaseController, MessageBox, MessageToast, Filter, salesinvoiceService, commonFunction, commonService, salesdeliveryService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.BreederSales.SalesInvoice", {

        onInit: function () {
            
            this.currentContext = this;
            this.nettotalinwords = "";
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.subscribe("salesinvoice", "setDetailPage", this.setDetailPage, this);
            this.bus.subscribe("salesinvoice", "handleSalesInvoiceList", this.handleSalesInvoiceList, this);
            this.bus.subscribe("salesinvoice", "onAddSalesInvoice", this.onAddSalesInvoice, this);
            this.bus.subscribe("salesinvoice", "onAddSalesInvoiceFreight", this.onAddSalesInvoiceFreight, this);
            this.oFlexibleColumnLayout = this.byId("fclBreederSalesInvoice");
            // this.bus.subscribe("home", "redirectToPage", this.redirectToPage, this);

            var emptyModel = this.getModelDefault();

            // set empty model to view		
            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "tblModel");

            var docSeriesModel = new JSONModel();
            docSeriesModel.setData(emptyModel);
            this.getView().setModel(docSeriesModel, "docSeriesModel");

            // set empty model to view		
            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "tblfreightModel");

            var model = new JSONModel();
            model.setData({});
            this.getView().setModel(model, "salesinvoiceModel");

            commonFunction.getNewDocSeries("SI", this);
            commonFunction.getEmployeeList(1, this);
            commonFunction.getWarehouseAddress(null, this);

            this.getView().byId("txtItemtotal").setTextAlign(sap.ui.core.TextAlign.End);
            this.getView().byId("txtDiscount").setTextAlign(sap.ui.core.TextAlign.End);
            this.getView().byId("txtFreightAmt").setTextAlign(sap.ui.core.TextAlign.End);
            this.getView().byId("txtRoundTotal").setTextAlign(sap.ui.core.TextAlign.End);
            this.getView().byId("txtTotal").setTextAlign(sap.ui.core.TextAlign.End);
            this.getView().byId("txtGrosstotal").setTextAlign(sap.ui.core.TextAlign.End);
            this.getView().byId("txtTotalDiscount").setTextAlign(sap.ui.core.TextAlign.End);

            this.getAllSalesInvoice();
            
            this.handleRouteMatched();

            // var currRouteName = this.getOwnerComponent().getModel("applicationModel").getProperty("/routeName");
            // this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            // this._oRouter.getRoute(currRouteName).attachMatched(this.handleRouteMatched, this);
            
        },

        onBeforeRendering: function () {
            // this.bus.subscribe("home", "redirectToPage", this.redirectToPage, this);
        },
        
        handleRouteMatched: async function (evt) {

            let _this = this;

            // get customer List 
            var partnerroleid = 32;
            commonFunction.getAllVendor(_this, partnerroleid);
            commonFunction.getReference("SOSts", "SOStatusList", _this);
            commonFunction.getReference("GSTInvTyp", "gstInvTypeList", _this);

            commonFunction.getReference("ModName", "moduleList", _this);

            this.clearData();

            _this.getSalesOrderOnInvoice();

            _this.getView().byId("txtSalesInvoiceDate").setValue(commonFunction.setTodaysDate(new Date()));
            
        },

        handleSalesInvoiceList: async function(sChannel, sEvent, oData) {

            let _this = this;
            let selRow = oData.viewModel;

            console.log(selRow);
            
            await this.handleRouteMatched();

            if(selRow != null)  {

                commonFunction.getPartyAddress(selRow.customerid, 1402, "billtoaddressList", _this);
                commonFunction.getPartyAddress(selRow.customerid, 1404, "deliverytoaddressList", _this);

                let oSalesInvoicerModel = this.getView().getModel("salesinvoiceModel");
                
                let oDocSeriesModel = this.getView().getModel("docSeriesModel");
                console.log(oSalesInvoicerModel);
                oSalesInvoicerModel.setData(selRow);
                oSalesInvoicerModel.refresh();

                oDocSeriesModel.oData.newseries = selRow.salesinvoiceno;
                oDocSeriesModel.refresh();

                console.log("selRow.salesinvoiceno", selRow.salesinvoiceno);
                console.log("oDocSeriesModel", oDocSeriesModel);
                
                var salesdeliveryids = selRow.salesdeliveryids;

                salesinvoiceService.getSalesDeliveryByOrder({ salesorderid: selRow.salesorderid, salesinvoiceid: selRow.id }, function (data) {
                    console.log(data);
                    var oModel = new sap.ui.model.json.JSONModel();
                    oModel.setData({ modelData: data[0] });
                    _this.getView().setModel(oModel, "salesdeliveryList");
                });

                setTimeout(function () {
                    _this.getView().byId("cmbSalesDelivery").setSelectedKeys(salesdeliveryids.split(','));
                }, 800);

				if (selRow.action == "view") {
					_this.getView().byId("btnSave").setEnabled(false);
                    selRow.navigation = 'Inactive';
				} else {
                    _this.getView().byId("btnSave").setEnabled(true);
                    selRow.navigation = selRow.statusid == 1361 ? 'Navigation' : 'Inactive';
				}

                salesinvoiceService.getSalesInvoiceDetailByInvoice({ salesinvoiceid: selRow.id }, function (data) {
                    var cModel = _this.getView().getModel("tblModel");
                    cModel.oData.modelData = data[0];
                    cModel.refresh();

                    _this.itemTotal();

                    // Get freight details List
                    salesinvoiceService.getAllSalesInvoiceFreight({ salesinvoiceid: selRow.id }, function (data) {
                        var cModel = _this.getView().getModel("tblfreightModel");
                        if(data.length>0){
                        for (var i = 0; i < data[0].length; i++) {
                            data[0][i].linetotal = (data[0][i].amount
                                + (Number(data[0][i].cgstamount) ? data[0][i].cgstamount : 0)
                                + (Number(data[0][i].sgstamount) ? data[0][i].sgstamount : 0)
                                + (Number(data[0][i].igstamount) ? data[0][i].igstamount : 0)
                                + (Number(data[0][i].vatamount) ? data[0][i].vatamount : 0)                
                                + (Number(data[0][i].utgstamount) ? data[0][i].utgstamount : 0)).toFixed(2);

                        }
                        cModel.oData.modelData = data[0];
                        cModel.refresh();

                        _this.itemTotal();
                    }
                    });

                });

            } else {
                commonFunction.getNewDocSeries("SI", this);
            }

        },

        getAllCommonSetting : function(){
			var currentContext = this;
			commonService.getAllCommonSetting(function(data){
				if(data.length && data[0].length){
                    var oModel = currentContext.getView().getModel("salesinvoiceModel");
                    oModel.oData.salesinvoicewithoutdelivery = data[0][0].salesinvoicewithoutdelivery;
                    oModel.oData.salesinvoicewithoutso = data[0][0].salesinvoicewithoutso;
                    oModel.refresh();

                    if(data[0][0].salesinvoicewithoutdelivery && !data[0][0].salesinvoicewithoutso){
                        currentContext.getSalesOrderOnInvoice();
                        currentContext.getView().byId("salesDeliveryEle").setVisible(false);
                    }else if(!data[0][0].salesinvoicewithoutdelivery && !data[0][0].salesinvoicewithoutso){
                        currentContext.getSalesOrderOnInvoice();
                    }else if(data[0][0].salesinvoicewithoutdelivery && data[0][0].salesinvoicewithoutso){
                        currentContext.getView().byId("addBtn").setVisible(true);
                        currentContext.getView().byId("salesDeliveryEle").setVisible(false);
                        currentContext.getView().byId("salesOrderEle").setVisible(false);
                        currentContext.getView().byId("txtContactperson").setEnabled(true);
                    }
                }else{
                    MessageBox.error("Please fill common settings first.");
                }
			})
		},

        getSalesOrderOnInvoice: function () {
            var currentContext = this;
            salesinvoiceService.getSalesOrderOnInvoice(function (data) {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oModel, "salesorderList");
            });
        },

        getAllSalesInvoice: function () {
            var currentContext = this;
            salesinvoiceService.getAllSalesInvoice(function (data) {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oModel, "salesinvoiceList");
            });
        },

        getModelDefault: function () {
            return {
                id: null,
                partycode: null,
                partyname: null,
                statusid: "1361",
                salestypeid : 721,
                salesinvoicedate: commonFunction.getDateFromDB(new Date()),
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
                var oModel = currentContext.getView().getModel("salesinvoiceModel");

                //Blank previous selected Sales Delivery
                oModel.oData.salesdelids = "";
                this.getView().byId("cmbSalesDelivery").setSelectedKeys([]);

                var tblModel = this.getView().getModel("tblModel");
                tblModel.oData.modelData = [];
                tblModel.refresh();

                //update existing model to set supplier
                oModel.oData.salesorderid = selRow[0].id;
                oModel.oData.customerid = selRow[0].customerid;
                oModel.oData.partyname = selRow[0].partyname;
                oModel.oData.contactperson = selRow[0].contactperson;
                oModel.oData.referenceno = selRow[0].referenceno;
                oModel.oData.salestypeid = selRow[0].salestypeid;
                oModel.oData.deliverydate = selRow[0].deliverydate;
                oModel.oData.salesorderno = selRow[0].salesorderno;
                oModel.oData.salesorderdate = selRow[0].salesorderdate;
                oModel.oData.statecode = selRow[0].statecode;
                oModel.oData.statename = selRow[0].statename;
                oModel.oData.isunionterritory = selRow[0].isunionterritory;
                oModel.oData.deliverytoaddressid = selRow[0].deliverytoaddressid;
                oModel.oData.deliverytoaddress = selRow[0].deliverytoaddress;
                oModel.oData.billtoaddressid = selRow[0].billtoaddressid;
                oModel.oData.billtoaddress = selRow[0].billtoaddress;
                oModel.oData.warehouseid = selRow[0].warehouseid;
                oModel.oData.warehouseaddress = selRow[0].warehouseaddress;
                oModel.oData.transactiontypeid = selRow[0].transactiontypeid;

                oModel.refresh();

                // Billing To Address
                commonFunction.getPartyAddress(selRow[0].customerid, 1402, "billtoaddressList", this);
                // Delivery To Address
                commonFunction.getPartyAddress(selRow[0].customerid, 1404, "deliverytoaddressList", this);

                this.getView().byId("cmbSalesDelivery").setValueState(sap.ui.core.ValueState.None);
                //this.getView().byId("cmbSalesDelivery").setSelectedKey('');
                this.getView().byId("cmbSalesDelivery").setEnabled(true);

                if(!oModel.oData.salesinvoicewithoutdelivery){
                    salesinvoiceService.getSalesDeliveryByOrder({ salesorderid: oModel.oData.salesorderid, salesinvoiceid: null }, function (data) {
                        var oModel = new sap.ui.model.json.JSONModel();
                        oModel.setData({ modelData: data[0] });
                        currentContext.getView().setModel(oModel, "salesdeliveryList");
                    });
                }

                this.itemTotal();


                if(oModel.oData.salesinvoicewithoutdelivery && !oModel.oData.salesinvoicewithoutso){
                    salesdeliveryService.getCalculatedSalesOrderDetail({ salesorderid: oModel.oData.salesorderid }, function (data) {
                        var cModel = currentContext.getView().getModel("tblModel");
                        for (var i = 0; i < data[0].length; i++) {
                            data[0][i].navigation = data[0][i].quantity > 0 ? 'Navigation' : 'Inactive';
                        }
                        cModel.oData.modelData = data[0];
                        cModel.refresh();
                    });
                }
            }
        },

        validateMaster: function () {

            var isValid = true;

            if (!commonFunction.isRequired(this, "txtCustomer", "Customer selection is required."))
                isValid = false;

            // give alert message if total exceeds partyoutstanding
            let invoiceTotal = this.getView().byId("txtTotal").getValue();
            let partyOutstanding = this.getView().byId("txtPartyOutstanding").getValue();
            if(parseFloat(invoiceTotal) > parseFloat(partyOutstanding))
            {
                MessageBox.error("Invoice amount exceeds your credit limits.");
                isValid = false;
            }
            else{
                isValid = true;
            }

            //
            if (!commonFunction.isRequired(this, "txtbilltoaddress", "Bill to address is required."))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtshiptoaddress", "Delivery to address is required."))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtWarehouseAddress", "Delivery from warehouse is required."))
                isValid = false;

            if (!commonFunction.isSelectRequired(this, "selGSTInvType", "Transaction type is required."))
                isValid = false;

            if (!commonFunction.isSelectRequired(this, "status", "Sales order status is required."))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtSalesInvoiceDate", "Sales order date is required."))
                isValid = false;
                

            if (isValid) {

                var salesinvoiceModel = this.getView().getModel("salesinvoiceModel");
                var dataModel = {
                    deliverytostatecode: salesinvoiceModel.oData.deliverytostatecode,
                    warehousestatecode: salesinvoiceModel.oData.warehousestatecode,
                };

                if (dataModel.deliverytostatecode == null || dataModel.warehousestatecode == null) {
                    MessageBox.error("Please select Delivery address and Warehouse address with valid state code!");
                    isValid = false;
                }
            }

            return isValid;
        },

        onAddNewContent: function () {
            var salesinvoiceModel = this.getView().getModel("salesinvoiceModel");
            if (this.validateMaster()) {
                var dataModel = {
                    salesinvoicewithoutso : salesinvoiceModel.oData.salesinvoicewithoutso,
                    salesinvoicewithoutdelivery : salesinvoiceModel.oData.salesinvoicewithoutdelivery,
                    isgstinvoice: this.getView().byId("selGSTInvType").getSelectedKey(),
                    deliverytostatecode: salesinvoiceModel.oData.deliverytostatecode,
                    deliverytoisunionterritory: salesinvoiceModel.oData.deliverytoisunionterritory,
                    warehousestatecode: salesinvoiceModel.oData.warehousestatecode,
                    billtoisunionterritory: salesinvoiceModel.oData.billtoisunionterritory,
                    warehouseid : salesinvoiceModel.oData.warehouseid,
                    batchid : null,
                    quantity : 0
                };

                this.bus = sap.ui.getCore().getEventBus();
                this.bus.publish("salesinvoice", "setDetailPage", { viewName: "SalesInvoiceDetail", viewModel: dataModel });
            }
        },
        
        onPartyRoleSelectionChange: function (oEvent) {

            var changedItem = oEvent.getParameter("changedItem");
            var isSelected = oEvent.getParameter("selected");
            var changedItemKey = changedItem.mProperties.key;

            if (changedItemKey == 31 && isSelected) //supplier
                this.getView().byId("frmElementSupplierLedger").setVisible(true);
            else if (changedItemKey == 31 && isSelected == false)
                this.getView().byId("frmElementSupplierLedger").setVisible(false);

            if (changedItemKey == 32 && isSelected) //customer
                this.getView().byId("frmElementCustomerLedger").setVisible(true);
            else if (changedItemKey == 32 && isSelected == false)
                this.getView().byId("frmElementCustomerLedger").setVisible(false);
        },

        SalesDeliveryChange: function (oEvent) {

            var currentContext = this;
            var selectedItems = oEvent.getParameter("selectedItems");
            var salesdeliveryids = "";
            if (selectedItems.length > 0) {
                for (var i = 0; i < selectedItems.length; i++) {
                    var salesdeliveryid = selectedItems[i].getKey();
                    salesdeliveryids += salesdeliveryid;
                    if (i != selectedItems.length - 1) {
                        salesdeliveryids += ",";
                    }
                }

                var oModel = this.getView().getModel("salesinvoiceModel");
                oModel.oData.salesdelids = salesdeliveryids;
                oModel.refresh();
                this.getView().byId("cmbSalesDelivery").setValueState(sap.ui.core.ValueState.None)

                var oModel = this.getView().getModel("salesinvoiceModel");
                var invoiceStateCode = oModel.oData.statecode;
                var invoiceIsUT = oModel.oData.isunionterritory;
               
                // Get Order-Delivery item List
            
                salesinvoiceService.getdeliverydetailsearchByOrder({ salesdeliveryids: salesdeliveryids, salesorderid: oModel.oData.salesorderid }, function (data) {
                    var oModel = new sap.ui.model.json.JSONModel();
                    //var data = currentContext.calculateTax(data[0]);
                    var data = currentContext.calculateTax(data[0], invoiceStateCode, invoiceIsUT);

                    oModel.setData({ modelData: data });
                    currentContext.getView().setModel(oModel, "tblModel");
                });
 
            }
            else {
               
                this.getView().byId("cmbSalesDelivery").setValueState(sap.ui.core.ValueState.Error)
            }

            setTimeout(function () {
                console.log(currentContext);
                console.log(currentContext);
                console.log(currentContext);
                currentContext.itemTotal();
            }, 800);

        },


        calculateTax: function (data, invoiceStateCode, invoiceIsUT) {

            var isTaxModified = false;
            var itemTaxes = [];
            for (var i = 0; i < data.length; i++) {
                var itemStateCode = data[i]["statecode"];
                var itemIsUT = data[i]["isunionterritory"];

                var itemCost = parseFloat(data[i]["quantity"] * data[i]["unitprice"]).toFixed(2);
                var discAmt = itemCost - data[i]["discount"];

                if (itemStateCode == invoiceStateCode) {
                    if (data[i]["cgstpercent"] != null && data[i]["sgstpercent"] != null) {
                        
                        var cgstpercent = data[i]["cgstpercent"];
                        var sgstpercent = data[i]["sgstpercent"];
                        var vatpercent = data[i]["vatpercent"];
                        if (cgstpercent) data[i]["cgstamount"] = (discAmt * cgstpercent / 100).toFixed(2);
                        if (sgstpercent) data[i]["sgstamount"] = (discAmt * sgstpercent / 100).toFixed(2);
                        if (vatpercent) data[i]["vatamount"] = (discAmt * vatpercent / 100).toFixed(2);

                        data[i]["igstpercent"] = data[i]["igstamount"] = null;
                        data[i]["utgstpercent"] = data[i]["utgstamount"] = null;
                    }
                    else {
                        data[i]["cgstpercent"] = data[i]["cgstamount"] = null;
                        data[i]["sgstpercent"] = data[i]["sgstamount"] = null;
                        data[i]["igstpercent"] = data[i]["igstamount"] = null;
                        data[i]["utgstpercent"] = data[i]["utgstamount"] = null;
                        data[i]["vatpercent"] = data[i]["vatamount"] = null;

                        isTaxModified = true;
                        itemTaxes.push('CGST');
                        itemTaxes.push('SGST');
                    }
                } else {
                    if (itemIsUT == 1 || invoiceIsUT == 1) {
                        if (data[i]["utgstpercent"] != null) {
                            
                            var utgstpercent = data[i]["utgstpercent"];
                            if (utgstpercent) data[i]["utgstamount"] = (discAmt * utgstpercent / 100).toFixed(2);

                            data[i]["cgstpercent"] = data[i]["cgstamount"] = null;
                            data[i]["sgstpercent"] = data[i]["sgstamount"] = null;
                            data[i]["igstpercent"] = data[i]["igstamount"] = null;
                            data[i]["vatpercent"] = data[i]["vatamount"] = null;
                        }
                        else {
                            
                            data[i]["cgstpercent"] = data[i]["cgstamount"] = null;
                            data[i]["sgstpercent"] = data[i]["sgstamount"] = null;
                            data[i]["igstpercent"] = data[i]["igstamount"] = null;
                            data[i]["utgstpercent"] = data[i]["utgstamount"] = null;
                            data[i]["vatpercent"] = data[i]["vatamount"] = null;

                            isTaxModified = true;
                            itemTaxes.push('UTGST');
                        }
                    }
                    else {

                        if (data[i]["igstpercent"] != null) {

                            var igstpercent = data[i]["igstpercent"];
                            if (igstpercent) data[i]["igstamount"] = (discAmt * igstpercent / 100).toFixed(2);

                            data[i]["cgstpercent"] = data[i]["cgstamount"] = null;
                            data[i]["sgstpercent"] = data[i]["sgstamount"] = null;
                            data[i]["utgstpercent"] = data[i]["utgstamount"] = null;
                            data[i]["vatpercent"] = data[i]["vatamount"] = null;

                        }
                        else {
                            
                            data[i]["cgstpercent"] = data[i]["cgstamount"] = null;
                            data[i]["sgstpercent"] = data[i]["sgstamount"] = null;
                            data[i]["igstpercent"] = data[i]["igstamount"] = null;
                            data[i]["utgstpercent"] = data[i]["utgstamount"] = null;
                            data[i]["vatpercent"] = data[i]["vatamount"] = null;

                            isTaxModified = true;
                            itemTaxes.push('IGST');
                        }
                    }
                }

                var itemCost = parseFloat(data[i]["quantity"] * data[i]["unitprice"]).toFixed(2);
                var discAmt = itemCost - ((itemCost*data[i]["discount"])/100);
                var taxTotal = parseFloat(data[i]["cgstamount"] != null ? data[i]["cgstamount"] : 0)
                    + parseFloat(data[i]["sgstamount"] != null ? data[i]["sgstamount"] : 0)
                    + parseFloat(data[i]["igstamount"] != null ? data[i]["igstamount"] : 0)
                    + parseFloat(data[i]["utgstamount"] != null ? data[i]["utgstamount"] : 0)
                    + parseFloat(data[i]["vatamount"] != null ? data[i]["vatamount"] : 0);

                data[i]["linetotal"] = parseFloat(discAmt).toFixed(2);
            }

            if (isTaxModified)
                MessageBox.error("Item Warehouse Address statecode is not matching with invoice Delivery Address statecode, therefore removed GST taxes for items, please select proper GST taxes for items. ");

            return data;
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
                var oModel = currentContext.getView().getModel("salesinvoiceModel");

                //update existing model to set supplier
                oModel.oData.customerid = selRow[0].id;
                oModel.oData.partyoutstanding = selRow[0].partyoutstanding;
                oModel.oData.partyname = selRow[0].partyname;
                oModel.oData.contactperson = selRow[0].contactperson;
                oModel.refresh();

                this.getView().byId("txtCustomer").setValueState(sap.ui.core.ValueState.None)

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
                var oModel = currentContext.getView().getModel("salesinvoiceModel");

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
                var oModel = currentContext.getView().getModel("salesinvoiceModel");

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
                var oModel = currentContext.getView().getModel("salesinvoiceModel");

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

                this.calculateTax(selRow[0], oModel.oData.warehousestatecode, oModel.oData.warehouseisunionterritory);

                this.getView().byId("txtshiptoaddress").setValueState(sap.ui.core.ValueState.None)
            }
        },

        onAddSalesInvoice: function (sChannel, sEvent, oData) {
            var jsonStr = oData.data;
            var oModel = this.getView().getModel("tblModel");
            var pModel = this.getView().getModel("salesinvoiceModel")
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
            oModel.refresh();

            this.itemTotal();

        },


        onAddSalesInvoiceFreight: function (sChannel, sEvent, oData) {
            var jsonStr = oData.data;
            var oModel = this.getView().getModel("tblfreightModel");

            //var pModel = this.getView().getModel("salesinvoiceFreight")
            //pModel.oData.navigation = "Navigation";
            //pModel.refresh();

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
            oModel.refresh();

            this.itemTotal();

        },


        itemTotal: function () {
            var childModel = this.getView().getModel("tblModel").oData.modelData;
            var parentModel = this.getView().getModel("salesinvoiceModel");

            parentModel.oData.hasDiscount = false;

            var itemtotal = 0, cgsttotal = 0, sgsttotal = 0, igsttotal = 0, utgsttotal = 0, vattotal = 0, itemtotalwithoutdiscount = 0;
            let grosstotal = 0;

            if (childModel != undefined) {
                for (var i = 0; i < childModel.length; i++) {

                    itemtotal += parseFloat(childModel[i].linetotal);
                  
                   if (!isNaN(childModel[i].cgstamount) ) 
                   {
                           cgsttotal += parseFloat(childModel[i].cgstamount); 
                   }          
                  else if (childModel[i].cgstamount == null )
                  {
                            childModel[i].cgstamount = 0;
                            cgsttotal += childModel[i].cgstamount;
                  }

                    if (!isNaN(childModel[i].vatamount)  && childModel[i].vatamount!= null ){
                        vattotal += parseFloat(childModel[i].vatamount); 
                    }          
                    else if (childModel[i].vatamount == null )
                    {
                        childModel[i].vatamount = 0;
                        vattotal += childModel[i].vatamount;
                    }


                  if (!isNaN(childModel[i].sgstamount) ) 
                   {
                    sgsttotal += parseFloat(childModel[i].sgstamount) 
                   }          
                  else if (childModel[i].sgstamount == null )
                  {
                    childModel[i].sgstamount = 0;
                    sgsttotal = childModel[i].sgstamount;
                  }


                  if (!isNaN(childModel[i].igstamount) && childModel[i].igstamount!= null ) 
                  {
                    igsttotal += parseFloat(childModel[i].igstamount) 
                  }          
                 else if (childModel[i].igsttotal == null )
                 {
                    childModel[i].igstamount = 0;
                    igsttotal = childModel[i].igstamount;
                 }

                 if (!isNaN(childModel[i].utgstamount) && childModel[i].utgstamount!= null) 
                  {
                    utgsttotal += parseFloat(childModel[i].utgstamount) 
                  }          
                 else if (childModel[i].utgstamount == null )
                 {
                    childModel[i].utgstamount = 0;
                    utgsttotal = childModel[i].utgstamount;
                 }
                     // if (!isNaN(childModel[i].cgstamount) ) cgsttotal += parseFloat(childModel[i].cgstamount) 
                     //if (!isNaN(childModel[i].sgstamount)) sgsttotal += parseFloat(childModel[i].sgstamount)
                    //if (!isNaN(childModel[i].igstamount)) igsttotal += parseFloat(childModel[i].igstamount)
                    // if (!isNaN(childModel[i].utgstamount)) utgsttotal += parseFloat(childModel[i].utgstamount)

                    if (childModel[i].itemdiscount != null && childModel[i].itemdiscount != "") {
                        if (parseFloat(childModel[i].itemdiscount) > 0) {
                            parentModel.oData.hasDiscount = true;
                        }
                    }

                    grosstotal += parseFloat(childModel[i].quantity)*parseFloat(childModel[i].unitprice);
                   
                }
            }

            parentModel.oData.grosstotal = parseFloat(grosstotal).toFixed(2);
           

            parentModel.oData.cgsttotal = parseFloat(cgsttotal);
            parentModel.oData.sgsttotal = parseFloat(sgsttotal);
            parentModel.oData.igsttotal = parseFloat(igsttotal);
            parentModel.oData.utgsttotal = parseFloat(utgsttotal);
            parentModel.oData.vattotal = parseFloat(vattotal);

            parentModel.oData.taxtotal = parseFloat(cgsttotal) + parseFloat(sgsttotal) + parseFloat(igsttotal) + parseFloat(utgsttotal) + parseFloat(vattotal);
            parentModel.oData.itemtotal = (parseFloat(itemtotal)-parseFloat(parentModel.oData.taxtotal));
           
            //Freight list tax calculation
            var freightModel = this.getView().getModel("tblfreightModel").oData.modelData;
            var freighttotal = 0, cgsttotalfgt = 0, sgsttotalfgt = 0, igsttotalfgt = 0, utgsttotalfgt = 0, vattotalfgt = 0;



            if (freightModel != undefined) {
                for (var i = 0; i < freightModel.length; i++) {
                    freighttotal += parseFloat(freightModel[i].linetotal);

                    if (!Number(freightModel[i].cgstamount) && freightModel[i].cgstamount!= null ) 
                   {
                    cgsttotalfgt += parseFloat(freightModel[i].cgstamount); 
                   }          
                  else if (freightModel[i].cgstamount == null )
                  {
                            freightModel[i].cgstamount = 0;
                            cgsttotalfgt += freightModel[i].cgstamount;
                  }
                  if (!Number(freightModel[i].vatamount) && freightModel[i].vatamount!= null ) 
                  {
                    vattotalfgt += parseFloat(freightModel[i].vatamount); 
                  }          
                 else if (freightModel[i].vatamount == null )
                 {
                           freightModel[i].vatamount = 0;
                           vattotalfgt += freightModel[i].vatamount;
                 }

                  if (!Number(freightModel[i].sgstamount) && freightModel[i].sgstamount!= null ) 
                  {
                    sgsttotalfgt += parseFloat(freightModel[i].sgstamount); 
                  }          
                 else if (freightModel[i].sgstamount == null )
                 {
                           freightModel[i].sgstamount = 0;
                           sgsttotalfgt += freightModel[i].sgstamount;
                 }

                 if (!Number(freightModel[i].igstamount) && freightModel[i].igstamount!= null ) 
                  {
                    igsttotalfgt += parseFloat(freightModel[i].igstamount); 
                  }          
                 else if (freightModel[i].igstamount == null )
                 {
                           freightModel[i].igstamount = 0;
                           igsttotalfgt += freightModel[i].igstamount;
                 }

                 if (!Number(freightModel[i].utgstamount) && freightModel[i].utgstamount!= null ) 
                  {
                    utgsttotalfgt += parseFloat(freightModel[i].utgstamount); 
                  }          
                 else if (freightModel[i].utgstamount == null )
                 {
                           freightModel[i].utgstamount = 0;
                           utgsttotalfgt += freightModel[i].utgstamount;
                 }
                    // if (!Number(freightModel[i].cgstamount)) cgsttotalfgt += parseFloat(freightModel[i].cgstamount)
                    // if (!Number(freightModel[i].sgstamount)) sgsttotalfgt += parseFloat(freightModel[i].sgstamount)
                    // if (!Number(freightModel[i].igstamount)) igsttotalfgt += parseFloat(freightModel[i].igstamount)
                    // if (!Number(freightModel[i].utgstamount)) utgsttotalfgt += parseFloat(freightModel[i].utgstamount)
                }
            }


            parentModel.oData.freighttotal = parseFloat(freighttotal).toFixed(2);
            parentModel.oData.cgsttotalfreight = parseFloat(cgsttotalfgt);
            parentModel.oData.sgsttotalfreight = parseFloat(sgsttotalfgt);
            parentModel.oData.igsttotalfreight = parseFloat(igsttotalfgt);
            parentModel.oData.utgsttotalfreight = parseFloat(utgsttotalfgt);
            parentModel.oData.vattotalfreight = parseFloat(vattotalfgt);

           // parentModel.oData.freighttaxtotal = parseFloat(cgsttotalfgt + sgsttotalfgt + igsttotalfgt + utgsttotalfgt).toFixed(2);

            parentModel.oData.freighttaxtotal = parseFloat(cgsttotalfgt) + parseFloat(sgsttotalfgt) + parseFloat(igsttotalfgt) + parseFloat(utgsttotalfgt) + parseFloat(vattotalfgt);
            //parentModel.oData.freighttotal += parseFloat(parentModel.oData.freighttaxtotal);

            if (!Number(parentModel.oData.discount))
                parentModel.oData.discount = 0;

            if (!Number(parentModel.oData.roundoff))
                parentModel.oData.roundoff = 0;


            var discAmtFormat = 0;

            parentModel.oData.itemtotalwithdisc = parseFloat(parentModel.oData.itemtotal) - parseFloat(discAmtFormat);

            // //var dscAmt = (parseFloat(parentModel.oData.itemtotalwithdisc) - parseFloat(parentModel.oData.discount)).toFixed(2);
            // parentModel.oData.grandtotal = parseFloat(parseFloat(parentModel.oData.itemtotalwithdisc) + parseFloat(parentModel.oData.freighttotal) + parseFloat(parentModel.oData.roundoff)).toFixed(2);

            var dscAmt = parseFloat(parentModel.oData.itemtotal) - ((parseFloat(parentModel.oData.itemtotal)*parseFloat(parentModel.oData.discountpercent))/100);
            
            parentModel.oData.grandtotal = parseFloat(dscAmt);

            parentModel.refresh();
            this.notowordChange();
            this.subTotal();
        },


        onCalcChange: function (oEvent) {

            this.itemTotal();
            this.notowordChange();
        },

        onRoundOffChange : function(oEvent){
            var parentModel = this.getView().getModel("salesinvoiceModel");
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
            var parentModel = this.getView().getModel("salesinvoiceModel");
            parentModel.oData.discountedamount = (parseFloat(parentModel.oData.grosstotal) - (parseFloat(parentModel.oData.itemtotal))).toFixed(2); 
            parentModel.refresh();

            var discAmtFormat = 0;

            this.getView().byId("txtDiscount").setEnabled(true);
            this.getView().byId("txtDiscountPercent").setEnabled(true);

            var discPercent = (isNaN(parentModel.oData.discountpercent) ? 0 : parseFloat(parentModel.oData.discountpercent));
            var discAmt = 0;

            if (Number(discPercent)) {
                discAmt = ((parseFloat(parentModel.oData.itemtotal)) * parseFloat(discPercent) / 100);
                discAmtFormat = discAmt.toFixed(2);
                parentModel.oData.discount = discAmt.toFixed(2);
                parentModel.oData.discountedamount = (parseFloat(parentModel.oData.discountedamount) + parseFloat(discAmt)).toFixed(2);
            }
            else {
                discAmtFormat = 0;
                parentModel.oData.discount = 0;
            }
            //this.getView().byId("txtDiscount").setValue(discAmtFormat);

            var basicitemTotal = parentModel.oData.itemtotal;
            //var discount = this.getView().byId("txtDiscount").getValue();

            var DiscountCal = basicitemTotal - parseFloat(discAmtFormat);

            parentModel.oData.dicountwithitemTot = DiscountCal;


            parentModel.oData.dicountwithitemTot += parseFloat(parentModel.oData.taxtotal);

            //var grandTotalWithDis = basicitemTotal - parseFloat(DiscountCal);

            //parentModel.oData.grandtotal = parseFloat(parentModel.oData.dicountwithitemTot) + parseFloat(parentModel.oData.freighttotal) + parseFloat(parentModel.oData.freighttaxtotal);
            parentModel.oData.grandtotal = parseFloat(parentModel.oData.dicountwithitemTot) + parseFloat(parentModel.oData.freighttotal);
            parentModel.oData.grandtotal = parseFloat(parentModel.oData.grandtotal).toFixed(2);

            parentModel.refresh();
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

            var siModel = this.getView().getModel("salesinvoiceModel");

            var Model = {
                id: Model.getProperty("id") ? Model.getProperty("id") : null,
                itemgroupid: Model.getProperty("itemgroupid"),
                groupname: Model.getProperty("groupname"),
                itemid: Model.getProperty("itemid"),
                itemname: Model.getProperty("itemname"),
                itemcode: Model.getProperty("itemcode"),
                itembatch: Model.getProperty("itembatch"),

                warehouseid: Model.getProperty("warehouseid"),
                warehousebinid: Model.getProperty("warehousebinid"),
                warehousebinname: Model.getProperty("warehousebinname"),
                stateid: Model.getProperty("stateid"),
                statecode: Model.getProperty("statecode"),
                statename: Model.getProperty("statename"),
                isunionterritory: Model.getProperty("isunionterritory"),

                isgstinvoice: this.getView().byId("selGSTInvType").getSelectedKey(),
                deliverytostatecode: siModel.oData.statecode,
                deliverytoisunionterritory: siModel.oData.isunionterritory,
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

                //itemunitid: Model.getProperty("itemunitid"),
                //itemunitname: Model.getProperty("itemunitname"),
                unitprice: Model.getProperty("unitprice"),

                isbird: Model.getProperty("isbird"),
                avgweight: Model.getProperty("avgweight"),
                weight: Model.getProperty("weight"),
                iscalcweight: Model.getProperty("iscalcweight"),
                quantity: Model.getProperty("quantity"), 
                stockquantity : Model.getProperty("stockquantity"),
                linetotal: Model.getProperty("linetotal"),

                discount: Model.getProperty("discount"),
                taxid: Model.getProperty("taxid"),
                taxpercent: Model.getProperty("taxpercent"),
                taxcode: Model.getProperty("taxcode"),
                taxcategoryid : Model.getProperty("taxcategoryid"),
                taxcategoryname : Model.getProperty("taxcategoryname"),
		        index: rowIndex
            };

            this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("salesinvoice", "setDetailPage", { viewName: "SalesInvoiceDetail", viewModel: Model });
        },

        clearData: function () {
            var parentModel = this.getView().getModel("salesinvoiceModel");
            parentModel.oData = {};
            parentModel.refresh();
            var childModel = this.getView().getModel("tblModel");
            childModel.oData.modelData = [];
            childModel.refresh();
            var childModel = this.getView().getModel("tblfreightModel");
            childModel.oData.modelData = [];
            childModel.refresh();

            this.getView().byId("txtSalesOrder").setValueState(sap.ui.core.ValueState.None);
            this.getView().byId("selGSTInvType").setValueState(sap.ui.core.ValueState.None);
            this.getView().byId("txtbilltoaddress").setValueState(sap.ui.core.ValueState.None);
            this.getView().byId("txtshiptoaddress").setValueState(sap.ui.core.ValueState.None);
           
            this.getView().byId("txtSalesInvoiceDate").setValue(commonFunction.setTodaysDate(new Date()));

            this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---invoicegenerations--fclBreederSalesInvoice");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);

            this.getAllCommonSetting();
        },

        onSave: function () {

            var currentContext = this;
            if (this.validateMaster()) {
                var parentModel = this.getView().getModel("salesinvoiceModel").oData;
                var childModel = this.getView().getModel("tblModel").oData.modelData;
                var freightModel = this.getView().getModel("tblfreightModel").oData.modelData;

                // parentModel["salestypeid"] = 721;
                parentModel["subject"] = null;
                parentModel["statusid"] = this.getView().byId("status").getSelectedKey()
                parentModel["salestypeid"] = this.getView().byId("salestype").getSelectedKey()

                //if(parentModel["salesdeliveryids"] === Array)
                if(parentModel["salesdeliveryids"] != null)
                	parentModel["salesdeliveryids"] = parentModel["salesdeliveryids"].join();

                parentModel["salesinvoiceno"] = this.getView().byId('txtSalesInvoiceNo').getValue();
                if (parentModel.salesinvoicedate != null)
                    parentModel["salesinvoicedate"] = commonFunction.getDate(parentModel.salesinvoicedate);
                if (parentModel.deliverydate != null)
                    parentModel["deliverydate"] = commonFunction.getDate(parentModel.deliverydate);
                if (parentModel.referencedate != null)
                    parentModel["referencedate"] = commonFunction.getDate(parentModel.referencedate);

                parentModel["companyid"] = commonService.session("companyId");
                parentModel["userid"] = commonService.session("userId");

                salesinvoiceService.saveSalesInvoice(parentModel, function (data) {
                    if (data.id > 0) {
                        var salesinvoiceid = data.id;
                        var cnt = 0;
                        for (var i = 0; i < freightModel.length; i++) {

                            freightModel[i]["salesinvoiceid"] = salesinvoiceid;
                            freightModel[i]["companyid"] = commonService.session("companyId");
                            freightModel[i]["userid"] = commonService.session("userId");

                            salesinvoiceService.saveSalesInvoiceFreight(freightModel[i], function (data) {
                                if (freightModel.length == i) {
                                    MessageToast.show("Sales invoice freight submitted");
                                }
                            })
                        }

                        for (var i = 0; i < childModel.length; i++) {

                            childModel[i]["salesinvoiceid"] = salesinvoiceid;
                            childModel[i]["companyid"] = commonService.session("companyId");
                            childModel[i]["userid"] = commonService.session("userId");

                            salesinvoiceService.saveSalesInvoiceDetail(childModel[i], function (data) {
                                if (childModel.length == i) {
                                    MessageToast.show("Sales invoice saved successfully!");
                                    if (data.id > 0) {
                                        //cnt++;
                                        //Save JE for WIP bird ledger and goods received but not paid ledger
                                        
                                    }
                                }
                            })
                        }

                        if(data.id > 0 && parentModel["statusid"] == 1362){
                            cnt++;
                            salesinvoiceService.saveSalesInvoiceJE({ salesinvoiceid: salesinvoiceid }, function (data) {
                            });

                            if(parentModel["salesinvoicewithoutdelivery"]){
                                salesinvoiceService.salesInvoiceIssueItems({ salesinvoiceid: salesinvoiceid }, function (data) {
                                });
                            }
                        }
                        currentContext.clearData();
                        currentContext.getAllSalesInvoice();
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

            if (!commonFunction.isRequired(this, "txtSalesInvoiceDate", "Sales order date is required."))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtItemtotal", "Item total is required."))
                isValid = false;

            if (!commonFunction.isPercentage(this, "txtTaxPercent", ItemTaxMsg))
                isValid = false;

        },

        onAddNewFreight: function () {
            if (this.validateMaster()) {

                var siModel = this.getView().getModel("salesinvoiceModel");

                var itmModel = this.getView().getModel("tblModel").oData;

                if (itmModel.modelData.length > 0) {

                    itmModel = itmModel.modelData[0];

                    var dataModel = {
                        warehouseid: null,
                        freightid: null,
                        freightname: null,
                        amount: null,
                        stateid: itmModel.stateid,
                        statecode: itmModel.statecode,
                        statename: itmModel.statename,
                        isunionterritory: itmModel.isunionterritory,
                        isgstinvoice: this.getView().byId("selGSTInvType").getSelectedKey(),
                        deliverytostatecode: siModel.oData.statecode,
                        deliverytoisunionterritory: siModel.oData.isunionterritory,
                        utgstid: null,
                        utgstpercent: null,
                        utgstamount: null,
                        cgstid: null,
                        cgstpercent: null,
                        cgstamount: null,
                        sgstid: null,
                        sgstpercent: null,
                        sgstamount: null,
                        igstid: null,
                        igstpercent: null,
                        igstamount: null,
                        vatid: null,
                        vatpercent: null,
                        vatamount: null,
                        quantity: null,
                        linetotal: null,
                        taxid: null,
                        taxpercent: null,
                        taxcode: null
                    };

                    this.bus = sap.ui.getCore().getEventBus();
                    this.bus.publish("salesinvoice", "setDetailPage", { viewName: "SalesInvoiceFreight", viewModel: dataModel });
                }
                else {
                    MessageBox.error("Freight will be applicable on delivery items, Please select sales delivery.");
                }
            }
        },

        onListItemFreightPress: function (oEvent) {

            var currentContext = this;
            var Model = oEvent.getSource().getBindingContext("tblfreightModel");
            var spath = Model.sPath.split("/");
            var rowIndex = spath[spath.length - 1];

            var siModel = this.getView().getModel("salesinvoiceModel");

            var Model = {
                id: Model.getProperty("id") ? Model.getProperty("id") : null,

                isgstinvoice: this.getView().byId("selGSTInvType").getSelectedKey(),
                deliverytostatecode: siModel.oData.statecode,
                deliverytoisunionterritory: siModel.oData.isunionterritory,
                warehousestatecode: Model.getProperty("warehousestatecode"),
                billtoisunionterritory: Model.getProperty("billtoisunionterritory"),

                freightid: Model.getProperty("freightid"),
                freightname: Model.getProperty("freightname"),
                amount: Model.getProperty("amount"),
                warehouseid: Model.getProperty("warehouseid"),
                stateid: Model.getProperty("stateid"),
                statecode: Model.getProperty("statecode"),
                statename: Model.getProperty("statename"),
                isunionterritory: Model.getProperty("isunionterritory"),

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

                linetotal: Model.getProperty("linetotal"),

                taxid: Model.getProperty("taxid"),
                taxpercent: Model.getProperty("taxpercent"),
                taxcode: Model.getProperty("taxcode"),
                index: rowIndex,
            };

            this.bus = sap.ui.getCore().getEventBus();

            this.bus.publish("salesinvoice", "setDetailPage", { viewName: "SalesInvoiceFreight", viewModel: Model });
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
                this._oDialog = sap.ui.xmlfragment("sap.ui.elev8rerp.componentcontainer.fragmentview.Sales.BreederSales.SalesInvoiceDialog", this);
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

        handleSalesInvoiceSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var columns = ['customer', 'name', 'postingDate', 'deliveryDate', 'documentDate'];
            var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
            }),
                false);  // false for OR condition
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },


        handleSalesInvoiceClose: function (oEvent) {
            var currentContext = this;
            var aContexts = oEvent.getParameter("selectedContexts");

            if (aContexts != undefined) {
                var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });

                salesinvoiceService.getSalesInvoice({ id: selRow[0].id }, function (data) {

                    // Sales order data
                    var oModel = currentContext.getView().getModel("salesinvoiceModel");
                    oModel.oData = data[0][0];
                    oModel.oData.navigation = oModel.oData.statusid == 1361 ? 'Navigation' : 'Inactive';
                    oModel.oData.itemtotal = oModel.oData.subtotal;
                    oModel.refresh();

                    if(oModel.oData.statusid == 1361){
                        currentContext.getView().byId("btnSave").setEnabled(true);
                        currentContext.getView().byId("btnDelete").setEnabled(true);
                    }else{
                        currentContext.getView().byId("btnSave").setEnabled(false);
                        currentContext.getView().byId("btnDelete").setEnabled(true);
                    }
                        
                    var salesdeliveryids = oModel.oData.salesdeliveryids;

                    salesinvoiceService.getSalesDeliveryByOrder({ salesorderid: oModel.oData.salesorderid, salesinvoiceid: oModel.oData.id }, function (data) {
                        var oModel = new sap.ui.model.json.JSONModel();
                        oModel.setData({ modelData: data[0] });
                        currentContext.getView().setModel(oModel, "salesdeliveryList");
                    });

                    setTimeout(function () {
                        currentContext.getView().byId("cmbSalesDelivery").setSelectedKeys(salesdeliveryids.split(','));
                    }, 800);

                    commonFunction.getPartyAddress(oModel.oData.customerid, 1402, "billtoaddressList", currentContext);
                    commonFunction.getPartyAddress(oModel.oData.customerid, 1404, "deliverytoaddressList", currentContext);

                    // Update current series with existing series number
                    var seriesModel = currentContext.getView().getModel("docSeriesModel");
                    seriesModel.oData.newseries = data[0][0].salesinvoiceno;
                    seriesModel.refresh();

                    salesinvoiceService.getSalesInvoiceDetailByInvoice({ salesinvoiceid: oModel.oData.id }, function (data) {
                        var cModel = currentContext.getView().getModel("tblModel");
                        cModel.oData.modelData = data[0];
                        cModel.refresh();

                        currentContext.itemTotal();

                        // Get freight details List
                        salesinvoiceService.getAllSalesInvoiceFreight({ salesinvoiceid: oModel.oData.id }, function (data) {
                            var cModel = currentContext.getView().getModel("tblfreightModel");

                            for (var i = 0; i < data[0].length; i++) {
                                data[0][i].linetotal = (data[0][i].amount
                                    + (Number(data[0][i].cgstamount) ? data[0][i].cgstamount : 0)
                                    + (Number(data[0][i].sgstamount) ? data[0][i].sgstamount : 0)
                                    + (Number(data[0][i].igstamount) ? data[0][i].igstamount : 0)
                                    + (Number(data[0][i].vatamount) ? data[0][i].vatamount : 0)
                                    + (Number(data[0][i].utgstamount) ? data[0][i].utgstamount : 0)).toFixed(2);

                            }
                            cModel.oData.modelData = data[0];
                            cModel.refresh();

                            currentContext.itemTotal();
                        });

                    });

                });
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

			var parentModel = this.getView().getModel("salesinvoiceModel").oData;
			if (parentModel.id != null) {
				MessageBox.confirm(
					deleteMsg, {
					styleClass: "sapUiSizeCompact",
					onClose: function (sAction) {
						if (sAction == OKText) {
							salesinvoiceService.deleteSalesInvoice({id : parentModel.id}, function (data) {
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

        replaceStr: function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },

        // Function Used For PDF Download

        replaceTemplateData: function (template) {
          
            var parentModel = this.getView().getModel("salesinvoiceModel").oData;
            var tbleModel = this.getView().getModel("tblModel").oData.modelData;

            var htmTable = "";
            for (var indx in tbleModel) {
                var model = tbleModel[indx];
                var itemname = model["itemname"] == null ? " " : model["itemname"];
                var quantity = model["quantity"] == null ? " " : model["quantity"];
                var unitprice = model["unitprice"] == null ? " " : model["unitprice"];
                var discount = model["discount"] == null ? " " : model["discount"];
                var cgstpercent = model["cgstpercent"] == null ? " " : model["cgstpercent"];
                var cgstamount = model["cgstamount"] == null ? " " : model["cgstamount"];
                var sgstpercent = model["sgstpercent"] == null ? " " : model["sgstpercent"];
                var sgstamount = model["sgstamount"] == null ? " " : model["sgstamount"];
                var igstpercent = model["igstpercent"] == null ? " " : model["igstpercent"];
                var igstamount = model["igstamount"] == null ? " " : model["igstamount"];
                var utgstpercent = model["utgstpercent"] == null ? " " : model["utgstpercent"];
                var utgstamount = model["utgstamount"] == null ? " " : model["utgstamount"];
                var linetotal = model["linetotal"] == null ? " " : model["linetotal"];



                // Replace/create column sequence data table
                htmTable += "<tr>";
                htmTable += "<td align='left'>" + itemname + "</td>"
                htmTable += "<td align='right'>" + quantity + "</td>"
                htmTable += "<td align='right'>" + unitprice + "</td>"
                htmTable += "<td align='right'>" + discount + "</td>"
                htmTable += "<td align='right'>" + cgstpercent + "</td>"
                htmTable += "<td align='right'>" + cgstamount + "</td>"
                htmTable += "<td align='right''>" + sgstpercent + "</td>"
                htmTable += "<td align='right'>" + sgstamount + "</td>"
                htmTable += "<td align='right'>" + igstpercent + "</td>"
                htmTable += "<td align='right'>" + igstamount + "</td>"
                htmTable += "<td align='right'>" + utgstpercent + "</td>"
                htmTable += "<td align='right'>" + utgstamount + "</td>"
                htmTable += "<td align='right'>" + linetotal + "</td>"
                htmTable += "</tr>";
            }

            var companynameone = this.companyname;
            var companyname = companynameone == null ? " " : companynameone;
            var companycontactone = this.companycontact;
            var companycontact = companycontactone == null ? " " : companycontactone;
            var companyemailone = this.companyemail;
            var companyemail = companyemailone == null ? " " : companyemailone;
            var addressone = this.address;
            var address = addressone == null ? " " : addressone;
            var pincodeone = this.pincode;
            var pincode = pincodeone == null ? " " : pincodeone;


            var salesOrderno = this.getView().byId("txtSalesOrder").getValue();
            var InvoiceDatedate = this.getView().byId("txtSalesOrderDate").getValue();
            var cmbSalesDelivery = this.getView().byId("cmbSalesDelivery").getValue();
            var txtCustomer = this.getView().byId("txtCustomer").getValue();
            var txtCustomerRefNo = this.getView().byId("txtCustomerRefNo").getValue();
            var txtSalesInvoiceId = this.getView().byId("txtSalesInvoiceId").getValue();
            var txtSalesInvoiceNo = this.getView().byId("txtSalesInvoiceNo").getValue();
            var txtSalesInvoiceDate = this.getView().byId("txtSalesInvoiceDate").getValue();
            var txtbilltoaddress = this.getView().byId("txtbilltoaddress").getValue();
            var txtbilltoaddress = this.getView().byId("txtbilltoaddress").getValue();
            var txtshiptoaddress = this.getView().byId("txtshiptoaddress").getValue()
            var remark = this.getView().byId("remark").getValue();
	    var employee = this.getView().byId("selEmployees").getSelectedItem().mProperties.text;
	    

            var txtItemTotalone = this.getView().byId("txtItemtotal").getValue();
            var txtItemTotal = txtItemTotalone == null ? " " : txtItemTotalone;
            var txtDiscountoneper = this.getView().byId("txtDiscount").getValue();
            var txtDiscount = txtDiscountoneper == null ? " " : txtDiscountoneper;
            var txtFreightAmt = this.getView().byId("txtFreightAmt").getValue();
            var txtFRIGHTamt = txtFreightAmt == null ? " " : txtFreightAmt;
            var txtRoundTotal = this.getView().byId("txtRoundTotal").getValue();
            var RoundTotal = txtRoundTotal == null ? " " : txtRoundTotal;

            var txtTotal = this.getView().byId("txtTotal").getValue();
            var txtGrandTotal = txtTotal == null ? " " : txtTotal;
            var txtGrandTotalfloor = Math.floor(txtGrandTotal);
            var txtGrandTotalfloornotowordsone = this.nettotalinwords;
            var txtGrandTotalfloornotowords = txtGrandTotalfloornotowordsone == null ? " " : txtGrandTotalfloornotowordsone;
            var remarkone = parentModel.remark;
            var remark = remarkone == null ? " " : remarkone;
            var todayDate = new Date();
            var curDate = commonFunction.getDateFromDB(todayDate);
            var curTime = todayDate.getHours() + ":" + todayDate.getMinutes() + ":" + todayDate.getSeconds();


            template = this.replaceStr(template, "##DATE##", curDate);
            template = this.replaceStr(template, "##TIME##", curTime);
            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);
            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##Date##", InvoiceDatedate);
            template = this.replaceStr(template, "##SALESORDERNO##", salesOrderno);
            template = this.replaceStr(template, "##TXTSALESINVOIEDATE##", txtSalesInvoiceDate);
            template = this.replaceStr(template, "##CUSTOMER##", txtCustomer);

            template = this.replaceStr(template, "##CUSTOMERREFNO##", txtCustomerRefNo);
            template = this.replaceStr(template, "##SALESINVOICENO##", txtSalesInvoiceNo);
            template = this.replaceStr(template, "##SALESDELIVERY##", cmbSalesDelivery);
            template = this.replaceStr(template, "##SALESINVOICEDATE##", txtSalesInvoiceId);
            template = this.replaceStr(template, "##BILLTOADDRESS##", txtbilltoaddress);
            template = this.replaceStr(template, "##CUSTOMERADDRESS##", txtshiptoaddress);
            template = this.replaceStr(template, "##ITEMTOTAL##", txtItemTotal);
            template = this.replaceStr(template, "##DISCOUNT##", txtDiscount);
            template = this.replaceStr(template, "##FREIGHTAMT##", txtFRIGHTamt);
            template = this.replaceStr(template, "##ROUNDTOTAL##", RoundTotal);
            template = this.replaceStr(template, "##GRANDTOTAL##", txtGrandTotal);
            template = this.replaceStr(template, "##GRANDTOTALWITHWORDS##", txtGrandTotalfloornotowords);
            template = this.replaceStr(template, "##REMARK##", remark);
	    template = this.replaceStr(template, "##EMPLOYEE##", employee);
            return template;

        },

        createPDF: function () {            var currentContext = this;
            commonFunction.getHtmlTemplate("Purchase", "Salesinvoice.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Sales Invoice");

            });
        },

        createno: function (num) {
            var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
            var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

            if ((num = num.toString()).length > 9)
                return 'overflow';

            var n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
            if (!n) return;

            var str = '';
            str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
            str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
            str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
            str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
            str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
            return str;

        },

        notowordChange: function () {
            var grandtotal = this.getView().byId("txtTotal").getValue();
            var grandtotalfloor = Math.floor(grandtotal);
            var text = this.createno(grandtotalfloor);
            this.nettotalinwords = text;
        }

    });
}, true);
