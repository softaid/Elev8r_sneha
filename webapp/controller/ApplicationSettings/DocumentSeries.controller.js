sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/FinancialYearSetting.service',
	'sap/ui/elev8rerp/componentcontainer/services/FinancialYearDocSeries.service'
	
], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, commonFunction, financialyearsettingService, documentseriesService) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.ApplicationSettings.DocumentSeries", {

        onInit: function() {	
            
            this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("documentseries", "setDetailPage", this.setDetailPage, this);     
			this.bus.subscribe("loaddata", "loadData", this.loadData, this);     						
            this.oFlexibleColumnLayout = this.byId("fclDocumentSeries");

			var oModel = new JSONModel();
			oModel.setData([{ yearid : null }]);
			this.getView().setModel(oModel, "searchDocSeriesModel");

			this.handleRouteMatched(null);

			var currRouteName = this.getOwnerComponent().getModel("applicationModel").getProperty("/routeName");
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this._oRouter.getRoute(currRouteName).attachMatched(this.handleRouteMatched, this);
		},
		
		handleRouteMatched : function (evt) {	
			// load data to grid
			commonFunction.getFinancialYearList(this);
		},

		financialYearChange : function(oEvent){
			this.loadData();
		},
             
        onExit: function () {
            this.bus.unsubscribe("documentseries", "setDetailPage", this.setDetailPage, this);
        },
            
        setDetailPage: function (channel, event, data) {
            this.detailView = sap.ui.view({
                viewName: "sap.ui.elev8rerp.componentcontainer.view.ApplicationSettings." + data.viewName,
                type: "XML"
            });
            
            this.detailView.setModel(data.viewModel,"viewModel"); 
            this.oFlexibleColumnLayout.removeAllMidColumnPages();          
            this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
        },

		onListItemPress : function(oEvent){
			var viewModel = oEvent.getSource().getBindingContext("documentseriesModel");                                			
			var model = {
				"id" : viewModel.getProperty("id"),
				"docseriesid" : viewModel.getProperty("docseriesid"),
				"docname" : viewModel.getProperty("docname"),
				"doccode" : viewModel.getProperty("doccode"),
				"length" : viewModel.getProperty("length"),
				"startwith" : viewModel.getProperty("startwith"),
				"endto" : viewModel.getProperty("endto"),
				"prefix" : viewModel.getProperty("prefix"),
				"financialyearsettingid" : this.getView().byId("cmbFinancialYear").getSelectedKey(),
				"default" : viewModel.getProperty("default")
			}
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("documentseries", "setDetailPage", { viewName: "DocumentSeriesDetail", viewModel : model });            
		},

		onAddNew: function (oEvent) {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("documentseries", "setDetailPage", { viewName: "DocumentSeriesDetail" });
		},

		onSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");
			var contains = sap.ui.model.FilterOperator.Contains;
			var columns = ['documentseriesname', 'locationname','warehousename','machinetype'];
			var filters = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, contains, sQuery);
			}),
				false);

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [filters];
			}

			this.getView().byId("tblDocumentSeries").getBinding("items").filter(oTableSearchState, "Application");
		},

		onSort: function (oEvent) {
			this._bDescendingSort = !this._bDescendingSort;
			var oView = this.getView(),
				oTable = oView.byId("tblDocumentSeries"),
				oBinding = oTable.getBinding("items"),
				oSorter = new Sorter("documentseriesname", this._bDescendingSort);
			oBinding.sort(oSorter);
		},

		loadData : function(){
			var currentContext = this;	
			var settingid =  this.getView().byId("cmbFinancialYear").getSelectedKey();
			documentseriesService.getAllFinancialYearDocSeries({settingid : settingid}, function(data){
              
				for(var i = 0; i < data[0].length ; i++){
					data[0][i].active = data[0][i].active == 1 ? true : false;
				}
				var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({modelData : data[0]}); 
				currentContext.getView().setModel(oModel,"documentseriesModel");
			});
		},

		onMasterPressed: function (oEvent) {
			var oContext = oEvent.getParameter("listItem").getBindingContext("side");
			var sPath = oContext.getPath() + "/selected";
			oContext.getModel().setProperty(sPath, true);
			var sSelectedMasterElement = oContext.getProperty("title");
			var sKey = oContext.getProperty("key");
			this.getRouter().getTargets().display(sKey, {});
			this.getRouter().navTo(sKey);
		},
        
    });
    
}, true);
