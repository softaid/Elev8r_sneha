/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/base/EventProvider","sap/m/Menu","sap/m/MenuItem","../getResourceBundle","../thirdparty/three"],function(t,e,i,s,n){"use strict";var r=t.extend("sap.ui.vk.tools.AnchorPointToolHandler",{metadata:{library:"sap.ui.vk"},constructor:function(t){this._priority=10;this._tool=t;this._gizmo=t.getGizmo();this._rect=null;this._rayCaster=new THREE.Raycaster;this._handleIndex=-1;this._gizmoIndex=-1;this._handleAxis=new THREE.Vector3;this._gizmoOrigin=new THREE.Vector3;this._gizmoScale=1;this._matrixOrigin=new THREE.Matrix4;this._rotationOrigin=new THREE.Matrix4;this._mouse=new THREE.Vector2;this._mouseOrigin=new THREE.Vector2}});r.prototype._updateMouse=function(t){var e=this.getViewport().getRenderer().getSize(new THREE.Vector2);this._mouse.x=(t.x-this._rect.x)/e.width*2-1;this._mouse.y=(t.y-this._rect.y)/e.height*-2+1;this._rayCaster.setFromCamera(this._mouse,this.getViewport().getCamera().getCameraRef())};r.prototype._updateHandles=function(t,e){var i=this._handleIndex;this._handleIndex=-1;if(t.n===1||t.event&&t.event.type==="contextmenu"){for(var s=0,n=this._gizmo.getGizmoCount();s<n;s++){var r=this._gizmo.getTouchObject(s);var a=this._rayCaster.intersectObject(r,true);if(a.length>0){this._handleIndex=r.children.indexOf(a[0].object);if(this._handleIndex>=0){this._gizmoIndex=s;this._gizmoOrigin.setFromMatrixPosition(r.matrixWorld);this._matrixOrigin.copy(r.matrixWorld);this._gizmoScale=r.scale.x;this._rotationOrigin.extractRotation(r.matrixWorld);if(this._handleIndex<3){this._handleAxis.setFromMatrixColumn(r.matrixWorld,this._handleIndex).normalize()}else if(this._handleIndex<6){this._handleAxis.setFromMatrixColumn(r.matrixWorld,this._handleIndex-3).normalize()}else if(this._handleIndex<9){this._handleAxis.setFromMatrixColumn(r.matrixWorld,this._handleIndex-6).normalize()}}}}}this._gizmo.highlightHandle(this._handleIndex,e||this._handleIndex===-1);if(i!==this._handleIndex){this.getViewport().setShouldRenderFrame()}};r.prototype.hover=function(t){if(this._inside(t)&&!this._gesture){this._updateMouse(t);this._updateHandles(t,true);t.handled|=this._handleIndex>=0}};r.prototype.click=function(t){if(this._inside(t)&&!this._gesture){this._updateMouse(t);this._updateHandles(t,true);this._gizmo.selectHandle(this._handleIndex);t.handled|=this._handleIndex>=0}};var a=new THREE.Vector3;r.prototype._getAxisOffset=function(){var t=this._rayCaster.ray;var e=this._handleAxis.clone().cross(t.direction).cross(t.direction).normalize();a.copy(t.origin).sub(this._gizmoOrigin);return e.dot(a)/e.dot(this._handleAxis)};r.prototype._getPlaneOffset=function(){var t=this._rayCaster.ray;a.copy(this._gizmoOrigin).sub(t.origin);var e=this._handleAxis.dot(a)/this._handleAxis.dot(t.direction);return t.direction.clone().multiplyScalar(e).sub(a)};r.prototype._getMouseAngle=function(){var t=this._rayCaster.ray;var e=this._rotationPoint.clone().sub(t.origin);var i=this._rotationAxis.dot(e)/this._rotationAxis.dot(t.direction);var s=t.direction.clone().multiplyScalar(i).sub(e).normalize();return Math.atan2(s.dot(this._axis2),s.dot(this._axis1))};r.prototype.beginGesture=function(t){if(this._inside(t)&&!this._gesture){this._updateMouse(t);this._updateHandles(t,false);if(this._handleIndex>=0){t.handled=true;this._gesture=true;this._mouseOrigin.copy(t);this._gizmo.selectHandle(this._handleIndex);this._gizmo.beginGesture();if(this._handleIndex<3){this._dragOrigin=this._getAxisOffset()}else if(this._handleIndex<6){this._dragOrigin=this._getPlaneOffset()}else if(this._handleIndex<9){this._axis1=(new THREE.Vector3).setFromMatrixColumn(this._matrixOrigin,(this._handleIndex+1)%3).normalize();this._axis2=(new THREE.Vector3).setFromMatrixColumn(this._matrixOrigin,(this._handleIndex+2)%3).normalize();this._rotationAxis=(new THREE.Vector3).crossVectors(this._axis1,this._axis2).normalize();this._rotationPoint=(new THREE.Vector3).setFromMatrixPosition(this._matrixOrigin);if(Math.abs(this._rayCaster.ray.direction.dot(this._rotationAxis))<Math.cos(Math.PI*85/180)){var e=this.getViewport().getCamera().getCameraRef().matrixWorld;this._axis1.setFromMatrixColumn(e,0).normalize();this._axis2.setFromMatrixColumn(e,1).normalize();this._rotationAxis.setFromMatrixColumn(e,2).normalize()}var i=this._axis1.clone();var s=2;for(var n=0;n<3;n++){var r=(new THREE.Vector3).setComponent(n,1);var a=this._rotationAxis.dot(r);if(s>a){s=a;i.copy(r)}}i.sub(this._rotationAxis.clone().multiplyScalar(i.dot(this._rotationAxis))).normalize();this._levelAngle=Math.atan2(i.dot(this._axis2),i.dot(this._axis1));this._startAngle=this._getMouseAngle();this._prevDeltaAngle=0}}}};r.prototype._setOffset=function(t){if(this._tool.getEnableStepping()){var e=Math.pow(10,Math.round(Math.log10(this._gizmoScale)))*.1;var i=(new THREE.Matrix4).getInverse(this._rotationOrigin);var s=this._gizmoOrigin.clone().applyMatrix4(i);var n=this._gizmoOrigin.clone().add(t).applyMatrix4(i);for(var r=0;r<3;r++){var o=n.getComponent(r);if(Math.abs(o-s.getComponent(r))>e*1e-5){var h=Math.round(o/e)*e;a.setFromMatrixColumn(this._rotationOrigin,r).multiplyScalar(h-o);t.add(a)}}}this._gizmo._setOffset(t,this._gizmoIndex)};r.prototype.move=function(t){if(this._gesture){t.handled=true;this._updateMouse(t);if(this._handleIndex<3){if(isFinite(this._dragOrigin)){this._setOffset(this._handleAxis.clone().multiplyScalar(this._getAxisOffset()-this._dragOrigin))}}else if(this._handleIndex<6){if(isFinite(this._dragOrigin.x)&&isFinite(this._dragOrigin.y)&&isFinite(this._dragOrigin.z)){this._setOffset(this._getPlaneOffset().sub(this._dragOrigin))}}else if(this._handleIndex<9){var e=this._startAngle;var i=this._getMouseAngle()-e;if(i>Math.PI){i-=Math.PI*2}else if(i<-Math.PI){i+=Math.PI*2}if(Math.abs(this._prevDeltaAngle)>Math.PI/4){if(this._prevDeltaAngle*i<0){i+=Math.PI*2*Math.sign(this._prevDeltaAngle)}}i=i%(Math.PI*2);var s=e+i;if(this._tool.getEnableStepping()){var n=THREE.Math.degToRad(5);var r=s-e-this._levelAngle;s+=Math.round(r/n)*n-r}this._prevDeltaAngle=s-e;if(isFinite(e)&&isFinite(s)){this._gizmo._setRotationAxisAngle(this._handleIndex-6,e,s)}}}};r.prototype.endGesture=function(t){if(this._gesture){this._gesture=false;t.handled=true;this._updateMouse(t);this._gizmo.endGesture();this._dragOrigin=undefined;this._updateHandles(t,true);this.getViewport().setShouldRenderFrame()}};function o(t){var e=[];if(t){t.enumerateSelection(function(t){e.push(t)})}return e}r.prototype.contextMenu=function(t){if(!this._tool.getAllowContextMenu()){return}if(this._inside(t)){this._updateMouse(t);this._updateHandles(t,true);if(this._handleIndex>=0){t.handled=true;var n=this.getViewport();var r=new e({items:[new i({text:s().getText("ANCHOR_POINT_TOOL_MOVE_TO_WORLD_ORIGIN")}),new i({text:s().getText("ANCHOR_POINT_TOOL_MOVE_TO_SELECTION_CENTER")}),new i({text:s().getText("ANCHOR_POINT_TOOL_MOVE_TO_SCENE_CENTER")}),new i({text:s().getText("ANCHOR_POINT_TOOL_MOVE_TO_SELECTED_OBJECTS_ORIGIN")})],itemSelected:function(t){var e=t.getParameters("item").item;var i=t.getSource().indexOfItem(e);var s=new THREE.Vector3;switch(i){default:case 0:break;case 1:this._tool.moveTo(o(n._viewStateManager),false);return;case 2:var r=n.getScene()?n.getScene().getSceneRef():null;if(r){var a=new THREE.Box3;r._expandBoundingBox(a,null,true);a.getCenter(s)}break;case 3:this._tool.moveTo(o(n._viewStateManager),true);return}this._gizmo.setPosition(s);n.setShouldRenderFrame()}.bind(this)});r.openAsContextMenu(t.event,n)}}};r.prototype.getViewport=function(){return this._tool._viewport};r.prototype._getOffset=function(t){var e=t.getBoundingClientRect();var i={x:e.left+window.pageXOffset,y:e.top+window.pageYOffset};return i};r.prototype._inside=function(t){if(this._rect===null||true){var e=this._tool._viewport.getIdForLabel();var i=document.getElementById(e);if(i===null){return false}var s=this._getOffset(i);this._rect={x:s.x,y:s.y,w:i.offsetWidth,h:i.offsetHeight}}return t.x>=this._rect.x&&t.x<=this._rect.x+this._rect.w&&t.y>=this._rect.y&&t.y<=this._rect.y+this._rect.h};return r});