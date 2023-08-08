/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","./library","sap/ui/core/Element","sap/ui/core/Control","sap/m/Popover","sap/ui/core/delegate/ItemNavigation","sap/ui/core/InvisibleText","./NavigationListRenderer","sap/base/Log"],function(t,e,i,o,s,a,n,r,p){"use strict";var l=o.extend("sap.tnt.NavigationList",{metadata:{library:"sap.tnt",properties:{width:{type:"sap.ui.core.CSSSize",group:"Dimension"},expanded:{type:"boolean",group:"Misc",defaultValue:true},selectedKey:{type:"string",group:"Data"}},defaultAggregation:"items",aggregations:{items:{type:"sap.tnt.NavigationListItem",multiple:true,singularName:"item"}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"},selectedItem:{type:"sap.tnt.NavigationListItem",multiple:false}},events:{itemSelect:{parameters:{item:{type:"sap.ui.core.Item"}}}}},renderer:r});l.prototype.init=function(){this._itemNavigation=new a;this._itemNavigation.setCycling(false);this.addEventDelegate(this._itemNavigation);this._itemNavigation.setPageSize(10);this._itemNavigation.setDisabledModifiers({sapnext:["alt","meta"],sapprevious:["alt","meta"]})};l.prototype.onBeforeRendering=function(){var t=this.getSelectedKey();this.setSelectedKey(t)};l.prototype.onAfterRendering=function(){this._itemNavigation.setRootDomRef(this.getDomRef());this._itemNavigation.setItemDomRefs(this._getDomRefs())};l.prototype._updateNavItems=function(){this._itemNavigation.setItemDomRefs(this._getDomRefs())};l.prototype._getDomRefs=function(){var e=[],i=this.getItems(),o=this.getExpanded();for(var s=0;s<i.length;s++){if(o){t.merge(e,i[s]._getDomRefs())}else{e.push(i[s].getDomRef())}}return e};l.prototype._adaptPopoverPositionParams=function(){if(this.getShowArrow()){this._marginLeft=10;this._marginRight=10;this._marginBottom=10;this._arrowOffset=8;this._offsets=["0 -8","8 0","0 8","-8 0"];this._myPositions=["center bottom","begin top","center top","end top"];this._atPositions=["center top","end top","center bottom","begin top"]}else{this._marginTop=0;this._marginLeft=0;this._marginRight=0;this._marginBottom=0;this._arrowOffset=0;this._offsets=["0 0","0 0","0 0","0 0"];this._myPositions=["begin bottom","begin top","begin top","end top"];this._atPositions=["begin top","end top","begin bottom","begin top"]}};l.prototype.exit=function(){if(this._itemNavigation){this._itemNavigation.destroy()}if(this._popover){this._popover.destroy()}};l.prototype._selectItem=function(t){this.fireItemSelect(t);var e=t.item;this.setSelectedItem(e,true)};l.prototype._findItemByKey=function(t){var e=this.getItems(),i,o,s,a,n;for(a=0;a<e.length;a++){i=e[a];if(i._getUniqueKey()===t){return i}o=i.getItems();for(n=0;n<o.length;n++){s=o[n];if(s._getUniqueKey()===t){return s}}}return null};l.prototype.setSelectedKey=function(t){var e=this._findItemByKey(t);this.setSelectedItem(e,true);this.setProperty("selectedKey",t,true);return this};l.prototype.getSelectedItem=function(){var t=this.getAssociation("selectedItem");if(!t){return null}return sap.ui.getCore().byId(t)};l.prototype.setSelectedItem=function(t){var e,o,s;if(this._selectedItem){this._selectedItem._unselect()}if(!t){this._selectedItem=null}s=t instanceof i&&t.isA("sap.tnt.NavigationListItem");if(typeof t!=="string"&&!s){p.warning("Type of selectedItem association should be string or instance of sap.tnt.NavigationListItem. New value was not set.");this.setAssociation("selectedItem",null,true);return this}this.setAssociation("selectedItem",t,true);if(typeof t==="string"){e=sap.ui.getCore().byId(t)}else{e=t}o=e?e._getUniqueKey():"";this.setProperty("selectedKey",o,true);if(e){e._select();this._selectedItem=e;return this}p.warning("Type of selectedItem association should be a valid NavigationListItem object or ID. New value was not set.");return this};l.prototype._openPopover=function(t,e){var i=this;var o=e.getSelectedItem();if(o&&e.isGroupSelected){o=null}var a=this._popover=new s({showHeader:false,horizontalScrolling:false,verticalScrolling:true,initialFocus:o,afterClose:function(){if(i._popover){i._popover.destroy();i._popover=null}},content:e,ariaLabelledBy:n.getStaticId("sap.tnt","NAVIGATION_LIST_DIALOG_TITLE")}).addStyleClass("sapContrast sapContrastPlus");a._adaptPositionParams=this._adaptPopoverPositionParams;a.openBy(t)};l.prototype._closePopover=function(){if(this._popover){this._popover.close()}};return l});