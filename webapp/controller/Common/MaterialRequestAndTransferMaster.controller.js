
sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/ui/elev8rerp/componentcontainer/utility/SessionManager', 
    
  ], function (BaseController, Filter, FilterOperator, Sorter) {
        "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Common.MaterialRequestAndTransferMaster", {

        onInit: function() {	

            this.bus = sap.ui.getCore().getEventBus();
            this.bus.subscribe("materialrequestandtransfer", "setDetailPage", this.setDetailPage, this);     
            this.oFlexibleColumnLayout = this.byId("fclMaterialRequestTransfer");
        },
 
        onExit: function () {
            this.bus.unsubscribe("materialrequestandtransfer", "setDetailPage", this.setDetailPage, this);
        },

        setDetailPage: function (channel, event, data) {
            this.detailView = sap.ui.view({
                viewName: "sap.ui.elev8rerp.componentcontainer.view.Common." + data.viewName,
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
                if(key === "materialtransfer"){         
                     var view = new sap.ui.view({  
                        viewName: "sap.ui.elev8rerp.componentcontainer.view.Common.MaterialTransfer",
                        type: "XML",      
                     });
                     item.addContent(view);
                }
            } 
            if(key === "materialtransfer"){  
                this.bus.publish("materialtransfer", "onTabChangeToTransfer", { viewName: "MaterialTransfer" });
            }
            
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);         
        }
    });
});