
sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController'

  ], function (BaseController) {
        
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Warehouse.WarehouseMaster", {

       onInit: function() {		
         this.bus = sap.ui.getCore().getEventBus();
         this.bus.subscribe("warehousemaster", "setDetailPage", this.setDetailPage, this);     
         this.oFlexibleColumnLayout = this.byId("fclWarehouseMaster");
         this.fnShortcutkeys();
       },
 
       onExit: function () {
          this.bus.unsubscribe("warehousemaster", "setDetailPage", this.setDetailPage, this);
       },

       fnShortcutkeys: function () {
        var oIconTabBar = this.getView().byId("warehousemasterid");
        var xTriggered = 0;
        $(document).keydown(function (event) {
            if (event.keyCode == 9 && event.shiftKey) {
                if (xTriggered == 2) {
                    xTriggered = 0;
                }
                event.preventDefault();
                if (xTriggered == 0) {
                    oIconTabBar.fireSelect({ //trying to select the WIP tab dynamically without a user click
                        key: "warehousebin",
                        item: oIconTabBar.getItems()[1]
                    });
                    oIconTabBar.setSelectedKey("warehousebin");

                }
                if (xTriggered == 1) {
                    oIconTabBar.fireSelect({ //trying to select the WIP tab dynamically without a user click
                        key: "warehouse",
                        item: oIconTabBar.getItems()[0]

                    });
                    oIconTabBar.setSelectedKey("warehouse");
                }
                xTriggered++;


            }
        })
    },

       setDetailPage: function (channel, event, data) {
           this.detailView = sap.ui.view({
              viewName: "sap.ui.elev8rerp.componentcontainer.view.Warehouse." + data.viewName,
              type: "XML"
           });

           this.detailView.setModel(data.viewModel,"viewModel");            
           this.oFlexibleColumnLayout.removeAllMidColumnPages();			          
           this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
           this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
        },

        //lazy loading of view on tab select        
        onTabSelect : function(oControlEvent){
            var key = oControlEvent.getParameters().key;
            var item = oControlEvent.getParameter("item");
            var isViewRendered = item.getContent().length > 0;

            //render view if it is not rendered previously
            if(!isViewRendered){
                if(key === "warehousebin"){
                     var view = new sap.ui.view({  
                        viewName: "sap.ui.elev8rerp.componentcontainer.view.Warehouse.WarehouseBin",
                        type: "XML",      
                     });
                     item.addContent(view);
                }
            } 
            if(key === "warehousebin"){  
                this.bus.publish("warehousebin", "onTabChangeToWarehouseBin", { viewName: "WarehouseBin" });
            }
            
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);          
        }

    });
});