// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/Control","sap/ushell/library"],function(e){"use strict";var t=e.extend("sap.ushell.ui.shell.ToolArea",{metadata:{library:"sap.ushell",aggregations:{toolAreaItems:{type:"sap.ushell.ui.shell.ToolAreaItem",multiple:true}}},renderer:{apiVersion:2,render:function(e,t){e.openStart("div",t);e.class("sapUshellToolArea");if(!t.hasItemsWithText()){e.class("sapUshellToolAreaTextHidden")}e.openEnd();e.openStart("div");e.attr("id",t.getId()+"-cntnt");e.class("sapUshellToolAreaContainer");e.openEnd();var l=t.getToolAreaItems(),s,o;for(s=0;s<l.length;s++){o=l[s];if(o.getVisible()){e.openStart("div");e.class("sapUshellToolAreaContent");if(o.getSelected()){e.class("sapUshellToolAreaItemSelected")}e.openEnd();e.renderControl(o);e.close("div");e.openStart("div");e.class("sapUshellToolAreaContentSeparator");e.openEnd();e.close("div")}}e.close("div");e.close("div")}}});t.prototype.hasItemsWithText=function(){var e=this.getToolAreaItems(),t,l;for(t=0;t<e.length;t++){l=e[t];if(l.getVisible()&&l.getText()){return true}}return false};return t});