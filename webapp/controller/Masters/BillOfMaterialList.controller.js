sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
    'sap/ui/elev8rerp/componentcontainer/services/Masters/BillOfMaterial.service',
], function (JSONModel, BaseController, MessageBox, MessageToast, commonFunction, commonService, oBillOfMaterialService) {

    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Masters.BillOfMaterialList", {

        /**
         * Function to initialize bill of material.
         */
        onInit: function () {
            
            let oThis = this;
            oThis.oFlexibleColumnLayout = this.byId("fclPOList");

            oThis.bus = sap.ui.getCore().getEventBus();
            oThis.bus.subscribe("billofmaterial", "handleBillOfMaterialList", oThis.handleBillOfMaterialList, oThis);

            let oBillOfMaterialList = new JSONModel();
            oBillOfMaterialList.setData([]);
            oThis.getView().setModel(oBillOfMaterialList, "oBillOfMaterialList");
            
            let oView = oThis.getView();

            oView.addEventDelegate({onAfterShow: function(oEvent){
                oThis.handleRouteMatched();
            }}, oView);
            commonFunction.getFeedMillSettingData(this, 726);
        },

        /**
         * Function to handle matched route
         * @returns 
         */
        handleRouteMatched: function () {
			
			//get itemgroup
			commonFunction.getItemGroups(this, "itemGroupModel");

        },

		itemgroupSelect: function () {
			var itemgroupid = this.getView().byId("productgroup").getSelectedKey();
			commonFunction.getItemsByItemGroups(itemgroupid, this, "itemList");
		},

        /**
         * Function to handle module type selection.
         * @param {*} oEvent 
         * @returns 
         */
        handleModuleTypeSelection: function (oEvent) {

            let sModuleType = oEvent.getSource().getSelectedItem().getKey();

            return this.setVendorModelByModuleType(sModuleType);

        },

        /**
         * Function to set vendor model by module type.
         * @param {*} sModuleType 
         * @returns 
         */
        setVendorModelByModuleType: function(sModuleType) {

            let oVendors = ({
                roleid: 31,
                moduleid: parseInt(sModuleType)
            });

            commonFunction.getPartyModulewise(oVendors, this, "vendorModel");

            return this.getView().getModel("vendorModel");
            
        },

        /**
         * Function to submit search parameters of bill of material.
         */
        handleSearchData: function() {

            let _this = this;

            if(_this.validateForm()) {

                let sProductGroup = this.getView().byId("productgroup").getSelectedKey();
                let sProductName = this.getView().byId("productname").getSelectedKey();
                let sFromDate = this.getView().byId("fromDate").getValue();
                let sToDate = this.getView().byId("toDate").getValue();

                oBillOfMaterialService.getBillOfMaterialList({
                    product_group: sProductGroup,
                    product_name: sProductName,
                    from_date: sFromDate,
                    to_date: sToDate,
                }, function (data) {

                    if(data.length > 0) {
                        let oModel = new sap.ui.model.json.JSONModel();
                        oModel.setData({ modelData: data[0] });
                        oModel.setSizeLimit(data[0].length);
                        _this.getView().setModel(oModel, "oBillOfMaterialList1");
                        _this.setPagination();
                    }else{
                        MessageBox.information("No BOM is available.");
                    }

                });
            }

        },

        /**
         * Function to redirect to add screen of bill of material.
         */
        add: function() {

            this.bus = sap.ui.getCore().getEventBus();
            setTimeout(function () {
                this.bus = sap.ui.getCore().getEventBus();
                this.bus.publish("billofmaterial", "handleBillOfMaterialList", { pagekey: "billofmaterial", viewModel:null });
            }, 1000);
            this.bus.publish("billofmaterial", "handleBillOfMaterialList", { pagekey: "billofmaterial", viewModel:null});
            commonFunction.getFeedMillSettingData(this, 726);
        },
       
        /**
         * Function to navigate to specified route.
         * @param {*} sChannel 
         * @param {*} sEvent 
         * @param {*} oData 
         */
        handleBillOfMaterialList : function (sChannel, sEvent, oData) {
            console.log("oData",oData);
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.bus = sap.ui.getCore().getEventBus();
            oRouter.getTargets().display(oData.pagekey, { viewModel: oData.viewModel });
            oRouter.navTo(oData.pagekey, true);
        },
        
        /**
         * Function to validate the bill of material form.
         * @returns 
         */
        validateForm: function () {
            
            let isValid = true;

            if (!isValid){
                MessageToast.show(this.getModel("i18n").getResourceBundle().getText("requiredmsg"));
                return false;
            }
                
            return isValid;

        },

        /**
         * Function to filter search crieteria of bill of material.
         * @param {*} oEvent 
         */
        search: function (oEvent) {

            this._aTableFilters = []
			var oModel = this.getView().getModel("oBillOfMaterialList1").oData.modelData;
			var sQuery = oEvent.getParameter("query");
            console.log(sQuery);
			if (sQuery) {
				this._oGlobalFilter = null;
				var aTablex = oModel.slice(0);
				var foundKey = "";
				for (var k = 0; k < aTablex.length; k++) {
					var tableRow = aTablex[k];
					Object.keys(tableRow).forEach(function (key) {
						var value = tableRow[key];
						if (key !== "__metadata") {
							if (value != null) {
								if (value.toString() !== "") {
									if (value.toString().includes(sQuery.toString())) {
										foundKey = key;

									}
								}
							}
						}
					});
				}

                if (foundKey !== "") {
					var filterProp = foundKey;
					var filterValue = sQuery;
					var filterOperator = "EQ";
                    console.log("filterProp: ", filterProp);
                    console.log("filterValue: ", filterValue);
					this._aTableFilters.push({
						filterProp: filterProp,
						filterValue: filterValue,
						filterOperator: filterOperator
					});

					var aTable = this.sortAndFilterTable(aTablex);
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData({ modelData: aTable });
					this.getView().setModel(oModel, "oBillOfMaterialList");

				}
				else {
					aTable = [];
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData({ modelData: aTable });
					this.getView().setModel(oModel, "oBillOfMaterialList");
				}
			} else {
				this.setPagination()
			}

        },

        /**
         * Function to sort the search results of bill of material.
         * @param {*} oEvent 
         */
        sort: function (oEvent) {
            this._bDescendingSort = !this._bDescendingSort;
            var oView = this.getView(),
                oTable = oView.byId("tblPOList"),
                oBinding = oTable.getBinding("items"),
                oSorter = new sap.ui.model.Sorter("id", this._bDescendingSort);
            oBinding.sort(oSorter);
        },

        /**
         * Function to redirect to edit screen of bill of material.
         * @param {*} oEvent 
         */
        edit: function (oEvent) { 
            
            let _this = this;
            let viewModel = oEvent.getSource().getBindingContext("oBillOfMaterialList").getObject();
            viewModel.action = "edit";
            
            _this.bus = sap.ui.getCore().getEventBus();
            
            setTimeout(function () {
                _this.bus = sap.ui.getCore().getEventBus();
                _this.bus.publish("billofmaterial", "handleBillOfMaterialList", { pagekey: "billofmaterial", viewModel:viewModel });
            }, 1000);
            
            _this.bus.publish("billofmaterial", "handleBillOfMaterialList", { pagekey: "billofmaterial", viewModel:viewModel});
       
        },

        /**
         * Function to redirect to view screen of bill of material.
         * @param {*} oEvent 
         */
        show: function(oEvent) {
       
            let _this = this;
            let viewModel = oEvent.getSource().getBindingContext("oBillOfMaterialList").getObject();
            viewModel.action = "view";
            
            _this.bus = sap.ui.getCore().getEventBus();
            
            setTimeout(function () {
                _this.bus = sap.ui.getCore().getEventBus();
                _this.bus.publish("billofmaterial", "handleBillOfMaterialList", { pagekey: "billofmaterial", viewModel:viewModel });
            }, 1000);
            
            _this.bus.publish("billofmaterial", "handleBillOfMaterialList", { pagekey: "billofmaterial", viewModel:viewModel});
       
        },

        /**
         * Function to set pagination on row count selection.
         * @returns 
         */
        changeRowCount: function () {
			return this.setPagination();
		},

        /**
         * Function to set pagination for search results of bill of material.
         */
        setPagination: function () {
			
            if(typeof this.getView().getModel("oBillOfMaterialList1") !== "undefined") {

                let data = this.getView().getModel("oBillOfMaterialList1").oData.modelData;

                console.log(data);

                var currentContext = this;
                if (typeof data !== "undefined" && data.length > 10) {
                    currentContext.getView().byId("btp2").setVisible(true);
                } else {
                    currentContext.getView().byId("btp2").setVisible(false);
                }

                var hbox = this.byId("btp1");
                hbox.destroyItems();
                // get row count
                var count = 10;
                console.log(this.getView().byId("cmbTransactionType").getSelectedKey());
                if(typeof this.getView().byId("cmbTransactionType") !== "undefined" && this.getView().byId("cmbTransactionType").getSelectedKey() !== "") {
                    count = this.getView().byId("cmbTransactionType").getSelectedKey();
                }
                // set page number 
                var oActual = data.length / count;
                var oCalculation = (oActual % 1 == 0);

                // var oValue = oActual;
                if (oCalculation == true) {
                    var oValue = oActual;
                } else {
                    var oValue = parseInt(oActual) + 1;
                }
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({ modelData: data.slice(0, count) });
                currentContext.getView().setModel(oModel, "oBillOfMaterialList");
                // paginator controller

                var oPaginator = new sap.ui.commons.Paginator({
                    numberOfPages: oValue,
                    page: function (oEvent) {
                        console.log(oEvent)
                        var oValue = oEvent;
                        var oTargetPage = oEvent.getParameter("targetPage");
                        var oTargetValue = oTargetPage * count;
                        var oSourceValue = oTargetValue - count;
                        var oTotalData = data;
                        var oSelectedData = oTotalData.slice(oSourceValue, oTargetValue);
                        oModel.setProperty("/modelData", oSelectedData);
                    }
                }).addStyleClass("paginatorStyle");
                // add item in pagginator
                var hbox = this.byId("btp1");
                hbox.addItem(oPaginator);

            }

		},

        /**
         * Function to sort and filter search results of bill of material.
         * @param {*} aData 
         * @returns 
         */
		sortAndFilterTable: function (aData) {
			if (!(aData.length > 0)) return aData;


			for (var i = 0; i < this._aTableFilters.length; i++) {

				var oTableFilters = this._aTableFilters[i];

				var fieldType = typeof aData[0][oTableFilters.filterProp];

				if (oTableFilters.filterValue !== null && oTableFilters.filterValue !== "") {
					for (var k = 0; k < aData.length; k++) {
						var tableRow = aData[k];

						if (oTableFilters.filterOperator === "Contains") {
							if (!((tableRow[oTableFilters.filterProp]).includes(oTableFilters.filterValue))) {
								aData.splice(k, 1);
								k--;
							}

						} else if (oTableFilters.filterOperator === "EQ") {

							if (fieldType === "object") {

								var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
									pattern: "dd.M.yyyy"
								});

								var compValue = oDateFormat.format(tableRow[oTableFilters.filterProp])

								if (!(compValue === oTableFilters.filterValue)) {
									aData.splice(k, 1);
									k--;
								}
							} else {
                                // console.log(!((tableRow[oTableFilters.filterProp]) === oTableFilters.filterValue))
								if (!((tableRow[oTableFilters.filterProp]) === oTableFilters.filterValue)) {
									aData.splice(k, 1);
									k--;
								}
							}
						}
					}
				}
			}

            return aData;

		},
        
    });
});