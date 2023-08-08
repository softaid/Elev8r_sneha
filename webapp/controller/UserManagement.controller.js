
sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
  ], function (BaseController, Filter, FilterOperator, Sorter) {
        "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.UserManagement", {

        metadata: {
           manifest: "json"
        },

        onInit: function() {	
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.subscribe("usermanagement", "setDetailPage", this.setDetailPage, this);     
            this.oFlexibleColumnLayout = this.byId("fclUserManagement");
        },
 
        onExit: function () {
            this.bus.unsubscribe("usermanagement", "setDetailPage", this.setDetailPage, this);
        },

        setDetailPage: function (channel, event, data) {
            this.detailView = sap.ui.view({
                viewName: "sap.ui.elev8rerp.componentcontainer.view." + data.viewName,
                type: "XML"
            });

            this.detailView.setModel(data.viewModel,"viewModel"); 
            this.oFlexibleColumnLayout.removeAllMidColumnPages();          
            this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
        },

        onTabSelect : function(oControlEvent){
            var key = oControlEvent.getParameters().key;
            var item = oControlEvent.getParameter("item");
            var isViewRendered = item.getContent().length > 0;

            //lazy loading of view
            if(!isViewRendered){
                if(key === "role"){         
                    var view = new sap.ui.view({  
                        viewName: "sap.ui.elev8rerp.componentcontainer.view.Role",
                        type: "XML",      
                    });
                    item.addContent(view);
                }
            }          
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
});