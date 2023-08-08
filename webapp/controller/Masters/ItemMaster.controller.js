
sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController'

], function (BaseController) {

    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Masters.ItemMaster", {

        onInit: function () {
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.subscribe("itemmaster", "setDetailPage", this.setDetailPage, this);
            this.oFlexibleColumnLayout = this.byId("fclItemMaster");
            this.fnShortcutkeys()
        },

        onExit: function () {
            this.bus.unsubscribe("itemmaster", "setDetailPage", this.setDetailPage, this);
        },
        fnShortcutkeys: function () {
            var oIconTabBar = this.getView().byId("idIconTabBar");
            var xTriggered = 0;
            $(document).keydown(function (event) {
                if (event.keyCode == 9 && event.shiftKey) {
                    if (xTriggered == 3) {
                        xTriggered = 0;
                    }
                    event.preventDefault();
                    if (xTriggered == 0) {
                        oIconTabBar.fireSelect({ //trying to select the WIP tab dynamically without a user click
                            key: "item",
                            item: oIconTabBar.getItems()[1]
                        });
                        oIconTabBar.setSelectedKey("item");

                    }
                    if (xTriggered == 1) {
                        oIconTabBar.fireSelect({ //trying to select the WIP tab dynamically without a user click
                            key: "hsn",
                            item: oIconTabBar.getItems()[2]

                        });
                        oIconTabBar.setSelectedKey("hsn");
                    }

                    if (xTriggered == 2) {
                        oIconTabBar.fireSelect({ //trying to select the WIP tab dynamically without a user click
                            key: "itemGroup",
                            item: oIconTabBar.getItems()[0]
                        });
                        oIconTabBar.setSelectedKey("itemGroup");
                    }
                    xTriggered++;


                }
            })
        },

        setDetailPage: function (channel, event, data) {

            this.detailView = sap.ui.view({
                viewName: "sap.ui.elev8rerp.componentcontainer.view.Masters." + data.viewName,
                type: "XML"
            });

            this.detailView.setModel(data.viewModel, "viewModel");
            this.oFlexibleColumnLayout.removeAllMidColumnPages();
            this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
            this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
        },

        //lazy loading of view on tab select        
        onTabSelect: function (oControlEvent) {
            var key = oControlEvent.getParameters().key;
            var item = oControlEvent.getParameter("item");
            var isViewRendered = item.getContent().length > 0;

            //render view if it is not rendered previously
            if (!isViewRendered) {
                if (key === "itemGroup") {
                    var view = new sap.ui.view({
                        viewName: "sap.ui.elev8rerp.componentcontainer.view.Masters.ItemGroup",
                        type: "XML",
                    });
                    item.addContent(view);
                }
                else if (key === "item") {
                    var view = new sap.ui.view({
                        viewName: "sap.ui.elev8rerp.componentcontainer.view.Masters.Item",
                        type: "XML",
                    });
                    item.addContent(view);
                }

                else if (key === "hsn") {
                    var view = new sap.ui.view({
                        viewName: "sap.ui.elev8rerp.componentcontainer.view.Masters.ItemHSN",
                        type: "XML",
                    });
                    item.addContent(view);
                }
            }



        }

    });
});