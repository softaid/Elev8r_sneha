
sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    "sap/ui/model/json/JSONModel",   
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageToast',
	'sap/ui/elev8rerp/componentcontainer/services/Company/ManageSubscription.service',    
    
], function (BaseController,JSONModel, Filter, FilterOperator, Sorter, MessageToast, manageSubscriptionService) {
        "use strict";

     return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.CompanySettings.LicenseManagementDetail", {

        metadata: {
           manifest: "json"
        },

        onInit: function() {	
			
           
		},
		
		onBeforeRendering: function () {
		
            this.model = this.getView().getModel("viewModel");
			var oModel = new JSONModel();

		    if(this.model != undefined){				

				console.log('viewModel User -', this.model);

				this.getUserLicensesDdl(this.model);

			  	oModel.setData(this.model);
			  
			}
			else{
                oModel.setData({ id : null} ); 
			}

			this.getView().setModel(oModel,"userDetailModel");
		},

		getUserLicensesDdl: function(model){
			var currentContext = this;
			console.log('model.id : ', model.id);
            manageSubscriptionService.userLicensesDdl({'userid' : model.id },  function (data) {
                var oModel = new JSONModel();
                console.log("User Licenses Ddl data loaded : ", data[0])
                oModel.setData({ modelData: data[0] });
				currentContext.getView().setModel(oModel, "userLicenseDdlModel");
				
				console.log('model.subscriptionids : ',model.subscriptionids);
				var arrSids = model.subscriptionids != null ? model.subscriptionids.split(',') : [];
				//setTimeout(function(){
					if(arrSids.length > 0){
						currentContext.byId("cboUserLicenses").setSelectedKeys(arrSids);
					}
				//},300)
				
            });
		},


		onSave: function () {
			var currentContext = this;
			
			var model = this.getView().getModel("userDetailModel").oData;

				var licenses = currentContext.byId("cboUserLicenses").getSelectedKeys().join();
				model["userid"] = model.id;
				model["licenses"] = licenses;

				//console.log('Save Model getSelectedKeys : ', licenses, currentContext.byId("cboUserLicenses").getSelectedKeys());

                console.log('Save Model : ', model);

                manageSubscriptionService.saveSubscription(model, function (data) {
                   if (data.id > 0) {
						MessageToast.show("User license updated!");
						
						currentContext.bus = sap.ui.getCore().getEventBus();
						currentContext.bus.publish("licensemanagementmaster", "userlicenselist");
						currentContext.bus = sap.ui.getCore().getEventBus();
						currentContext.bus.publish("licensemanagementmaster", "activelicenselist");
                        currentContext.onCancel();
                    }
                });
            //}
        },
		

        handleSelectionChange: function(oEvent) {
			var changedItem = oEvent.getParameter("changedItem");
			var isSelected = oEvent.getParameter("selected");

			var state = "Selected";
			if (!isSelected) {
				state = "Deselected";
			}

			// MessageToast.show("Event 'selectionChange': " + state + " '" + changedItem.getText() + "'", {
			// 	width: "auto"
			// });
		},

		handleSelectionFinish: function(oEvent) {
			var selectedItems = oEvent.getParameter("selectedItems");
			var messageText = "Event 'selectionFinished': [";

			for (var i = 0; i < selectedItems.length; i++) {
				messageText += "'" + selectedItems[i].getText() + "'";
				if (i != selectedItems.length - 1) {
					messageText += ",";
				}
			}

			messageText += "]";

			// MessageToast.show(messageText, {
			// 	width: "auto"
			// });
		},


        onCancel : function()
		{
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---licensemanagement--fclLicenseDetail");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}
    });
});