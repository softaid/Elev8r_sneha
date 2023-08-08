
sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
  ], function (BaseController, Filter, FilterOperator, Sorter) {
        "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Application.ManageApplication", {

        metadata: {
           manifest: "json"
        },

        onInit: function() {		
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.subscribe("manageapplication", "setDetailPage", this.setDetailPage, this);     
            this.oFlexibleColumnLayout = this.byId("fclManageApplication");
        },
 
        onExit: function () {
            this.bus.unsubscribe("manageapplication", "setDetailPage", this.setDetailPage, this);
        },

        setDetailPage: function (channel, event, data) {
            this.detailView = sap.ui.view({
                viewName: "sap.ui.elev8rerp.componentcontainer.view.Application." + data.viewName,
                type: "XML"
            });
            this.detailView.setModel(data.viewModel, "viewModel");
            this.oFlexibleColumnLayout.removeAllMidColumnPages();
            this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsMidExpanded);
        },

        //lazy loading of view        
        onTabSelect : function(oControlEvent){
            var key = oControlEvent.getParameters().key;
            var item = oControlEvent.getParameter("item");
            var isViewRendered = item.getContent().length > 0;

            if(!isViewRendered){
                if(key === "rolepermissions"){         
                     var view = new sap.ui.view({  
                        viewName: "sap.ui.elev8rerp.componentcontainer.view.Application.RolePermissions",
                        type: "XML",      
                     });
                     item.addContent(view);
                }
                if(key === "permission"){         
                    var view = new sap.ui.view({  
                       viewName: "sap.ui.elev8rerp.componentcontainer.view.Application.Permission",
                       type: "XML",      
                    });
                    item.addContent(view);
               }
                else if(key === "manageentity"){
                     var view = new sap.ui.view({  
                        viewName: "sap.ui.elev8rerp.componentcontainer.view.Application.ManageEntity",
                        type: "XML",      
                     });
                     item.addContent(view);
                }
                else if(key === "notificationsetting"){
                    var view = new sap.ui.view({  
                       viewName: "sap.ui.elev8rerp.componentcontainer.view.Application.NotificationSetting",
                       type: "XML",      
                    });
                    item.addContent(view);
               }
            }   
            
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
            
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