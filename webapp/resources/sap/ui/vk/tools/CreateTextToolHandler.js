/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/base/EventProvider","../svg/Element"],function(t,e){"use strict";var o=t.extend("sap.ui.vk.tools.CreateTextToolHandler",{metadata:{library:"sap.ui.vk"},constructor:function(t){this._priority=30;this._tool=t;this._rect=null}});o.prototype._getPosition=function(t){return this._tool._viewport._camera._screenToWorld(t.x-this._rect.x,t.y-this._rect.y)};o.prototype.hover=function(t){};o.prototype.beginGesture=function(t){};o.prototype.move=function(t){};o.prototype.endGesture=function(t){};o.prototype.click=function(t){var e=this._tool.getGizmo();if(e&&this._inside(t)){this._tool.getGizmo()._createText(this._getPosition(t),"Text");t.handled=true}};o.prototype.doubleClick=function(t){};o.prototype.contextMenu=function(t){};o.prototype.getViewport=function(){return this._tool._viewport};o.prototype._getOffset=function(t){var e=t.getBoundingClientRect();var o={x:e.left+window.pageXOffset,y:e.top+window.pageYOffset};return o};o.prototype._inside=function(t){var e=this._tool._viewport.getIdForLabel();var o=document.getElementById(e);if(o==null){return false}var i=this._getOffset(o);this._rect={x:i.x,y:i.y,w:o.offsetWidth,h:o.offsetHeight};return t.x>=this._rect.x&&t.x<=this._rect.x+this._rect.w&&t.y>=this._rect.y&&t.y<=this._rect.y+this._rect.h};return o});