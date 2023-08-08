// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/Config","sap/base/Log","sap/m/Text"],function(e,i,t){"use strict";var l={apiVersion:2};l.render=function(t,l){var n=null,s;try{n=l.getTileViews()[0]}catch(e){i.warning("Failed to load tile view: ",e.message);n=l.getFailedtoLoadViewText()}var o=l.getParent();var a=[];if(o&&o.getTiles){a=o.getTiles()}else if(o&&o.getAppBoxesContainer&&o.getCustomTilesContainer){a=o.getAppBoxesContainer().concat(o.getCustomTilesContainer())}var r=a.filter(function(e){return e.getVisible()});var c=r.indexOf(l)>-1?r.indexOf(l)+1:"";if(!o){return}t.openStart("li",l);if(e.last("/core/shell/model/enableHelp")){t.attr("data-help-id",l.getTileCatalogId())}t.class("sapUshellTile");if(l.getTileActionModeActive()){t.class("sapUshellTileWrapper")}if(n&&n.getContent){s=n.getContent();s.forEach(function(e){if(e.isA("sap.m.GenericTile")){t.class("sapUshellFeedTileBG")}})}if(l.getLong()){t.class("sapUshellLong")}if(!l.getVisible()){t.class("sapUshellHidden")}if(l.getIsLocked()){t.class("sapUshellLockedTile")}if(e.last("/core/home/sizeBehavior")==="Small"){t.class("sapUshellSmall")}t.attr("aria-posinset",c);t.attr("aria-setsize",r.length);var d=o.getId()+"-titleText";t.attr("aria-describedby",d);t.openEnd();if(l.getTileActionModeActive()){this.renderTileActionMode(t,l);this.renderTileView(t,l,n)}else{t.openStart("div");t.class("sapUshellTileWrapper");t.openEnd();this.renderTileView(t,l,n);if(l.getShowActionsIcon()){t.renderControl(l.actionIcon)}t.close("div");this.renderTileActionsContainer(t,n,l.getPinButton())}t.close("li")};l.renderTileActionsContainer=function(e,i,t){t=t.length?t[0]:undefined;if(t){t.addStyleClass("sapUshellActionButton");e.openStart("div");e.class("sapUshellTilePinButtonOverlay");if(i.getHeader){e.attr("role","toolbar");e.attr("aria-label",i.getHeader())}e.openEnd();e.renderControl(t);e.close("div")}};l.renderTileView=function(e,i,t){e.openStart("div");e.class("sapUshellTileInner");if(i.getTileActionModeActive()){e.class("sapUshellTileActionBG")}e.openEnd();e.renderControl(t);e.close("div")};l.renderTileActionMode=function(e,i){e.openStart("div");e.class("sapUshellTileActionLayerDiv");e.openEnd();if(!i.getIsLocked()){e.openStart("div");e.class("sapUshellTileDeleteClickArea");e.openEnd();e.openStart("div");e.class("sapUshellTileDeleteIconOuterClass");e.openEnd();e.renderControl(i._initDeleteAction());e.close("div");e.close("div")}e.openStart("div");e.class("sapUshellTileActionDivCenter");e.openEnd();e.close("div");e.openStart("div");e.class("sapUshellTileActionIconDivBottom");e.openEnd();e.openStart("div");e.class("sapUshellTileActionIconDivBottomInnerDiv");e.openEnd();e.renderControl(i.getActionSheetIcon());e.close("div");e.close("div");e.close("div")};return l},true);