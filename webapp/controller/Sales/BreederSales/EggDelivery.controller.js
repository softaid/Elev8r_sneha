sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageBox',
	'sap/m/MessageToast',
	'sap/ui/model/Filter',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
], function (JSONModel, BaseController, MessageBox, MessageToast, Filter, commonFunction) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.BreederSales.EggDelivery", {

		onInit: function () {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("eggdelivery", "setDetailPage", this.setDetailPage, this);
			this.oFlexibleColumnLayout = this.byId("fclEggDelivery");

			// set model for list dialog
			var oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.elev8rerp.componentcontainer.model.Sales.BreederSales", "/eggdelivery.json"));
			this.getView().setModel(oModel);

			// set empty model to view		
			var model = new JSONModel();
			model.setData({ modelData: [] });
			this.getView().setModel(model, "tblModel");

			var emptyModel = this.getModelDefault();

			var model = new JSONModel();
			model.setData(emptyModel);
			this.getView().setModel(model, "salesdeliveryModel");


			this.handleRouteMatched(null);

			var currRouteName = this.getOwnerComponent().getModel("applicationModel").getProperty("/routeName");
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.getRoute(currRouteName).attachMatched(this.handleRouteMatched, this);
		},

		handleRouteMatched: function (evt) {

			// get customer List 
			var partnerroleid = 32;
			commonFunction.getAllVendor(this, partnerroleid);
			//commonFunction.getReference("BrdSalsOdrSts", "BrdSalsOdrStsList", this);
		},

		getModelDefault: function () {
            return {
                id: null,
                partycode: null,
                partyname: null,
                statusid: "521",
                salesorderdate: commonFunction.getDateFromDB(new Date()),
                deliverydate: commonFunction.getDateFromDB(new Date()),
                discount: 0,
                remark: null,
                checkState: true,
                shipfromwarehouseid: null,
                linetotal: 0,
                freequantitypercent : 0
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
				var oModel = currentContext.getView().getModel("salesdeliveryModel");

				//update existing model to set supplier
				oModel.oData.vendorid = selRow[0].id;
				//oModel.oData.partycode = selRow[0].partnercode;
				oModel.oData.partyname = selRow[0].partyname;
				oModel.oData.contactperson = selRow[0].contactperson;
				oModel.refresh();

				this.getView().byId("txtVendor").setValueState(sap.ui.core.ValueState.None)
			}
		},

		handleSelectSalesOrderNo: function (oEvent) {
            var sInputValue = oEvent.getSource().getValue();

            this.inputId = oEvent.getSource().getId();
            // create value help dialog
            // if (!this._valueHelpDialog) {
            this._valueHelpDialog = sap.ui.xmlfragment(
                "sap.ui.elev8rerp.componentcontainer.fragmentview.Common.SalesOrderDialog",
                this
            );
            this.getView().addDependent(this._valueHelpDialog);
            // }
            // open value help dialog filtered by the input value
            this._valueHelpDialog.open(sInputValue);
        },

        handleSalesOrderSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var columns = ['statusname'];
            var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
            }),
                false);  // false for OR condition
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        onSalesOrderDialogClose: function (oEvent) {
            var currentContext = this;
            var aContexts = oEvent.getParameter("selectedContexts");

            if (aContexts != undefined) {
                var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
                var oModel = currentContext.getView().getModel("salesdeliveryModel");
                //update existing model to set supplier

                oModel.oData.id = null;
                oModel.oData.purchaserequestid = selRow[0].id;
                oModel.oData.requestdate = selRow[0].requestdate;

                oModel.refresh();
                var poDate = this.getView().byId("txtpodate").getValue();
                poDate = commonFunction.parseDate(poDate)
                oModel.oData.requestdate = commonFunction.parseDate(oModel.oData.requestdate)
                var date1 = new Date(poDate);
                var date2 = new Date(oModel.oData.requestdate);
                if (date2 > date1) {
                    var msg = this.resourceBundle().getText("purchaseOrderMsgErrorPODate");
                    MessageBox.error(msg);
                    this.getView().byId("txtpodate").setValueState(sap.ui.core.ValueState.Error)
                    this.getView().byId("txtrequestno").setValue("");


                } else {
                    this.getAllPurchaseRequestDetail(selRow[0].id);
                    this.getView().byId("txtpodate").setValueState(sap.ui.core.ValueState.None)

                }

            }
        },

		checkDone: function (oEvent) {

            var input = oEvent.mParameters.state;
            this.getView().byId("txtsalesorder").setValue(null);
            if (input === true) {
                this.getView().byId("txtsalesorder").setEnabled(true);
                this.getView().byId("btnAdd").setEnabled(false);
                var tbleModel = this.getView().getModel("tblModel");
                tbleModel.setData({ modelData: [] });

            } else {
				this.getView().byId("txtsalesorder").setEnabled(false);
				this.getView().byId("btnAdd").setEnabled(true);
                var tbleModel = this.getView().getModel("tblModel");
                tbleModel.setData({ modelData: [] });
            }
            this.closeDetailPage();
        },

		onExit: function () {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
		},

		onAddNewContent: function () {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("eggdelivery", "setDetailPage", { viewName: "EggDeliveryContentDetail" });
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
				this._oDialog = sap.ui.xmlfragment("sap.ui.elev8rerp.componentcontainer.fragmentview.Sales.BreederSales.EggDeliveryDialog", this);
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

		handleSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['name', 'breederName', 'fromDate', 'toDate'];
			var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
			}),
				false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleClose: function (oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
			this.getView().byId("txtCustomer").setValue(selRow[0].customer);
			this.getView().byId("txtName").setValue(selRow[0].name);
			this.getView().byId("txtCustomerRefNo").setValue(selRow[0].customerRefNo);
			this.getView().byId("cmbCurrency").setSelectedKey(selRow[0].localCurrency);
			this.getView().byId("txtPlaceOfSupply").setValue(selRow[0].placeOfSupply);
			this.getView().byId("txtNo1").setValue(selRow[0].no1);
			this.getView().byId("txtNo2").setValue(selRow[0].no2);

			this.getView().byId("txtStatus").setValue(selRow[0].status);
			this.getView().byId("txtPostingDate").setValue(selRow[0].postingDate);
			this.getView().byId("txtDeliveryDate").setValue(selRow[0].deliveryDate);
			this.getView().byId("txtDocumentDate").setValue(selRow[0].documentDate);
			this.getView().byId("txtOwner").setValue(selRow[0].owner);
			this.getView().byId("txtRemark").setValue(selRow[0].remark);
			this.getView().byId("txtTotalBeforeDiscount").setValue(selRow[0].totalBeforeDiscount);
			this.getView().byId("txtDiscount").setValue(selRow[0].discount);
			this.getView().byId("txtDiscount1").setValue(selRow[0].discount1);
			this.getView().byId("txtFreight").setValue(selRow[0].freight);
			this.getView().byId("chkRounding").setSelected(selRow[0].rounding);
			this.getView().byId("txtRoundTotal").setValue(selRow[0].roundTotal);
			this.getView().byId("txtTax").setValue(selRow[0].tax);
			this.getView().byId("txtTotal").setValue(selRow[0].total);


			this.bindDetailTable(selRow[0].contentDetails);
		},

		bindDetailTable: function (oModel) {
			//bind table
			var currentContext = this;
			// instantiating the model of type json
			var oModel = new sap.ui.model.json.JSONModel(oModel);

			// Set the model to Table
			var oTable = this.getView().byId("stdDetailTable");
			oTable.setModel(oModel, "dataModel");

			// Template
			var oTemplate = new sap.m.ColumnListItem({
				cells: [new sap.m.Text({
					text: "{dataModel>itemNo}"
				}), new sap.m.Text({
					text: "{dataModel>dispatchQty}"
				}), new sap.m.Text({
					text: "{dataModel>itemDescription}"
				}), new sap.m.Text({
					text: "{dataModel>quantity}"
				}), new sap.m.Text({
					text: "{dataModel>unitPrice}"
				}), new sap.m.Text({
					text: "{dataModel>discount}"
				}), new sap.m.Text({
					text: "{dataModel>taxCode}"
				}), new sap.m.Text({
					text: "{dataModel>total}"
				}), new sap.m.Text({
					text: "{dataModel>whse}"
				}), new sap.ui.commons.Button({
					text: "",
					icon: "sap-icon://edit",
					press: function (e) {

						var viewModel = e.getSource().getBindingContext("dataModel");
						var model = {
							"itemNo": viewModel.getProperty("itemNo"),
							"dispatchQty": viewModel.getProperty("dispatchQty"),
							"itemDescription": viewModel.getProperty("itemDescription"),
							"quantity": viewModel.getProperty("quantity"),
							"unitPrice": viewModel.getProperty("unitPrice"),
							"discount": viewModel.getProperty("discount"),
							"taxCode": viewModel.getProperty("taxCode"),
							"total": viewModel.getProperty("total"),
							"whse": viewModel.getProperty("whse"),
						}

						currentContext.bus = sap.ui.getCore().getEventBus();
						currentContext.bus.publish("eggdelivery", "setDetailPage", { viewName: "EggDeliveryContentDetail", viewModel: model });
					}
				})
				]
			});

			oTable.bindAggregation("items", {
				path: "dataModel>/",
				sorter: { path: 'itemNo' },
				template: oTemplate
			})
		}
	});
}, true);
