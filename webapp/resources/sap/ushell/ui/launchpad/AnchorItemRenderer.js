// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(function(){"use strict";var e={apiVersion:2,render:function(e,t){var s=t.getGroupId(),a=t.getSelected();e.openStart("li",t);e.attr("modelGroupId",s);e.attr("role","tab");e.attr("aria-selected",a);e.class("sapUshellAnchorItem");if(t.getSetsize()){e.attr("aria-posinset",t.getPosinset());e.attr("aria-setsize",t.getSetsize())}if(t.getHelpId()){if(t.getDefaultGroup()){e.class("help-id-homeAnchorNavigationBarItem")}else{e.class("help-id-anchorNavigationBarItem")}e.attr("data-help-id",t.getHelpId())}if(a){e.attr("tabindex","0");e.class("sapUshellAnchorItemSelected")}if(!t.getVisible()||!t.getIsGroupVisible()){e.class("sapUshellShellHidden")}e.openEnd();e.openStart("div",t.getId()+"-inner");e.class("sapUshellAnchorItemInner");if(t.getIsGroupDisabled()){e.class("sapUshellAnchorItemDisabled")}e.openEnd();e.text(t.getTitle());e.close("div");e.close("li")}};return e});