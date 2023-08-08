sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/CBF/BirdSalesOrder.service',
], function (JSONModel, BaseController, MessageBox, MessageToast, commonFunction,birdSalesOrderService) {

    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.CBFSales.BirdSalesOrderList", {

        /**
         * Function to initialize issue for production.
         */
        onInit: function () {
            
            let oThis = this;
            oThis.oFlexibleColumnLayout = this.byId("fclPOList");

            oThis.bus = sap.ui.getCore().getEventBus();
            oThis.bus.subscribe("cbfbirdsalesorder", "handlecbfbirdsalesorderList", oThis.handlecbfbirdsalesorderList, oThis);

            let oBirdSalesOrderList = new JSONModel();
            oBirdSalesOrderList.setData([]);
            oThis.getView().setModel(oBirdSalesOrderList, "oBirdSalesOrderList");
            
            let oView = oThis.getView();

            oView.addEventDelegate({onAfterShow: function(oEvent){
                oThis.handleRouteMatched();
            }}, oView);
            commonFunction.getCBFSettingData(this, 723);
        //    this.getBirdSalesOrderList();

        },

        /**
         * Function to handle matched route
         * @returns 
         */
        handleRouteMatched: function () {
			
            this.getView().byId("dateselection").setSelectedKey("current_financial_year");

            this.setCurrentFinancialYear();

            this.getView().byId("btnSearchData").firePress();

            //set current financial year
            let dateArr = commonFunction.setCurrentFinancialYear();

            this.getView().byId("fromDate").setValue(dateArr[0].fromDate);
            this.getView().byId("toDate").setValue(dateArr[0].toDate);

            // this is for getting bird sales order list
            this.getBirdSalesOrderList();

        },

        handlecbfbirdsalesorderList : function(sChannel, sEvent, oData) {
            console.log("oData",oData);
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.bus = sap.ui.getCore().getEventBus();
            oRouter.getTargets().display(oData.pagekey, { viewModel: oData.viewModel });
            oRouter.navTo(oData.pagekey, true);
        },

        

        setCurrentMonth: function() {

            var date = new Date(), y = date.getFullYear(), m = date.getMonth();
            var firstDay = new Date(y, m, 1);
            var lastDay = new Date(y, m + 1, 0);

            var firstDayDD = firstDay.getDate();
            var firstDayMM = firstDay.getMonth()+1; 
            var firstDayYYYY = firstDay.getFullYear();

            if(firstDayDD<10) 
            {
                firstDayDD='0'+firstDayDD;
            } 

            if(firstDayMM<10) 
            {
                firstDayMM='0'+firstDayMM;
            } 

            var lastDayDD = lastDay.getDate();
            var lastDayMM = lastDay.getMonth()+1; 
            var lastDayYYYY = lastDay.getFullYear();

            if(lastDayDD<10) 
            {
                lastDayDD='0'+lastDayDD;
            } 

            if(lastDayMM<10) 
            {
                lastDayMM='0'+lastDayMM;
            } 

            this.getView().byId("fromDate").setValue(firstDayYYYY+'-'+firstDayMM+'-'+firstDayDD);
            this.getView().byId("toDate").setValue(lastDayYYYY+'-'+lastDayMM+'-'+lastDayDD);

        },

        setLastMonth: function() {

            var date = new Date();
            date = new Date(date.setMonth(date.getMonth() - 1));
            var y = date.getFullYear(), m = date.getMonth();
            var firstDay = new Date(y, m, 1);
            var lastDay = new Date(y, m + 1, 0);

            var firstDayDD = firstDay.getDate();
            var firstDayMM = firstDay.getMonth()+1; 
            var firstDayYYYY = firstDay.getFullYear();

            if(firstDayDD<10) 
            {
                firstDayDD='0'+firstDayDD;
            } 

            if(firstDayMM<10) 
            {
                firstDayMM='0'+firstDayMM;
            } 

            var lastDayDD = lastDay.getDate();
            var lastDayMM = lastDay.getMonth()+1; 
            var lastDayYYYY = lastDay.getFullYear();

            if(lastDayDD<10) 
            {
                lastDayDD='0'+lastDayDD;
            } 

            if(lastDayMM<10) 
            {
                lastDayMM='0'+lastDayMM;
            } 

            this.getView().byId("fromDate").setValue(firstDayYYYY+'-'+firstDayMM+'-'+firstDayDD);
            this.getView().byId("toDate").setValue(lastDayYYYY+'-'+lastDayMM+'-'+lastDayDD);

        },

        setCurrentQuarter: function() {

            var date = new Date();
                
            var quarter = Math.floor((date.getMonth() / 3));
            var firstDay = new Date(date.getFullYear(), quarter * 3, 1);
            var lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 3, 0);

            var firstDayDD = firstDay.getDate();
            var firstDayMM = firstDay.getMonth()+1; 
            var firstDayYYYY = firstDay.getFullYear();

            if(firstDayDD<10) 
            {
                firstDayDD='0'+firstDayDD;
            } 

            if(firstDayMM<10) 
            {
                firstDayMM='0'+firstDayMM;
            } 

            var lastDayDD = lastDay.getDate();
            var lastDayMM = lastDay.getMonth()+1; 
            var lastDayYYYY = lastDay.getFullYear();

            if(lastDayDD<10) 
            {
                lastDayDD='0'+lastDayDD;
            } 

            if(lastDayMM<10) 
            {
                lastDayMM='0'+lastDayMM;
            } 

            this.getView().byId("fromDate").setValue(firstDayYYYY+'-'+firstDayMM+'-'+firstDayDD);
            this.getView().byId("toDate").setValue(lastDayYYYY+'-'+lastDayMM+'-'+lastDayDD);

        },

        setCurrentFinancialYear: function() {

            var date = new Date();

            if ((date.getMonth() + 1) <= 3) {
                var firstDay = new Date(date.getFullYear() - 1, 3, 1);
                var lastDay = new Date(date.getFullYear(), 3, 0);
            } else {
                var firstDay = new Date(date.getFullYear(), 3, 1);
                var lastDay = new Date(date.getFullYear() + 1, 3, 0);
            }
            
            console.log(firstDay);
            console.log(lastDay);

            var firstDayDD = firstDay.getDate();
            var firstDayMM = firstDay.getMonth()+1; 
            var firstDayYYYY = firstDay.getFullYear();

            if(firstDayDD<10) 
            {
                firstDayDD='0'+firstDayDD;
            } 

            if(firstDayMM<10) 
            {
                firstDayMM='0'+firstDayMM;
            } 

            var lastDayDD = lastDay.getDate();
            var lastDayMM = lastDay.getMonth()+1; 
            var lastDayYYYY = lastDay.getFullYear();

            if(lastDayDD<10) 
            {
                lastDayDD='0'+lastDayDD;
            } 

            if(lastDayMM<10) 
            {
                lastDayMM='0'+lastDayMM;
            } 

            this.getView().byId("fromDate").setValue(firstDayYYYY+'-'+firstDayMM+'-'+firstDayDD);
            this.getView().byId("toDate").setValue(lastDayYYYY+'-'+lastDayMM+'-'+lastDayDD);

        },

		handleDateSelection: function(oEvent) {

			let sDateSelection = oEvent.getSource().getSelectedItem().getKey();

			console.log(sDateSelection);

			if(sDateSelection == "current_month") {

				this.setCurrentMonth();

			}

			if(sDateSelection == "last_month") {

                this.setLastMonth();
				
			}

            if(sDateSelection == "current_quarter") {

				this.setCurrentQuarter();

			}

            if(sDateSelection == "current_financial_year") {

                this.setCurrentFinancialYear();

			}

            this.getView().byId("btnSearchData").firePress();

		},

        /**
         * Function to submit search parameters of issue for production.
         */
        handleSearchData: function() {

            let _this = this;

            if(_this.validateForm()) {

                let sFromDate = this.getView().byId("fromDate").getValue();
                let sToDate = this.getView().byId("toDate").getValue();

                birdSalesOrderService.getBirdSalesOrderList({
                    fromdate: sFromDate,
                    todate: sToDate,
                }, function (data) {
                    console.log("farmerdata-----",data);

                    if(data.length > 0) {
                        let oModel = new sap.ui.model.json.JSONModel();
                        oModel.setData({ modelData: data[0] });
                        oModel.setSizeLimit(data[0].length);
                        _this.getView().setModel(oModel, "oBirdSalesOrderList1");
                        _this.setPagination();
                    }
                    else
                    {
                        MessageBox.error("Data is not available");
                    }

                });
            }

        },

        /**
         * Function to redirect to add screen of issue for production.
         */
        Add: function() {

            this.bus = sap.ui.getCore().getEventBus();
            setTimeout(function () {
                this.bus = sap.ui.getCore().getEventBus();
                this.bus.publish("cbfbirdsalesorder", "handlecbfbirdsalesorderList", { pagekey: "cbfbirdsalesorder", viewModel:null });
            }, 1000);
            this.bus.publish("cbfbirdsalesorder", "handlecbfbirdsalesorderList", { pagekey: "cbfbirdsalesorder", viewModel:null});
            // commonFunction.getCBFSettingData(this, 723);
        },
       
        // get all bird sales order list
        getBirdSalesOrderList : function(){
          
			var currentContext=this;
            let sFromDate = currentContext.getView().byId("fromDate").getValue();
            let sToDate = currentContext.getView().byId("toDate").getValue();

           console.log(sFromDate);
           console.log(sToDate);
           birdSalesOrderService.getBirdSalesOrderList(
                    {fromdate: sFromDate,
                    todate: sToDate },
                    function(data)
           
            {
                console.log("data",data);
                if(data.length > 0)
                {
                    for(var i = 0; i < data[0].length; i++){
                        if(data[0][i].status_id == 1722){
                            var pModel = new sap.ui.model.json.JSONModel();
                            pModel.setData({ modelData: data[0] });
                            currentContext.getView().setModel(pModel, "oBirdSalesOrderList");
                        }
                    }
                }
                else
                {
                    MessageBox.error("Data is not available");
                }

            })
        },

         /**
         * Function to navigate to specified route.
         * @param {*} sChannel 
         * @param {*} sEvent 
         * @param {*} oData 
         */
       
         /**
         * Function to validate the issue for production form.
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
         * Function to filter search crieteria of issue for production.
         * @param {*} oEvent 
         */
        search: function (oEvent) {

            this._aTableFilters = []
			var oModel = this.getView().getModel("oBirdSalesOrderList1").oData.modelData;
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
					this.getView().setModel(oModel, "oBirdSalesOrderList");

				}
				else {
					aTable = [];
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData({ modelData: aTable });
					this.getView().setModel(oModel, "oBirdSalesOrderList");
				}
			} else {
				this.setPagination()
			}

        },

        /**
         * Function to sort the search results of issue for production.
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
         * Function to redirect to edit screen of issue for production.
         * @param {*} oEvent 
         */
        edit: function (oEvent) { 
            
            let _this = this;
            let viewModel = oEvent.getSource().getBindingContext("oBirdSalesOrderList").getObject();
            viewModel.action = "edit";
            
            _this.bus = sap.ui.getCore().getEventBus();
            
            setTimeout(function () {
                _this.bus = sap.ui.getCore().getEventBus();
                _this.bus.publish("cbfbirdsalesorder", "handlecbfbirdsalesorderList", { pagekey: "cbfbirdsalesorder", viewModel:viewModel });
            }, 1000);
            
            _this.bus.publish("cbfbirdsalesorder", "handlecbfbirdsalesorderList", { pagekey: "cbfbirdsalesorder", viewModel:viewModel});
       
        },

        /**
         * Function to redirect to view screen of issue for production.
         * @param {*} oEvent 
         */
        show: function(oEvent) {
       
            let _this = this;
            let viewModel = oEvent.getSource().getBindingContext("oBirdSalesOrderList").getObject();
            viewModel.action = "view";
            
            _this.bus = sap.ui.getCore().getEventBus();
            
            setTimeout(function () {
                _this.bus = sap.ui.getCore().getEventBus();
                _this.bus.publish("cbfbirdsalesorder", "handlecbfbirdsalesorderList", { pagekey: "cbfbirdsalesorder", viewModel:viewModel });
            }, 1000);
            
            _this.bus.publish("cbfbirdsalesorder", "handlecbfbirdsalesorderList", { pagekey: "cbfbirdsalesorder", viewModel:viewModel});
       
        },

        /**
         * Function to set pagination on row count selection.
         * @returns 
         */
        changeRowCount: function () {
			return this.setPagination();
		},

        /**
         * Function to set pagination for search results of issue for production.
         */
        setPagination: function () {
			
            if(typeof this.getView().getModel("oBirdSalesOrderList1") !== "undefined") {

                let data = this.getView().getModel("oBirdSalesOrderList1").oData.modelData;

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
                currentContext.getView().setModel(oModel, "oBirdSalesOrderList");
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
         * Function to sort and filter search results of issue for production.
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