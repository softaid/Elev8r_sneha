/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Control","sap/ui/core/delegate/ScrollEnablement","sap/ui/core/Element","./ScrollContainerRenderer","sap/ui/dom/denormalizeScrollBeginRTL","sap/ui/core/Configuration"],function(e,o,t,r,l,i,n){"use strict";var a=o.extend("sap.m.ScrollContainer",{metadata:{library:"sap.m",properties:{width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"auto"},height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"auto"},horizontal:{type:"boolean",group:"Behavior",defaultValue:true},vertical:{type:"boolean",group:"Behavior",defaultValue:false},focusable:{type:"boolean",group:"Behavior",defaultValue:false}},defaultAggregation:"content",aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"}},dnd:{draggable:false,droppable:true},designtime:"sap/m/designtime/ScrollContainer.designtime"},renderer:l});a.prototype.init=function(){this._oScroller=new t(this,this.getId()+"-scroll",{horizontal:true,vertical:false})};a.prototype.onBeforeRendering=function(){this._oScroller.setHorizontal(this.getHorizontal());this._oScroller.setVertical(this.getVertical())};a.prototype.exit=function(){if(this._oScroller){this._oScroller.destroy();this._oScroller=null}};a.prototype.getScrollDelegate=function(){return this._oScroller};a.prototype.scrollTo=function(e,o,t){if(this._oScroller){var r=this.getDomRef();if(r){if(n.getRTL()){e=i(e,r)}this._oScroller.scrollTo(e,o,t)}else{this._oScroller._scrollX=e;this._oScroller._scrollY=o}}return this};a.prototype.scrollToElement=function(e,o){if(e instanceof r){e=e.getDomRef()}if(this._oScroller){this._oScroller.scrollToElement(e,o)}return this};return a});