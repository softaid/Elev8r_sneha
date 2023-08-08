/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/Element","./Core","sap/ui/vk/tools/RedlineTool","./RedlineConversation","sap/ui/vk/uuidv4","sap/ui/vk/RedlineUpgradeManager","sap/ui/core/Core"],function(e,t,i,o,r,n,s){"use strict";var a=e.extend("sap.ui.vk.RedlineCollaboration",{metadata:{library:"sap.ui.vk",aggregations:{conversations:{singularName:"conversation",type:"sap.ui.vk.RedlineConversation",multiple:true}},associations:{viewport:{type:"sap.ui.vk.Viewport",multiple:false},activeConversation:{type:"sap.ui.vk.RedlineConversation",multiple:false},activeComment:{type:"sap.ui.vk.RedlineComment",multiple:false}},events:{elementCreated:{parameters:{element:"object"}},elementClicked:{parameters:{elementId:"string"}},elementHovered:{parameters:{elementId:"string"}},conversationActivating:{parameters:{conversation:"sap.ui.vk.RedlineConversation"}},conversationActivated:{parameters:{conversation:"sap.ui.vk.RedlineConversation",viewportLocked:"boolean"}}}},constructor:function(t,i){e.apply(this,arguments);if(typeof t==="object"){i=t;t=undefined}this._elementId=i&&i.elementId?i.elementId:r()}});a.prototype.init=function(){this._header=new Map};a.prototype.exit=function(){if(this._tool){this._tool.setActive(false);this._tool.destroy();this._tool=null}var e=s.byId(this.getViewport());if(e){var t=e.getMeasurementSurface();t.detachMeasurementsAdded(this._onmMeasurementsAdded,this);t.detachMeasurementsRemoving(this._onMeasurementsRemoving,this);t.detachScaleChanged(this._onMeasurementsScaleChanged,this)}};a.prototype.getElementId=function(){return this._elementId};a.prototype.setViewport=function(e){this.setAssociation("viewport",e);if(!this._tool){this._tool=new i;this._tool.attachElementCreated(this._onElementCreated,this);this._tool.attachElementClicked(this._onElementClicked,this);this._tool.attachElementHovered(this._onElementHovered,this)}else{this._tool.setActive(false,e)}e.addTool(this._tool);var t=e.getMeasurementSurface();t.attachMeasurementsAdded(this._onMeasurementsAdded,this);t.attachMeasurementsRemoving(this._onMeasurementsRemoving,this);t.attachScaleChanged(this._onMeasurementsScaleChanged,this);return this};a.prototype._onMeasurementsAdded=function(e){var t=e.getParameter("measurements");if(this.getActiveConversation()){var i=s.byId(this.getActiveConversation());var o;if(this.getActiveComment()){o=s.byId(this.getActiveComment())}t.forEach(function(e){var t=e.toJSON();i.addMeasurement(t);if(o){o.addMeasurement(t.id)}},this)}};a.prototype._onMeasurementsRemoving=function(e){var t=e.getParameter("measurements");if(this.getActiveConversation()){var i=s.byId(this.getActiveConversation());t.forEach(function(e){var t=e.getId();i.removeMeasurement(t);var o=i.getComments();o.forEach(function(e){e.removeMeasurement(t)})})}};a.prototype._onMeasurementsScaleChanged=function(e){var t=e.getParameter("newScale");if(this.getActiveConversation()){var i=s.byId(this.getActiveConversation());i.setMeasurementScale(t)}};a.prototype._onElementHovered=function(e){this.fireElementHovered({elementId:e.getParameter("elementId")})};a.prototype._onElementCreated=function(e){var t=e.getParameter("element");if(this.getActiveConversation()){var i=s.byId(this.getActiveConversation());i.addContent(t);this._tool.destroyRedlineElements();i._activate(this._tool)}if(this.getActiveComment()){var o=s.byId(this.getActiveComment());o.addContent(t)}this.fireElementCreated({element:t})};a.prototype._onElementClicked=function(e){this.fireElementClicked({elementId:e.getParameter("elementId")})};a.prototype.setHeaderProperty=function(e,t){this._header.set(e,t);return this};a.prototype.getHeaderProperty=function(e){return this._header.get(e)};a.prototype.removeHeaderProperty=function(e){this._header.delete(e);return this};a.prototype.createConversation=function(e){var t=new o({conversationName:e});this.addConversation(t);this.setActiveConversation(t);return t};a.prototype.setActiveConversation=function(e){var i=s.byId(this.getActiveConversation());if(i){if(i.getViewInfo()){var o=this._updateViewInfo();i.setViewInfo(o)}i._deactivate()}this.setAssociation("activeConversation",e);var r=s.byId(this.getViewport());if(!r){return this}if(!e){this._tool.setActive(false,r);return this}this.fireConversationActivating({conversation:e});this._tool.destroyRedlineElements();if(e.getViewInfo()){var n=s.byId(r.getContentConnector()).getContent();var a=n.getViews();var l;for(var v=0;v<a.length;v++){if(a[v].getViewId()===e.getViewId()){l=a[v]}}if(l){t.getEventBus().subscribe("sap.ui.vk","readyForAnimation",this._readyForAnimation,this);var h=s.byId(r.getViewStateManager());var d=s.byId(h.getViewManager());this._activatingView=true;if(this._tool.getActive()){this._tool.setActive(false,r)}d.activateView(l,true,true)}if(!this._tool.getActive()){this._tool.setActive(true,r)}}else if(this._tool.getActive()){this._tool.setActive(false,r)}if(e.getContent()){e._activate(this._tool)}if(e.getMeasurements()){var m=e.getMeasurements();r.getMeasurementSurface().fromJSON({measurements:m,scale:e.getMeasurementScale()},true);r.setShouldRenderFrame()}this.fireConversationActivated({conversation:e,viewportLocked:this._tool.getActive()});return this};a.prototype._readyForAnimation=function(){var e=s.byId(this.getViewport());if(!e){return}var i=s.byId(this.getActiveConversation());if(i){var o=s.byId(e.getViewStateManager()).getAnimationPlayer();o.setTime(i.getAnimationOffset());var r=i.getViewInfo();if(e.getCamera()&&e.getCamera().getCameraRef()){var n=e.getCamera().getCameraRef();if(r.camera.view&&n&&!n.view){n.view=r.camera.view;n.view.enabled=true}}e.setViewInfo(r)}this._activatingView=false;t.getEventBus().unsubscribe("sap.ui.vk","readyForAnimation",this._readyForAnimation,this)};a.prototype.createElement=function(e){var t=s.byId(this.getActiveConversation());var i=s.byId(this.getViewport());if(!i){return e}if(t&&!t.getViewInfo()){var o=this._updateViewInfo();t.setViewId(i.getCurrentView().getViewId());t.setViewInfo(o);t.setAnimationOffset(s.byId(i.getViewStateManager()).getAnimationPlayer().getTime())}if(!this._tool.getActive()){this._tool.setActive(true,i)}this._tool.startAdding(e);return e};a.prototype.deactivateRedlineDrawing=function(){if(this._tool){this._tool.stopAdding()}return this};a.prototype.removeElement=function(e){var t=s.byId(this.getActiveConversation());if(t){t.removeContent(e);this._tool.destroyRedlineElements();t._activate(this._tool)}return this};a.prototype._normalizeElementsArray=function(e){var t=[];var i=this.getActiveRedlineElements();if(Array.isArray(e)){for(var o=0;o<e.length;o++){if(e[o]instanceof sap.ui.vk.RedlineElement){t.push(e[o])}else{for(var r=0;r<i.length;r++){if(e[o]===i[r].getElementId()){t.push(i[r])}}}}}else if(e instanceof sap.ui.vk.RedlineElement){t.push(e)}else{for(var n=0;n<i.length;n++){if(e===i[n].getElementId()){t.push(i[n])}}}return t};a.prototype.setHighlight=function(e,t){if(!e){return this}var i=this._normalizeElementsArray(e);for(var o=0;o<i.length;o++){var r=i[o];r.setHalo(true);if(t){r.setHaloColor(t)}else if(this._tool._haloColor){r.setHaloColor(this._tool._haloColor)}else{r.setHaloColor("rgba(255, 0, 0, 1)")}}this._tool.getGizmo().rerender();return this};a.prototype.setDefaultHighlightColor=function(e){if(e){this._tool._haloColor=e}return this};a.prototype.clearHighlight=function(e){if(!e){return this}var t=this._normalizeElementsArray(e);for(var i=0;i<t.length;i++){t[i].setHalo(false)}this._tool.getGizmo().rerender();return this};a.prototype.addStyleClass=function(e){if(e&&this._tool){this._tool.getGizmo().addStyleClass(e)}return this};a.prototype.removeStyleClass=function(e){if(e&&this._tool){this._tool.getGizmo().removeStyleClass(e)}return this};a.prototype.toggleStyleClass=function(e){if(e&&this._tool){this._tool.getGizmo().toggleStyleClass(e)}return this};a.prototype._updateViewInfo=function(){var e=s.byId(this.getViewport());if(!e){return{}}var t={camera:{matrices:true},visibility:true,selection:true};var i=e.getViewInfo(t);return i};a.prototype.freezeView=function(){var e=s.byId(this.getActiveConversation());var t=s.byId(this.getViewport());if(!t){return this}if(e&&!e.getViewInfo()){var i=this._updateViewInfo();e.setViewId(t.getCurrentView().getViewId());e.setViewInfo(i);e.setAnimationOffset(s.byId(t.getViewStateManager()).getAnimationPlayer().getTime())}if(!this._tool.getActive()){this._tool.setActive(true,t)}return this};a.prototype.unfreezeView=function(){var e=s.byId(this.getActiveConversation());if(e){var t=e.getComments();if(this._tool.getActive()&&this._tool.getRedlineElements().length===0&&(t.length===0||t.length===1&&!t[0].getText())){this._tool.setActive(false);e.setViewInfo(null)}}return this};a.prototype.getActiveRedlineElements=function(){if(this._tool){var e=this._tool.getRedlineElements();return e}};a.prototype._createConversationFromJSON=function(e){var t=new o;var i=t.importJSON(e);this.addConversation(t);return i};a.prototype.importJSON=function(e){e=n.upgrade(e);var t=new Set;this.setActiveConversation(null);this.destroyConversations();this.setActiveComment(null);var i=Object.entries(e.header);for(var o=0;o<i.length;o++){this.setHeaderProperty(i[o][0],i[o][1])}this._elementId=this.getHeaderProperty("elementId");var r=e.conversations;if(r){for(var s=0;s<r.length;s++){var a=this._createConversationFromJSON(r[s]);a.forEach(t.add,t)}}var l=this.getHeaderProperty("initialConversation");var v=this.getConversations();var h;if(v){for(var d=0;d<v.length;d++){if(v[d].getElementId()===l){h=v[d];break}}}this.setActiveConversation(h);return t};a.prototype.exportJSON=function(){var e="";if(this.getActiveConversation()){var t=s.byId(this.getActiveConversation());if(!this._activatingView&&t.getViewInfo()){var i=this._updateViewInfo();t.setViewInfo(i)}e=t.getElementId()}this.setHeaderProperty("initialConversation",e);if(!this.getHeaderProperty("elementId")){this.setHeaderProperty("elementId",this._elementId)}var o=Object.fromEntries(this._header);var r={schemaVersion:"1.0",header:o,conversations:this.getConversations().map(function(e){return e.exportJSON()})};return r};return a});