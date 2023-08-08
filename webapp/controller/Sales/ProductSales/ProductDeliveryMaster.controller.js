
sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController'

  ], function (BaseController) {
        
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Sales.ProductSales.ProductDeliveryMaster", {

       metadata: {
           manifest: "json"
       },

       onInit: function() {		
         this.bus = sap.ui.getCore().getEventBus();
         this.bus.subscribe("productdeliverymaster", "setDetailPage", this.setDetailPage, this);     
         this.oFlexibleColumnLayout = this.byId("fclProductDeliveryMaster");
       },
 
       onExit: function () {
          this.bus.unsubscribe("productdeliverymaster", "setDetailPage", this.setDetailPage, this);
       },

       setDetailPage: function (channel, event, data) {
           this.detailView = sap.ui.view({
              viewName: "sap.ui.elev8rerp.componentcontainer.view.Sales.ProductSales." + data.viewName,
              type: "XML"
           });

           this.detailView.setModel(data.viewModel,"viewModel");            
           this.oFlexibleColumnLayout.removeAllMidColumnPages();			          
           this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
           this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
        },

        //lazy loading of view on tab select        
        onTabSelect : function(oControlEvent){
            // var key = oControlEvent.getParameters().key;
            // var item = oControlEvent.getParameter("item");
            // var isViewRendered = item.getContent().length > 0;

            // //render view if it is not rendered previously
            // if(!isViewRendered){
            //     if(key === "processed"){
            //          var view = new sap.ui.view({  
            //             viewName: "sap.ui.elev8rerp.componentcontainer.view.Sales.ProductDelivery.",
            //             type: "XML",      
            //          });
            //          item.addContent(view);
            //     }
            //     // else if(key === "brooding"){
            //     //   var view = new sap.ui.view({  
            //     //      viewName: "sap.ui.elev8rerp.componentcontainer.view.Breeder.Master.BroodingMaster",
            //     //      type: "XML",      
            //     //   });
            //     //   item.addContent(view);
            //     // }
            // }          
        }

    });
});