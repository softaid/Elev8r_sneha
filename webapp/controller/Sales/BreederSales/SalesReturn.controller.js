sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/ui/elev8rerp/componentcontainer/services/Sales/SalesReturn.service',
], function (JSONModel, BaseController, salesReturnService) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.BreederSales.SalesReturn", {
		
		onInit: function () {
            this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("salesreturn", "salesreturn", this.setDetailPage, this);     
			this.bus.subscribe("loaddata", "loadData", this.loadData, this); 	
			this.oFlexibleColumnLayout = this.byId("fclSalesReturn");
			 
			var model = new JSONModel();
			model.setData({modelData : []});
			this.getView().setModel(model, "SalesReturnModel");

			this.loadData();
		},

		loadData : function(){
			var currentContext = this;
			salesReturnService.getAllSalesReturn(function(data){
				
				if(data.length){
					var oModel = new sap.ui.model.json.JSONModel();
					for(var i = 0; i < data[0].length; i++){
						if(data[0][i].statusid ==6261){
							data[0][i].navigation = "Navigation";
						}else{
							data[0][i].navigation = "Inactive";
						}
					}
					oModel.setData({modelData : data[0]});
					currentContext.getView().setModel(oModel, "SalesReturnModel");
				}
			})
		},
		
		onExit: function () {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
		},

		onAddNewRow : function() {
			this.bus = sap.ui.getCore().getEventBus();
			var model = {
				id : null,
				statusid : 6261
			}
			this.bus.publish("salesreturn", "salesreturn", {viewName:"SalesReturnDetail", viewModel : model});
		},

		setDetailPage: function (channel, event, data) {
            this.detailView = sap.ui.view({
                viewName: "sap.ui.elev8rerp.componentcontainer.view.Sales.BreederSales." + data.viewName,
                type: "XML"
            });

            this.detailView.setModel(data.viewModel,"viewModel"); 
            this.oFlexibleColumnLayout.removeAllMidColumnPages();          
            this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
		},
		
		onListItemPress: function (oEvent) {
			var viewModel = oEvent.getSource().getBindingContext("SalesReturnModel");                           						
			var model =  {
				"id" : viewModel.getProperty("id")
            };
            
		    this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("salesreturn", "salesreturn", {viewName:"SalesReturnDetail" , viewModel : model});
		},
	});
}, true);
