/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["../thirdparty/three","./Tool","./AnchorPointToolHandler","./AnchorPointToolGizmo","./AnchorPointToolOperation"],function(t,e,i,o,r){"use strict";var n=e.extend("sap.ui.vk.tools.AnchorPointTool",{metadata:{library:"sap.ui.vk",properties:{enableStepping:{type:"boolean",defaultValue:false},showEditingUI:{type:"boolean",defaultValue:false},allowOperation:{type:"sap.ui.vk.tools.AnchorPointToolOperation",defaultValue:r.All},allowContextMenu:{type:"boolean",defaultValue:true},position:{type:"any",defaultValue:null},quaternion:{type:"any",defaultValue:null}},events:{moving:{parameters:{x:"float",y:"float",z:"float"}},moved:{parameters:{x:"float",y:"float",z:"float"}},rotating:{parameters:{x:"float",y:"float",z:"float"}},rotated:{parameters:{x:"float",y:"float",z:"float"}}}},constructor:function(t,o){e.apply(this,arguments);this._viewport=null;this._handler=new i(this);this._gizmo=null}});n.prototype.init=function(){if(e.prototype.init){e.prototype.init.call(this)}this.setFootprint(["sap.ui.vk.threejs.Viewport"]);var t=new o;this.setAggregation("gizmo",t);this.setProperty("position",t._gizmo.position);this.setProperty("quaternion",t._gizmo.quaternion)};n.prototype.setViewport=function(t){if(this._viewport!==t){this._deactivateScreenAlignment()}e.prototype.setViewport.call(this,t);if(t){this.getGizmo()._initAnchorPoint(t)}};n.prototype.setActive=function(t,i,o){e.prototype.setActive.call(this,t,i,o);if(this._viewport){if(t){this._gizmo=this.getGizmo();this._gizmo.show(this._viewport,this);this._addLocoHandler();this._deactivateScreenAlignment()}else{this._removeLocoHandler();if(this._gizmo){this._gizmo.hide();this._gizmo=null}}}return this};n.prototype.queueCommand=function(t){if(this._addLocoHandler()){if(this.isViewportType("sap.ui.vk.threejs.Viewport")){t()}}return this};n.prototype.setShowEditingUI=function(t){this.setProperty("showEditingUI",t,true);if(this._viewport){this._viewport.setShouldRenderFrame()}return this};n.prototype.setAllowOperation=function(t){this.setProperty("allowOperation",t,true);if(this._gizmo){this._gizmo._updateHandlesVisibility()}if(this._viewport){this._viewport.setShouldRenderFrame()}return this};n.prototype.move=function(t,e,i){if(this._gizmo){this._gizmo.move(t,e,i)}if(this._viewport){this._viewport.setShouldRenderFrame()}return this};n.prototype.rotate=function(t,e,i){if(this._gizmo){this._gizmo.rotate(t,e,i)}if(this._viewport){this._viewport.setShouldRenderFrame()}return this};n.prototype.moveTo=function(t,e){var i=Array.isArray(t)?t:[t];var o=new THREE.Vector3;if(t instanceof THREE.Matrix4){t.decompose(o,new THREE.Quaternion,new THREE.Vector3)}else if(e){var r=0;var n=new THREE.Vector3;i.forEach(function(t){t.updateWorldMatrix(false,false);o.add(n.setFromMatrixPosition(t.matrixWorld));r++});o.multiplyScalar(1/r)}else{var a=new THREE.Box3;i.forEach(function(t){a.expandByObject(t)});a.getCenter(o)}this.getGizmo().setPosition(o);if(this._viewport){this._viewport.setShouldRenderFrame()}return this};n.prototype.alignTo=function(t){this._deactivateScreenAlignment();var e=new THREE.Quaternion;if(t instanceof THREE.Matrix4){t.decompose(new THREE.Vector3,e,new THREE.Vector3)}else if(t){t.updateWorldMatrix(false,false);t.matrixWorld.decompose(new THREE.Vector3,e,new THREE.Vector3)}this.getGizmo().setQuaternion(e);if(this._viewport){this._viewport.setShouldRenderFrame()}return this};n.prototype.alignToWorld=function(){this._deactivateScreenAlignment();this.getGizmo().setQuaternion(new THREE.Quaternion);if(this._viewport){this._viewport.setShouldRenderFrame()}return this};n.prototype.alignToScreen=function(){if(this._viewport){this._activateScreenAlignment();this.alignToScreenCallback();this._viewport.setShouldRenderFrame()}return this};n.prototype._activateScreenAlignment=function(){if(!this.alignToScreenCallback){this.alignToScreenCallback=function(){var t=this._viewport.getCamera().getCameraRef();this.getGizmo().setQuaternion(t.quaternion)}.bind(this);this._viewport.attachCameraChanged(this.alignToScreenCallback)}};n.prototype._deactivateScreenAlignment=function(){if(this.alignToScreenCallback&&this._viewport){this._viewport.detachCameraChanged(this.alignToScreenCallback);this.alignToScreenCallback=null}};n.prototype.setPosition=function(){throw new Error("The AnchorPointTool position is read-only")};n.prototype.setQuaternion=function(){throw new Error("The AnchorPointTool quaternion is read-only")};return n});